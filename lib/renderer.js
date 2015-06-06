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
        // setTimeout(function() {
        //   console.log(status);
        //   finalCallback(null, page.content);
        // }, timeout);
        
        page.evaluate(function() {

        });
      });
    },
  ]);
}

module.exports = {
  render: render
};