-module(get_rating).
-export([rotten_tomatoes/1, imdb/1]).

rotten_tomatoes(Imdb_Id) ->
	Short_Id = string:sub_string(Imdb_Id,3),
	Api_Key = "?apikey=nuyfaesekthcgc45fd7umc4j",
	Filter = "http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json",
	Id = "&type=imdb&id=" ++ Short_Id,
	Url = Filter ++ Api_Key ++ Id,
	inets:start(),
	ssl:start(),
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	Now_showing = mochijson2:decode(Body),
	{struct,Firststep} = Now_showing,
	{value, {<<"ratings">>, Secondstep}} = lists:keysearch(<<"ratings">>, 1, Firststep),
	{struct,Thirdstep} = Secondstep,
	{value, Fourthstep} = lists:keysearch(<<"critics_score">>, 1, Thirdstep),
	Fourthstep.

imdb(Imdb_Id) ->
	First_Filter = "http://www.omdbapi.com/?i=",
	Second_Filter = "&plot=short&r=json",
	Url = First_Filter ++ Imdb_Id ++ Second_Filter,
	inets:start(),
	ssl:start(),
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	Now_showing = mochijson2:decode(Body),
	{struct,Firststep} = Now_showing,
	{value, {<<"imdbRating">>, Secondstep}} = lists:keysearch(<<"imdbRating">>, 1, Firststep),
	Thirdstep = binary_to_float(Secondstep),
	Fourthstep = Thirdstep * 10,
	{<<"imdbRating">>,Fourthstep}.




