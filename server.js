var express = require("express");
var app = express();

var biasservice_url = (process.env.BIAS_SERVER_URL || "http://localhost:3000");
var fbapp_id = (process.env.FB_APP_ID || "382449245425765");
var bcapp_id = (process.env.BC_APP_ID || "0909367047e24c43956ae4511cb28f00");
var bcapp_secret = (process.env.BC_APP_SECRET || "0e4f843becb044e496a317f3befc5105");

app.use(express.static('build'))
app.listen((process.env.PORT || 8888), function(){
	 console.log("App is running.");
	 console.log("BiasCheckerUrl:", biasservice_url);
	 console.log("Facebook App Id:", fbapp_id);
	 console.log("BiasChecker App Id:", bcapp_id);
});