var express = require('express');
var router = express.Router();
var renderer = require('../lib/renderer');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/render', function(req, res) {
  var url = req.query.url;
  console.log('url is ' + url);
  var timeout = req.query.timeout || 3000;
  if (!url) {
    return res.json({error: 'no url specified'});
  }
  
  renderer.render(url, timeout, function(err, html) {
    console.log(html);
    return res.json({html: html});
  });
});

module.exports = router;
