var express = require('express');
var router = express.Router();
var renderer = require('../lib/renderer');
var lzx = require('../lib/lzx');

router.get('/iframe', function(req, res) {
  var url = req.query.url;
  var source = req.query.source || 'default';
  if (!url) return res.send('no url specified');

  lzx.transform(url, source).
    then(function(data) {
      console.log('data: ' + JSON.stringify(data));
      res.render('iframe', {
        query: req.query,
        data: data
      });
    });
});

router.get('/render', function(req, res) {
  var url = req.query.url;
  var timeout = req.query.timeout || 3000;
  if (!url) return res.json({error: 'no url specified'});
  
  renderer.render(url, timeout, function(err, html) {
    return res.json({html: html});
  });
});

module.exports = router;
