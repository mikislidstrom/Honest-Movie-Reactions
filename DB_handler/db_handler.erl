-module(db_handler).
-export([put/3, get/2, buckets/0, delete/2]).

%%% Module works as a wrapper for the riak-erlang-client 
%%% accessing and writing data to the database

% Put an object with a key in a bucket
put(Bucket, Key, Object) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10027),
	RiakObject = riakc_obj:new(list_to_binary(Bucket), list_to_binary(Key), list_to_binary(Object), <<"application/json">>),
	riakc_pb_socket:put(Pid, RiakObject),
	riakc_pb_socket:stop(Pid).

% Get an object with a key in a bucket
% returns the object as Erlang type
get(Bucket, Key) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, Obj} = riakc_pb_socket:get(Pid, list_to_binary(Bucket), list_to_binary(Key)),
	riakc_pb_socket:stop(Pid),
	binary_to_term(riakc_obj:get_value(Obj)).

buckets() ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	{ok, List} = riakc_pb_socket:list_buckets(Pid),
	riakc_pb_socket:stop(Pid),
	List.

delete(Bucket, Key) ->
	{ok, Pid} = riakc_pb_socket:start_link("127.0.0.1", 10017),
	riakc_pb_socket:delete(Pid, list_to_binary(Bucket), list_to_binary(Key)),
	riakc_pb_socket:stop(Pid).