var phantom = require('phantom');
var async = require('async');

function render(url, timeout, callback) {
  phantom.create(function (ph) {
    ph.createPage(function (page) {
      page.open(url, function (status) {
        console.log("Opened: ", status);
        setTimeout(function() {
          page.get('content', function(content) {
            callback(null, content);
            ph.exit();
          });
        }, timeout);
      });
    });
  });  
}

module.exports = {
    render: render
};