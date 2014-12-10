%% @author Mikaela Lidström

-module(schedule).
-export([start/0, stop/0]).

%% 
start() -> 
	erlang:display("timer started"),
	start(erlang:localtime()).

%% At 12.00 every day call the server function to get movie data.
start({_Date, {12, 00, 00}}) ->
	server:get_movie_data(),
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime);

%% Once every 5 minutes, call the server function to get tweets.
start({_Date, {_, H, _}}) when H rem 5 == 0 ->
	server:get_twitter_data(),
	timer:sleep(61000),
	CurrentTime = erlang:localtime(),
	start(CurrentTime);

%% Once every 6 min, call the server function to update statistics.
start({_Date, {_, H, 00}}) when H rem 7 == 0 ->
	server:update_statistics(),
	timer:sleep(61000),
	CurrentTime = erlang:localtime(),
	start(CurrentTime);

%% When nothing above matches, call self on new time.
start(_DateTime) ->
	CurrentTime = erlang:localtime(),
	timer:sleep(1000),
	start(CurrentTime).

stop() -> 
	{ok, stopped_schedule}.

