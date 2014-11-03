-module(test_db).
-export([store_movie/1, get_movie/1]).

store_movie(Id) -> 
	Obj = movies:id(Id),
	db_handler:put("Movies", Id, Obj).

get_movie(Id) ->
	db_handler:get("Movies", Id).