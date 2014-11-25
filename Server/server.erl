%% @author Mikaela Lidström

-module(server).
-export([start_link/0, stop/0, get_movie_data/0, get_twitter_data/0]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).
-behaviour(gen_server).

-record(state, {}).
-define(SERVER, ?MODULE).

start_link() ->
	gen_server:start_link({local, ?SERVER}, ?MODULE, [], []).


stop() -> 
	gen_server:call(?SERVER, terminate).

init([]) ->
	erlang:display("server started"),
	{ok, #state{}}.

get_movie_data() ->
	erlang:display("getting movie data"),
	gen_server:cast(server, get_movies).

%% Gets movie title and id from database
get_twitter_data() -> 
	erlang:display("pulling twitter data"),
	get_twitter_data(test_db:id_title_list()).

update_statistics() ->
	ok.

%% 
get_twitter_data([]) -> ok;
get_twitter_data([H | T]) ->
	erlang:display(erlang:localtime()),
	erlang:display(H),
	gen_server:cast(server, {get_tweets, H}),
	get_twitter_data(T).

handle_cast(get_movies, State) -> 
	spawn(fun() -> 
		test_db:store_releases() end),
	{noreply, State};

handle_cast({get_tweets, {MovieId, Title}}, State) ->
	spawn(fun() -> 
		Tweets = twitter_miner:twitter_search(Title),
	[test_db:store_tweet(integer_to_list(TwitterId), jiffy:encode({[{<<"movie_id">>, MovieId}, {<<"created_at">>, Date}, {<<"screen_name">>, Screen_Name}, {<<"text">>, Text}, {<<"rating">>, tweet:twitterator(Text)}]})) 
	|| {TwitterId, Date, Screen_Name, Text} <- Tweets, tweet:twitterator(Text) > 0] end),
	{noreply, State};


handle_cast(Message, State) ->
	erlang:display(Message),
	{noreply, State}.

handle_info(_M, _N) -> ok.

handle_call(terminate, _From, State) ->
	{stop, normal, ok, State}.

terminate(normal, _State) ->
	erlang:display("server has stopped"),
	ok.

code_change(_M, _N, _Q) -> ok.

