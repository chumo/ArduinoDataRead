var socket;

$(document).ready(function () {
  // $(".btn").click(clickHandler);

  $("#startButton").click(startFunc);
  $("#stopSaveButton").click(stopSaveFunc);

  socket = io('http://localhost:3000');
  socket.on('connect', function () {
    console.log('socket io connected');
  });
  socket.on('event', function (data) {
    console.log('event data: '+data)
  });

  socket.on('disconnect', function () {
    console.log('socket io disconnect');
  });

  socket.on('pinData', function(data){
    var update = {
                x: [[data.dt]],
                y: [[data.value]]
              };

    Plotly.extendTraces(graphVsT, update, [0]);

  })

});

// var clickHandler = function (e) {
//   var id = e.currentTarget.id
//   console.log('id =', id);
//
//   // socket.emit('buttonClick', id)
// };

function startFunc(){
  changePlot(graphVsT, [[]], [[]]);
  socket.emit('startClick', 1)
}

function stopSaveFunc(){
  socket.emit('stopSaveClick', 0)
}
