//Global variables
var movieJSON;
var titles;
var keys;
var statistics;
var movie;
var highlightedThumb;
var frequency_list;
var fill = d3.scale.category20b();

//Updates start.html
function updatePage() {

    //Updates Movie information and images
    $("#title").text(movieJSON.title);
    $("#tagline").text(movieJSON.tagline);
    $("#overview").text(movieJSON.overview);
    $("#runtime").text("Runtime: " + movieJSON.runtime + " min");
    $("#homepage").html('<a href="' + movieJSON.homepage + '">' + movieJSON.homepage + '</a>');
    $("#imdb").html('<a href="http://www.imdb.com/title/' + movieJSON.imdb_id + '">IMDb</a>');
    $("#imagePoster").attr({"src": "https://image.tmdb.org/t/p/w500" + movieJSON.poster_path, "title":movieJSON.title});
    $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movieJSON.backdrop_path +')');
 
    //The purpose of this function is to set give IDs a tag
    //that will later be used by start.html to display text
    setTweetTags();

    //Updates the Box Office chart with new data
    chart1.load({    
        columns: [
            ['Budget', movieJSON.budget],
            ['Total Revenue', movieJSON.revenue],
        ]
        });

    //Updates the Tweet Amount chart with new data
    chart2.load({    
        columns: [
            ['This Movie', movieJSON.movieTweets],
            ['All Movies', movieJSON.totalTweets],
        ]
        });

    //Updates the Sentiment Score chart with new data
    chart3.load({    
        columns: [['Sentiment Score', movieJSON.sentiment_rating]]
        });

}

//Updates statistics.html
function updateStatPage() {

    //Necessary to use Jquery Cookies
    $.cookie.json = true; 
    
    //Creates an array of 5 JSON objects with different movie data stored as cookies
    movie = [$.cookie('movie1'), $.cookie('movie2'), $.cookie('movie3'), $.cookie('movie4'), $.cookie('movie5')];
    //Creates an array of 5 JSON objects with different movie wordcloud data stored as cookies
    //This data is gathered as a different JSON object because storing it together with the Movie JSON object would make the cookie too big to store
    frequency_list = [$.cookie('moviewords1'), $.cookie('moviewords2'), $.cookie('moviewords3'), $.cookie('moviewords4'), $.cookie('moviewords5')];
    //Used so that the page remembers which movie is highlighted in case of an accidental page refresh
    highlightedMovie = $.cookie('highlightedMovie');
     
    //If no Movie has been highlighted, the first One in comparison is highlighted as default  
    if (highlightedMovie == undefined) {
    highlightedMovie = $.cookie('movie1');
    highlightedThumb = "thumbnail1";
    $.cookie('highlightedN', "1");
    }

    //To keep track of which thumbnail belongs to the highlighted movie
    else {
    highlightedThumb = "thumbnail" + $.cookie('highlightedN');
    }

    //Updates thumbnail1 and background images
    $("#thumbnail1").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[0].poster_path, "title":movie[0].title});
    $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + highlightedMovie.backdrop_path +')');

    //Changes layout for the highlighted thumbnail
    document.getElementById(highlightedThumb).style.border = "5px inset black";

    //Updates the Box Office chart with new data from the highlighted movie
    chart1.load({    
        columns: [
            ['Budget', highlightedMovie.budget],
            ['Total Revenue', highlightedMovie.revenue],
        ]
        });

    //Updates the Tweet Amount chart with new data from the highlighted movie
    chart2.load({    
        columns: [
            ['This Movie', highlightedMovie.movieTweets],
            ['All Movies', highlightedMovie.totalTweets],
        ]
        });

    //Updates the Sentiment Score chart with new data from the highlighted movie
    chart3.load({    
        columns: [['Sentiment Score', highlightedMovie.sentiment_rating]]
        });

    //Clears the wordcloud before adding word data from the highlighted movie
    clearWords();

    //Updates the Wordcloud with word data from the highlighted movie
    d3.layout.cloud().size([400, 400])
            .words(frequency_list[parseInt($.cookie('highlightedN')-1)])
            .rotate(0)
            .padding(1)
            .fontSize(function(d) { return (Math.sqrt(d.size)*3); })
            .on("end", draw)
            .start();

    //Cursor-hover event for thumbnails
    $('.thumbnail').mouseover(function(event) {
        switch (event.which) {
            default:
                document.getElementById(highlightedThumb).style.border = "none";
                document.getElementById(this.id).style.border = "5px inset black";
                break;
           }
    })

    //Cursor-out event for thumbnails
    $('.thumbnail').mouseout(function(event) {
        switch (event.which) {
            default:
                document.getElementById(this.id).style.border = "none";
                document.getElementById(highlightedThumb).style.border = "5px inset black";
                break;
           }
    })

    //Mouse-click event for thumbnails (highlighting a movie)
    $('.thumbnail').mousedown(function(event) {
        switch (event.which) {
            //Left-click event
            case 1:
                document.getElementById(highlightedThumb).style.border = "none";
                document.getElementById(this.id).style.border = "5px inset black";
                highlightedThumb = this.id;
                var number = highlightedThumb.charAt(9);
                $("body").css('background-image', 'url(' + 'https://image.tmdb.org/t/p/w780' + movie[number-1].backdrop_path +')')
                $.cookie('highlightedMovie', $.cookie('movie'+number));
                $.cookie('highlightedN', number);
                updateStatPage();
                
                break;                

            //Right-click event
            case 3:
                var number = this.id.charAt(9);
                $.cookie.json = true;

                //Checks if the right-clicked movie(movie to be removed) is the same as the highlighted movie
                if (number == parseInt($.cookie('highlightedN'))) {
                    $.removeCookie('highlightedMovie');
                    $.removeCookie('highlightedN');
                }
                //checks if the rightclicked movie is on the left-side of the highlighted movie in order to update the highlighted thumbnail to correct
                else if (number < parseInt($.cookie('highlightedN'))) {
                $.cookie('highlightedN', parseInt($.cookie('highlightedN')-1).toString());
                }

                //When a movie is to be detached this checks how many movies there currently are in order to update the cookies and thumbnail images properly
                switch (amountOfMovies()) {
                    //If there is only one movie in comparison it can't be detached
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
                    //Unloads charts so they can be reloaded with new data
                    chart4.unload({});
                    chart5.unload({});
                    chart6.unload({});
                    chart7.unload({});
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
                    chart6.unload({});
                    chart7.unload({});
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
                    chart6.unload({});
                    chart7.unload({});
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
                    chart6.unload({});
                    chart7.unload({});
                    updateStatPage();
                    break;
                }
                break;
        }
    })

