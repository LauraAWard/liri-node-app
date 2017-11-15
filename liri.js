

var twitter = require("twitter");
var spotify = require("node-spotify-api");
var request = require("request");

var keys = require("./keys.js");



var twitterKeys = keys.twitterKeys;
console.log(twitterKeys);

var command = process.argv[2];
var parameter = process.argv[3];