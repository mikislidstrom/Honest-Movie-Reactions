var movieJSON;
var titles;
var id = "101";
var keys;
var statistics;
var movie;
var highlightedThumb;
var frequency_list;
var color = d3.scale.linear()
            .domain([0,1,2,3,4,5,6,10,15,20,100])
            .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

function updatePage() {

    $("#title").text(movieJSON.title);
    $("#tagline").text(movieJSON.tagline);
    $("#overview").text(movieJSON.overview);
    $("#runtime").text("Runtime: " + movieJSON.runtime + " min");
    $("#homepage").html('<a href="' + movieJSON.homepage + '">' + movieJSON.homepage + '</a>');
    $("#imdb").html('<a href="http://www.imdb.com/title/' + movieJSON.imdb_id + '">IMDb</a>');
    $("#imagePoster").attr({"src": "https://image.tmdb.org/t/p/w500" + movieJSON.poster_path, "title":movieJSON.title});
    $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movieJSON.backdrop_path +')');
    var json_Chart1 = [{'Budget':movieJSON.budget, 'Total Revenue':movieJSON.revenue}];
    var json_Chart2 = [{'This Movie':movieJSON.movieTweets, 'All Movies':movieJSON.totalTweets}];
    var json_Chart3 = [{'Sentiment Score':movieJSON.sentiment_rating}];
 

    setTweetTags();

    chart1.load({    
        json: json_Chart1,
        keys: {
            value: ['Budget', 'Total Revenue']
        },
        colors: {
        'Budget': '#ffa500',
        'Total Revenue': '#0099cc',
        }
        });

    chart2.load({    
        json: json_Chart2,
        keys: {
            value: ['This Movie', 'All Movies']
        },
        colors: {
        'This Movie': '#326ada',
        'All Movies': '#a19c9c',
        }
        });

    chart3.load({    
        json: json_Chart3,
        keys: {
            value: ['Sentiment Score']
        },
        });

    if($.cookie('tutorial1') == undefined) {
    alert("On this page you can view information and statistics about movies.\n\nUse the search-field together with the SEARCH-button to search for a specific movie by its title or click the RANDOM-button to check-out a random movie.\n\nYou can view more statistics about a movie by clicking on 'VIEW FULL STATISTICS', additional movies can be added in order to compare statistics by clicking 'ADD TO COMPARE'.");
    var date = new Date();
    var minutes = 60;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie('tutorial1', 'true', { expires: date });
    }
}

