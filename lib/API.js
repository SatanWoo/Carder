var phantom = require('phantom');
var cp      = require('child_process');
var URL     = require('url');
var SPAWN   = cp.spawn;
var jsdom   = require('jsdom');
var PythonShell = require('python-shell');

var API = {};

API.parseHTML = function(url, timeout, callback) {
	phantom.create(function (ph) {
		ph.createPage(function (page) {
			page.onResourceRequested(
				function(requestData, request, arg1, arg2) { 
				}
				);

			page.set('onResourceReceived', function (r) { 
		    	//lastResponseReceived = new Date().getTime();
		    });

			var t = new Date().getTime();
			page.open(url, function(status){
				if (!status) return ph.exit(1);

				page.get('content', function(content) {
					var parsedHTML = content.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(match, capture) {
						return '<img src="' + URL.resolve(url, capture) + '">';
					});

					PythonShell.defaultOptions = {
						scriptPath: './lib'
					};

					var pyshell = new PythonShell('extractor_y.py');
					pyshell.send(JSON.stringify({html:parsedHTML, url:url}));
					
					pyshell.on('message', function (message) {
						console.log(message);
						callback(null, message);
					});
					
					// end the input stream and allow the process to exit 
					pyshell.end(function (err) {
						if (err) throw err;
						console.log('finished');
					});
				});
			});     
		});
});
}

module.exports = API;