-module(movies).
-export([releases_day/1, releases_today/0, id/1, url/1, string_date/0, id_list/1, popular/1]).

-define(API_KEY, "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXx").


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
	Body.

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
