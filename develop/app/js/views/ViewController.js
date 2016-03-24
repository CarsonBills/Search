var ContentView = require('views/ContentView');
    
var ViewController = (function () {
    'use strict';
    var initialize = function () {
        ContentView.initialize({
            el: '.results_content'
        });
    };

    return {
        initialize: initialize
    };

}());

module.exports = ViewController;