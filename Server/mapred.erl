-module(mapred).
-export([wordcount/1, map_wordcount/3, red_count_words/2, titles/0]).
-export([total_sentiment/1, sentiment_day/1, map_sentiment_day/3]).
-export([tweets_day/1, map_tweets_day/3]).

%% Wordcount mapreaduce
wordcount(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, ?MODULE, map_wordcount}, none, false},
			{reduce, {modfun, ?MODULE, red_count_words}, none, true}
		]
	),
	dict:to_list(Result).

%% Map for wordcount
map_wordcount(RiakObject, _, _) ->
	{PropList} = jiffy:decode(riak_object:get_value(RiakObject)),
	Tokens = string:tokens(string:to_lower(binary_to_list(proplists:get_value(<<"text">>, PropList))), ",.:/(){}[]- "),
	[dict:from_list([{I, 1} || I <- Tokens])].

%% Reduce for wordcount
red_count_words(Input, _) -> 
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
			{map, {qfun, fun(O,_,_) -> 
				{PropList} = jiffy:decode(riak_object:get_value(O)),
				[{proplists:get_value(<<"title">>, PropList), riak_object:key(O)}]
			end}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	Result.

%% sentiment analysis
total_sentiment(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, [{0, Result}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {qfun, fun(O,_,_) ->
				{PropList} = jiffy:decode(riak_object:get_value(O)),
				[proplists:get_value(<<"rating">>, PropList)]
			end}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	lists:sum(Result) / length(Result).

sentiment_day(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, [{0, Result}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, ?MODULE, map_weekly_sentiment}, none, true},
			{reduce, {modfun, ?MODULE, red_sentiment}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	Result.

map_sentiment_day(O,_,_) -> [O].


%% Tweets per day
tweets_day(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, ?MODULE, map_tweets_day}, none, false},
			{reduce, {modfun, ?MODULE, red_count_words}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	dict:to_list(Result).

%% Map tweets per day
map_tweets_day(RiakObject, _, _) ->
	{PropList}=jiffy:decode(riak_object:get_value(RiakObject)),
	Date = date_conversion(binary_to_list(proplists:get_value(<<"created_at">>, PropList))),
	[dict:from_list([{Date, 1}])].
	
%% Function to convert the date
date_conversion(Date) ->
	{_,Month,Day,_,_,Year}=list_to_tuple(string:tokens(Date, " ")),
	Year ++ "-" ++ month_num(Month) ++ "-" ++ Day.

%% Helper function for month to number
month_num(Day) ->
	case Day of
		"Jan" -> "1";
		"Feb" -> "2";
		"Mar" -> "3";
		"Apr" -> "4";
		"May" -> "5";
		"Jun" -> "6";
		"Jul" -> "7";
		"Aug" -> "8";
		"Sep" -> "9";
		"Oct" -> "10";
		"Nov" -> "11";
		"Dec" -> "12"
	end.