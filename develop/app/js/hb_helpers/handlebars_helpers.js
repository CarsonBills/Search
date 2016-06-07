var Handlebars = require('handlebars/runtime');

module.exports = (function() {
    'use strict';
    Handlebars.registerHelper('HBtrimString', function(str) {
        var theString = str.substring(0,100);
        return new Handlebars.SafeString(theString);
    });
    Handlebars.registerHelper('HBupperCase', function(str) {
        if (str && typeof str === 'string') {
            return str.replace(/\w\S*/g, function(word) {
                return word.charAt(0).toUpperCase() + word.substr(1);
            });
        }
    });
    Handlebars.registerHelper('if_eq', function(a, b, opts) {
        if(a == b)
            return opts.fn(this);
        else
            return opts.inverse(this);
    });  

})();
