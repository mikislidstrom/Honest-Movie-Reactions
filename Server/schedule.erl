%% @author Mikaela Lidström

-module(schedule).
-export([start/0, stop/0]).

start() -> 
	erlang:display("timer started"),
	start(erlang:localtime()).

start({_Date, {09, 50, 00}}) ->
	server:get_movie_data(),
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime);

start({_Date, {_, _, 00}}) ->
	server:get_twitter_data(),
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime);

start(_Date) ->
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime).

stop() -> 
	{ok, stopped_schedule}.