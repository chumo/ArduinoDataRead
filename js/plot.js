function createChartOnlyLayout(container, title, xLabel, yLabel, barmode, legendOrientation) {

    // data
    var data = [{
          x: [],
          y: [],
          mode: 'lines+markers'}];

    // layout
    var layout = {
        title: title,
        xaxis: {
            showgrid: false,
            zeroline: false,
            title: xLabel
        },
        yaxis: {
            showline: false,
            title: yLabel
        },
        height: 500,
        barmode: barmode || 'stack',
        legend: {
          orientation: legendOrientation || "v",
          y: 1.1
        }
    };

    // create plot
    Plotly.newPlot(container, data, layout, {modeBarButtonsToRemove: ['sendDataToCloud'], displaylogo: false});

}

//////////////////////////////////////////////////

function createChart(container, title, xLabel, yLabel, names, types, colors, barmode, rightAxisTraceIndex, legendOrientation) {
    // rightAxisTraceIndex is the index of trace (from the array of traces) that should be represented on the right axis

    if (typeof(names) == "string") {
        names = [names];
        types = [types];
        colors = [colors];
    }

    // data
    var data = [];
    for (var i = 0; i < names.length; i++) {
        var trace = {
              x: [],
              y: [],
              name: names[i],
              type: types[i],
              mode: 'lines+markers',
              marker: {
                  color: colors[i]
              }
         };

        if (i == rightAxisTraceIndex) {
            _.extend(trace, {yaxis: 'y2'});
        }

        data.push(trace);
    }

    // layout
    var layout = {
        title: title,
        xaxis: {
            showgrid: false,
            zeroline: false,
            title: xLabel
        },
        barmode: barmode || 'stack',
        legend: {
          orientation: legendOrientation || "v",
          y: 1.1
        }
    };

    // if two yLabel are provided, the second one is assumed to be a Y axis on the right with the color of the trace.
    if (typeof(yLabel) == "string") {
      _.extend(layout, {
          yaxis: {
              showline: false,
              title: yLabel
          }
      })
    } else {
      _.extend(layout, {
          yaxis: {
              showline: false,
              title: yLabel[0]
          },
          yaxis2: {
              showline: false,
              title: yLabel[1],
              overlaying: 'y',
              side: 'right',
              titlefont: {color: colors[rightAxisTraceIndex]},
              tickfont: {color: colors[rightAxisTraceIndex]},
              showgrid: false
          }
      })
    }

    // create plot
    Plotly.newPlot(container, data, layout, {modeBarButtonsToRemove: ['sendDataToCloud'], displaylogo: false});

}

//////////////////////////////////////////////////

function changePlot(container, X, Y) {
    // X and Y should be arrays of arrays. For example:
    // X = [x,x]
    // Y = [y1,y2]
    // or
    // X = [x]
    // Y = [y]

    // if no data is coming with X and Y, display no trace
    if (X[0] == undefined) {
        X = [moment().toDate()];
        Y = [0];
    }

    for (var i = 0; i < X.length; i++) {
        container.data[i].x = X[i];
        container.data[i].y = Y[i];
    }

    // empty traces that have not been updated
    for (var i = X.length; i < container.data.length; i++) {
        container.data[i].x = [moment().toDate()];
        container.data[i].y = [0];
    }

    Plotly.redraw(container);
}

//////////////////////////////////////////////////

function replotPlot(container, X, Y, names){
  // delete existing traces
  _(container.data).each(function(){Plotly.deleteTraces(container, 0)});

  // add traces
  // if no data is coming with X and Y, display no trace
  if (X[0] == undefined) {
      X = [moment().toDate()];
      Y = [0];
  }

  // if X is a single array, make it an array of arrays to handle multiple traces
  if (!X[0].length) {
      X = [X];
      Y = [Y];
      names = [names];
  }

  _(X).map(function(d, i){Plotly.addTraces(container, {x: X[i], y: Y[i], name: names[i]})});

}

//////////////////////////////////////////////////

function createPie(container, title, labels, colors) {
  var data = [{
    // values: [19, 26, 55],
    labels: labels,
    type: 'pie',
    marker: {colors: colors},
    sort: false,
    rotation: 180,
    direction: 'clockwise'
  }];

  var layout = {
    height: 300,
    width: 300,
    // autosize: true,
    showlegend: false,
    title: title
    // ,
    // margin: {b:50}
  };

  Plotly.newPlot(container, data, layout, {modeBarButtonsToRemove: ['sendDataToCloud'], displaylogo: false});

}

//////////////////////////////////////////////////

function changePie(container, data) {

  var values = _.map(container.data[0].labels, function(d){return data[d]});

  container.data[0].values = values;
  Plotly.redraw(container);
}
