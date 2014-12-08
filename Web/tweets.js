var tweetArray = [];
var tweetID;

//The purpose of this function is to set give IDs a tag
//that will later be used by start.html to display text
function setTweetTags() {
    for(n=0; n<5; n++){   
        if(n<tweetArray.length){
        	dateArray = tweetArray[n].created_at.split(" "); //turns JSON data into array with white space as delimiter.
			$("#screenName"+n.toString()).text(tweetArray[n].screen_name);
    	    $("#tweetText"+n.toString()).text(tweetArray[n].text); 
        	$("#date"+n.toString()).text("     "+dateArray[3].slice(0, 5)+", "+dateArray[1]+" "+dateArray[2]+" "+dateArray[5]);
        }else{
        	//In case a movie does not have 5 tweets about it,
        	//we set the tags to "" to appear empty, otherwise they'll
        	//contain previous movies' tweets.  
	        $("#screenName"+n.toString()).text(""); 
    	    $("#tweetText"+n.toString()).text(""); 
        	$("#date"+n.toString()).text("");
        }
    };
}


//The purpose of this function is to 
//retrieve JSON data from Riak database
function getTweets(movieID) { 
	
	//here the Array is reset so it does not contain
	//information about previous movies.
    if(tweetArray.length!=0){
        tweetArray.length = 0;
    }

    //Here we actually obtain JSON tweet data containing data
    $.ajax({
        url: "http://localhost:8081/erl/web_server:tweets?"+movieID.toString(),
        async: false,
        dataType: 'json',
        success: function(data) {
            tweetArray = data;
        }
    });
};