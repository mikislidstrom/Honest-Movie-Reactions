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
        height: 263,
    },
    data: {
        columns: [
            ['Movie 1', 30, 120],
            ['Movie 2', 130, 300],
            ['Movie 3', 130, 300],
            ['Movie 4', 130, 300],
            ['Movie 5', 130, 300],
        ],
        type: 'bar',
        colors: {
        'Movie 1': '#ee4035',
        'Movie 2': '#f37736',
        'Movie 3': '#ecb939',
        'Movie 4': '#7bc043',
        'Movie 5': '#0392cf',
        },
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
        height: 263,
    },
    data: {
        columns: [
            ['Movie 1', 0.30, 0.70, 0.60, 0.87],
            ['Movie 2', 0.13, 0.10, 0.40, 0.67],
            ['Movie 3', 0.13, 0.10, 0.40, 0.23],
            ['Movie 4', 0.13, 0.10, 0.40, 0.56],
            ['Movie 5', 0.13, 0.10, 0.40, 0.08]
        ],
        type: 'bar',
        colors: {
        'Movie 1': '#ee4035',
        'Movie 2': '#f37736',
        'Movie 3': '#ecb939',
        'Movie 4': '#7bc043',
        'Movie 5': '#0392cf',
        },
    },
            axis: {

        y : {
            tick: {
                format: d3.format("%,")
                }
            },

        x: {
            type: 'category',
            categories: ['MoSCoW', 'The Movie Database', 'OMDb', 'Rotten Tomatoes']
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
        columns: [
            ['Movie 1', 30, 200, 100, 400, 150, 250, 90],
            ['Movie 2', 45, 20, 10, 40, 150, 300, 100],
            ['Movie 3', 12, 100, 100, 40, 85, 90, 80],
            ['Movie 4', 60, 70, 110, 500, 200, 200, 190],
            ['Movie 5', 50, 20, 50, 40, 75, 100, 120]
        ],
        colors: {
        'Movie 1': '#ee4035',
        'Movie 2': '#f37736',
        'Movie 3': '#ecb939',
        'Movie 4': '#7bc043',
        'Movie 5': '#0392cf',
        },
    },
    axis: {
        x: {
            label: {
                text: 'Day of the week',
                position: 'outer-center' 
            },
            type: 'category',
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
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
    .text('Last Week - Tweet Sentiment Analysis');

var chart7 = c3.generate({
    bindto: '#chart7',
        size: {
        height: 170,
    },
    data: {
        columns: [
            ['Movie 1', 30, 200, 100, 400, 150, 250, 90],
            ['Movie 2', 45, 20, 10, 40, 150, 300, 100],
            ['Movie 3', 12, 100, 100, 40, 85, 90, 80],
            ['Movie 4', 60, 70, 110, 500, 200, 200, 190],
            ['Movie 5', 50, 20, 50, 40, 75, 100, 120]
        ],
        colors: {
        'Movie 1': '#ee4035',
        'Movie 2': '#f37736',
        'Movie 3': '#ecb939',
        'Movie 4': '#7bc043',
        'Movie 5': '#0392cf',
        },
    },
    axis: {
        x: {
            label: {
                text: 'Day of the week',
                position: 'outer-center' 
            },
            type: 'category',
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        },
        y: {
            label: {
                text: 'Amount of tweets',
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
    .text('Last Week - Amount of Tweets');

    






