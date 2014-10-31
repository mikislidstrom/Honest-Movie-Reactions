-module(supervisor_prototype).
-behavior(supervisor).

-export([start_link/1]).
-export([init/1]).

start_link(Type) ->
	supervisor:start_link({local, ?MODULE}, ?MODULE, Type).

init(supervise) ->
	init({one_for_one, 3, 60});

init({RestartStrategy, MaxRestart, MaxTime}) ->
	{ok, {{RestartStrategy, MaxRestart, MaxTime},
		[{database, 
			{prototype, start_link, [database, good]},
			permanent, 1000, worker, [prototype]},
		{twitter,
			{prototype, start_link, [twitter, bad]},
			transient, 1000, worker, [prototype]},
		{the_movie_db,
			{prototype, start_link, [the_movie_db, bad]},
			transient, 1000, worker, [prototype]}
			]}}.



