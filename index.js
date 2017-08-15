// var express = require('express');
// var app = express();
// var httpServer = require('http').createServer(app);
var five = require('johnny-five');
var io = require('socket.io')(3000)//(httpServer);


var port = 3000;
var FREQ = 100; // millisec

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
    freq: FREQ
    // ,
    // threshold: 5
  });
});

//Socket connection handler
io.on('connection', function(socket) {

  // Scale the sensor's data from 0-1023 to 0-10 and log changes
  A0.on("data", function() {
    // console.log(data);
    var value = this.fscaleTo(0, 1023);
    var dt = Date.now();//moment().toDate();

    dataX.push(dt);
    dataY.push(value);
    C += 1;
// console.log(C);
    // batch completion
    if (C >= 1000/FREQ) {
      socket.emit('pinData', {dataX: dataX, dataY: dataY});
      C = 0;
      dataX = [];
      dataY = [];
    }

    // var tDelta = Date.now()-tPlay
    // if (value>0.1 && tDelta>50) {
    //   // To PLAY IN THE CLIENT IS MUCH FASTER BECAUSE THE MP3 CAN BE PRELOADED (see client)
    //   tPlay = Date.now()
    //   socket.emit("play_mp3" , { message: 'sbell', value: value });
    // }

    // datos.push(this.fscaleTo(0, 10));
  });

  socket.on('buttonClick', function(data) {
    console.log('buttonClick data = ', data);

    if (data === 'startButton') {
      // led.stop();
      // led.on();
      // // player.play('bell.m', function(err){
      // //   if (err) console.log(err);
      // // })
      // fs.writeFile("/tmp/test", datos, function(err) {
      //     if(err) {
      //         return console.log(err);
      //     }
      //
      //     console.log("The file was saved!");
      // });
    }

    if (data === 'stopSaveButton') {
      // led.stop();
      // led.off();
    }

  });

});