function updateStatPage() {

$.cookie.json = true; 
    
    movie = [$.cookie('movie1'), $.cookie('movie2'), $.cookie('movie3'), $.cookie('movie4'), $.cookie('movie5')];
    frequency_list = [$.cookie('moviewords1'), $.cookie('moviewords2'), $.cookie('moviewords3'), $.cookie('moviewords4'), $.cookie('moviewords5')];
    highlightedMovie = $.cookie('highlightedMovie');
      
    if (highlightedMovie == undefined) {
    highlightedMovie = $.cookie('movie1');
    highlightedThumb = "thumbnail1";
    $.cookie('highlightedN', "1");
    }

    else {
    highlightedThumb = "thumbnail" + $.cookie('highlightedN');
    }

    $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + highlightedMovie.backdrop_path +')');
    $("#thumbnail1").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[0].poster_path, "title":movie[0].title});

    document.getElementById(highlightedThumb).style.border = "5px inset black";

    json_Chart1 = [{'Budget':highlightedMovie.budget, 'Total Revenue':highlightedMovie.revenue}];
    json_Chart2 = [{'This Movie':highlightedMovie.movieTweets, 'All Movies':highlightedMovie.totalTweets}];
    json_Chart3 = [{'Sentiment Score':highlightedMovie.sentiment_rating}];

    chart1.load({    
        json: json_Chart1,
        keys: {
            value: ['Budget', 'Total Revenue']
        },
        colors: {
        'Budget': '#ffa500',
        'Total Revenue': '#0099cc',
        }
        });

    chart2.load({    
        json: json_Chart2,
        keys: {
            value: ['This Movie', 'All Movies']
        },
        colors: {
        'This Movie': '#326ada',
        'All Movies': '#a19c9c',
        }
        });

    chart3.load({    
        json: json_Chart3,
        keys: {
            value: ['Sentiment Score']
        },
        });

    clearWords();

    d3.layout.cloud().size([275, 360])
            .words(frequency_list[parseInt($.cookie('highlightedN')-1)])
            .rotate(0)
            .fontSize(function(d) { return d.size; })
            .on("end", draw)
            .start();

    if($.cookie('tutorial2') == undefined) {
    alert("On this page you can view more detailed statistics about a movie.\nYou may stack up to 5 movies on this page and compare their statistics against each other.\n\nThe movies you have selected to compare are displayed as thumbnails:\nHOVER a thumbnail to see the movie title.\nLEFT-CLICK a thumbnail to highlight a particular movie (some statistics are displayed for this movie only and not compared).\nRIGHT-CLICK a thumbnail to remove a particular movie from comparison.")
    var date = new Date();
    var minutes = 60;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie('tutorial2', 'true', { expires: date });
    }

    $('.thumbnail').mouseover(function(event) {
        switch (event.which) {
            default:
                document.getElementById(highlightedThumb).style.border = "none";
                document.getElementById(this.id).style.border = "5px inset black";
                break;
           }
    })

    $('.thumbnail').mouseout(function(event) {
        switch (event.which) {
            default:
                document.getElementById(this.id).style.border = "none";
                document.getElementById(highlightedThumb).style.border = "5px inset black";
                break;
           }
    })

    $('.thumbnail').mousedown(function(event) {
        switch (event.which) {
            case 1:
                document.getElementById(highlightedThumb).style.border = "none";
                document.getElementById(this.id).style.border = "5px inset black";
                highlightedThumb = this.id;
                var number = highlightedThumb.charAt(9);
                $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movie[number-1].backdrop_path +')');
                json_Chart1 = [{'Budget':movie[number-1].budget, 'Total Revenue':movie[number-1].revenue}];
                json_Chart2 = [{'This Movie':movie[number-1].movieTweets, 'All Movies':movie[number-1].totalTweets}];
                json_Chart3 = [{'Sentiment Score':movie[number-1].sentiment_rating}];
                $.cookie('highlightedMovie', $.cookie('movie'+number));
                $.cookie('highlightedN', number);
                chart1.load({    
                    json: json_Chart1,
                    keys: {
                        value: ['Budget', 'Total Revenue']
                    },
                    colors: {
                    'Budget': '#ffa500',
                    'Total Revenue': '#0099cc',
                    }
                    });

                chart2.load({    
                    json: json_Chart2,
                    keys: {
                        value: ['This Movie', 'All Movies']
                    },
                    colors: {
                    'This Movie': '#326ada',
                    'All Movies': '#a19c9c',
                    }
                    });

                chart3.load({    
                    json: json_Chart3,
                    keys: {
                        value: ['Sentiment Score']
                    },
                    });

                clearWords();

                d3.layout.cloud().size([275, 360])
                    .words(frequency_list[number-1])
                    .rotate(0)
                    .fontSize(function(d) { return d.size; })
                    .on("end", draw)
                    .start();
                
                break;                

            case 3:
                var number = this.id.charAt(9);
                $.cookie.json = true;

                if (number == parseInt($.cookie('highlightedN'))) {
                    $.removeCookie('highlightedMovie');
                    $.removeCookie('highlightedN');
                }
                else if (number < parseInt($.cookie('highlightedN'))) {
                $.cookie('highlightedN', parseInt($.cookie('highlightedN')-1).toString());
                }

                switch (amountOfMovies()) {
                    case 1: 
                    alert("Why would you want to do that?");
                    updateStatPage();
                    break;        

                    case 2: 
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.cookie('moviewords'+number, $.cookie('moviewords'+(parseInt(number)+1).toString()));
                    $.removeCookie('movie2');
                    $.removeCookie('moviewords2');
                    document.getElementById("thumbnail2").style.visibility = "hidden";
                    chart4.unload({});
                    chart5.unload({});
                    location.reload();
                    updateStatPage();
                    break;

                    case 3:
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.cookie('moviewords'+number, $.cookie('moviewords'+(parseInt(number)+1).toString()));
                    $.cookie('movie'+(parseInt(number)+1).toString(), $.cookie('movie'+(parseInt(number)+2).toString()));
                    $.cookie('moviewords'+(parseInt(number)+1).toString(), $.cookie('moviewords'+(parseInt(number)+2).toString()));
                    $.removeCookie('movie3');
                    $.removeCookie('moviewords3');
                    document.getElementById("thumbnail3").style.visibility = "hidden";
                    chart4.unload({});
                    chart5.unload({});
                    location.reload();
                    updateStatPage();
                    break;

                    case 4: 
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.cookie('moviewords'+number, $.cookie('moviewords'+(parseInt(number)+1).toString()));
                    $.cookie('movie'+(parseInt(number)+1).toString(), $.cookie('movie'+(parseInt(number)+2).toString()));
                    $.cookie('moviewords'+(parseInt(number)+1).toString(), $.cookie('moviewords'+(parseInt(number)+2).toString()));
                    $.cookie('movie'+(parseInt(number)+2).toString(), $.cookie('movie'+(parseInt(number)+3).toString()));
                    $.cookie('moviewords'+(parseInt(number)+2).toString(), $.cookie('moviewords'+(parseInt(number)+3).toString()));                    
                    $.removeCookie('movie4');
                    $.removeCookie('moviewords4');
                    document.getElementById("thumbnail4").style.visibility = "hidden";
                    chart4.unload({});
                    chart5.unload({});
                    location.reload();
                    updateStatPage();
                    break;

                    case 5: 
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.cookie('moviewords'+number, $.cookie('moviewords'+(parseInt(number)+1).toString()));
                    $.cookie('movie'+(parseInt(number)+1).toString(), $.cookie('movie'+(parseInt(number)+2).toString()));
                    $.cookie('moviewords'+(parseInt(number)+1).toString(), $.cookie('moviewords'+(parseInt(number)+2).toString()));
                    $.cookie('movie'+(parseInt(number)+2).toString(), $.cookie('movie'+(parseInt(number)+3).toString()));
                    $.cookie('moviewords'+(parseInt(number)+2).toString(), $.cookie('moviewords'+(parseInt(number)+3).toString()));                    
                    $.cookie('movie'+(parseInt(number)+3).toString(), $.cookie('movie'+(parseInt(number)+4).toString()));
                    $.cookie('moviewords'+(parseInt(number)+3).toString(), $.cookie('moviewords'+(parseInt(number)+4).toString()));                    
                    $.removeCookie('movie5');
                    $.removeCookie('moviewords5');
                    document.getElementById("thumbnail5").style.visibility = "hidden";                    
                    chart4.unload({});
                    chart5.unload({});
                    location.reload();
                    updateStatPage();
                    break;
                }
                break;
        }
    })

    chart4.load({
        rows: [
            [movie[0].title],
            [movie[0].budget],
            [movie[0].revenue],
        ],
        type: 'bar',
    });

    chart5.load({
        rows: [
            [movie[0].title],
            [movie[0].sentiment_rating],
            [movie[0].vote_average], 
            [movie[0].imdb_rating],
            [movie[0].critics_rating],
        ],
        type: 'bar',
    });

    chart6.load({
        columns: [
            ['x', Object.keys(movie[0].sentiment_per_day)[0], Object.keys(movie[0].sentiment_per_day)[1], Object.keys(movie[0].sentiment_per_day)[2], Object.keys(movie[0].sentiment_per_day)[3], Object.keys(movie[0].sentiment_per_day)[4], Object.keys(movie[0].sentiment_per_day)[5], Object.keys(movie[0].sentiment_per_day)[6]],
            [movie[0].title, movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[0]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[1]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[2]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[3]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[4]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[5]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[6]]],
        ]
    });

    chart7.load({
        columns: [
            ['x', Object.keys(movie[0].tweets_per_day)[0], Object.keys(movie[0].tweets_per_day)[1], Object.keys(movie[0].tweets_per_day)[2], Object.keys(movie[0].tweets_per_day)[3], Object.keys(movie[0].tweets_per_day)[4], Object.keys(movie[0].tweets_per_day)[5], Object.keys(movie[0].tweets_per_day)[6]],
            [movie[0].title, movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[0]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[1]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[2]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[3]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[4]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[5]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[6]]],
        ]
    });

    $("#thumbnail2").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[1].poster_path, "title":movie[1].title});
    document.getElementById("thumbnail2").style.visibility = "visible";

    chart4.load({
        rows: [
            [movie[0].title, movie[1].title],
            [movie[0].budget, movie[1].budget],
            [movie[0].revenue, movie[1].revenue],
        ],
        type: 'bar',
    });

    chart5.load({
        rows: [
            [movie[0].title, movie[1].title],
            [movie[0].sentiment_rating, movie[1].sentiment_rating],
            [movie[0].vote_average, movie[1].vote_average], 
            [movie[0].imdb_rating, movie[1].imdb_rating],
            [movie[0].critics_rating, movie[1].critics_rating],
        ],
        type: 'bar',
    });

    chart6.load({
        columns: [
            ['x', Object.keys(movie[0].sentiment_per_day)[0], Object.keys(movie[0].sentiment_per_day)[1], Object.keys(movie[0].sentiment_per_day)[2], Object.keys(movie[0].sentiment_per_day)[3], Object.keys(movie[0].sentiment_per_day)[4], Object.keys(movie[0].sentiment_per_day)[5], Object.keys(movie[0].sentiment_per_day)[6]],
            [movie[0].title, movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[0]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[1]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[2]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[3]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[4]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[5]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[6]]],
            [movie[1].title, movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[0]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[1]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[2]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[3]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[4]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[5]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[6]]],
        ]
    });

    chart7.load({
        columns: [
            ['x', Object.keys(movie[0].tweets_per_day)[0], Object.keys(movie[0].tweets_per_day)[1], Object.keys(movie[0].tweets_per_day)[2], Object.keys(movie[0].tweets_per_day)[3], Object.keys(movie[0].tweets_per_day)[4], Object.keys(movie[0].tweets_per_day)[5], Object.keys(movie[0].tweets_per_day)[6]],
            [movie[0].title, movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[0]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[1]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[2]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[3]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[4]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[5]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[6]]],
            [movie[1].title, movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[0]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[1]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[2]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[3]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[4]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[5]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[6]]],
        ]
    });

    $("#thumbnail3").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[2].poster_path, "title":movie[2].title});
    document.getElementById("thumbnail3").style.visibility = "visible";

    chart4.load({
        rows: [
            [movie[0].title, movie[1].title, movie[2].title],
            [movie[0].budget, movie[1].budget, movie[2].budget],
            [movie[0].revenue, movie[1].revenue, movie[2].revenue],
        ],
        type: 'bar',
    });

    chart5.load({
        rows: [
            [movie[0].title, movie[1].title, movie[2].title],
            [movie[0].sentiment_rating, movie[1].sentiment_rating, movie[2].sentiment_rating],
            [movie[0].vote_average, movie[1].vote_average, movie[2].vote_average], 
            [movie[0].imdb_rating, movie[1].imdb_rating, movie[2].imdb_rating],
            [movie[0].critics_rating, movie[1].critics_rating, movie[2].critics_rating],
        ],
        type: 'bar',
    });

    chart6.load({
        columns: [
            ['x', Object.keys(movie[0].sentiment_per_day)[0], Object.keys(movie[0].sentiment_per_day)[1], Object.keys(movie[0].sentiment_per_day)[2], Object.keys(movie[0].sentiment_per_day)[3], Object.keys(movie[0].sentiment_per_day)[4], Object.keys(movie[0].sentiment_per_day)[5], Object.keys(movie[0].sentiment_per_day)[6]],
            [movie[0].title, movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[0]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[1]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[2]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[3]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[4]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[5]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[6]]],
            [movie[1].title, movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[0]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[1]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[2]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[3]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[4]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[5]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[6]]],
            [movie[2].title, movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[0]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[1]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[2]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[3]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[4]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[5]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[6]]],
        ]
    });

    chart7.load({
        columns: [
            ['x', Object.keys(movie[0].tweets_per_day)[0], Object.keys(movie[0].tweets_per_day)[1], Object.keys(movie[0].tweets_per_day)[2], Object.keys(movie[0].tweets_per_day)[3], Object.keys(movie[0].tweets_per_day)[4], Object.keys(movie[0].tweets_per_day)[5], Object.keys(movie[0].tweets_per_day)[6]],
            [movie[0].title, movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[0]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[1]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[2]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[3]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[4]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[5]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[6]]],
            [movie[1].title, movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[0]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[1]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[2]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[3]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[4]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[5]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[6]]],
            [movie[2].title, movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[0]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[1]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[2]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[3]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[4]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[5]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[6]]],
        ]
    });

    $("#thumbnail4").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[3].poster_path, "title":movie[3].title});
    document.getElementById("thumbnail4").style.visibility = "visible";

    chart4.load({
        rows: [
            [movie[0].title, movie[1].title, movie[2].title, movie[3].title],
            [movie[0].budget, movie[1].budget, movie[2].budget, movie[3].budget],
            [movie[0].revenue, movie[1].revenue, movie[2].revenue, movie[3].revenue],
        ],
        type: 'bar',
    });

    chart5.load({
        rows: [
            [movie[0].title, movie[1].title, movie[2].title, movie[3].title],
            [movie[0].sentiment_rating, movie[1].sentiment_rating, movie[2].sentiment_rating, movie[3].sentiment_rating],
            [movie[0].vote_average, movie[1].vote_average, movie[2].vote_average, movie[3].vote_average], 
            [movie[0].imdb_rating, movie[1].imdb_rating, movie[2].imdb_rating, movie[3].imdb_rating],
            [movie[0].critics_rating, movie[1].critics_rating, movie[2].critics_rating, movie[3].critics_rating],
        ],
        type: 'bar',
    });

    chart6.load({
        columns: [
            ['x', Object.keys(movie[0].sentiment_per_day)[0], Object.keys(movie[0].sentiment_per_day)[1], Object.keys(movie[0].sentiment_per_day)[2], Object.keys(movie[0].sentiment_per_day)[3], Object.keys(movie[0].sentiment_per_day)[4], Object.keys(movie[0].sentiment_per_day)[5], Object.keys(movie[0].sentiment_per_day)[6]],
            [movie[0].title, movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[0]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[1]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[2]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[3]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[4]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[5]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[6]]],
            [movie[1].title, movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[0]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[1]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[2]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[3]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[4]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[5]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[6]]],
            [movie[2].title, movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[0]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[1]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[2]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[3]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[4]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[5]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[6]]],
            [movie[3].title, movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[0]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[1]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[2]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[3]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[4]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[5]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[6]]],
        ]
    });

    chart7.load({
        columns: [
            ['x', Object.keys(movie[0].tweets_per_day)[0], Object.keys(movie[0].tweets_per_day)[1], Object.keys(movie[0].tweets_per_day)[2], Object.keys(movie[0].tweets_per_day)[3], Object.keys(movie[0].tweets_per_day)[4], Object.keys(movie[0].tweets_per_day)[5], Object.keys(movie[0].tweets_per_day)[6]],
            [movie[0].title, movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[0]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[1]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[2]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[3]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[4]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[5]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[6]]],
            [movie[1].title, movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[0]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[1]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[2]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[3]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[4]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[5]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[6]]],
            [movie[2].title, movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[0]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[1]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[2]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[3]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[4]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[5]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[6]]],
            [movie[3].title, movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[0]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[1]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[2]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[3]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[4]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[5]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[6]]],
        ]
    });

    $("#thumbnail5").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[4].poster_path, "title":movie[4].title});
    document.getElementById("thumbnail5").style.visibility = "visible";

    chart4.load({
        rows: [
            [movie[0].title, movie[1].title, movie[2].title, movie[3].title, movie[4].title],
            [movie[0].budget, movie[1].budget, movie[2].budget, movie[3].budget, movie[4].budget],
            [movie[0].revenue, movie[1].revenue, movie[2].revenue, movie[3].revenue, movie[4].revenue],
        ],
        type: 'bar',
    });

    chart5.load({
        rows: [
            [movie[0].title, movie[1].title, movie[2].title, movie[3].title, movie[4].title],
            [movie[0].sentiment_rating, movie[1].sentiment_rating, movie[2].sentiment_rating, movie[3].sentiment_rating, movie[4].sentiment_rating],
            [movie[0].vote_average, movie[1].vote_average, movie[2].vote_average, movie[3].vote_average, movie[4].vote_average], 
            [movie[0].imdb_rating, movie[1].imdb_rating, movie[2].imdb_rating, movie[3].imdb_rating, movie[4].imdb_rating],
            [movie[0].critics_rating, movie[1].critics_rating, movie[2].critics_rating, movie[3].critics_rating, movie[4].critics_rating],
        ],
        type: 'bar',
    });

    chart6.load({
        columns: [
            ['x', Object.keys(movie[0].sentiment_per_day)[0], Object.keys(movie[0].sentiment_per_day)[1], Object.keys(movie[0].sentiment_per_day)[2], Object.keys(movie[0].sentiment_per_day)[3], Object.keys(movie[0].sentiment_per_day)[4], Object.keys(movie[0].sentiment_per_day)[5], Object.keys(movie[0].sentiment_per_day)[6]],
            [movie[0].title, movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[0]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[1]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[2]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[3]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[4]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[5]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[6]]],
            [movie[1].title, movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[0]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[1]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[2]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[3]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[4]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[5]], movie[1].sentiment_per_day[Object.keys(movie[1].sentiment_per_day)[6]]],
            [movie[2].title, movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[0]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[1]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[2]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[3]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[4]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[5]], movie[2].sentiment_per_day[Object.keys(movie[2].sentiment_per_day)[6]]],
            [movie[3].title, movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[0]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[1]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[2]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[3]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[4]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[5]], movie[3].sentiment_per_day[Object.keys(movie[3].sentiment_per_day)[6]]],
            [movie[4].title, movie[4].sentiment_per_day[Object.keys(movie[4].sentiment_per_day)[0]], movie[4].sentiment_per_day[Object.keys(movie[4].sentiment_per_day)[1]], movie[4].sentiment_per_day[Object.keys(movie[4].sentiment_per_day)[2]], movie[4].sentiment_per_day[Object.keys(movie[4].sentiment_per_day)[3]], movie[4].sentiment_per_day[Object.keys(movie[4].sentiment_per_day)[4]], movie[4].sentiment_per_day[Object.keys(movie[4].sentiment_per_day)[5]], movie[4].sentiment_per_day[Object.keys(movie[4].sentiment_per_day)[6]]],
        ]
    });

    chart7.load({
        columns: [
            ['x', Object.keys(movie[0].tweets_per_day)[0], Object.keys(movie[0].tweets_per_day)[1], Object.keys(movie[0].tweets_per_day)[2], Object.keys(movie[0].tweets_per_day)[3], Object.keys(movie[0].tweets_per_day)[4], Object.keys(movie[0].tweets_per_day)[5], Object.keys(movie[0].tweets_per_day)[6]],
            [movie[0].title, movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[0]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[1]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[2]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[3]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[4]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[5]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[6]]],
            [movie[1].title, movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[0]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[1]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[2]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[3]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[4]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[5]], movie[1].tweets_per_day[Object.keys(movie[1].tweets_per_day)[6]]],
            [movie[2].title, movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[0]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[1]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[2]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[3]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[4]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[5]], movie[2].tweets_per_day[Object.keys(movie[2].tweets_per_day)[6]]],
            [movie[3].title, movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[0]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[1]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[2]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[3]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[4]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[5]], movie[3].tweets_per_day[Object.keys(movie[3].tweets_per_day)[6]]],
            [movie[4].title, movie[4].tweets_per_day[Object.keys(movie[4].tweets_per_day)[0]], movie[4].tweets_per_day[Object.keys(movie[4].tweets_per_day)[1]], movie[4].tweets_per_day[Object.keys(movie[4].tweets_per_day)[2]], movie[4].tweets_per_day[Object.keys(movie[4].tweets_per_day)[3]], movie[4].tweets_per_day[Object.keys(movie[4].tweets_per_day)[4]], movie[4].tweets_per_day[Object.keys(movie[4].tweets_per_day)[5]], movie[4].tweets_per_day[Object.keys(movie[4].tweets_per_day)[6]]],
        ]
    });

}

