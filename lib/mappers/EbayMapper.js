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
        var title = $('#itemTitle').text().replace(/^Details about/g, '').trim();
        var image = $('[itemprop=image]').attr('src');
        var price = $('[itemprop=price]').text().trim();
        var priceCurrency = $(['[itemprop=priceCurrency]']).attr('content');
        resolve({
          image: [image],
          price: price,
          title: title,
          type: 'ebay',
          priceCurrency: priceCurrency
        });
      });
  });
}


module.exports = EbayMapper;