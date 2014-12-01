%% @author Mikaela Lidström

-module(server_supervisor).
-export([start_link/0]).
-export([init/1]).
-behaviour(supervisor).

%% starts the supervisor and the Schedule.
start_link() ->
	supervisor:start_link({local, ?MODULE}, ?MODULE, []),
	schedule:start().


init([]) -> 
%% Parameters
	RestartStrategy = one_for_one,
	MaxRestart = 3,
	MaxTime = 60,
	Supflags = {RestartStrategy, MaxRestart, MaxTime},
	Restart = permanent,
	Shutdown = 1000,
	Type = worker,

%% Server worker
	Server = {server, {server, start_link, []},
		Restart, Shutdown, Type, [server]},

%% start workers.
	{ok, {Supflags, [Server]}}.