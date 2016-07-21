var Config = require('modules/Config'),
    Handlebars = require('handlebars'),
    ViewController = require('views/ViewController'),
    hb_helpers = require('hb_helpers/handlebars_helpers'),
    hb_partials = require('hb_helpers/handlebars_partials');
$(function () {
    'use strict';
    Config.setup('//stg-services.wwnorton.com/search/search.php').done(function () {
        ViewController.initialize();
    });
});