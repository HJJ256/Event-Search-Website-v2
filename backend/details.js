var express = require('express');
var router = express.Router();
var moment = require('moment');
var spotify = require('spotify-web-api-node');
const axios = require('axios').default;
const API_KEY = "Uced0mO1FoidmwDugkEyGileAFxy90Tu";

function get(object, key, default_value) {
    var result = object[key];
    return (typeof result !== "undefined") ? result : default_value;
}

//THIS ONE SHOULD FETCH ALL 3 DETAILS TAB, that is EVENT DETAILS, ARTIST/TEAM INFO FROM SPOTIFY AND VENUE DETAILS
function curateDetailsData(responseData){

    var finalResult = {
        id: get(responseData,'id',''),
        Event: get(responseData,'name','N/A'),
        SeatMap: get(responseData,'seatmap',{staticUrl:''}).staticUrl,
        BTA: get(responseData,'url',''),
        PriceRange: 'N/A'
    };

    dates = get(responseData,'dates','N/A');

    if(dates !== 'N/A'){
        var date = get(dates,"start",{localDate:'TBD'}).localDate;
        if (date!== 'TBD'){
            finalResult.Date = date;
        }
        else{
            finalResult.Date = date;
        }

        var status = get(dates,"status",{code:'N/A'}).code;
        finalResult.Status = status;
    }
    else{
        finalResult.Date = 'N/A';
        finalResult.Status = 'N/A';
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
        genres.sort();
        finalResult.Category = genres.join(' | ')
    }
    else{
        finalResult.Category = 'N/A'
    }

    var embedded = get(responseData,'_embedded','N/A')
    var venue='N/A'
    if (embedded !== 'N/A'){
        var venues = get(embedded,'venues','N/A')
    }
    if (venues !== 'N/A'){
        venue = get(venues[0],'name','N/A')
    }

    finalResult.Venue = venue;

    var attrs='N/A';
    attractions = [];
    if(embedded!=='N/A'){
        attrs = get(embedded,'attractions','N/A');
    }
    if (attrs!=='N/A'){
        attrs.forEach(attr => {
            att = get(attr,"name",'N/A')
            if (att!=='N/A'){
                attractions.push(att);
            }
        });
    }

    if (attractions === []){
        attractions = ['N/A']
    }
    finalResult.Artist = attractions.join(' | ');

    var pricerange = get(responseData,'priceRanges','N/A');
    if (pricerange!=='N/A'){
        var min_range = get(pricerange[0],'min','');
        var max_range = get(pricerange[0],'max','');
        if (min_range - Math.floor(min_range) == 0){
            min_range = Math.floor(min_range);
        }
        if (max_range - Math.floor(max_range) == 0){
            max_range = Math.floor(max_range);
        }
        finalResult.PriceRange = min_range + ' - ' + max_range + ' ' + get(pricerange[0],'currency','USD');
    }

    return finalResult;

}

function curateVenueDetails(responseData){
    var bo_details = get(responseData,'boxOfficeInfo',{phoneNumberDetail:'N/A',openHoursDetail:'N/A'});
    var gen_info = get(responseData,'generalInfo',{generalRule:'N/A',childlRule:'N/A'})
    var finalResult = {
        Address: get(responseData,'address',{line1:'N/A'}).line1,
        Phone: get(bo_details,'phoneNumberDetail','N/A'),
        OpenHours: get(bo_details,'openHoursDetail','N/A'),
        GeneralRule: get(gen_info,'generalRule','N/A'),
        ChildRule: get(gen_info,'childRule','N/A'),
        Location: get(responseData,'location','N/A')
    };
    
    finalResult.City = '';
    var city = get(responseData,'city',{name:'N/A'}).name;
    var state = get(responseData,'state',{name:'N/A'}).name;
    if (city!=='N/A'){
        finalResult.City += city
    }
    if (state!=='N/A'){
        if (finalResult.City!==''){
            finalResult.City += ', ' + state
        }
        else{
            finalResult.City += state
        }
    }
    return finalResult;

}

function curateArtistDetails(responseData){
    var finalResult = {
        Name: get(responseData,'name','N/A'),
        Followers: get(responseData,'followers',{total:0}).total,
        Popularity: get(responseData,'popularity','N/A'),
        Check: get(responseData,'external_urls',{spotify:''}).spotify
    }
    return finalResult;
}

router.get('/', function(req, res){
    var spotifyApi = new spotify({
        clientId: 'ea5cd64a3883465182b27d6fe99df79c',
        clientSecret: 'fba786795376400aae563ac1fa65f8e8'
    });    

    spotifyApi.clientCredentialsGrant()
    .then(function(response){
        spotifyApi.setAccessToken(response.body.access_token);
    })
    .catch(function(error){
        //console.log('error fetching access token');
    })

    var eventId = req.query.eventId;
    var url = 'https://app.ticketmaster.com/discovery/v2/events/'+eventId+'.json?apikey='+API_KEY
    var finalResults = {};
    var artistInfo = {};

    axios.get(url)
    .then(function(response){  
        var initialResult = response.data;
        var finalResult = curateDetailsData(initialResult);
        //console.log(finalResult);
        finalResults.Event = finalResult;
        var new_url = '';
        var promises = [];
        if (finalResult.Artist !== 'N/A'){
            artists = finalResult.Artist.split(' | ')
            finalResults.artist_names = artists;
            artists.forEach(artist => {
                artistInfo[artist] = {}
                promises.push(spotifyApi.searchArtists(artist))
            });
        }
        return axios.all(promises)
        .then(axios.spread((...responses)=>{
            for(var r in responses){
                if (responses[r]){
                    if(responses[r].body.artists.items.length !== 0){
                        for(var i in responses[r].body.artists.items){
                            if(finalResults.artist_names[r].toLowerCase() === responses[r].body.artists.items[i].name.toLowerCase()){
                                artistInfo[finalResults.artist_names[r]] = curateArtistDetails(responses[r].body.artists.items[i]);
                                break;
                            }
                        }
                    }
                }
            }
            //console.log('artist info:')
            //console.log(artistInfo)
        }))
        .catch(errors=>{
            //console.log(errors)
        })
        .finally(()=>{
            finalResults.Artist = artistInfo;
            if (finalResults.Event.Venue !== 'N/A'){
                new_url = 'https://app.ticketmaster.com/discovery/v2/venues.json?apikey='+API_KEY+'&keyword='+finalResults.Event.Venue
            }
            //console.log('new_url '+new_url)
            return axios.get(new_url)
            .then(function(response){
                //res.json(response.data);
                finalResults.Venue = curateVenueDetails(response.data._embedded.venues[0])
                //console.log(finalResults);
                res.json(finalResults);
        
            })
        })  
    })
    .catch(function(error){
        //console.log(error);
        res.json([])
    })
 });
 
//Routes will go here
module.exports = router;