-module(db_handler).
-export([put/3, get/2, buckets/0, keys/1, keys_json/1, delete/2, cal_keys/1]).
-export([wordcount/1, titles/0, sum_tweets/0, sentiment_day/1, sentiment_average/1]).
-export([tweets_day/1]).

-define(FILE_PATH, "/home/nizzon/Prog/Erlang/Project/Server/sentiment.txt").
-define(PORT, 10017).
-define(HOST, "127.0.0.1").

%%% Module works as a wrapper for the riak-erlang-client 
%%% accessing and writing data to the database

%% Put an object with a key in a bucket
put(Bucket, Key, Object) when is_binary(Object) -> 
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT), %% IP needs to be changed
	RiakObject = riakc_obj:new(list_to_binary(Bucket), list_to_binary(Key), Object, <<"application/json">>),
	riakc_pb_socket:put(Pid, RiakObject),
	riakc_pb_socket:stop(Pid);

put(Bucket, Key, Object) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT), %% IP needs to be changed
	RiakObject = riakc_obj:new(list_to_binary(Bucket), list_to_binary(Key), list_to_binary(Object), <<"application/json">>),
	riakc_pb_socket:put(Pid, RiakObject),
	riakc_pb_socket:stop(Pid).

%% Get an object with a key in a bucket
%% returns the object as Erlang type
get(Bucket, Key) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	case riakc_pb_socket:get(Pid, list_to_binary(Bucket), list_to_binary(Key)) of
		{ok, Obj} ->
			riakc_pb_socket:stop(Pid),
			riakc_obj:get_value(Obj);
		{error, Msg} ->
			riakc_pb_socket:stop(Pid),
			{error, Msg}
	end.

%% Gets all the buckets in Riak
buckets() ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	{ok, List} = riakc_pb_socket:list_buckets(Pid),
	riakc_pb_socket:stop(Pid),
	List.
%% Gets all keys in a bucket and returns it as a JSON string
keys_json(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	{ok, List} = riakc_pb_socket:list_keys(Pid, list_to_binary(Bucket)),
	riakc_pb_socket:stop(Pid),
	jiffy:encode(List).

%% Gets all keys in a bucket
keys(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	{ok, List} = riakc_pb_socket:list_keys(Pid, list_to_binary(Bucket)),
	riakc_pb_socket:stop(Pid),
	[binary_to_list(X)|| X <- List].

%% Deletes a key in a bucket
delete(Bucket, Key) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?	PORT),
	riakc_pb_socket:delete(Pid, list_to_binary(Bucket), list_to_binary(Key)),
	riakc_pb_socket:stop(Pid).

%% Returns the amount of keys for a bucket
cal_keys(Bucket) ->
	M = 0,
	lists:sum([M + 1 || _X <- keys(Bucket)]).

%% Returns the sum of all tweets
sum_tweets() ->
	Movies = db_handler:keys("Movies"),
	lists:sum([length(db_handler:keys(Movie))||Movie <- Movies]).

%% Counts the sentiment words for all tweets for a movie
wordcount(Bucket) ->
	{ok, File} = file:open(?FILE_PATH, read),
	Keys = read(File),
	file:close(File),
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, mapred, map_wordcount}, Keys, false},
			{reduce, {modfun, mapred, red_count_words}, none, true}
		]
	),
	dict:to_list(Result).

%% Read line by line of text file
read(File) ->
    case file:read_line(File) of
        {ok, [_|Data]} -> [lists:sublist(Data, length(Data) -1) | read(File)];
        eof        -> []
    end.

%% Returns a list of all the movie titles
titles() ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	{ok, [{0, Result}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		<<"Movies">>,
		[
			{map, {modfun, mapred, map_titles}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	Result.

%% Get the average sentiment value for tweets per day in a list for a movie
sentiment_day(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, mapred, map_sentiment_day}, none, false},
			{reduce, {modfun, mapred, red_sentiment_day}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	[{Key, (round((lists:sum(List) / length(List)) * 20 * math:pow(10, 2)) / math:pow(10,2))}||{Key,List} <- dict:to_list(Result)].

%% Get the average sentiments value for all tweets for a movie
sentiment_average(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	case lists:member(list_to_binary(Bucket), db_handler:buckets()) of
		true ->
			{ok, [{0, Result}]} = riakc_pb_socket:mapred_bucket(
				Pid,
				list_to_binary(Bucket),
				[
					{map, {modfun, mapred, map_sentiment_average}, none, true}
				]
			),
			riakc_pb_socket:stop(Pid),
			P = math:pow(10, 2),
    		round((lists:sum(Result) / length(Result)) * 20 * P) / P;
    	false -> 0
    end.

%% Gets the amount of tweets per day for a movie
tweets_day(Bucket) ->
	{ok, Pid} = riakc_pb_socket:start_link(?HOST, ?PORT),
	{ok, [{1, [Result]}]} = riakc_pb_socket:mapred_bucket(
		Pid,
		list_to_binary(Bucket),
		[
			{map, {modfun, mapred, map_tweets_day}, none, false},
			{reduce, {modfun, mapred, red_count_words}, none, true}
		]
	),
	riakc_pb_socket:stop(Pid),
	dict:to_list(Result).
