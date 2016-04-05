var ContentView = require('views/ContentView');
var NavView = require('views/NavView');
    
var ViewController = (function () {
    'use strict';
    var initialize = function () {
        ContentView.initialize({
            el: '.results_content'
        });
        NavView.initialize({
            el: '.filters_nav'
        });
    };

    return {
        initialize: initialize
    };

}());

module.exports = ViewController;