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
//    console.log('Headers', JSON.stringify(response.headers));
//    console.log('Reponse received', body);
    // 1: If I use this line, I get "Illegal argument: Not a valid base64 encoded string"
//    var feed = gtfsrb.FeedMessage.decode(body);
    // 2: If I use this line, I get "Illegal wire type of unknown field 1242 in Message"
    var feed; 
  console.log("1");
    // function retryForever(fn) {
    //   console.log("1.0");
    //   console.log("1.1");
    //   console.log("Feed Generated");
    //   return fn().catch(function(error) { 
    //   console.log("Feed Errored and in retry");
    //     return setTimeout(retryForever(fn), 2000); 
    //   });
    // }
    
    function fn() {
      feed = gtfsrb.FeedMessage.decode(new Buffer(body, 'base64'));
    }

    try {
      fn();
      console.log("Feed Generated");
    }    catch (error){
      feed = null;
      console.log("Feed Errored and in retry mode" + error);
      return setTimeout(fn, 100);
    }
    // retryForever(fn);
  console.log("2");
    // 3: If I use protobufjs, I still get "Illegal wire type for unknown field 1242 in Message .transit_realtime.FeedMessage#decode". I have tried both 2011 and 2015 versions of the proto files.
//    var transit = protobuf.loadProtoFile("gtfs-realtime.proto").build("transit_realtime");
//    var feed = transit.FeedMessage.decode(body);
    //console.log(feed);
//      console.log(feed.entity[2]);
      var results = [];
console.log("3"); 
      if (feed) {    
console.log("4");        
        for (var i=0; i < feed.entity.length; i++) {
          if (feed.entity[i].id.indexOf('M54') > 0)
          {
            //console.log(feed.entity[i].id);
            console.log("Entity id=" + i + "    Lat=" +feed.entity[i].vehicle.position.latitude);
            console.log("Entity id=" + i + "    Lon" +feed.entity[i].vehicle.position.longitude);
            results.push({entity: feed.entity[i] })
          }
        }
console.log("5");        
  //    fs.writeFile("feed.txt", JSON.stringify(feed), function(err) {
        fs.writeFile("./feed.json", JSON.stringify(results), function(err) {
            console.log("Writing to file");
            if(err) {
                return console.log(err);
            }
        });
      }
})
};

var http = require('http');
var fs = require('fs');
var index = '';
http.createServer(function (req, res) {
    //getCall();
    console.log(req.url);
    res.writeHead(200, {'Content-Type': 'text/html'});
    index = fs.readFileSync("./" + req.url)
    res.end(index);  
    if (req.url.indexOf("Bus") >0){
    getCall();
    }
    //setInterval(getCall, 20000);
}).listen(process.env.PORT, process.env.IP);
