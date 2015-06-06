var phantom = require('phantom');
var async = require('async');

var imgs = [];

function render(url, timeout, callback) {
    // phantom.create(function (ph) {
    //     ph.createPage(function (page) {
    //         waitFor(ph, page, url, 2000, callback);
    //     });
    // });
}

function downloadAllImages(url, timeout, callback) {
    console.log('downloadAllImages');
    phantom.create(function (ph) {
        ph.createPage(function (page) {
            page.open(url, function (status) {
                page.evaluate(function () { 
                    return document.images; 
                }, function (result) {
                    var imgs = [];
                    for (var i = 0; i < result.length; i++){
                        if (result[i] && result[i].width && result[i].height) {
                            console.log(result[i].width + " :: " + result[i].height);
                            imgs.push({
                                'src':result[i].src,
                                'height':result[i].height,
                                'width':result[i].width
                            });
                        }  
                    }

                    callback(null, imgs);
                    ph.exit();
                });
            });
        });
    });
}

// function waitFor(ph, page, url, timeSpan, callback) {
//     console.log("Start Waiting For Executing");
//     var lastRequestTime = new Date().getTime(), lastResponseTime = new Date().getTime();
//     var imgs = [];

//     page.onResourceRequested(
//         function(requestData, request, arg1, arg2) { 
//             console.log("start request for url", requestData.url);
//         }
//     );

//     page.open(url, function(status){
//         if (!status) return ph.exit(1);

//         setTimeout(function() {
//             page.get('content', function(content) {
//                 console.log('Get Content');
//                 callback(null, content);
//                 ph.exit();
//             });
//         }, 0);
//     });
// }

module.exports = {
    render: render,
    download: downloadAllImages
};