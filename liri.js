

var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");

var keys = require("./keys.js");



var twitterKeys = keys.twitterKeys;
console.log(twitterKeys);

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

// parameter = argString.slice(3);
// 	parameter = parameter.toString().trim();
// 		if(parameter.indexOf(",") > -1) {
// 	    parameter = parameter.split(",").join("+");
// 		}
	}
}

switch(command) {

	case "my-tweets":
		// ...show last 20 tweets and when they were created at
		break;
	case "spotify-this-song":
		// ...
		break;
	case "movie-this":
		omdb();
		break;
	case "do-what-it-says":
		// ...
		break;

	// default:
		// ...


}


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