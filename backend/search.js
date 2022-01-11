var express = require('express');
var router = express.Router();
var geohash = require('ngeohash');
const axios = require('axios').default;
const API_KEY = "Uced0mO1FoidmwDugkEyGileAFxy90Tu";

function get(object, key, default_value) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}

function curateData(responseData){

    var finalResult = {
        id: get(responseData,'id',''),
        Event: get(responseData,'name','N/A')
    };

    dates = get(responseData,'dates','N/A');

    if(dates !== 'N/A'){
        finalResult.Date = get(dates.start,'localDate','TBD');
    }
    else{
        finalResult.Date = 'N/A';
    }

    var genres = [];
    var classifications = get(responseData,'classifications','N/A');
    if (classifications !== 'N/A'){
        var keys = ['genre','subGenre','segment','subType','type']
        classifications.forEach(classification => {
            keys.forEach(key => {
                value = get(classification,key,{name: ''});
                valueName = value.name !== 'Undefined' ? value.name : '';
            if (valueName !== '' && !genres.includes(valueName)){
                genres.push(valueName);
            }
            });
        });
    }

    if (genres !== []){
        finalResult.Category = genres.join(' | ')
    }
    else{
        finalResult.Category = 'N/A'
    }

    var embedded = get(responseData,'_embedded','N/A')
    var venue='N/A'
    if (embedded !== 'N/A'){
        venues = get(embedded,'venues','N/A')
    }
    if (venues !== 'N/A'){
        venue = get(venues[0],'name','N/A')
    }

    finalResult.Venue = venue;

    return finalResult

}

router.get('/', function(req, res){
    var keyword = req.query.keyword;
    var latlong = req.query.latlong;//9q5ctr1 (actually it will be either be name or lat_long of location)
    var location = req.query.location;
    var location_lat_long = ''; 
    var geoPoint = '';
    var radius = req.query.radius;
    var unit = req.query.unit;
    var segmentId = req.query.segmentId;
    if (location!==''){
        //console.log('Location='+location)
        var geokey = 'AIzaSyAQuwS1FuP95xMXOtDLW841gsw6f_7DAr8'
        var loc_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + location + '&key='+ geokey; 
        axios.get(loc_url)
        .then(function(response){
            var geometry = response.data.results[0].geometry.location
            location_lat_long += geometry.lat + ',' + geometry.lng;
            //console.log(location_lat_long)
            location_lat_long = location_lat_long.split(',');
            geoPoint = geohash.encode(location_lat_long[0],location_lat_long[1])
            var url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey='+API_KEY+'&sort=date,asc&keyword='+keyword+'&geoPoint='+geoPoint+'&radius='+radius+'&unit='+unit+'&segmentId='+segmentId
            return axios.get(url)
        })
        .then(function(response){
            finalResults = [];
            initialResults = response.data;
            initialResults = initialResults._embedded.events;
            //console.log(initialResults);
            initialResults.forEach(element => {
                finalResults.push(curateData(element))
            });
    
            /*finalResults.sort(function (left, right){
                return moment.utc(left.Date).diff(moment.utc(right.Date))
            })*/
            
            res.json(finalResults)
        })
        .catch(function(error){
            //console.log(error);
            res.json([])
        })
    }
    else{
        latlong = latlong.split(',')
        geoPoint = geohash.encode(latlong[0],latlong[1])
        //console.log(geoPoint)
        var url = 'https://app.ticketmaster.com/discovery/v2/events.json?apikey='+API_KEY+'&sort=date,asc&keyword='+keyword+'&geoPoint='+geoPoint+'&radius='+radius+'&unit='+unit+'&segmentId='+segmentId
        //console.log(url)
        axios.get(url)
        .then(function(response){
            finalResults = [];
            initialResults = response.data;
            initialResults = initialResults._embedded.events;
            //console.log(initialResults);
            initialResults.forEach(element => {
                finalResults.push(curateData(element))
            });
    
            /*finalResults.sort(function (left, right){
                return moment.utc(left.Date).diff(moment.utc(right.Date))
            })*/
            
            res.json(finalResults)
        })
        .catch(function(error){
            //console.log(error);
            res.json([])
        })
    }
 });
 
//Routes will go here
module.exports = router;