//In order to reload the bar and line charts properly there has to be a timer function
setTimeout(function () {

    //Updates the Box Office bar chart with new data from the first movie in comparison
    chart4.load({
        rows: [
            [movie[0].title],
            [movie[0].budget],
            [movie[0].revenue],
        ],
        type: 'bar',
    });

    //Updates the Ratings bar chart with new data from the first movie in comparison
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

    //Updates the Sentiment Score per day line chart with new data from the first movie in comparison
    chart6.load({
        columns: [
            ['x', Object.keys(movie[0].sentiment_per_day)[0], Object.keys(movie[0].sentiment_per_day)[1], Object.keys(movie[0].sentiment_per_day)[2], Object.keys(movie[0].sentiment_per_day)[3], Object.keys(movie[0].sentiment_per_day)[4], Object.keys(movie[0].sentiment_per_day)[5], Object.keys(movie[0].sentiment_per_day)[6]],
            [movie[0].title, movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[0]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[1]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[2]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[3]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[4]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[5]], movie[0].sentiment_per_day[Object.keys(movie[0].sentiment_per_day)[6]]],
        ]
    });

    //Updates the Tweets per day line chart with new data from the first movie in comparison
    chart7.load({
        columns: [
            ['x', Object.keys(movie[0].tweets_per_day)[0], Object.keys(movie[0].tweets_per_day)[1], Object.keys(movie[0].tweets_per_day)[2], Object.keys(movie[0].tweets_per_day)[3], Object.keys(movie[0].tweets_per_day)[4], Object.keys(movie[0].tweets_per_day)[5], Object.keys(movie[0].tweets_per_day)[6]],
            [movie[0].title, movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[0]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[1]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[2]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[3]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[4]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[5]], movie[0].tweets_per_day[Object.keys(movie[0].tweets_per_day)[6]]],
        ]
    });

}, 1);

//Naturally, the following only happens if there are 2 movies attached otherwise the function updateStatPage() stops. This will throw an error to the console, tried to catch this error with different solutions which would catch the error but mess with the entire functionality because of what seems to be a cookie timing problems.
//Updates the thumbnail2 and charts with new data from the first two movies in comparison
$("#thumbnail2").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[1].poster_path, "title":movie[1].title});
document.getElementById("thumbnail2").style.visibility = "visible";

setTimeout(function () {

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

}, 500);

