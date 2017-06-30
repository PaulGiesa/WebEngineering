const http = require('http');
const hostname = '127.0.0.1';
const port = 3000;
var express = require('express');
var app = express();
var bodyParser= require("body-parser")

const server = http.createServer((req, res) => {
  console.log (req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
  });

server.listen(port,hostname, ()  => {
  console.log(`server running at http://${hostname}:${port}/`);
  console.log(__dirname);
  });

//Readfilesync für user.js einlesen
//PW ändern Json datei zur laufzeit generienren
//nützliche website postman

app.use(bodyParser.json());

  app.get('/', function(req, res){
  res.setHeader('Content-Type', 'text/plain');
  res.end('Got a get request')
});

app.post('/', function(req, res){
  res.setHeader('Content-Type', 'text/plain');
  res.end('Got a Post request')
});

app.put('/', function(req, res){
  res.setHeader('Content-Type', 'text/plain');
  res.send('Got a Put request')
});
