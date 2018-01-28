var express = require("express");
var path = require("path");
var app = express();

app.use(express.static(__dirname + '/build'))

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'build', 'index.html'))
})

app.listen((process.env.PORT || 8888), function(){
	 console.log("App is running.");
});