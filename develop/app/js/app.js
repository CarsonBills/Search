var Config = require('modules/Config'),
    ViewController = require('views/ViewController');
$(function () {
    'use strict';
    Config.setup('//dev2-services.wwnorton.com/search/search.php').done(function () {
        ViewController.initialize();
    });
});