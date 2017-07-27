//initial variables

var selection = process.argv[2];
var userQuery = process.argv[3];
var convertedQuery;

//set up requires
	var fs = require('fs');
	var request = require('request');
	var Twitter = require('twitter');
	var Spotify = require('node-spotify-api');

	var keys = require('./keys');
	cleanSheet();

if(selection == 'my-tweets'){
	tweetMaker();
}else if(selection == 'spotify-this-song'){
 	spotifyMaker(userQuery);
}else if(selection == 'movie-this'){
	movieMaker(userQuery);
}else if(selection == 'do-what-it-says'){

 doWhatItSays();

//};
}else{
	console.log('not much');
}


//Convert Text for encoding
function textCleaner(userText){

	convertedQuery = userText.split(' ').join('+');
	return convertedQuery;
}

//Twitter function

function tweetMaker(){


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
			writeThatDown("\r\nText: " + tweets[i].text);
			writeThatDown("\r\nDate: " + tweets[i].created_at);
			writeThatDown("\r\n------------");
			if(i == tweets.length - 1){
				console.log('this is far back as I am willing to take you.');
			}
		}
	}
}

//spottify Function

function spotifyMaker(songChosen){

	var spotify = new Spotify(keys.spotApi);
	//var spotSearch = userQuery.split(' ').join('+');
	textCleaner(songChosen);
	//console.log(convertedQuery);

 
spotify.search({ type: 'track', query: convertedQuery }, function(err, data) {
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
		 		writeThatDown("\r\nSong: " + spottCheck[i].name);
		 		writeThatDown("\r\nArtist: " + spottCheck[i].artists[0].name);
		 		writeThatDown("\r\nAlbum: " + spottCheck[i].album.name);
		 		writeThatDown("\r\nURL: " + spottCheck[i].external_urls.spotify);
		 		writeThatDown("\r\n------------");



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
}

// OMDB functions
function movieMaker(movieChosen){
	var getMovieApi = keys.omdbApi.movieApi;
	//var convertedTitle = userQuery.split(' ').join('+');
	textCleaner(movieChosen);


	request("http://www.omdbapi.com/?t=" + movieChosen + "&y=&plot=short&tomatoes=true&r=json&apikey=" + getMovieApi, function(error, response, body) {

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
    writeThatDown("\r\nTitle: " + JSON.parse(body).Title);
    writeThatDown("\r\nYear: " + JSON.parse(body).Year);
    writeThatDown("\r\nRotten Tomatoes score: " + JSON.parse(body).Ratings[1].Value);
    writeThatDown("\r\nCountry: " + JSON.parse(body).Country);
    writeThatDown("\r\nLanguage: " + JSON.parse(body).Language);
    writeThatDown("\r\nPlot: " + JSON.parse(body).Plot);
     writeThatDown("\r\nStarring: " + JSON.parse(body).Actors)





  }
});
}

//do what it says function
function doWhatItSays(){
	fs.readFile("./random.txt", "utf8", function(error, data){
		if (error){
			return console.log(error);
		};
		//console.log(data);
		var brokenText = data.split(',')

		selection= brokenText[0];
		specialQuery = brokenText[1];
		console.log(specialQuery);
		spotifyMaker(specialQuery);

		
	});
	
}

//export text document
function writeThatDown(ideas){
	fs.appendFile("liriResults.txt", ideas, function(err) {

  // If the code experiences any errors it will log the error to the console.
  if (err) {
    return console.log(err);
  }

 
  //console.log("your experience has been recorded.");


});
}
function cleanSheet(){
	fs.writeFile("liriResults.txt", '', function(err) {

  // If the code experiences any errors it will log the error to the console.
  if (err) {
    return console.log(err);
  }

 
  //console.log("your experience has been recorded.");


});
}