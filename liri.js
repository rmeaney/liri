//initial variables

var selection = process.argv[2];
var userQuery = process.argv[3];

//set up requires
	var fs = require('fs');
	var request = require('request');

if(selection == 'my-tweets'){


	var Twitter = require('twitter');

	var keys = require('./keys');
	var client = new Twitter(keys.twitApi);

	 
	var params = {
		q: 'RickMeaney',
		count:20
	};

	client.get('search/tweets', params, grabbedData);

	function grabbedData(err, data, response){
		var tweets = data.statuses;
		for (var i = 0; i < tweets.length; i++){
			console.log('\nText: ' + tweets[i].text);
			console.log('\nDate: ' + tweets[i].created_at);
			console.log('-----------');
			if(i == tweets.length - 1){
				console.log('this is far back as I am willing to take you.');
			}
		}
		
	}
}else if(selection == 'spotify-this-song'){
	var Spotify = require('node-spotify-api');
 	var keys = require('./keys');
	var spotify = new Spotify(keys.spotApi);
	var spotSearch = userQuery.split(' ').join('+');

 
spotify.search({ type: 'track', query: spotSearch }, function(err, data) {
		  if (err) {
		    return console.log('Error occurred: ' + err);
		  }

		  if (!data){
		  	console.log("Invalid input");
		  	return;
		  }
		 	//console.log(data.tracks.items);
		 	var spottCheck = data.tracks.items;

		 	for(var i = 0; i < spottCheck.length; i++){
		 		console.log('Song: ' + spottCheck[i].name);
		 		console.log('Artist: ' + spottCheck[i].artists[0].name);
		 		console.log('Album: ' + spottCheck[i].album.name);
		 		console.log('Url: ' + spottCheck[i].external_urls.spotify);
		 		console.log('----------------');
		 	}

			//console.log("Artist: " + data.tracks.items[8].artists[0].name); 
			//console.log("Song name: " + data.tracks.items[8].name); 
			//console.log("Listen at: " + data.tracks.items[1].external_urls.spotify); 
			//console.log("Album: " + data.tracks.items[1].album.name); 

			//logResults("Artist: " + data.tracks.items[1].artists[0].name);
			//logResults("Song name: " + data.tracks.items[1].name);
			//logResults("Listen at: " + data.tracks.items[1].external_urls.spotify);
			//logResults("Album: " + data.tracks.items[1].album.name);
		}); 
}else if(selection = 'movie-this'){
	var keys = require('./keys');
	var getMovieApi = keys.omdbApi.movieApi;
	var convertedTitle = userQuery.split(' ').join('+');


	request("http://www.omdbapi.com/?t=" + convertedTitle + "&y=&plot=short&tomatoes=true&r=json&apikey=" + getMovieApi, function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log('Title: ' + JSON.parse(body).Title);
    console.log('Year: ' + JSON.parse(body).Year);
    console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
    console.log("Rotten Tomatoes Score : " + JSON.parse(body).Ratings[1].Value);
    console.log("Country: " + JSON.parse(body).Country);
    console.log("Language: " + JSON.parse(body).Language);
    console.log("Plot: " + JSON.parse(body).Plot);
    console.log("Starring: " + JSON.parse(body).Actors);

  }
});

}else if(selection == 'do-what-it-says'){

//	function doWhatItSays(){
	fs.readFile("./random.txt", "utf8", function(error, data){
		if (error){
			return console.log(error);
		};
		//console.log(data);
		var brokenText = data.split(',')

		selection= brokenText[0];
		userQuery = brokenText[1];

		//checkInput();
	});
//};
}//else if(selection != 'do-what-it-says' && selection != 'movie-this' && selection != 'my-tweets' && selection != 'spotify-this-song'){
//	console.log('that is not a valid choice.');
//	console.log('\nFor Twitter, Please Type: my-tweets');
//	console.log('\nFor Spotify, Please Type: spotify-this-song');
//	console.log('\nFor OMDB, Please Type: movie-this');
//	console.log('\n For a secret function, Please Type: do-what-it-says');
//}

