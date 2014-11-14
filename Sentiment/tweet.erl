-module(tweet).
-export(main/1, python_start/1, flush/0).

main(FileName) ->
	{ok, Binary} = file:read_file(FileName),
	S = string:tokens(binary_to_list(Binary), "\r\n\t "),
    python_start(S).

python_start(List) ->
	{ok, P} = python:start(),
	python:call(P, tweet, register_tweet, [self()]),
	python:cast(P, List),
	flush().

flush() ->
	receive
		Msg -> Msg
	after 5000 ->
		timeout
	end.