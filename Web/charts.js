//Chart settings and default values which are necessary to solve some color rendering bugs
var chart1 = c3.generate({
    bindto: '#chart1',
    size: {
        height: 170,
        width: 170
    },
    data: {
        columns: [
            ['Budget', 999999999999999],
            ['Total Revenue', 999999999999999],
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
    title: "Box Office",
            width: 10
    },
    tooltip: {
        format: {
        value: function (value, defaultValueFormat) {
            var format = d3.format('$');
            var percentage = d3.format('%,');
            return format(value)+" ("+percentage(defaultValueFormat)+")";
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
            ['This Movie', 999999999999999],
            ['All Movies', 999999999999999],
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
        title: "Tweets",
        width: 10
    },
    tooltip: {
        format: {
        value: function (value, defaultValueFormat) {
            var percentage = d3.format('%,');
            return value+" Tweets "+"("+percentage(defaultValueFormat)+")";
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
            ['Sentiment Score', 50]
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
        height: 262,
    },
    data: {
        columns: [
        ],
        type: 'bar',
    },
        axis: {

        y : {
            tick: {
                format: d3.format("$,")
                }
            },

        x: {
            type: 'category',
            categories: ['Budget', 'Total Revenue']
        }

    },
    bar: {
        width: {
            ratio: 0.8
        }
    }
});

d3.select('#chart4 svg').append('text')
    .attr('x', d3.select('#chart4 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.3em')
    .text('Box Office (In Millions $)');

var chart5 = c3.generate({
    bindto: '#chart5',
        size: {
        height: 262,
    },
    data: {
        columns: [
        ],
        type: 'bar',      
    },
            axis: {

        y : {
            tick: {
                //format: d3.format("%,")
                }
            },

        x: {
            type: 'category',
            categories: ['Sentiment Score', 'The Movie Database', 'IMDb', 'Rotten Tomatoes']
        }

    },
    bar: {
        width: {
            ratio: 0.8
        }
    }
});

d3.select('#chart5 svg').append('text')
    .attr('x', d3.select('#chart5 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 16)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.3em')
    .text('Ratings');

var chart6 = c3.generate({
    bindto: '#chart6',
        size: {
        height: 170,
    },
    data: {
        x: 'x',
        columns: [
        ],
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        },
        y: {
            label: {
                text: 'Overall Score',
                position: 'outer-middle' 
            },
        }
    },
});

d3.select('#chart6 svg').append('text')
    .attr('x', d3.select('#chart6 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 12)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.3em')
    .text('Tweet Sentiment Analysis - Last 7 Days');

var chart7 = c3.generate({
    bindto: '#chart7',
        size: {
        height: 170,
    },
    data: {
        x: 'x',
        columns: [
        ],
    },
    axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%Y-%m-%d'
            }
        },
        y: {
            label: {
                text: 'Amount of Tweets',
                position: 'outer-middle' 
            },
        }
    },
});

d3.select('#chart7 svg').append('text')
    .attr('x', d3.select('#chart7 svg').node().getBoundingClientRect().width / 2)
    .attr('y', 12)
    .attr('text-anchor', 'middle')
    .style('font-size', '1.3em')
    .text('Amount of Tweets - Last 7 Days');