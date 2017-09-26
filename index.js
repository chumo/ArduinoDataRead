// var express = require('express');
// var app = express();
// var httpServer = require('http').createServer(app);
var five = require('johnny-five');
var io = require('socket.io')(3000)//(httpServer);
var fs = require('fs');

var port = 3000;
// Read analog input every readT millisec and send to the client every commT
var readT = 164; // millisec
var commT = 820;

var RUNNING = false;
var T0;

// httpServer.listen(port);
console.log('Server available at http://localhost:' + port);
console.log('Waiting for connection');

var A0;
var dataX = [];
var dataY = [];

var C = 0;

//Arduino board connection
var board = new five.Board();

board.on('ready', function() {
  console.log('Arduino connected');

  A0 = new five.Sensor({
    pin: "A0",
    freq: readT
    // ,
    // threshold: 5
  });
});

//Socket connection handler
io.on('connection', function(socket) {

  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  A0.on("data", function() {

    if (RUNNING) {
      var value = this.fscaleTo(0, 5);
      var dt = (Date.now() - T0)/1000;//moment().toDate();

      dataX.push(dt);
      dataY.push(value);
      C += readT;

      if (C >= commT) { // send only one point each commT millisec
        socket.emit('pinData', {dt: dt, value: value});
        C = 0;
      }
    }

  });

  socket.on('stopClick', function(data){
    RUNNING = false;
  });

  socket.on('startClick', function(data){
    T0 = Date.now();
    dataX = [];
    dataY = [];
    RUNNING = true;
  });

  socket.on('saveClick', function(data){
    RUNNING = false;

    var S = dataToText(dataX, dataY, '# '+data.comment);

    fs.writeFile("data/"+data.fname+'.csv', S, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The data was saved!");
    });
  });

});

function dataToText(X, Y, comment){
  var S = comment + '\n'

  for (var i = 0; i < X.length; i++) {
    S += X[i] + ',' + Y[i] + '\n'
  }

  return S;
}
