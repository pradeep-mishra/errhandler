var domain = require("domain");

var defaultHandler = function(err, req, res){
    var data = [ "<h1>oops! Error on Application</h1>", "<pre>", err.stack, "</pre>" ].join('\n');
    res.send(500, data);  
}

function DomainError(){
    var me = this,
        handlerFunc = defaultHandler;

    this.error = function(handle){
        if(typeof(handle) === "function"){
            handlerFunc = handle;
        }
        return this;
    }

    this.middleWare = function(req, res, next){
        var d = domain.create();
        d.on('error', function(err) {
        	var context = {
        		error : err,
        		request : req,
        		response : res
        	}
            handlerFunc.call(context, err, req, res);
        });
        d.add(req);
        d.add(res);
        req.domain = d;
        req.errorHandler = me;
        d.run(next);    
    }

    this.handler = function(req, res){
    	var d = domain.create();
        d.on('error', function(err) {
        	var context = {
        		error : err,
        		request : req,
        		response : res
        	}
            handlerFunc.call(context, err, req, res);
        });
        d.add(req);
        d.add(res);	
        req.domain = d;
        req.errorHandler = me;
        me.run = d.run.bind(d);
        return me;
    }
}

var domainError = {
	error : function(handle){
		if(typeof(handle) === "function"){
			defaultHandler = handle;
		}
		return this;
	},

	middleWare : function(req, res, next){
		return ((new DomainError).middleWare(req, res, next));
	},

	handler : function(req, res){
		var handle = new DomainError;
		handle.error(function(err, req, res){
			res.statusCode = 500;
	        res.setHeader('content-type', 'text/html');
	        res.end([ "<h1>oops! Error on Application</h1>", "<pre>", err.stack, "</pre>" ].join('\n'));
		});
		return (handle.handler(req, res));	
	}	
}

module.exports = domainError;


