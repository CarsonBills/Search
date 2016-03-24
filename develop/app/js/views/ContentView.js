var Config = require('modules/Config'),
    template = require('modules/contentTemplate.hbs'),
    ContentView = (function () {
        'use strict';
        var $el,
            CONTEXT = 'content',

            initialize = function (options) {
                $el = $(options.el);
                render();
            },

            render = function () {
                var context = Config.get(CONTEXT);
                $el.append(template({
                    content: context
                }));
            };

        return {
            initialize: initialize
        };
    }());

module.exports = ContentView;