/*
* Homework Assignment #1
* Jason Ramsey aka Jaseowns
* Hello World API that will return a welcome message
*/ 

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

// Setup Config
const config = {
    port: 1337,
    name: 'HelloWorldApi'
}

// Setup Server
var server = http.createServer(function(req,res) {
    processRequest(req,res);
});

// Listen
server.listen(config.port, () => {
    console.log(`Starting ${config.name} on port ${config.port}...`);
});

// Process
var processRequest = function(req,res) {

    // get the url and parse it
    var parsedUrl = url.parse(req.url, true);

    // get path from the url
    var path = parsedUrl.pathname;
    var trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Get the query string as an object
    var queryStringObject = parsedUrl.query;

    // Get the HTTP method
    var method = req.method.toUpperCase();

    // Get the headers as an object
    var headers = req.headers;

    // Get the payload, if any
    var decoder = new StringDecoder('utf-8');
    var buffer = '';
    req.on('data', function(data){
        buffer += decoder.write(data);
    });
    req.on('end', function() {
        buffer += decoder.end();

        // Choose the handler the request should go to, if one is not found use 404
        var chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

        // construct the data object to send to handler
        var data = {
            'trimmedPath' : trimmedPath,
            'queryStringObject' : queryStringObject,
            'method' : method,
            'headers' : headers,
            'payload' : buffer
        }

        // route the request to the handler
        chosenHandler(data, function(statusCode, payload) {
            // use the status code by handle or default to 200
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
            
            // use payload returned by handler or default to empty
            payload = typeof(payload) == 'object' ? payload : {};

            // Convert the payload to a string
            var payloadString = JSON.stringify(payload);

            // return the response
            res.setHeader('Content-Type','application/json');
            res.writeHead(statusCode);
            res.end(payloadString);

            // log what path happened
            // console.log(`Request received on: ${method} ${trimmedPath}`, queryStringObject, headers, buffer);
            console.log(`Request received on: ${method} ${trimmedPath} : Response: ${statusCode} ${payloadString}`);

        });        
    });
};

var handlers = {};

// Return a welcome message
handlers.welcome = function(data, callback) {
    let message = "Welcome to my homework assignment!"
    if (data.payload.length !== 0) {
        message += `\nThanks for saying "${data.payload}"`;
    }
    callback(200,{"message":message});
};

// Not found handler
handlers.notFound = function(data, callback) {
    callback(404);
};

// Define a request router
var router = {
    'hello' : handlers.welcome
};

