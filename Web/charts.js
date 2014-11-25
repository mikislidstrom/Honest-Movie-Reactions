var chart1 = c3.generate({
   bindto: '#chart1',
   size: {
    height: 230,
    width: 230
},
data: {
        columns: [
            ['Budget', 30000000],
            ['Opening Weekend', 10000000],
            ['Revenue', 50000000],
        ],
    type : 'donut',
        colors: {
        Budget: '#ffa500',
        'Opening Weekend': '#468499',
        Revenue: '#0099cc',
    },
    onclick: function (d, i) { console.log("onclick", d, i); },
    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
},
donut: {
    title: "Box Office"
},
tooltip: {
    format: {
        value: function (value, id) {
            var format = d3.format('$');
            return format(value);
        }
    }
}
});

var chart2 = c3.generate({
   bindto: '#chart2',
   size: {
    height: 240,
    width: 240
},
data: {
    columns: [
    ['Amazing', 152],
    ['Great', 106],
    ['Good', 96],
    ['Not too bad', 76],
    ['Bad', 60],
    ['Shitty', 50],
    ],
    type : 'donut',
    colors: {
        Amazing: '#009900',
        Great: '#00cc00',
        Good: '#00ff00',
        'Not too bad': '#99ff00',
        Bad: '#990000',
        Shitty: '#663300',
    },
    onclick: function (d, i) { console.log("onclick", d, i); },
    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
},
 padding: {
        top: 20,
    },
donut: {
    title: "Tweets"
},
tooltip: {
    format: {
        value: function (value, id) {
            return value+" tweets";
        }
    }
}
});

d3.select('#chart2 svg').append('text')
    .attr('x', d3.select('#chart2 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.9em')
    .text('Tweet Analysis');

var chart3 = c3.generate({
   bindto: '#chart3',
   size: {
    height: 220,
    width: 220
},
data: {
    columns: [
    ['This Movie', 52],
    ['Other Movies', 106],
    ],
    type : 'donut',
    colors: {
        'This Movie': '#31698a',
        'Other Movies': '#c0c0c0',
    },
    onclick: function (d, i) { console.log("onclick", d, i); },
    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
},
 padding: {
        top: 20,
    },
donut: {
    title: "Tweets"
},
tooltip: {
    format: {
        value: function (value, id) {
            return value+" tweets";
        }
    }
}
});

d3.select('#chart3 svg').append('text')
    .attr('x', d3.select('#chart3 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.9em')
    .text('Movie-related tweets this month');

var chart4 = c3.generate({
    bindto: '#chart4',
       size: {
    height: 240
},
    data: {
        columns: [
            ['Amazing', 30, 200, 100, 400, 150, 250, 90],
            ['Great', 45, 20, 10, 40, 150, 300, 100],
            ['Good', 12, 100, 100, 40, 85, 90, 80],
            ['Not too bad', 60, 70, 110, 500, 200, 200, 190],
            ['Bad', 50, 20, 50, 40, 75, 100, 120],
            ['Shitty', 20, 20, 65, 40, 50, 25, 15]
        ],
            colors: {
        Amazing: '#009900',
        Great: '#00cc00',
        Good: '#00ff00',
        'Not too bad': '#99ff00',
        Bad: '#990000',
        Shitty: '#663300',
    },
    },
    axis: {
        x: {
            type: 'category',
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        }
    },
});

d3.select('#chart4 svg').append('text')
    .attr('x', d3.select('#chart4 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.9em')
    .text('Last Week - Tweet Sentiment Analysis');

var chart5 = c3.generate({
    bindto: '#chart5',
    data: {
        columns: [
            ['Movie1', 30, 200, 100],
            ['Movie2', 130, 100, 140]
        ],
        type: 'bar'
    },
        axis: {
        x: {
            type: 'category',
            categories: ['Budget', 'Opening Weekend', 'Revenue']
        }
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
    }
});

var chart6 = c3.generate({
    bindto: '#chart6',
    data: {
        columns: [
            ['Movie1', 79, 72, 76, 82],
        ],
        type: 'bar'
    },
        axis: {
            rotated: true,

        x: {
            type: 'category',
            categories: ['MoSCoW', 'The Movie Database', 'Rotten Tomatoes', 'IMDb']
        }
    },
    bar: {
        width: {
            ratio: 0.5 // this makes bar width 50% of length between ticks
        }
        // or
        //width: 100 // this makes bar width 100px
    }
});
    
  var fill = d3.scale.category20();

  var word = [
        "Hello", "world", "normally", "you", "want", "more", "words",
        "than", "this"]

  d3.layout.cloud().size([300, 300])
      .words(word.map(function(d) {
        return {text: d, size: 10 + Math.random() * 90};
      }))
      .padding(5)
      .rotate(function() { return ~~(Math.random() * 2) * 90; })
      .font("Impact")
      .fontSize(function(d) { return d.size; })
      .on("end", draw)
      .start();

  function draw(words) {
    d3.select("body").append("svg")
        .attr("width", 300)
        .attr("height", 300)
      .append("g")
        .attr("transform", "translate(150,150)")
      .selectAll("text")
        .data(words)
      .enter().append("text")
        .style("font-size", function(d) { return d.size + "px"; })
        .style("font-family", "Impact")
        .style("fill", function(d, i) { return fill(i); })
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .text(function(d) { return d.text; });
  };