function random() { 

    $.ajax({
        url: "http://localhost:8081/erl/web_server:movie_ids",
        async: false,
        dataType: 'json',
        success: function(data) {
            keys = data;
        }
    });

    var r = Math.floor((Math.random() * keys.length));


    $.ajax({
        url: "http://localhost:8081/erl/web_server:movies?" + keys[r],
        async: false,
        dataType: 'json',
        success: function(data) {
            movieJSON = data;
        $.cookie.json = true;
            $.cookie('movieJSONcurr', movieJSON);
        }
    });

    getTweets(movieJSON.id);
    updatePage();   
}

function search() {

    var term = $("#search_term").val().toLowerCase();
    if (term != "") {
        var keys = Object.keys(titles);
        var key = "";
        var loop = true;
        var found = false;
        var len = keys.length;
        var i = 0;
        while(loop) {
            key = keys[i];
            if(key.toLowerCase().indexOf(term) > -1) {
                found = true;
                loop = false;
            };
            i++;
            if (i>=len) {
                loop = false;
            };
        }
        if(found) {
            var id = titles[key];
            $.ajax({
                url: "http://localhost:8081/erl/web_server:movies?" + id,
                async: false,
                dataType: 'json',
                success: function(data) {
                    movieJSON = data;
                $.cookie.json = true;
                    $.cookie('movieJSONcurr', movieJSON);
                }  
            });

            getTweets(movieJSON.id);
            updatePage();
        }
        else{
            alert("No matching result");
        }
    };
}

