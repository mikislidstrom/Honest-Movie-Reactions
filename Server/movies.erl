-module(movies).
-export([releases_day/1, releases_today/0, id/1, url/1, string_date/0, id_list/1, popular/1]).
-export([rotten_tomatoes/1, imdb/1]).

-define(API_KEY, "90387aadff905aa5771e9aeb14ab9e3d").


%% Gets a list of movies released on inputed date
releases_day(Date) ->
	Api_Key = "&api_key=" ++ ?API_KEY ++ "&page=1",
	Filter = "https://api.themoviedb.org/3/discover/movie",
	ReleaseDateFrom = "?primary_release_date.gte=" ++ Date,
	ReleaseDateTo = "&primary_release_date.lte=" ++ Date,
	Sort = "&sort_by=popularity.desc",
	Url = Filter ++ ReleaseDateFrom ++ ReleaseDateTo ++ Sort ++ Api_Key,
	inets:start(),
	ssl:start(),
	
	% Pattern {ok, {{Version, 200, ReasonPhrase}, Headers, Body}}
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	{[_Page, {_Result,MovieList}, _TotalPages, _TotalResult]}=jiffy:decode(Body),
	MovieList.

rotten_tomatoes(Imdb_Id) ->
	Api_Key = "?apikey=nuyfaesekthcgc45fd7umc4j",
	Url = "http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json" ++ Api_Key ++ "&type=imdb&id=" ++ string:sub_string(Imdb_Id,3),
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	{PropList} = jiffy:decode(Body),
	{RatingsList} = proplists:get_value(<<"ratings">>, PropList),
	proplists:get_value(<<"critics_score">>, RatingsList).

imdb(Imdb_Id) ->
	Url = "http://www.omdbapi.com/?plot=short&r=json&i=" ++ Imdb_Id,
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	{PropList} = jiffy:decode(Body),
	R = proplists:get_value(<<"imdbRating">>, PropList),
	case R of
		<<"N/A">> -> R;
		_ -> binary_to_float(R) * 10
	end.

%% Gets a list of movies released the current day
releases_today() ->
	Date = string_date(),
	Api_Key = "&api_key=" ++ ?API_KEY ++ "&page=1",
	Filter = "https://api.themoviedb.org/3/discover/movie",
	ReleaseDateFrom = "?primary_release_date.gte=" ++ Date,
	ReleaseDateTo = "&primary_release_date.lte=" ++ Date,
	Sort = "&sort_by=popularity.desc",
	Url = Filter ++ ReleaseDateFrom ++ ReleaseDateTo ++ Sort ++ Api_Key,
	inets:start(),
	ssl:start(),
	
	% Pattern {ok, {{Version, 200, ReasonPhrase}, Headers, Body}}
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	{[_Page, {_Result,MovieList}, _TotalPages, _TotalResult]}=jiffy:decode(Body),
	MovieList.

	%id_list(MovieList).

%% Gets the JSON data for a movie at a certain day
id(Id) ->
	Url = "https://api.themoviedb.org/3/movie/" ++ Id ++ "?api_key=" ++ ?API_KEY,
	inets:start(),
	ssl:start(),
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	{PropList} = jiffy:decode(Body),
	Imdb_rating = [{<<"imdb_rating">>, imdb(binary_to_list(proplists:get_value(<<"imdb_id">>,PropList)))}],
	Critics_rating = [{<<"critics_rating">>, rotten_tomatoes(binary_to_list(proplists:get_value(<<"imdb_id">>,PropList)))}],
	binary_to_list(jiffy:encode({PropList ++ Imdb_rating ++ Critics_rating})).


%% Get the JSON data for entered URL
url(Url) ->
	inets:start(),
	ssl:start(),
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	Body.

%% Creates a string representation of the current date in format "YYYY-MM-DD"
string_date() ->
	{Y,M,D} = date(),
	integer_to_list(Y) ++ "-" ++ integer_to_list(M) ++ "-" ++ integer_to_list(D).

%% Get a list of movie ids from a moviel ist
id_list([]) -> [];
id_list([{Movie}|MovieList]) ->
	[integer_to_list(proplists:get_value(<<"id">>, Movie))] ++ id_list(MovieList).

%% Get a list of movie ids from a movie list with a popularity rating over 4 
popular([]) -> [];
popular([{Movie}|MovieList]) -> 
	case proplists:get_value(<<"popularity">>, Movie) > 4 of
		true ->
			[integer_to_list(proplists:get_value(<<"id">>, Movie))] ++ popular(MovieList);
		false ->
			popular(MovieList)
	end. 
