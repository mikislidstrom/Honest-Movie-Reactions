-module(test_db).
-export([store_movie/1, get_movie/1, store_movies/1, delete_all/1, delete_movies/1, update_movies/0, id_title_list/0, store_releases/0, store_releases/1, store_tweet/3]).

%% Stores movies in the database from a list of movie ids
store_movies([]) -> ok;
store_movies([X|Xs]) -> 
	Obj = movies:id(X),
	db_handler:put("Movies", X, Obj),
	store_movies(Xs).

%% Stores the movie in the database for the inputed movie id 
store_movie(Id) -> 
	Obj = movies:id(Id),
	db_handler:put("Movies", Id, Obj).

%% Gets the movie data from the database for a movie with inputed movie id
get_movie(Id) ->
	db_handler:get("Movies", Id).


%% Deletes movies from the database from a list of movie ids
delete_movies([]) -> ok;
delete_movies([X|Xs]) ->
	db_handler:delete("Movies", X),
	delete_movies(Xs).

%% Deletes all objects in the db for a certain bucket
delete_all(Bucket) -> 
	delete_all(Bucket, db_handler:keys(Bucket)).

delete_all(_Bucket, []) -> ok;
delete_all(Bucket, [X|Xs]) ->
	db_handler:delete(Bucket, X),
	delete_all(Bucket, Xs).


%% Refreshes the data for all the movies in the database
update_movies() ->
	store_movies(db_handler:keys("Movies")).

%% Helper function
movielist(List) -> movielist(List, []).

movielist([], List) -> List;
movielist([{Movie}|MovieList], List) ->
	movielist(MovieList, [{proplists:get_value(<<"id">>, Movie), binary_to_list(proplists:get_value(<<"title">>, Movie))}|List]).


%% Get id and title for all movies in db
id_title_list() ->
	Keys = db_handler:keys("Movies"),
	MovieList =[jiffy:decode(get_movie(Id))||Id <- Keys],
	movielist(MovieList).

%% Gets and stores the latest popular releases for today
store_releases() ->
	store_movies(movies:popular(movies:releases_today())).

%% Gets and stores the latest popular releases for a certain date
store_releases(Date) ->
	store_movies(movies:popular(movies:releases_day(Date))).

%% Store a tweet
store_tweet(Bucket, Key, Obj) ->
	db_handler:put(Bucket, Key, Obj).