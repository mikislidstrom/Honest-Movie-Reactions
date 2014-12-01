%% @author: Henrik Edholm
%% @doc: This module get a tweet from the server, 
%%		 starts a python process that makes calculations on the tweet 
%%		 and finally returns the value to the server.

-module(tweet).
-export([twitterator/2, python_start/2, flush/0]).

%% Get a tweet from the server, put it in a list and send to next function.
twitterator(MovieTitle, Binary) ->
	List = string:tokens(binary_to_list(Binary), "\r\n\t "),
    python_start(MovieTitle, List).

%% Starts a python process that calculates the sentiment value of the tweet
%% and returns it to the server.
python_start(MovieTitle, List) ->
	{ok, P} = python:start(),
	python:call(P, tweet, register_tweet, [self()]),
	python:cast(P, {MovieTitle, List}),
	Rating = flush(),
	python:stop(P),
	Rating.

flush() ->
	receive
		Msg -> Msg
	after 5000 ->
		timeout
	end.