-module(twitter_miner).
-export([twitter_search/1, unpack/1]).

twitter_search(Movie) ->
	URL = "https://api.twitter.com/1.1/search/tweets.json",
  Params = [{q, Movie}, {lang, en}, {count, 100}],

  Api_key = "xxx",
  Api_secret = "xxx",
  Access_token = "xxx-xxx",
  Access_token_secret = "xxx",

  Consumer = {Api_key, Api_secret, hmac_sha1},
  Token = Access_token,
  Secret = Access_token_secret,



	ssl:start(),
	application:start(inets),	
  {ok, {{_, 200, _}, _, Body}} = oauth:get(URL, Params, Consumer, Token, Secret),
  parse(Body).

  parse(Body) ->
    {A} = jiffy:decode(Body),
    [A1|B] = A,
    {Header, A2} = A1,
    [{A3}|B2] = A2,

    List = [twitter_miner:unpack(X)||{X}<-A2],
    List.

  unpack(List) ->
    {<<"id">>,  Id} = lists:keyfind(<<"id">>, 1, List),
    {<<"text">>, Text} = lists:keyfind(<<"text">>, 1, List),
    {<<"created_at">>, Date} = lists:keyfind(<<"created_at">>, 1, List),
    {<<"user">>, {Locked_List}} = lists:keyfind(<<"user">>, 1, List),
    {<<"screen_name">>, Screen_Name} = lists:keyfind(<<"screen_name">>, 1, Locked_List),
    {Id, Date, Screen_Name, Text}.

    