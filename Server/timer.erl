-module(timer).
-export([start/0]).

start() -> 
	erlang:display("timer started"),
	start(erlang:localtime()).

start({_Date, {12, 00, 00}}) ->
	server:get_movie_data(),
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime).

start({{_Date}, {}})
