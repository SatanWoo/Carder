var BaseMapper = require('./BaseMapper');
var url = require('url');
var util = require('util');
var request = require('request');

function ECommerceMapper () {
  BaseMapper.apply(this, [].slice.call(arguments));
}

util.inherits(ECommerceMapper, BaseMapper);

ECommerceMapper.prototype.transform = function () {
  var that = this;
  return new Promise(function(resolve, reject) {
    var url = encodeURIComponent(that.url);
    var requrl = `https://api.diffbot.com/v3/product?token=testdrivezyrbuzjerkup&url=${url}&format=json&_=1433613975015`;
    console.log(`requesting: ${requrl}`);
    request.get(requrl, function(err, response, body) {
      var bodyObj = JSON.parse(body);
      resolve({
        type: 'ecommerce',
        title: bodyObj.objects[0].title,
        image: bodyObj.objects[0].images.map(function(image) { return image.url }),
        price: bodyObj.objects[0].offerPriceDetails.amount,
        description: bodyObj.objects[0].text,
        priceCurrency: 'RMB'
      });
    });
  });
};


module.exports = ECommerceMapper;