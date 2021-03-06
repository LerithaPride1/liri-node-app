var fs = require('fs');
var os = require('os');
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var prettyjson = require('prettyjson');
var Twitter = require('twitter');
var keys = require('./keys.js');


var first_argv = process.argv[2];
var second_argv = process.argv[3];

function initiate(command, argument) {
    if (typeof(command) == 'undefined' || command === null) {}
    switch (command) {
        case 'my-tweets':
            myTweets(argument);
            break;
        case 'spotify-this-song':
            spotifyThis(argument);
            break;
        case 'movie-this':
            movieThis(argument);
            break;
        case 'do-what-it-says':
            doWhatItSays();
            break;
        default:
            console.log(first_argv + " : command not found");
    }
}

function myTweets() {
    var client = new Twitter({
        consumer_key: keys.twitterKeys.consumer_key,
        consumer_secret: keys.twitterKeys.consumer_secret,
        access_token_key: keys.twitterKeys.access_token_key,
        access_token_secret: keys.twitterKeys.access_token_secret
    });
    var user = 'lerithaphp';
    var tweet_count = 20;

};
twitter_client.get('statuses/user_timeline', argument, function(error, tweets, response) {
    if (error) {
        console.log(error);
    } else {
        var tweet_data = [];

        for (i in tweets) {
            var data = {
                "Created": tweets[i].created_at,
                "Tweet": tweets[i].text,
                "Retweeted": tweets[i].retweet_count,
                "Favorited": tweets[i].favorite_count
            };
            tweet_data.push(data);
        }

        console.log("Successfully retrieved " + tweets.length + " tweets (maximum 20) from Twitter.");
        console.log(prettyjson.render(tweet_data, { keysColor: 'green', stringColor: 'white' }));

    }
    appendLogFile("Executed my-tweets");
});


function spotify_client(song) {

    var spotify_client = new Spotify({
        id: keys.spotifyKeys.client_id,
        secret: keys.spotifyKeys.client_secret
    });

    spotify_client.searchTracks(song).then.then(function(res) {

        var spot_data = [];
        var tracks = res.body.tracks.items;

        for (i in tracks) {
            var data = {
                "Track": tracks[i].name,
                "Album": tracks[i].album.name,
                "Artist(s)": tracks[i].artists[0].name,
                "Preview URL": tracks[i].preview_url
            };
            spot_data.push(data);
        }

        var total_items = tracks.length;

        console.log("Successfully retrieved " + total_items + " items from Spotify");
        console.log(prettyjson.render(spot_data, { keysColor: 'green', stringColor: 'white' }));

    }, function(error) {
        console.error(error);
    });

    appendLogFile("Executed spotify-this-song with argument " + "'" + song + "'");
}


function moviefy(argument) {

    var query_url = "http://www.omdbapi.com/?t=" + argument + "&y=&plot=short&apikey=4614c236";

    request(queryUrl, function(error, res, body) {

        if (!error && response.statusCode === 200) {

            var movie_data = {
                "Title": JSON.parse(body).Title,
                "Released": JSON.parse(body).Released,
                "Country": JSON.parse(body).Country,
                "Language(s)": JSON.parse(body).Language,
                "Actors": JSON.parse(body).Actors,
                "IMDB Rating": JSON.parse(body).imdbRating,
                "Rotten Tomatoes Rating": JSON.parse(body).tomatoRating,
                "Rotten Tomatoes URL": JSON.parse(body).tomatoURL,
                "Plot": JSON.parse(body).Plot
            }

            console.log("Successfully retrieved OMDB results for " + movie_data.Title + ".");
            console.log(prettyjson.render(movie_data, { keysColor: 'green', stringColor: 'white' }));
        } else
            console.error(error);
    });

    appendLogFile("Executed movie-this with argument " + "'" + movie + "'");
}


function doWhatItSays() {

    fs.readFile("random.txt", "utf8", function(err, random_txt) {

        var ran_txt = random_txt.split(',');
        var func = ran_txt[0];
        var param = ran_txt[1];

        console.log("PARAM: ", param);

        switch (func) {
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                spotifyThis(param);
                break;
            case "movie-this":
                movieThis(param);
                break;
        }
    });

    appendLogFile("Executed do-what-it-says");
}

function appendLogFile(log_entry) {

    var dtg = new Date() + ': ';

    fs.appendFile('log.txt', dtg + log_entry + os.EOL, 'utf8', function(error) {
        if (error)
            throw error;
    });
}
