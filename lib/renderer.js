var phantom = require('phantom');
var async = require('async');

function render(url, timeout, finalCallback) {
    async.waterfall([
        function(callback) {
            phantom.create(function(phantomInstance) {
                callback(null, phantomInstance);
            });
        },

        function(phantomInstance, callback) {
            phantomInstance.createPage(function(page) {
                callback(null, page);
            });
        },

        function(page, callback) {
            page.open(url, function(status) {
                console.log('Status: ' + status);
                var title = page.evaluate(function() {
                  return document.title;
                });

                console.log('Page title is ' + title);
            });
        },
    ]);
}

module.exports = {
    render: render
};