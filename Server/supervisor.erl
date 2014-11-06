-module(supervisor).
-export([start_link/1]).
-export([init/1]).
-behaviour(supervisor).

start_link() ->
	supervisor:start_link({local, ?MODULE}, ?MODULE, []),
	timer:start().

init([]) -> 
	RestartStrategy = one_for_one,
	MaxRestart = 3,
	MaxTime = 60,
	Supflags = {RestartStrategy, MaxRestart, MaxTime},
	Restart = permanent,
	Shutdown = 1000,
	Type = worker,

	Server = {server, {server, start_link, []},
		Restart, Shutdown, Type, [server]},

	{ok, Supflags, [Server]}.