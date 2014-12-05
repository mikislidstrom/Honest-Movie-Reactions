var movieJSON;
var titles;
var id = "101";
var keys;
var statistics;

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
    var jsonArr = [{'Budget':movieJSON.budget, 'Total Revenue':movieJSON.revenue}];

    chart1.load({    
        json: jsonArr,
        keys: {
            value: ['Budget', 'Total Revenue']
        },
        colors: {
        'Budget': '#ffa500',
        'Total Revenue': '#0099cc',
        }
        });
}

function updateStatPage() {

$.cookie.json = true;

    var movie1 = $.cookie('movie1');
    var movie2 = $.cookie('movie2');
    var movie3 = $.cookie('movie3');
    var movie4 = $.cookie('movie4');
    var movie5 = $.cookie('movie5');

    $("#vote_average").text("Average vote: " + movie1.vote_average);

    $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movie1.backdrop_path +')');
    $("#imagePoster1").attr({"src": "https://image.tmdb.org/t/p/w500" + movie1.poster_path, "title":movie1.title});
    $("#imagePoster2").attr({"src": "https://image.tmdb.org/t/p/w500" + movie2.poster_path, "title":movie2.title});
    $("#imagePoster3").attr({"src": "https://image.tmdb.org/t/p/w500" + movie3.poster_path, "title":movie3.title});
    $("#imagePoster4").attr({"src": "https://image.tmdb.org/t/p/w500" + movie4.poster_path, "title":movie4.title});
    $("#imagePoster5").attr({"src": "https://image.tmdb.org/t/p/w500" + movie5.poster_path, "title":movie5.title});
    var jsonArr = [{'Budget':movie1.budget, 'Revenue':movie1.revenue}];

    chart1.load({    
        json: jsonArr,
        keys: {
            value: ['Budget', 'Revenue']
        },
        columns: [
            ['Opening Weekend', 10000000],
        ],
        colors: {
        Budget: '#ffa500',
        Revenue: '#006400',
        }
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



    /*var list = ["500","123","102651","157336","205587","106","97","120","116","254904","245891","262543","103","96","100","13","113","239563","207933","107","122","98566","114","112","125","603","111","115","124","98","121","105","101","95","240832","228150","104","118","117","204922", "137113", "184315", "91314", "225886", "241254", "189", "138103"];*/
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

};

function initStatPage() {

    $.cookie.json = true;
        $.cookie('movie1', $.cookie('movieJSONcurr'));
    statistics = window.open("statistics.html","statistics");
    statistics.updateStatPage();

};

function add() {

$.cookie.json = true;

if($.cookie('movie2') == undefined) {
$.cookie('movie2', $.cookie('movieJSONcurr'));
statistics.updateStatPage();
}

else if($.cookie('movie3') == undefined) {
$.cookie('movie3', $.cookie('movieJSONcurr'));
statistics.updateStatPage();
}

else if($.cookie('movie4') == undefined) {
$.cookie('movie4', $.cookie('movieJSONcurr'));
statistics.updateStatPage();
}

else {
$.cookie('movie5', $.cookie('movieJSONcurr'));
statistics.updateStatPage();
}   

};
