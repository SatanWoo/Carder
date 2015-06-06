var phantom = require('phantom');
var async = require('async');

function render(url, timeout, callback) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            waitFor(ph, page, url, 2000, callback);
        });
    });
}

function waitFor(ph, page, url, timeSpan, callback) {
    console.log("Start Waiting For Executing");
    var lastRequestTime = new Date().getTime(), lastResponseTime = new Date().getTime();

    page.onResourceRequested = function(request) {
        lastRequestTime = new Date().getTime();
        console.log('Request ' + JSON.stringify(request, undefined, 4));
    };
    page.onResourceReceived = function(response) {
        lastResponseTime = new Date().getTime();
        console.log('Receive ' + JSON.stringify(response, undefined, 4));
    };

    page.open(url, function (status) {
        if (!status) return ph.exit(1);


        
        while (new Date().getTime() - lastResponseTime <= timeSpan) 
        {
            console.log("waiting for Executing");
        }

        console.log("Time span is over");

        setTimeout(function() {
            page.get('content', function(content) {
                console.log('Get Content');
                callback(null, content);
                ph.exit();
            });
        }, 0);
    });
}

module.exports = {
    render: render
};