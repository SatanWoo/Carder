var phantom = require('phantom');
var cp      = require('child_process');
var URL     = require('url');
var jsdom   = require('jsdom');

var API = {};

function output(baseURL, relativeURL) {
	return "src=" + url + "/";
}

API.parseHTML = function(url, timeout, callback) {
    var urls = [];
    var lastResponseReceived = new Date().getTime();

    phantom.create(function (ph) {
        ph.createPage(function (page) {
	    	page.onResourceRequested(
		        function(requestData, request, arg1, arg2) { 
		        }
		    );

		    page.set('onResourceReceived', function (r) { 
		    	urls.push(r.url);
		    	lastResponseReceived = new Date().getTime();
		    });

		    var t = new Date().getTime();
		    page.open(url, function(status){
		        if (!status) return ph.exit(1);

		        page.get('content', function(content) {
					var parsedHTML = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
						return '<img src="' + URL.resolve(url, capture) + '"">';
					});

	                setTimeout(function(){
	                	var server = cp.spawn('cat');
		                server.stdout.on('data', function(d) {
		                　　//console.log(d.toString());
		                });
		                server.on('exit', function() {
		                　　//console.log('child process exit');
		                });

		                server.stdin.write(parsedHTML);
		                server.stdin.end();

		                ph.exit();
	                }, timeout);
	            });
		    });     
        });
    });
}

module.exports = API;