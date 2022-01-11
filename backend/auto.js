var express = require('express');
var router = express.Router();
const axios = require('axios').default;
const API_KEY = "Uced0mO1FoidmwDugkEyGileAFxy90Tu";

function curateData(responseData){

    var suggestions = [];

    try{
        var embedded = responseData._embedded;
        var attractions = embedded.attractions;
        attractions.forEach(element => {
            if ('name' in element){
                suggestions.push(element.name)
            }
        });
        return suggestions
    }
    catch(e){
        return suggestions
    }
}

router.get('/', function(req, res){
    var keyword = req.query.keyword;
    axios.get('https://app.ticketmaster.com/discovery/v2/suggest?apikey='+API_KEY+'&keyword='+keyword)
    .then(function(response){
        suggestions = curateData(response.data)
        res.json(suggestions)
    })
    .catch(function(error){
        //console.log(error);
        res.json([])
    })
 });

//Routes will go here
module.exports = router;