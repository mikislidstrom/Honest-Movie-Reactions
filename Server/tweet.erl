%% @author: Henrik Edholm
%% @doc: This module get a tweet from the server, 
%%		 starts a python process that makes calculations on the tweet 
%%		 and finally returns the value to the server.

-module(tweet).
-export([twitterator/2, python_start/1, flush/0, remove_Title/2]).

%% Get a tweet from the server, put it in a list and send to next function.
twitterator(MovieTitle, Binary) ->
	Title = string:tokens(string:to_lower(binary_to_list(MovieTitle)), "\r\n\t "),
	NewList = string:tokens(string:to_lower(binary_to_list(Binary)), "\r\n\t "),
	python_start(remove_Title(Title, NewList)).

remove_Title([], List) -> List;
remove_Title([H|T], List) -> erlang:display(List), remove_Title(T, lists:delete(H, List)).

%% Starts a python process that calculates the sentiment value of the tweet
%% and returns it to the server.
python_start(List) ->
	{ok, P} = python:start(),
	python:call(P, tweet, register_tweet, [self()]),
	python:cast(P,  List),
	Rating = flush(),
	python:stop(P),
	Rating.

flush() ->
	receive
		Msg -> Msg
	after 5000 ->
		timeout
	end.