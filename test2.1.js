var gtfsrb = require('gtfs-realtime-bindings');
var protobuf = require('protobufjs');
var fs = require('fs');

var request = require('request');
  var url = 'https://api.transport.nsw.gov.au/v1/gtfs/vehiclepos/buses';
  
  function getCall(callback){
  request({
    url: url,
    headers: { 'authorization':'apikey mdict1NgnhEArqyp2Aj5MWEFfI7OoI0xFVD3' },
    method: 'GET',
    encoding: null
  }, function (error, response, body) {
    console.log('Status', response.statusCode);
    console.log('Headers', JSON.stringify(response.headers));
    console.log('Reponse received', body);
    // 1: If I use this line, I get "Illegal argument: Not a valid base64 encoded string"
//    var feed = gtfsrb.FeedMessage.decode(body);
    // 2: If I use this line, I get "Illegal wire type of unknown field 1242 in Message"
    var feed = gtfsrb.FeedMessage.decode(new Buffer(body, 'base64'));
    // 3: If I use protobufjs, I still get "Illegal wire type for unknown field 1242 in Message .transit_realtime.FeedMessage#decode". I have tried both 2011 and 2015 versions of the proto files.
//    var transit = protobuf.loadProtoFile("gtfs-realtime.proto").build("transit_realtime");
//    var feed = transit.FeedMessage.decode(body);
    //console.log(feed);
//      console.log(feed.entity[2]);
      var results = [];
      for (var i=0; i < feed.entity.length; i++) {
//        if (feed.entity[i].id.indexOf('M54') > 0)
//        {
          //console.log(feed.entity[i].id);
          console.log(feed.entity[i].vehicle.position.latitude);
          console.log(feed.entity[i].vehicle.position.longitude);
          results.push({entity: feed.entity[i] })
//        }
      }
//    fs.writeFile("feed.txt", JSON.stringify(feed), function(err) {
      fs.writeFile("./html/feed.json", JSON.stringify(results), function(err) {
          if(err) {
              return console.log(err);
          }
      });
})
};

setInterval(getCall, 20000);