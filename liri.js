
//import packages
var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//get data from file
var keys = require("./keys.js");
var twitterKeys = keys.twitterKeys;

//initialize user input variables
var command = "";
var parameter = "";

//collect command line arguments
var argString = process.argv;

//assign user input from command line to input variables
if (argString.length >= 3) {
	command = argString.slice(2, 3);
	command = command.toString().trim();
	if (argString.length >= 4) {
//collect all input after the initial command and store in string
		for (var i = 3; i < argString.length; i++) {
			if (i > 3 && i < argString.length) {
//if there are multiple words entered as parameters to the command, 
//link together in string with "+" for passing to the API search
				parameter = parameter + "+" + argString[i];
	  		}
	  		else {
				parameter += argString[i];
			}
		}
	}
}

//start the Liri App
heyLiri();

//function to act on commands entered by users
function heyLiri() {

	switch(command) {

		case "my-tweets":
			tweetIt();
			break;
		case "spotify-this-song":
			spotifyIt();
			break;
		case "movie-this":
			omdb();
			break;
		case "do-what-it-says":
			whateverItSays();
			break;

		default:
			whateverItSays();
	}		

};

//function to connect to twitter API and print out tweets
function tweetIt() {

//pull in keys and secrets from keys file
	var tweets = new twitter(twitterKeys); 

//user timeline request to twitter API for user WobbleWillie, limit results to 20 most recent tweets
	tweets.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=WobbleWillie&count=20', timelineSearch); 

	function timelineSearch(err, data, response) {

//getting data from JSON returned by API
		for(var i = 0; i < data.length; i++) {
			var timeStamp = data[i].created_at; 
			var tweetText = data[i].text; 

//output tweets and time to console
			console.log(timeStamp);
			console.log(tweetText);
		}
	}

};

//function to connect to Spotify API and return track info
function spotifyIt() {

//default track to use if user does not enter track
	var songToSearch = "The Sign Ace of Base";

//use input parameter entered by user if exists
	if (parameter.length > 0) {
		songToSearch = parameter;
	}

//client access data for Spotify account
	var client_id = "f4b2faae79f74001b4fe8cc2e24c2835"; 
	var client_secret = "0c100b002f124551b7afacdf7ebe8aac"; 

//data needed for oauth token request
	var authOptions = {
	  url: "https://accounts.spotify.com/api/token",
	  headers: {
	    "Authorization": "Basic " + (new Buffer(client_id + ":" + client_secret).toString("base64"))
	  },
	  form: {
	    grant_type: "client_credentials"
	  },
	  json: true
	};

//get access token for Spotify
	request.post(authOptions, function(error, response, body) {
	  if (!error && response.statusCode === 200) {

// use the access token to access the Spotify Web API, using track search and limiting to one result
	    var token = body.access_token;
	    var options = {
	      url: "https://api.spotify.com/v1/search?q=" + songToSearch + "&type=track&offset=0&limit=1",
	      headers: {
	        "Authorization": "Bearer " + token
	      },
	      json: true
	    };
	    request.get(options, function(error, response, body) {

//getting data from JSON returned by API
	     var artist = body.tracks.items[0].artists[0].name;
	     var title = body.tracks.items[0].name;
	     var preview = body.tracks.items[0].preview_url;
	     var album = body.tracks.items[0].album.name;

//outputting data to console
	     console.log("Artist: " + artist);
	     console.log("Song name: " + title);
	     console.log("Preview link: " + preview);
	     console.log("Album: " + album);

	    });
	  }
	});


};

//functin to search for movie in omdb API
function omdb() {

//default movie to search if user does not enter movie
	var movieToSearch = "Mr. Nobody";

//use input parameter entered by user if exists
	if (parameter.length > 0) {
		movieToSearch = parameter;
	}

//send request to omdb API
	request("http://www.omdbapi.com/?t=" + movieToSearch + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
		var results = JSON.parse(body);
	  	if (!error && response.statusCode === 200) {
//getting data from JSON returned by API
		  	var title = "The film title is: " + results.Title + "\n";
		  	var year = "The movie came out in " + results.Year + "\n";
//Ratings is an array with variable length and ratings sources, check for source before using (source imdb returned first if exists)
	        if (results.Ratings[0] != null && results.Ratings[0].Source == "Internet Movie Database") {
			  	var rating = "The IMDB rating is " + results.Ratings[0].Value + "\n";
		  	}
		  	else {
	          	var rating = "There is no IMDB rating.\n";
		  	}
//some films do not have this rating attached, so check for existence (source Rotten Tomatoes returned second if exists)
	        if (results.Ratings[1] != null && results.Ratings[1].Source == "Rotten Tomatoes") {
			    var rotten = "The Rotten Tomatoes rating is " + results.Ratings[1].Value + "\n";
	        }
	        else {
	            var rotten = "There is no Rotten Tomatoes rating.\n";
	        }
		  	var country = "The film was produced in " + results.Country + "\n";
		  	var language = "The film is in " + results.Language + "\n";
		  	var plot = "Film Plot: " + results.Plot + "\n";
		  	var actors = "Film Cast: " + results.Actors + "\n";

//Output all movie data to console	    
		    console.log(title + year + rating + rotten + country + language + plot + actors);
		}
		else {
//do this if API returns error code
		  	console.log("OMDB returned the following error: " + error);
		}
	});
};

//function to read data from file and pass those arguments into Liri App
function whateverItSays() {

//initialize array
	var itSaysArray = [];

//function to read from file
	fs.readFile("./random.txt", "utf8", function(error, data) {

		if (error) {
			return console.log(error);
		}

//take string read from file and parse comma separated values into an array
		itSaysArray = data.split(",");

//assign those values read to input variables
		command = itSaysArray[0];
		parameter = itSaysArray[1];

//call Liri App.  
//Calling from within file read function to ensure data is read before passing to Liri App
		heyLiri();
	});

};