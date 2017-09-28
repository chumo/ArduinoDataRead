createChart(
  'graphVsT',
  'Analog Read vs Time',
  'Time (s)',
  'Pression (MPa)', ['Analog Read'], ['lines'], ['red']
);

graphVsT.on('plotly_hover', function(data) {
      $('#hoverInfo').html('P = ' + data.points[0].y.toFixed(3) + ' MPa</br>V = ' + voltage(data.points[0].y).toFixed(3) + ' V&nbsp&nbsp');
    });

graphVsT.on('plotly_unhover', function(data) {
      $('#hoverInfo').html('P = ----- MPa</br>V = ----- V&nbsp&nbsp');
    });
