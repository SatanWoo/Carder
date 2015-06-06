var BaseMapper = require('./BaseMapper');
var url = require('url');
var util = require('util');

function TudouMapper () {
  BaseMapper.apply(this, [].slice.call(arguments));
}

util.inherits(TudouMapper, BaseMapper);

TudouMapper.prototype.transform = function () {
  var regexp =/\/([a-zA-Z0-9]+)\.html$/;
  var result = regexp.exec(this.url);
  if (!result) return Promise.reject();
  else return Promise.resolve({
    tudouId: result[1]
  });
}


module.exports = TudouMapper;