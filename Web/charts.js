var chart1 = c3.generate({
    bindto: '#chart1',
    size: {
        height: 170,
        width: 170
    },
data: {
        columns: [
            ['Budget', 30000000],
            ['Total Revenue', 50000000],
        ],
    type : 'donut',
    colors: {
        'Budget': '#ffa500',
        'Total Revenue': '#0099cc',
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
        height: 170,
        width: 170
    },
data: {
        columns: [
            ['This Movie', 52],
            ['All Movies', 106],
        ],
    type : 'donut',
    colors: {
        'This Movie': '#326ada',
        'All Movies': '#a19c9c',
    },
    onclick: function (d, i) { console.log("onclick", d, i); },
    onmouseover: function (d, i) { console.log("onmouseover", d, i); },
    onmouseout: function (d, i) { console.log("onmouseout", d, i); }
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

var chart3 = c3.generate({
    bindto: '#chart3',
        size: {
        height: 170,
    },
data: {
        columns: [
            ['Sentiment Score', 76]
        ],
        type: 'gauge',
        onclick: function (d, i) { console.log("onclick", d, i); },
        onmouseover: function (d, i) { console.log("onmouseover", d, i); },
        onmouseout: function (d, i) { console.log("onmouseout", d, i); }
},
gauge: {
        width: 30 
},
color: {
    pattern: ['#663300', '#b42722', '#F97600', '#F6C600', '#a0b422', '#60b044', '#4c8b36', '#009a00'], // the three color levels for the percentage values.
    threshold: {
    values: [15, 30, 45, 60, 75, 90, 100]
}
},
});

d3.select('#chart3 svg').append('text')
    .attr('x', d3.select('#chart3 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 125)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.3em')
    .text('Sentiment Score');

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
        y : {
            tick: {
                format: function (d) { return "$" + d + "M"; }
                }
            },
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

d3.select('#chart5 svg').append('text')
    .attr('x', d3.select('#chart5 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.9em')
    .text('Box Office');

var chart6 = c3.generate({
    bindto: '#chart6',
    data: {
        columns: [
            ['Movie1', 0.79, 0.72, 0.76, 0.82],
            ['Movie2', 0.67, 0.62, 0.56, 0.69],
        ],
        type: 'bar'
    },
        axis: {
            rotated: true,

        y : {
            tick: {
                format: d3.format("%,")
                }
            },

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

d3.select('#chart6 svg').append('text')
    .attr('x', d3.select('#chart6 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.9em')
    .text('Ratings');

var chart7 = c3.generate({
    bindto: '#chart7',
       size: {
    height: 240
},
    data: {
        columns: [
            ['Movie1', 30, 200, 100, 130, 150, 250, 90],
            ['Movie2', 45, 20, 10, 40, 150, 300, 100],
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

d3.select('#chart7 svg').append('text')
    .attr('x', d3.select('#chart7 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.9em')
    .text('Last Week - Amount of Tweets');
    

    






