-module(twitter).
-export([get_tweets/1, get_five_tweets/2]).

get_tweets(Bucket) ->
	KeyList = db_handler:keys(Bucket),
	jiffy:encode(get_five_tweets(KeyList, Bucket)).


get_five_tweets(List, Bucket) -> get_five_tweets(List, Bucket, [], 0).

get_five_tweets([], _, Tweets, _) -> Tweets;
get_five_tweets(_, _, Tweets, 5) -> Tweets;
get_five_tweets([X|Xs], Bucket, Tweets, Int) -> 
	get_five_tweets(Xs, Bucket, Tweets ++ [jiffy:decode(db_handler:get(Bucket, X))], Int+1).
