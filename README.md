[![NPM](https://nodei.co/npm/errhandler.svg?downloads=true&downloadRank=true)](https://nodei.co/npm/errhandler/)&nbsp;&nbsp;
[![Build Status](https://travis-ci.org/pradeep-mishra/errhandler.svg?branch=master)](https://travis-ci.org/pradeep-mishra/errhandler)




errhandler
==========

------------------------------------

Error handler for Node.js application http server
-------------------------------------

&copy; Pradeep Mishra, Licensed under the MIT-LICENSE

 


Example usage
-------------

As a middleware for express, connect like node framework

```javascript
var app = express();
var errHandler = require("errhandler");

// optional 
errHandler.error(function(err, req, res){
    // this.error, this.request, this.response is equal to err, req, res in arguments
    this.response.send(200, "oops!" + err.stack);
});

app.use(errHandler.middleWare);

app.get('/', function(req,res){
    process.nextTick(function(){
        throw new Error("my bad");
    });
});

app.listen(3000);

```

As a handler for core node.js http server

```javascript
var http = require('http');
var errHandler = require("errhandler");

http.createServer(function(req, res) {
    var handler = errHandler.handler(req, res);
    
    // optional 
    handler.error(function(err, req, res){
        res.statusCode = 500;
        res.setHeader('content-type', 'text/html');
        res.end(err.stack);
    });
    
    handler.run(function(){
        throw new Error('my error');
    });
    
}).listen(3000);

```



```bash
npm install errhandler --save
```
