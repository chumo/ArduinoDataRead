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

// Sensor calibration
function pression(voltage){
  return -0.62236269841434355 + 0.72494179984120621*voltage;
}

var clients = [];

var RUNNING = false;
var T0;

// httpServer.listen(port);
console.log('Server available at http://localhost:' + port);
console.log('Waiting for connection');

var A1;
var dataX = [];
var dataY = [];
var dataYp = [];

var C = 0;

//Arduino board connection
var board = new five.Board();

board.on('ready', function() {
  console.log('Arduino connected');

  A1 = new five.Sensor({
    pin: "A1",
    freq: readT
    // ,
    // threshold: 5
  });
});

//Socket connection handler
io.on('connection', function(socket) {
  console.info('New client connected (id=' + socket.id + ').');
  // Disconnect all other possible connections
  clients.map(d => d.disconnect());
  // Add new connection to the list of clients so far
  clients.push(socket);
  
  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  A1.on("data", function() {
    if (RUNNING && socket.id==clients.map(d => d.id).slice(-1) ) {
      var value = this.fscaleTo(0, 5);
      var valuePression = pression(value);
      var dt = (Date.now() - T0)/1000;//moment().toDate();

      dataX.push(dt);
      dataY.push(value);
      dataYp.push(valuePression);
      C += readT;

      if (C >= commT) { // send only one point each commT millisec
        socket.emit('pinData', {dt: dt, value: value, valuePression: valuePression});
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
    dataYp = [];
    RUNNING = true;
  });

  socket.on('saveClick', function(data){
    RUNNING = false;

    var S = dataToText(dataX, dataY, dataYp, '# '+data.comment);

    fs.writeFile("data/"+data.fname+'.csv', S, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The data was saved!");
    });
  });

});

function dataToText(X, Y, Yp, comment){
  var S = comment + '\n'

  for (var i = 0; i < X.length; i++) {
    S += X[i] + ',' + Y[i] + ',' + Yp[i] + '\n'
  }

  return S;
}
