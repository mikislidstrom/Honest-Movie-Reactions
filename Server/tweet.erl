-module(tweet).
-export([twitterator/1, python_start/1, flush/0]).

twitterator(Binary) ->
	List = string:tokens(binary_to_list(Binary), "\r\n\t "),
    python_start(List).

python_start(List) ->
	{ok, P} = python:start(),
	python:call(P, tweet, register_tweet, [self()]),
	python:cast(P, List),
	Rating = flush(),
	python:stop(P),
	Rating.

flush() ->
	receive
		Msg -> Msg
	after 5000 ->
		timeout
	end.