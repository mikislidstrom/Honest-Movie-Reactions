-module(mapred).
-export([map_sentiment_day/3, red_sentiment_day/2, map_titles/3, map_sentiment_average/3]).
-export([map_tweets_day/3, red_count_words/2, map_wordcount/3]).

% Path to sentiment.txt
-define(FILE_PATH, "/home/nizzon/Prog/Erlang/Project/Server/sentiment.txt").
-define(PORT, 10017).
-define(HOST, "127.0.0.1").

%% Map function for wordcount
map_wordcount(RiakObject, _, Keys) ->
	{PropList} = jiffy:decode(riak_object:get_value(RiakObject)),
	Tokens = string:tokens(string:to_lower(binary_to_list(proplists:get_value(<<"text">>, PropList))), ",.:/(){}[]- "),
	[dict:from_list([{list_to_binary(I), 1} || I <- Tokens, lists:member(I, Keys)])].

%% Reduce function for wordcount
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
	
map_sentiment_day(O,_,_) -> 
	{PropList}=jiffy:decode(riak_object:get_value(O)),
	Date = date_conversion(binary_to_list(proplists:get_value(<<"created_at">>, PropList))),
	Rating = proplists:get_value(<<"rating">>, PropList),
	[dict:from_list([{Date, [Rating]}])].

red_sentiment_day(Input, _) ->
	[lists:foldl(
		fun(Date, Acc) ->
			dict:merge(
				fun(_, Amount1, Amount2) ->
					Amount1 ++ Amount2
				end,
				Date,
				Acc
			)
		end,
		dict:new(),
		Input
	)].

map_titles(O,_,_) ->
	{PropList} = jiffy:decode(riak_object:get_value(O)),
	[{proplists:get_value(<<"title">>, PropList), riak_object:key(O)}].

map_sentiment_average(O,_,_) ->
	{PropList} = jiffy:decode(riak_object:get_value(O)),
	[proplists:get_value(<<"rating">>, PropList)].

%% Map tweets per day
map_tweets_day(RiakObject, _, _) ->
	{PropList}=jiffy:decode(riak_object:get_value(RiakObject)),
	Date = date_conversion(binary_to_list(proplists:get_value(<<"created_at">>, PropList))),
	[dict:from_list([{Date, 1}])].
	
%% Function to convert the date
date_conversion(Date) ->
	{_,Month,Day,_,_,Year}=list_to_tuple(string:tokens(Date, " ")),
	list_to_binary(Year ++ "-" ++ month_num(Month) ++ "-" ++ Day).

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
