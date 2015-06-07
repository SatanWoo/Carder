'use strict';

var renderer = require('./renderer');
var urlUtil = require('url');
var API = require('./API');

function LZX() {

}

LZX.prototype.transform = function(url, source) {

  return new Promise(function(resolve, reject) {
    // step 0: 如果是网店
    if (['item.taobao.com', 'www.amazon.cn', 'detail.tmall.com', 'calmtheham.com'].indexOf(urlUtil.parse(url).host) > -1) {
      let Mapper = require('./mappers/ECommerceMapper');
      let mapper = new Mapper(url, '');
      return mapper.transform().then(resolve);
    }
    // 算法处理
    if (source === 'default') {
      // 算法处理
      API.parseHTML(url, 3000, function(err, message) {
        var result = JSON.parse(message);
        result.type = 'article';
        resolve(result);
      });
      return;
    }
    // step 2.1: fetch and render html
    renderer.render(url, 10000, function(err, html) {
      // step 2.2: 根据url的source
      // 站点mapper处理
      var Mapper = require('./mappers/' + source + 'Mapper');
      var mapper = new Mapper(url, html);
      mapper.transform().then(resolve);
    });
  });
};

module.exports = new LZX();