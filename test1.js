var GtfsRealtimeBindings = require('gtfs-realtime-bindings');
var request = require('request');

var requestSettings = {
  method: 'GET',
  url: 'https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/buses',
  encoding: 'utf8',
  headers: {
      auth : 'Authorization: apikey mdict1NgnhEArqyp2Aj5MWEFfI7OoI0xFVD3'
  }
  
  
/*    host: 'api.transport.nsw.gov.au',
   port: 443,
   path: '/v1/gtfs/vehiclepos/buses',
   method: 'GET',
   // authentication headers
   headers: {
      'Authorization': 'apikey mdict1NgnhEArqyp2Aj5MWEFfI7OoI0xFVD3'
   }   */
};
request(requestSettings, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var feed = GtfsRealtimeBindings.FeedMessage.decode(body);
    feed.entity.forEach(function(entity) {
      if (entity.trip_update) {
        console.log(entity.trip_update);
      }
    });
  } else {
      console.log("Comes HERE");
      console.log(response);
      
  }
});