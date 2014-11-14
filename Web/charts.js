var chart1 = c3.generate({
   bindto: '#chart1',
   size: {
    height: 240,
    width: 240
},
data: {
        columns: [
            ['Budget', 0],
            ['Opening Weekend', 10000000],
            ['Revenue', 0],
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
    .style('font-size', '1.4em')
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
    .style('font-size', '1.4em')
    .text('Movie-related tweets this month');
