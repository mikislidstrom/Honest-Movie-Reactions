-module(web_server).
-export([start/0, movies/3, movie_ids/3, tweets/3, stop/1, movie_titles/3, create_movie_json/1]).

%%% Basic web server for serving JSON data from the database to a web page
%%% URL localhost:8081/erl/web_server:function


start() ->
	inets:start(),
	inets:start(httpd, [
		{modules, [
		mod_alias,
		mod_auth,
		mod_esi,
		mod_actions,
		mod_cgi,
		mod_dir,
		mod_get,
		mod_head,
		mod_log,
		mod_disk_log
		]},
		{port, 8081},
		{server_name, "web_server"},
		{server_root, "log"},
		{document_root, "www"},
		{erl_script_alias, {"/erl", [web_server]}},
		{error_log, "error.log"},
		{security_log, "security.log"},
		{transfer_log, "transfer.log"},
		{mime_types, [
		{"html", "text/html"},
		{"css", "text/css"},
		{"js", "application/x-javascript"},
		{"json", "application/json"}
		]}
	]).

stop(Pid) ->
	inets:stop(httpd, Pid).

%% Serves the movie information depending on the query as JSON data
%% Accessed with URL "localhost:8081/erl/web_server:movies?ID" where ID is the movie id
movies(SessionID, Env, _Input) ->
	Query = proplists:get_value(query_string, Env),
	mod_esi:deliver(SessionID, [
		"Access-Control-Allow-Origin:*\r\nContent-Type: application/json\r\n\r\n",
		create_movie_json(Query)
		]).

%% Serves the ids of all the movies in db as a JSON array
%% Accessed with URL "localhost:8081/erl/web_server:movie_ids"
movie_ids(SessionID, _Env, _Input) ->
	
	mod_esi:deliver(SessionID, [
		"Access-Control-Allow-Origin:*\r\nContent-Type: application/json\r\n\r\n",
		db_handler:keys_json("Movies")
		]).


%% Serves the tweet info depending on the query
%% Accessed with URL "http://localhost:8081/erl/web_server:tweets?ID" where ID is the movie id
tweets(SessionID, Env, _Input) ->
	MovieId = proplists:get_value(query_string, Env),
	mod_esi:deliver(SessionID, [
		"Access-Control-Allow-Origin:*\r\nContent-Type: application/json\r\n\r\n",
		twitter:get_tweets(MovieId)
		]).

movie_titles(SessionID, _Env, _Input) ->
	mod_esi:deliver(SessionID, [
		"Access-Control-Allow-Origin:*\r\nContent-Type: application/json\r\n\r\n",
		jiffy:encode({mapred:titles()})
		]).

create_movie_json(MovieId) ->
	{MovieJSON} = jiffy:decode(db_handler:get("Movies", MovieId)),
	{[TotalTweets, MovieTweets, SentimentRating, WordCloud, {TweetsDayKey, {TweetsDay}}, {SentimentDayKey, {SentimentDay}}]} = jiffy:decode(db_handler:get("Stats", MovieId)),
	NewSentimentDay = {SentimentDayKey, {lists:sublist(lists:reverse(lists:keysort(1, SentimentDay)), 7)}},
	NewTweetsDay = {TweetsDayKey, {lists:sublist(lists:reverse(lists:keysort(1, TweetsDay)), 7)}},
	MovieStats = [TotalTweets, MovieTweets, SentimentRating, WordCloud, NewTweetsDay, NewSentimentDay],

	jiffy:encode({MovieJSON ++ MovieStats}).

