

var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

var keys = require("./keys.js");

var twitterKeys = keys.twitterKeys;

var command = "";
var parameter = "";

var argString = process.argv;

if (argString.length >= 3) {
	command = argString.slice(2, 3);
	command = command.toString().trim();
	if (argString.length >= 4) {
		for (var i = 3; i < argString.length; i++) {
			if (i > 3 && i < argString.length) {
				parameter = parameter + "+" + argString[i];
	  		}
	  		else {
				parameter += argString[i];
			}
		}
	}
}

heyLiri();

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

function tweetIt() {

	var tweets = new twitter(twitterKeys); 

	tweets.get('https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=WobbleWillie&count=20', searchedData); 

	function searchedData(err, data, response) {

		for(var i = 0; i < data.length; i++) {
			var timeStamp = data[i].created_at; 
			var tweetText = data[i].text; 

			console.log(timeStamp);
			console.log(tweetText);
		}
	}

};

function spotifyIt() {


	var songToSearch = "The Sign Ace of Base";

	if (parameter.length > 0) {
		songToSearch = parameter;
	}

	var client_id = "f4b2faae79f74001b4fe8cc2e24c2835"; 
	var client_secret = "0c100b002f124551b7afacdf7ebe8aac"; 


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

	    // use the access token to access the Spotify Web API
	    var token = body.access_token;
	    var options = {
	      url: "https://api.spotify.com/v1/search?q=" + songToSearch + "&type=track&offset=0&limit=1",
	      headers: {
	        "Authorization": "Bearer " + token
	      },
	      json: true
	    };
	    request.get(options, function(error, response, body) {

	     var artist = body.tracks.items[0].artists[0].name;
	     var title = body.tracks.items[0].name;
	     var preview = body.tracks.items[0].preview_url;
	     var album = body.tracks.items[0].album.name;

	     console.log("Artist: " + artist);
	     console.log("Song name: " + title);
	     console.log("Preview link: " + preview);
	     console.log("Album: " + album);

	    });
	  }
	});


};


function omdb() {

	var movieToSearch = "Mr. Nobody";

	if (parameter.length > 0) {
		movieToSearch = parameter;
	}


	request("http://www.omdbapi.com/?t=" + movieToSearch + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
		var results = JSON.parse(body);
	  	if (!error && response.statusCode === 200) {
		  	var title = "The film title is: " + results.Title + "\n";
		  	var year = "The movie came out in " + results.Year + "\n";
	        if (results.Ratings[0] != null && results.Ratings[0].Source == "Internet Movie Database") {
			  	var rating = "The IMDB rating is " + results.Ratings[0].Value + "\n";
		  	}
		  	else {
	          	var rating = "There is no IMDB rating.\n";
		  	}
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
		    
		    console.log(title + year + rating + rotten + country + language + plot + actors);
		}
		else {
		  	console.log("OMDB returned the following error: " + error);
		}
	});
};

function whateverItSays() {

	var itSaysArray = [];

	fs.readFile("./random.txt", "utf8", function(error, data) {

		if (error) {
			return console.log(error);
		}

		itSaysArray = data.split(",");

		command = itSaysArray[0];
		parameter = itSaysArray[1];

		heyLiri();
	});

};