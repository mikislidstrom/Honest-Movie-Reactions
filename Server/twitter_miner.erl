-module(twitter_miner).
-export([twitter_search/1, unpack/1, remove_excess/1]).

twitter_search(Movie) ->
	URL = "https://api.twitter.com/1.1/search/tweets.json",
  Params = [{q, remove_excess(Movie) ++ "%20-RT"}, {lang, en}],

  Api_key = "QtSP14USgvF4Zj9IKHy2I5bKN",
  Api_secret = "c7j35Y4vU7mw2K5vdm4oAwS6VLViLutd4ZcORCC8ByAJCBm1qV",
  Access_token = "2827251826-bGt8aDBRHkySUiHW5XJBkOJ8u3vZFNS0gUhgHd5",
  Access_token_secret = "Ktwz5o3bYYsLSBA8fpTOk78UFkCGNtGU9NVV7b0fwoP2M",

  Consumer = {Api_key, Api_secret, hmac_sha1},
  Token = Access_token,
  Secret = Access_token_secret,

	
  {ok, {{_, 200, _}, _, Body}} = oauth:get(URL, Params, Consumer, Token, Secret),
  parse(Body).

parse(Body) ->
  {A} = jiffy:decode(Body),
  [A1|_B] = A,
  {_Header, A2} = A1,
  [{_A3}|_B2] = A2,
  [twitter_miner:unpack(X)||{X}<-A2].

unpack(List) ->
  {<<"id">>,  Id} = lists:keyfind(<<"id">>, 1, List),
  {<<"text">>, Text} = lists:keyfind(<<"text">>, 1, List),
  {<<"created_at">>, Date} = lists:keyfind(<<"created_at">>, 1, List),
  {<<"user">>, {Locked_List}} = lists:keyfind(<<"user">>, 1, List),
  {<<"screen_name">>, Screen_Name} = lists:keyfind(<<"screen_name">>, 1, Locked_List),
  {Id, Date, Screen_Name, Text}.

remove_excess(Movie) ->
  Title = string:tokens(Movie, "\r\n\t "),
  string:strip(separate_excess(Title, []), left, $ ).

separate_excess([], NewList) -> NewList;
separate_excess([H|T], NewList) ->
  case string:rchr(H, $:) of
    0 -> separate_excess(T, NewList ++ " " ++ H);
    _ -> NewList ++ " " ++ string:strip(H, right, $:)
end.