var Handlebars = require('handlebars/runtime');

module.exports = (function() {
    'use strict';
    Handlebars.registerPartial({
        'HBMockupMessage': require('partials/mockup/message.hbs')
    });

})();
