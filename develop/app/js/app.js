var Config = require('modules/Config'),
    ViewController = require('views/ViewController');

$(function () {
    'use strict';
    Config.setup('../json/config.json').done(function () {
        ViewController.initialize();
    });
});