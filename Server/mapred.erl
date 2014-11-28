-module(mapred).
-export([wordcount/1, mapwords/3, redwords/2, titles/0, maptitles/3]).

%% Wordcount mapreaduce
wordcount(Pid) ->
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		<<"Movies">>,
		[
			{map, {modfun, ?MODULE, mapwords}, none, false},
			{reduce, {modfun, ?MODULE, redwords}, none, true}
		]
	),
	dict:to_list(Result).

%% Map for wordcount
mapwords(RiakObject, _, _) ->
	{PropList} = jiffy:decode(riak_object:get_value(RiakObject)),
	Tokens = string:tokens(string:to_lower(binary_to_list(proplists:get_value(<<"overview">>, PropList))), ",. "),
	[dict:from_list([{I, 1} || I <- Tokens])].

%% Reduce for wordcount
redwords(Input, _) -> 
	[lists:foldl(
		fun(Tag, Acc) ->
			dict:merge(
				fun(_, Amount1, Amount2) ->
					Amount1 + Amount2
				end,
				Tag,
				Acc
			)
		end,
		dict:new(),
		Input
	)].

%% Titles list
titles() ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, [{0, Result}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		<<"Movies">>,
		[
			{map, {modfun, ?MODULE, maptitles}, none, true}
		]
	),
	Result.

%% Map for titles
maptitles(RiakObject,_,_) ->
	{PropList} = jiffy:decode(riak_object:get_value(RiakObject)),
	[{proplists:get_value(<<"title">>, PropList), riak_object:key(RiakObject)}].

