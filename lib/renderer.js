var phantom = require('phantom');
var async   = require('async');
var cp      = require('child_process');

var imgs = [];

function downloadAllImages(url, timeout, callback) {
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open(url, function (status) {
                page.evaluate(function () { 
                    return document.querySelectorAll('img'); 
                }, function (result) {
                    var imgs = [];
                    for (var i = 0; i < result.length; i++){
                        if (result[i] && result[i].width && result[i].height) {
                            imgs.push({
                                'src':result[i].src,
                                'height':result[i].height,
                                'width':result[i].width
                            });
                        }  
                    }

                    //callback(null, imgs);
                    ph.exit();
                });
            });
        });
    });
}

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
    download: downloadAllImages,
    render: render
};