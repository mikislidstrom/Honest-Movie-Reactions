var movieJSON;
var titles;
var id = "101";
var keys;
var statistics;
var highlightedMovie;
var json_Chart1;

function updatePage() {

    $("#title").text(movieJSON.title);
    $("#tagline").text(movieJSON.tagline);
    $("#overview").text(movieJSON.overview);
    $("#vote_average").text("Average vote: " + movieJSON.vote_average);
    $("#release_date").text("Release date: " + movieJSON.release_date);
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
    var minutes = 15;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie('tutorial1', 'true', { expires: date });
    }
}

function updateStatPage() {

$.cookie.json = true; 
    
    var movie = [$.cookie('movie1'), $.cookie('movie2'), $.cookie('movie3'), $.cookie('movie4'), $.cookie('movie5')];

    $("#vote_average").text("Average vote: " + movie[0].vote_average);
    $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movie[0].backdrop_path +')');
    $("#thumbnail1").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[0].poster_path, "title":movie[0].title});
    
    if (highlightedMovie == null) {
    highlightedMovie = "thumbnail1";
    }

    document.getElementById(highlightedMovie).style.border = "5px inset black";

    json_Chart1 = [{'Budget':movie[0].budget, 'Total Revenue':movie[0].revenue}];
    json_Chart2 = [{'This Movie':movie[0].movieTweets, 'All Movies':movie[0].totalTweets}];
    json_Chart3 = [{'Sentiment Score':movie[0].sentiment_rating}];

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

    if($.cookie('tutorial2') == undefined) {
    alert("On this page you can view more detailed statistics about a movie.\nYou may stack up to 5 movies on this page and compare their statistics against each other.\n\nThe movies you have selected to compare are displayed as thumbnails:\nHOVER a thumbnail to see the movie title.\nLEFT-CLICK a thumbnail to highlight a particular movie (this will also load it on the start page).\nRIGHT-CLICK a thumbnail to remove a particular movie from comparison.")
    var date = new Date();
    var minutes = 15;
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    $.cookie('tutorial2', 'true', { expires: date });
    }

    $('.thumbnail').mouseover(function(event) {
        switch (event.which) {
            default:
                document.getElementById(highlightedMovie).style.border = "none";
                document.getElementById(this.id).style.border = "5px inset black";
                break;
           }
    })

    $('.thumbnail').mouseout(function(event) {
        switch (event.which) {
            default:
                document.getElementById(this.id).style.border = "none";
                document.getElementById(highlightedMovie).style.border = "5px inset black";
                break;
           }
    })

    $('.thumbnail').mousedown(function(event) {
        switch (event.which) {
            case 1:
                document.getElementById(highlightedMovie).style.border = "none";
                document.getElementById(this.id).style.border = "5px inset black";
                highlightedMovie = this.id;
                var number = highlightedMovie.charAt(9);
                //var movie Has to be declared again inside this function due to timing to avoid refreshing entire script
                var movie = [$.cookie('movie1'), $.cookie('movie2'), $.cookie('movie3'), $.cookie('movie4'), $.cookie('movie5')];
                $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movie[number-1].backdrop_path +')');

                json_Chart1 = [{'Budget':movie[number-1].budget, 'Total Revenue':movie[number-1].revenue}];
                json_Chart2 = [{'This Movie':movie[number-1].movieTweets, 'All Movies':movie[number-1].totalTweets}];
                json_Chart3 = [{'Sentiment Score':movie[number-1].sentiment_rating}];

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

                break;

            case 3:
                var number = this.id.charAt(9);
                $.cookie.json = true;

                switch (amountOfMovies()) {
                    case 1: 
                    alert("Why would you want to do that?");
                    updateStatPage();
                    break;        

                    case 2: 
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.removeCookie('movie2');
                    document.getElementById("thumbnail2").style.visibility = "hidden";
                    updateStatPage();
                    break;

                    case 3:
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.cookie('movie'+(parseInt(number)+1).toString(), $.cookie('movie'+(parseInt(number)+2).toString()));
                    $.removeCookie('movie3');
                    document.getElementById("thumbnail3").style.visibility = "hidden";
                    updateStatPage();
                    break;

                    case 4: 
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.cookie('movie'+(parseInt(number)+1).toString(), $.cookie('movie'+(parseInt(number)+2).toString()));
                    $.cookie('movie'+(parseInt(number)+2).toString(), $.cookie('movie'+(parseInt(number)+3).toString()));
                    $.removeCookie('movie4');
                    document.getElementById("thumbnail4").style.visibility = "hidden";
                    updateStatPage();
                    break;

                    case 5: 
                    $.cookie('movie'+number, $.cookie('movie'+(parseInt(number)+1).toString()));
                    $.cookie('movie'+(parseInt(number)+1).toString(), $.cookie('movie'+(parseInt(number)+2).toString()));
                    $.cookie('movie'+(parseInt(number)+2).toString(), $.cookie('movie'+(parseInt(number)+3).toString()));
                    $.cookie('movie'+(parseInt(number)+3).toString(), $.cookie('movie'+(parseInt(number)+4).toString()));
                    $.removeCookie('movie5');
                    document.getElementById("thumbnail5").style.visibility = "hidden";
                    updateStatPage();
                    break;
                }
                break;
        }
    })

    $("#thumbnail2").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[1].poster_path, "title":movie[1].title});
    document.getElementById("thumbnail2").style.visibility = "visible";
    $("#thumbnail3").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[2].poster_path, "title":movie[2].title});
    document.getElementById("thumbnail3").style.visibility = "visible";
    $("#thumbnail4").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[3].poster_path, "title":movie[3].title});
    document.getElementById("thumbnail4").style.visibility = "visible";
    $("#thumbnail5").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[4].poster_path, "title":movie[4].title});
    document.getElementById("thumbnail5").style.visibility = "visible";

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
        };
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
    $.cookie('movie1', $.cookie('movieJSONcurr'));
    statistics = window.open("statistics.html","statistics");

}

function amountOfMovies() {
    $.cookie.json = true;
    var amount;

    if($.cookie('movie2') == undefined) {
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

        case 1: 
        $.cookie('movie2', $.cookie('movieJSONcurr'));
        statistics.updateStatPage();
        break;        

        case 2: 
        $.cookie('movie3', $.cookie('movieJSONcurr'));
        statistics.updateStatPage();
        break;

        case 3: 
        $.cookie('movie4', $.cookie('movieJSONcurr'));
        statistics.updateStatPage();
        break;

        case 4: 
        $.cookie('movie5', $.cookie('movieJSONcurr'));
        statistics.updateStatPage();
        break;

        case 5: 
        alert("Easy there NERD! You are currently comparing 5 movies, remove at least one before any more can be added.");
        break;
    }  

};
