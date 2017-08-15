var socket;

$(document).ready(function () {
  $(".btn").click(clickHandler);

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
    _(data.dataX).each(function(d, i){
      dataX.push(data.dataX[i]);
      dataY.push(data.dataY[i]);
    })
    // dataX.push(data.dataX);
    // dataY.push(data.dataY);
    // console.log('X: '+data.X);
    // console.log('Y: '+data.Y);

    if (dataX.length) {
      changePlot(graphVsT, [dataX], [dataY]);
    }

  })

});

var clickHandler = function (e) {
  var id = e.currentTarget.id
  console.log('id =', id);

  socket.emit('buttonClick', id)
};
