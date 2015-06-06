var phantom = require('phantom');
var async = require('async');

function render(url, timeout, callback) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open(url, function (status) {
                console.log("opened: ", status);
                if (status) {
                    setTimeout(function() {
                        page.get('content', function(content) {
                            callback(null, content);
                            ph.exit();
                        });
                    }, timeout);
                } else {
                    ph.exit(1);
                }
            });
        });

    });
}

module.exports = {
    render: render
};