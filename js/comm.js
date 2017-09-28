var socket;

$(document).ready(function () {
  // $(".btn").click(clickHandler);

  $("#startButton").click(startFunc);
  $("#stopSaveButton").click(stopFunc);
  $("#saveButton").click(saveFunc);

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
                y: [[data.valuePression]]
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
  socket.emit('startClick', 1);
}

function stopFunc(){
  socket.emit('stopClick', 0);
  $('#fnameInput').val('');
  $('#commentInput').val('');
  $('#savePanel').css('display','inline');
  $('#semiTrans').css('display','inline');
}

function saveFunc(){
  $('#savePanel').css('display','none');
  $('#semiTrans').css('display','none');
  var fname = $('#fnameInput').val();
  var comment = $('#commentInput').val();
  if (fname.length == 0) {
    fname = moment().format('[saved ]YYYY-MM-DD HH-mm-ss');
  }
  socket.emit('saveClick', {fname: fname, comment: comment});
}
