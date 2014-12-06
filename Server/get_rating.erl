-module(get_rating).
-export([rotten_tomatoes/1, imdb/1]).

rotten_tomatoes(Imdb_Id) ->
	Api_Key = "?apikey=nuyfaesekthcgc45fd7umc4j",
	Url = "http://api.rottentomatoes.com/api/public/v1.0/movie_alias.json" ++ Api_Key ++ "&type=imdb&id=" ++ string:sub_string(Imdb_Id,3),
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	{PropList} = jiffy:decode(Body),
	{RatingsList} = proplists:get_value(<<"ratings">>, PropList),
	proplists:get_value(<<"critics_score">>, RatingsList).

imdb(Imdb_Id) ->
	Url = "http://www.omdbapi.com/?plot=short&r=json&i=" ++ Imdb_Id,
	{ok, {{_, 200, _}, _, Body}} = httpc:request(get, {Url, []}, [], []),
	{PropList} = jiffy:decode(Body),
	binary_to_float(proplists:get_value(<<"imdbRating">>, PropList)) * 10.




