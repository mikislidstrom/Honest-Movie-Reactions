-module(server).
-export([start_link/0]).
-export([init/1, handle_call/3, handle_cast/2, handle_info/2, terminate/2, code_change/3]).
-behaviour(gen_server).

-record(state, {}).
-define(SERVER, ?MODULE).

start_link() ->
	gen_server:start_link({local, ?SERVER}, ?SERVER, [], []).

init([]) ->
	display:erlang("server started"),
	{ok, #state}.

get_movie_data() ->
	movies:id(100).

get_twitter_data() -> ok.

get_movie_titles() -> ok.

handle_cast() -> ok.

handle_info() -> ok.

handle_call() -> ok.

terminate() -> ok.

code_change() -> ok.

