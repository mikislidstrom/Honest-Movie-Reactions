%% @author Mikaela Lidström

-module(schedule).
-export([start/0, stop/0]).

start() -> 
	erlang:display("timer started"),
	start(erlang:localtime()).

start({_Date, {12, 05, 00}}) ->
	server:get_movie_data(),
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime);

start({_Date, {_, 00, 00}}) ->
	server:update_statistics(),
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime);

start({_Date, {_, H, _}}) when H rem 5 == 0 ->
	server:get_twitter_data(),
	CurrentTime = erlang:localtime(),
	timer:sleep(61000),
	start(CurrentTime);

start(_Date) ->
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime).

stop() -> 
	{ok, stopped_schedule}.

