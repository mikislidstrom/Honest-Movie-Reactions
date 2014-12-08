-module(mapred).
-export([wordcount/1, map_wordcount/3, red_count_words/2, titles/0, sum_tweets/0]).
-export([sentiment_average/1, sentiment_day/1, map_sentiment_day/3, red_sentiment_day/2]).
-export([tweets_day/1, map_tweets_day/3, read/1, load_stats/0, load_movie_stats/1]).

% Path to sentiment.txt
-define(FILE_PATH, "/home/nizzon/Prog/Erlang/Project/Server/sentiment.txt").

sum_tweets() ->
	Movies = db_handler:keys("Movies"),
	lists:sum([length(db_handler:keys(Movie))||Movie <- Movies]).

%% Wordcount mapreaduce
wordcount(Bucket) ->
	{ok, File} = file:open(?FILE_PATH, read),
	Keys = read(File),
	file:close(File),
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, ?MODULE, map_wordcount}, Keys, false},
			{reduce, {modfun, ?MODULE, red_count_words}, none, true}
		]
	),
	dict:to_list(Result).

%% Map for wordcount
map_wordcount(RiakObject, _, Keys) ->
	{PropList} = jiffy:decode(riak_object:get_value(RiakObject)),
	Tokens = string:tokens(string:to_lower(binary_to_list(proplists:get_value(<<"text">>, PropList))), ",.:/(){}[]- "),
	[dict:from_list([{list_to_binary(I), 1} || I <- Tokens, lists:member(I, Keys)])].

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

%% Get the average sentiment value for tweets per day in a list for a movie
sentiment_day(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, ?MODULE, map_sentiment_day}, none, false},
			{reduce, {modfun, ?MODULE, red_sentiment_day}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	[{Key, (round((lists:sum(List) / length(List)) * 20 * math:pow(10, 2)) / math:pow(10,2))}||{Key,List} <- dict:to_list(Result)].

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

%% Get the average sentiments value for all tweets for a movie
sentiment_average(Bucket) ->
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
	P = math:pow(10, 2),
    round((lists:sum(Result) / length(Result)) * 20 * P) / P.

%% Gets the amount of tweets per day for a movie
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

%% Read line by line of text file
read(File) ->
    %{ok, File} = file:open("/home/nizzon/Prog/Erlang/Project/Server/sentiment.txt", read),
    case file:read_line(File) of
        {ok, [_|Data]} -> [lists:sublist(Data, length(Data) -1) | read(File)];
        eof        -> []
    end.


load_stats() ->
	%db_handler:put(<<"Stats">>, list_to_binary(Key), 
	%{_,_,Start} = os:timestamp(),
	[db_handler:put("Stats", Key, jiffy:encode(load_movie_stats(Key)))||Key <- db_handler:keys("Movies")].
	%{_,_,Stop} = os:timestamp(),
	%Time = Start - Stop,

load_movie_stats(Key) ->
	SumTweets = {<<"sum_tweets">>, sum_tweets()},
	SumTweetsMovie = {<<"sum_movie_tweets">>, length(db_handler:keys(Key))},
	SentimentRating = {<<"sentiment">>, mapred:sentiment_average(Key)},
	WordCloud = {<<"wordcloud">>, {mapred:wordcount(Key)}},
	TweetsDay = {<<"tweets_per_day">>, {mapred:tweets_day(Key)}},
	SentimentDay = {<<"sentiment_per_day">>, {mapred:sentiment_day(Key)}},
	{[SumTweets, SumTweetsMovie, SentimentRating, WordCloud, TweetsDay, SentimentDay]}.
