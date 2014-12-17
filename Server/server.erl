%% @author Mikaela Lidström

-module(server).
-export([start_link/0, stop/0, get_movie_data/0, get_twitter_data/0, update_statistics/0]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).
-behaviour(gen_server).

-record(state, {}).
-define(SERVER, ?MODULE).

start_link() ->
	ssl:start(),
	application:start(inets),
	gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).

stop() -> 
	gen_server:call(?SERVER, terminate).

init([]) ->
	erlang:display("server started"),
	{ok, #state{}}.

%% Gets new movies from "the movie database".
get_movie_data() ->
	erlang:display("getting movie data"),
	gen_server:cast(server, get_movies).

%% Gets movie title and id from database.
get_twitter_data() -> 
	erlang:display("pulling twitter data"),
	get_twitter_data(db_integration:id_title_list()).

%% gen_server:cast to get tweets for every movie title in the database.
get_twitter_data([]) -> ok;
get_twitter_data([H | T]) ->
	erlang:display(erlang:localtime()),
	erlang:display(H),
	gen_server:cast(server, {get_tweets, H}),
	get_twitter_data(T).

%% Updates statistics.
update_statistics() ->
	erlang:display("updating statistics"),
	gen_server:cast(server, update_stats).

%% calls the test:db function to get newly released movies.
handle_cast(get_movies, State) -> 
	spawn(fun() -> 
		db_integration:store_releases() end),
	{noreply, State};

handle_cast(update_stats, State) -> 
	spawn(fun() -> 
		db_integration:load_stats() end),
		{noreply, State};

%% spawns a new process.
%% calls twitter miner to get tweets based on the movie title, returns a list of tweets.
%% store each tweet in the database where rating is above 0.
%% structure: [MovieId, TwitterID, {MovieId, Date, ScreenName, Text, Rating}]
handle_cast({get_tweets, {MovieId, Title}}, State) ->
	spawn(fun() -> 
		Tweets = twitter_miner:twitter_search(Title),
	[db_integration:store_tweet(integer_to_list(MovieId), integer_to_list(TwitterId), jiffy:encode({[{<<"movie_id">>, MovieId}, {<<"created_at">>, Date}, {<<"screen_name">>, Screen_Name}, {<<"text">>, Text}, {<<"rating">>, tweet:twitterator(Title, Text)}]}))
	|| {TwitterId, Date, Screen_Name, Text} <- Tweets, tweet:twitterator(Title, Text) > 0] end),
	{noreply, State};

handle_cast(Message, State) ->
	erlang:display(Message),
	{noreply, State}.

handle_info(_M, _N) -> ok.

handle_call(terminate, _From, State) ->
	application:stop(inets),
	ssl:stop(),
	{stop, normal, ok, State}.

terminate(normal, _State) ->
	erlang:display("server has stopped"),
	ok.
	
code_change(_M, _N, _Q) -> ok.

