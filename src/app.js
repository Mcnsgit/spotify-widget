const express = require('express');
const serverless = require('serverless-http');
const app = express();
const router = express.Router();

router.get("/", (req,response) => {

    const request = require('request');

const client_id = process.env.SPOTIFY_CLIENT_ID || '1f42356ed83f46cc9ffd35c525fc8541'; // your clientId
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || '487ec052888b4917b00665fc65b8df9f'; // Your secret
const refresh_token= process.env.SPOTIFY_REFRESH_TOKEN ||"AQA6NedvlzmMeI0DZ26Wruav3u6dTmVbvFcitgCprD3jEavGYoqxrvR-MwS-nf2RY9YaE0Q6-pX4TxIHhoYG7oTeNvz1mf-o8x7t-G0sbvW7COrh6-ksDktvTF1sdefKD5Q"

var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: { grant_type: 'refresh_token', refresh_token: refresh_token }
};

request.post(authOptions, function(error, res) {
    var header = { 'Authorization': 'Bearer ' + (JSON.parse(res.body)).access_token };
    var song_name, artist, song_url;
    request({ url: "https://api.spotify.com/v1/me/player/currently-playing?", headers: header }, function(error, res, body) {
        if((res.statusCode == 204) || JSON.parse(body).currently_playing_type != "track") {
            request({ url:"https://api.spotify.com/v1/me/player/recently-played?type=track&limit=1", headers: header }, function(error, res, body) {
                var body_text = JSON.parse(body);
                var track = body_text.items[0].track;
                song_name = track.name;
                artist = track.artists[0].name;
                song_url = track.external_urls.spotify;
                response.json({ "song_name": song_name, "artist": artist, "song_url": song_url });
            });
        } else {
            var body_text = JSON.parse(body);
            song_name = body_text.item.name;
            artist = (body_text.item.artists)[0].name;
            song_url = body_text.item.external_urls.spotify;
            response.json({ "song_name": song_name, "artist": artist, "song_url": song_url });
        }
    });

});

});


app.use("/.netlify/functions/app", router);
module.exports.handler = serverless(app);