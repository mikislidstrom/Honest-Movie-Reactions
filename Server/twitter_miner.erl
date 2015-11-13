%%Authored by Simonas Stirbys
%%Contributed to by Mikaela Lidström
%%this module gets tweets from twitter

-module(twitter_miner).
-export([twitter_search/1, unpack/1, remove_excess/1]).

%%This function connect to twitter and receives tweets in the form of JSON data
twitter_search(Movie) ->
	URL = "https://api.twitter.com/1.1/search/tweets.json",
  Params = [{q, remove_excess(Movie) ++ "%20-RT"}, {lang, en}],

  Api_key = "",
  Api_secret = "",
  Access_token = "",
  Access_token_secret = "",

  Consumer = {Api_key, Api_secret, hmac_sha1},
  Token = Access_token,
  Secret = Access_token_secret,

	%% oauth is used to verify the user for twitter security
  %% we pattern match the tweet JSON data into the variable called Body
  {ok, {{_, 200, _}, _, Body}} = oauth:get(URL, Params, Consumer, Token, Secret),
  parse(Body).

%% This function 'unpacks' the JSON data from multiple tuple/list layers
parse(Body) ->
  {A} = jiffy:decode(Body),
  [A1|_B] = A,
  {_Header, A2} = A1,
  [{_A3}|_B2] = A2,
  [twitter_miner:unpack(X)||{X}<-A2].

%% this function gets the relevant twitter data from the JSON object and returns a tuple.
unpack(List) ->
  {<<"id">>,  Id} = lists:keyfind(<<"id">>, 1, List),
  {<<"text">>, Text} = lists:keyfind(<<"text">>, 1, List),
  {<<"created_at">>, Date} = lists:keyfind(<<"created_at">>, 1, List),
  {<<"user">>, {Locked_List}} = lists:keyfind(<<"user">>, 1, List),
  {<<"screen_name">>, Screen_Name} = lists:keyfind(<<"screen_name">>, 1, Locked_List),
  {Id, Date, Screen_Name, Text}.

%% this tokenizes a movie title and sends it through to get excess removed.
remove_excess(Movie) ->
  Title = string:tokens(Movie, "\r\n\t "),
  string:strip(separate_excess(Title, []), left, $ ).

%% this function removes the excess words in the case of the title having a ":" in it.
%% it returns only the title before the ":".
separate_excess([], NewList) -> NewList;
separate_excess([H|T], NewList) ->
  case string:rchr(H, $:) of
    0 -> separate_excess(T, NewList ++ " " ++ H);
    _ -> NewList ++ " " ++ string:strip(H, right, $:)
end.
