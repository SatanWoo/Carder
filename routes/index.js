var express = require('express');
var router = express.Router();
var API = require('../lib/API');
var lzx = require('../lib/lzx');

router.get('/', function(res, res) {
  return res.render('index');
});

router.get('/iframe', function(req, res) {
    var url = req.query.url;
    var source = req.query.source || 'default';
    if (!url) return res.send('no url specified');

    lzx.transform(url, source).
        then(function(data) {
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
    
    API.parseHTML(url, timeout, function(err, html) {
        return res.json({html: html});
    });
});

router.get('/overlay', function(req, res) {
    res.render('overlay', {
        'images':[
            'http://ww1.sinaimg.cn/bmiddle/6ecbbfd0jw1estmaewqtpj20p018gtd4.jpg'
        ],
        'url':'https://github.com/ariya/phantomjs',
        'title':'Scriptable Headless WebKit',
        'paragraph':'Headless web testing. Lightning-fast testing without the browser is now possible! Screenshot service to a vector chart rasterizer.Network monitoring. Automate performance analysis, track page loading and export as standard HAR format.'
    });
});

router.get('/common', function(req, res) {
    res.render('common',{
    'images':[
      'http://ww1.sinaimg.cn/bmiddle/6ecbbfd0jw1estmaewqtpj20p018gtd4.jpg',
      'http://ww4.sinaimg.cn/bmiddle/6ecbbfd0jw1estmaflfmyj20p018gjws.jpg'
    ],
    'url':'https://github.com/ariya/phantomjs',
    'title':'Scriptable Headless WebKit',
    'paragraph':'Headless web testing. Lightning-fast testing without the browser is now possible! Various test frameworks such as Jasmine, Capybara, QUnit, Mocha, WebDriver, YUI Test, BusterJS, FuncUnit, Robot Framework, and many others are supported.Page automation. Access and manipulate web pages with the standard DOM API, or with usual libraries like jQuery.Screen capture. Programmatically capture web contents, including CSS, SVG and Canvas. Build server-side web graphics apps, from a screenshot service to a vector chart rasterizer.Network monitoring. Automate performance analysis, track page loading and export as standard HAR format.'
    });
});

router.get('/product', function(req, res) {
    res.render('product1',{
    'images':[
      'http://ww1.sinaimg.cn/bmiddle/6ecbbfd0jw1estmaewqtpj20p018gtd4.jpg',
      'http://ww4.sinaimg.cn/bmiddle/6ecbbfd0jw1estmaflfmyj20p018gjws.jpg'
    ],
    'url':'https://github.com/ariya/phantomjs',
    'title':'Scriptable Headless WebKit',
    'detail':'Headless web testing. Lightning-fast testing without the browser is now possible! Various test frameworks such as Jasmine, Capybara, QUnit, Mocha, WebDriver, YUI Test, BusterJS, FuncUnit, Robot Framework, and many others are supported.Page automation. Access and manipulate web pages with the standard DOM API, or with usual libraries like jQuery.Screen capture. Programmatically capture web contents, including CSS, SVG and Canvas. Build server-side web graphics apps, from a screenshot service to a vector chart rasterizer.Network monitoring. Automate performance analysis, track page loading and export as standard HAR format.',
    'price':'$12'
    });
});

module.exports = router;