var Datastore = require('nedb'),
  path = require('path'),
  crypto = require('crypto'),
  cacheStore = new Datastore({ filename: path.resolve(__dirname, 'data', 'cache.db') });

cacheStore.loadDatabase(function(err) {
  if (err) throw err;
  else console.log('Database OK');
});

function _makeKey (url, source) {
  var hash = crypto.createHash('md5').
    update(url + source).
    digest('hex');
  return hash;
}

function find(url, source, callback) {
  var key = _makeKey(url, source);
  cacheStore.findOne({ key: key }, callback);
}

function insert(url, source, data, callback) {
  var key = _makeKey(url, source);
  cacheStore.insert({
    key: key,
    data: data
  }, callback);
}

module.exports = {
  find: find,
  insert: insert
};