//Naturally, the following only happens if there are 3 movies attached otherwise the function updateStatPage() stops. This will throw an error to the console, tried to catch this error with different solutions which would catch the error but mess with the entire functionality because of what seems to be a cookie timing problems.
//Updates the thumbnail2 and charts with new data from the first three movies in comparison
$("#thumbnail3").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[2].poster_path, "title":movie[2].title});
document.getElementById("thumbnail3").style.visibility = "visible";

setTimeout(function () {

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

}, 1000);

//Naturally, the following only happens if there are 4 movies attached otherwise the function updateStatPage() stops. This will throw an error to the console, tried to catch this error with different solutions which would catch the error but mess with the entire functionality because of what seems to be a cookie timing problems.
//Updates the thumbnail4 and charts with new data from the first two movies in comparison
$("#thumbnail4").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[3].poster_path, "title":movie[3].title});
document.getElementById("thumbnail4").style.visibility = "visible";

setTimeout(function () {

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

}, 1500);

//Naturally, the following only happens if there are 5 movies attached otherwise the function updateStatPage() stops. This will throw an error to the console, tried to catch this error with different solutions which would catch the error but mess with the entire functionality because of what seems to be cookie timing problems.
//Updates the thumbnail5 and charts with new data from the first two movies in comparison
$("#thumbnail5").attr({"src": "https://image.tmdb.org/t/p/w500" + movie[4].poster_path, "title":movie[4].title});
document.getElementById("thumbnail5").style.visibility = "visible";

setTimeout(function () {

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

}, 2000);

}

//Randomizes a movie from the database in order to load it to the start.html
function random() { 

    //Gets a JSONObject all movie ids in the database 
    $.ajax({
        url: "http://localhost:8081/erl/web_server:movie_ids",
        async: false,
        dataType: 'json',
        success: function(data) {
            keys = data;
        }
    });

    var r = Math.floor((Math.random() * keys.length));

    //Gets a JSONObject of a movie with a random id
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

    //The purpose of this function is to 
    //retrieve JSON data from Riak database
    getTweets(movieJSON.id);
    updatePage();   
}

//Function for searching for a Movie title
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
        //If no movietitle was matched with the entered search term an error message will be displayed
        else{
            alert("No matching result");
        }
    };
}


//Initializes the start.html by getting all movietitles to compare future entered searchterms and also loads start.html with a random movie
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

//Initializes the statistics.html in a new tab and adds the movie from the root page to it
function initStatPage() {

    $.cookie.json = true;

    statistics = window.open("statistics.html","statistics");
    add();

}

//Function for checking amount of movies in comparison
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

//Function for adding a movie to comparison, depending on the amount of movies already attached, the added movie is stored as a specific cookie 
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

        //If 5 movies are already attached an error message will be displayed
        case 5:
        if (($.cookie('movieJSONcurr').id != $.cookie('movie1').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie2').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie3').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie4').id)&&($.cookie('movieJSONcurr').id != $.cookie('movie5').id)){  
        alert("Easy there NERD! You are currently comparing 5 movies, remove at least one before any more can be added.");
        }
        break;
    }  

};

//Function for drawing words to the wordcloud
function draw(words) {
    d3.select("#wordcloud").append("svg")
            .attr("id","wordcloud")
            .attr("width", 400)
            .attr("height", 400)
            .attr("class", "wordcloud")
            .append("g")
            // without the transform, words words would get cutoff to the left and top, they would
            // appear outside of the SVG area
            .attr("transform", "translate(200,200)")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .attr("text-anchor", "middle")
            .style("font-family", "Impact")
            .style("font-size", function(d) { return d.size + "px"; })
            .style("fill", function(d, i) { return fill(i); })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function(d) { return d.text; });
}

//Function for clearing the wordcloud from words
function clearWords() {
    d3.select("#wordcloud").select("svg").remove();
}

//Displaying a help message depending on which page the help button was clicked on
function help(s) {
    if (s == 1) {
        alert("On this page you can view information and statistics about movies.\n\nUse the search-field together with the SEARCH-button to search for a specific movie by its title or click the RANDOM-button to check-out a random movie.\n\nYou can view more statistics about a movie by clicking on 'VIEW FULL STATISTICS', additional movies can be added in order to compare statistics by clicking 'ADD TO COMPARE'.");
    }
    else if (s == 2) {
        alert("On this page you can view more detailed statistics about a movie.\nYou may stack up to 5 movies on this page and compare their statistics against each other.\n\nThe movies you have selected to compare are displayed as thumbnails:\nHOVER a thumbnail to see the movie title.\nLEFT-CLICK a thumbnail to highlight a particular movie (some statistics are displayed for this movie only and not compared).\nRIGHT-CLICK a thumbnail to remove a particular movie from comparison.");
    }
}