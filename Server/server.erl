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

get_twitter_data() -> 
	erlang:display("pulling twitter data"),
	get_movie_titles().

get_movie_titles() -> ok.

handle_cast(get_movies, State) -> 
	test_db:store_movie("600"),
	{noreply, State};

handle_cast(Message, State) ->
	erlang:display(Message),
	{noreply, State}.

handle_info(_M, _N) -> ok.

handle_call(terminate, _From, State) ->
	{stop, normal, ok, State}.

terminate(normal, _State) ->
	erlang:display("Server has stopped"),
	ok.

code_change(_M, _N, _Q) -> ok.

