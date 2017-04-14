var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var https = require('https');
var request = require('request');


var options = {
   host: 'api.transport.nsw.gov.au',
   port: 443,
   path: '/v1/gtfs/vehiclepos/buses',
   // authentication headers
   headers: {
      'Authorization': 'apikey mdict1NgnhEArqyp2Aj5MWEFfI7OoI0xFVD3'
   }   
};
//this is the call
request = https.get(options, function(res){

    var body = "";
   res.on('data', function(data) {
      body += data;
   });
   res.on('end', function() {
    //here we have the full response, html or json object
      //console.log(body);
      var feed = GtfsRealtimeBindings.FeedMessage(body);
      console.log("FEED = " + feed);
      feed.entity.forEach(function(entity) {
      if (entity.trip_update) {
        console.log(entity.trip_update);
      }
    });

   })
   res.on('error', function(e) {
      console.log("Got error: " + e.message);
   });
});

