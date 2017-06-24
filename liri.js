var keys = require("./keys.js");

var Twitter = require("twitter");

var Spotify = require("node-spotify-api");

var request = require("request");

var fs = require("fs");

var nodeArgs = process.argv;


var client = new Twitter(keys.twitterKeys);


var spotify = new Spotify(keys.spotifyKeys);

var command = process.argv[2];
var songName = "";
var movieName= "";

switch (command) {
	case "my-tweets":
		myTweets();
		break;

	case "spotify-this-song":
		spotifyRun();
		break;

	case "movie-this":
		movie();
		break;

	case "do-what-it-says":
		doWhat();
		break;
}

function myTweets(){
	client.request.get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=samjeonliri&count=20", function(error, tweets, response){
		if(!error){
			var convert = JSON.parse(tweets.body);
			for(var i = 0; i < convert.length; i ++){
				console.log(convert[i].text);
			}
		}
	})
}

function spotifyRun(){

	if (nodeArgs.length < 4){
		songName = "The Sign";
		spotify.search({type: "track", query: songName}, function(err, data) {
			if (err){
				return console.log("Error occurred: " + err);
			}
			console.log("Artist: " + data.tracks.items[11].artists[0].name 
						+ "\nSong Title: " + songName + "\nSpotify Preview URL: " 
						+ data.tracks.items[11].preview_url + "\nAlbum Name: " 
						+ data.tracks.items[11].album.name);
		})
	}
	else {
		for (var a = 3; a < nodeArgs.length; a++){
			if(a > 3 && a < nodeArgs.length){
				songName = songName + " " + nodeArgs[a];
			}
			else{
				songName += nodeArgs[a];
			}
		}
		spotify.search({type: "track", query: songName}, function(err, data) {
			if (err){
				return console.log("Error occurred: " + err);
			}
			console.log("Artist: " + data.tracks.items[0].artists[0].name 
						+ "\nSong Title: " + songName + "\nSpotify Preview URL: " 
						+ data.tracks.items[0].preview_url + "\nAlbum Name: " 
						+ data.tracks.items[0].album.name);
		})
	}
}

function movie(){
	if (nodeArgs.length < 4){
		movieName = "Mr.Nobody";
	}

	for (var b = 3; b < nodeArgs.length; b++) {
  		if (b > 2 && b < nodeArgs.length) {
    		movieName = movieName + "+" + nodeArgs[b];
  		}
  		else {
    		movieName += nodeArgs[b];
  		}
	}

	var queryUrl = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movieName + "&y=&plot=short&type=movie&tomatoes=true&r=json";

	request(queryUrl, function(error, response, body){

		if (!error && response.statusCode === 200){

		console.log("The title of the movie is: " + JSON.parse(body).Title
					+ "\nThe year the movie came out is: " + JSON.parse(body).Year
					+ "\nThe IMDB Rating of the movie is: " + JSON.parse(body).imdbRating
					+ "\nThe country the movie was produced is: " + JSON.parse(body).Country
					+ "\nThe language of the movie is: " + JSON.parse(body).Language
					+ "\nThe plot of the movie is: " + JSON.parse(body).Plot
					+ "\nThe actors in the movie are: " + JSON.parse(body).Actors
					+ "\nThe Rotten Tomatoes URL is: " + JSON.parse(body).tomatoURL);
		}
	})	
}

function doWhat(){
	fs.readFile("random.txt", "utf8", function(err, data){
		if (err){
			return console.log(err);
		}
		var output = data.split(",");
		nodeArgs.splice(2,1);
		
		for (var c = 0; c < output.length; c++){
			nodeArgs.push(output[c]);
		}
		spotifyRun();
	})
}





