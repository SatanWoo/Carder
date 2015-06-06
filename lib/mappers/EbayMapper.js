var BaseMapper = require('./BaseMapper');
var jsdom = require('jsdom');
var util = require('util');

function EbayMapper () {
  BaseMapper.apply(this, [].slice.call(arguments));
}

util.inherits(EbayMapper, BaseMapper);

EbayMapper.prototype.transform = function () {
  var that = this;
  return new Promise(function(resolve, reject) {
    jsdom.env(that.html, 
      ['http://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js'], 
      function(err, window) {
        var $ = window.$;
        var image = $('[itemprop=image]').attr('src');
        resolve({
          image: image,
          type: 'ebay'
        });
      });
  });
}


module.exports = EbayMapper;