function init() {

    $.ajax({
        url: "http://localhost:8081/erl/web_server:movie_titles",
        async: false,
        dataType: 'json',
        success: function(data) {
            titles = data;
        }
    });

    random();

}

function initStatPage() {

    $.cookie.json = true;

    statistics = window.open("statistics.html","statistics");
    add();

}

function amountOfMovies() {
    $.cookie.json = true;
    var amount;

    if($.cookie('movie1') == undefined) {
        amount = 0;
    }

    else if($.cookie('movie2') == undefined) {
        amount = 1;
    }

    else if($.cookie('movie3') == undefined) {
        amount = 2;
    }

    else if($.cookie('movie4') == undefined) {
        amount = 3;
    }

    else if($.cookie('movie5') == undefined) {
        amount = 4;
    }

    else {
        amount = 5;
    }  

    return amount;
}

function add() {
    $.cookie.json = true;

    switch (amountOfMovies()) {

        case 0: 
        alert("Added " + $.cookie('movieJSONcurr').title + " to comparison.");
        $.cookie('movie1', $.cookie('movieJSONcurr'));
        $.ajax({
        url: "http://localhost:8081/erl/web_server:wordcloud?" + $.cookie('movie1').id,
        async: false,
        dataType: 'json',
        success: function(data) {
            frequency_list = data;
            $.cookie('moviewords1', frequency_list);
        }
        })
        statistics.updateStatPage();
        break;

        case 1: 
        if ($.cookie('movieJSONcurr').id != $.cookie('movie1').id){
        alert("Added " + $.cookie('movieJSONcurr').title + " to comparison.");
        $.cookie('movie2', $.cookie('movieJSONcurr'));
        $.ajax({
        url: "http://localhost:8081/erl/web_server:wordcloud?" + $.cookie('movie2').id,
        async: false,
        dataType: 'json',
        success: function(data) {
            frequency_list = data;
            $.cookie('moviewords2', frequency_list);
        }
        })
        statistics.updateStatPage();
        }
        break;        

        case 2:
        if (($.cookie('movieJSONcurr').id != $.cookie('movie1').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie2').id)){ 
        alert("Added " + $.cookie('movieJSONcurr').title + " to comparison.");        
        $.cookie('movie3', $.cookie('movieJSONcurr'));
        $.ajax({
        url: "http://localhost:8081/erl/web_server:wordcloud?" + $.cookie('movie3').id,
        async: false,
        dataType: 'json',
        success: function(data) {
            frequency_list = data;
            $.cookie('moviewords3', frequency_list);
        }
        })
        statistics.updateStatPage();
        }
        break;

        case 3:
        if (($.cookie('movieJSONcurr').id != $.cookie('movie1').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie2').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie3').id)){ 
        alert("Added " + $.cookie('movieJSONcurr').title + " to comparison.");        
        $.cookie('movie4', $.cookie('movieJSONcurr'));
        $.ajax({
        url: "http://localhost:8081/erl/web_server:wordcloud?" + $.cookie('movie4').id,
        async: false,
        dataType: 'json',
        success: function(data) {
            frequency_list = data;
            $.cookie('moviewords4', frequency_list);
        }
        })
        statistics.updateStatPage();
        }
        break;

        case 4:
        if (($.cookie('movieJSONcurr').id != $.cookie('movie1').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie2').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie3').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie4').id)){ 
        alert("Added " + $.cookie('movieJSONcurr').title + " to comparison.");
        $.cookie('movie5', $.cookie('movieJSONcurr'));
        $.ajax({
        url: "http://localhost:8081/erl/web_server:wordcloud?" + $.cookie('movie5').id,
        async: false,
        dataType: 'json',
        success: function(data) {
            frequency_list = data;
            $.cookie('moviewords5', frequency_list);
        }
        })
        statistics.updateStatPage();
        }
        break;

        case 5:
        if (($.cookie('movieJSONcurr').id != $.cookie('movie1').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie2').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie3').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie4').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie5').id)){  
        alert("Easy there NERD! You are currently comparing 5 movies, remove at least one before any more can be added.");
        }
        break;
    }  

};

function draw(words) {
    d3.select("#wordcloud").append("svg")
            .attr("id","wordcloud")
            .attr("width", 275)
            .attr("height", 340)
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(80,100)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function(d) { return d.size*4 + "px"; })
            .style("fill", function(d, i) { return color(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
}

function clearWords() {
    d3.select("#wordcloud").select("svg").remove();
}

function help(s) {
    if (s == 1) {
        alert("On this page you can view information and statistics about movies.\n\nUse the search-field together with the SEARCH-button to search for a specific movie by its title or click the RANDOM-button to check-out a random movie.\n\nYou can view more statistics about a movie by clicking on 'VIEW FULL STATISTICS', additional movies can be added in order to compare statistics by clicking 'ADD TO COMPARE'.");
    }
    else if (s == 2) {
        alert("On this page you can view more detailed statistics about a movie.\nYou may stack up to 5 movies on this page and compare their statistics against each other.\n\nThe movies you have selected to compare are displayed as thumbnails:\nHOVER a thumbnail to see the movie title.\nLEFT-CLICK a thumbnail to highlight a particular movie (some statistics are displayed for this movie only and not compared).\nRIGHT-CLICK a thumbnail to remove a particular movie from comparison.");
    }
}