To run this software you will need a Erlang/Python interface called ErlPort.
----
It can be downloaded from: http://erlport.org/downloads/ 
Step by step guide for isntallation:
1. Download the right file for your Erlang version (can be seen when starting the shell, the version number is next to Erlang / OTP ##)
2. Run code:lib_dir(). in the Erlang shell and you will see the directory for your Erlang library.
3. Put the folder in that directory.
4. Restart the Erlang shell and ErlPort should be working.
To test it write the following in your shell:
{ok, P} = python:start().
python:stop(P).

Instructions for installing on Ubuntu
----
######Install Riak
Go to this page: http://docs.basho.com/riak/latest/ops/building/installing/debian-ubuntu/
Select the button on the right and download the deb-package and install it.
######Start riak
To start riak after installing it you just open a terminal and type: riak start
Install riak-erlang-client
######Go to this page: https://github.com/basho/riak-erlang-client
Clone the repository, and run make in the riak-erlang-client folder to compile it.
######Our code
Get our code from github, clone repository is easiest. Copy them to a folder where you can work with them because when they are compiled the beam file will be in the same directory and if they are in the git folder they will be sent to git when adding and pushing.
######Change some stuff
In the code you need to add some settings for it to work properly for you. First you need to change the API_KEY value (inside the quotes) in movies.erl to:
(see online doc)
And you need to change the PORT value to: 8087
######Run erl with path
Start erl with paths by adding the -pa option and the path to riak-erlang-client
```
erl -pa $PATH/*/ebin $PATH/*/deps/*/ebin
```
Where $PATH is the folder containing the riak erlang client. Then compile the erlang modules db___handler, movies and test_db.
######Add movie
To add a movie with you can do this easily with the id of the movie by running:
test_db:store_movie(“100”). 
This will store movie with id 100.
######Test the db
If you are successful and have no errors there should be a movie with the key “100” in a bucket called “Movies”. This can be checked by accessing the HTTP API. Go to the browser and enter url: 127.0.0.1:8098/buckets/Movies/keys/100
This should display JSON data of the movie which was pulled from the movie db.
