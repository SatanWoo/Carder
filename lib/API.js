var phantom = require('phantom');
var cp      = require('child_process');
var URL     = require('url');
var SPAWN   = cp.spawn;
var jsdom   = require('jsdom');
var PythonShell = require('python-shell');

var API = {};

function connectPython(url, callback, parsedHTML) {
	PythonShell.defaultOptions = 
	{
		scriptPath: './lib'
	};

	var result = parsedHTML || "";

	var pyshell = new PythonShell('extractor.py');
	pyshell.send(JSON.stringify({html:result, url:url}));
	
	pyshell.on('message', function (message) {
		callback(null, message);
	});
	
	// end the input stream and allow the process to exit 
	pyshell.end(function (err) {
		if (err) throw err;
		console.log('finished');
	});
}

API.parseHTML = function(url, timeout, callback) {
	if (url.indexOf('youku.com') != -1 || 
		url.indexOf('tudou.com') != -1) {
		
		connectPython(url, callback);
		return;			
	}

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

					connectPython(url, callback, parsedHTML);
				});
			});     
		});
	});
}

module.exports = API;