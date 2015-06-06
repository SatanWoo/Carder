var express = require('express');
var router = express.Router();
var renderer = require('../lib/renderer');

router.get('/iframe', function(req, res) {
  res.render('iframe');
});

router.get('/render', function(req, res) {
  var url = req.query.url;
  console.log('url is ' + url);
  var timeout = req.query.timeout || 3000;
  if (!url) {
    return res.json({error: 'no url specified'});
  }
  
  renderer.render(url, timeout, function(err, html) {
    return res.json({html: html});
  });
});

module.exports = router;
