-module(twitter_miner).
-export([get_account_keys/1, twitter_search/1]).
-record(account_keys, {api_key, api_secret,
                       access_token, access_token_secret}).


keyfind(Key, L) ->
  {Key, V} = lists:keyfind(Key, 1, L),
  V.


get_account_keys(Name) ->
  {ok, Accounts} = application:get_env(twitterminer, twitter_accounts),
  {Name, Keys} = lists:keyfind(Name, 1, Accounts),
  #account_keys{api_key=keyfind(api_key, Keys),
                api_secret=keyfind(api_secret, Keys),
                access_token=keyfind(access_token, Keys),
                access_token_secret=keyfind(access_token_secret, Keys)}.


twitter_search(Movie) ->
	
	ssl:start(),
	application:start(inets),	
	httpc:request(get, {"https://api.twitter.com/1.1/search/tweets.json?q=%40twitterapp", [{"connection", "close"}]}, [], []).