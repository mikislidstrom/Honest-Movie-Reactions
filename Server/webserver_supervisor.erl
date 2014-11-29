%% @author Mikaela Lidström

-module(webserver_supervisor).
-export([start_link/0]).
-export([init/1]).
-behaviour(supervisor).

%% starts the supervisor and the Schedule.
start_link() ->
	supervisor:start_link({local, ?MODULE}, ?MODULE, []),


init([]) -> 
%% Parameters
	RestartStrategy = one_for_one,
	MaxRestart = 3,
	MaxTime = 60,
	Supflags = {RestartStrategy, MaxRestart, MaxTime},
	Restart = permanent,
	Shutdown = 1000,
	Type = worker,

%% WebServer worker.
	WebServer = {web_server, {web_server, start, []},
		Restart, Shutdown, Type, [web_server]},

%% start worker.
	{ok, {Supflags, [WebServer]}}.