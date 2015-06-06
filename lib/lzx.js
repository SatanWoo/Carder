'use strict';

var renderer = require('./renderer');
var urlUtil = require('url');

function LZX() {

}

LZX.prototype.transform = function(url, source) {

  return new Promise(function(resolve, reject) {
    // step 0: 如果是网店
    if (['item.taobao.com', 'www.amazon.cn', 'detail.tmall.com'].indexOf(urlUtil.parse(url).host) > -1) {
      let Mapper = require('./mappers/ECommerceMapper');
      let mapper = new Mapper(url, '');
      return mapper.transform().then(resolve);
    }
    // step 1: fetch and render html
    renderer.render(url, 10000, function(err, html) {
      // step 2.2: 根据url的source
      if (source === 'default') {
        // 算法处理
        return resolve('default');
      }
      // 站点mapper处理
      var Mapper = require('./mappers/' + source + 'Mapper');
      var mapper = new Mapper(url, html);
      mapper.transform().then(resolve);
    });
  });
};

module.exports = new LZX();