'use strict'

var http = require('http');
var https = require('https');
var fs = require('fs');
var express = require('express');

var app = express();
//app.use(serveIndex('./public'));
app.use(express.static('./public'));



var options = {
        key : fs.readFileSync('./certs/privkey.pem'),
        cert: fs.readFileSync('./certs/fullchain.pem')
}

//https server
var https_server = https.createServer(options, app);
https_server.listen(3001, '0.0.0.0');

