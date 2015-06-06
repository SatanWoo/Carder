function BaseMapper (url, html) {
  this.url = url;
  this.html = html;
}

BaseMapper.prototype.transform = function () {
  throw new Error('transform not implemented');
};

module.exports = BaseMapper;