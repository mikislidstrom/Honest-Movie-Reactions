var movieJSON;
var titles;
var id = "101";
var keys;

function updatePage() {
    $("#title").text(movieJSON.title);
    $("#tagline").text(movieJSON.tagline);
    $("#overview").text(movieJSON.overview);
    $("#vote_average").text("Average vote: " + movieJSON.vote_average);
    $("#release_date").text("Release date: " + movieJSON.release_date);
    $("#runtime").text("Runtime: " + movieJSON.runtime + " min");
    $("#homepage").html('<a href="' + movieJSON.homepage + '">' + movieJSON.homepage + '</a>');
    $("#imdb").html('<a href="http://www.imdb.com/title/' + movieJSON.imdb_id + '">IMDb</a>');
    $("#imagePoster").attr("src", "https://image.tmdb.org/t/p/w500" + movieJSON.poster_path);
    $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movieJSON.backdrop_path +')');
    var jsonArr = [{'Budget':movieJSON.budget, 'Revenue':movieJSON.revenue}];

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
        'Opening Weekend': '#468499',
        Revenue: '#0099cc',
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