var Config = require('modules/Config'),
    template = require('modules/contentTemplate.hbs'),
    ContentView = (function () {
        'use strict';
        var $el,
            CONTEXT = 'content',

            initialize = function (options) {
                $el = $(options.el);
                render('');
                initEvents();
            },

            truncateString = function(data, array){
                for (var i = 0; i < array.length; i++){
                    $(data).each(function () {
                        if(this[array[i][0]].length > array[i][1]){
                            //  cuts off string at specified length and finds last space just before the cut.
                            var text = this[array[i][0]].substr(0, this[array[i][0]].substr(0, array[i][1]).lastIndexOf(' ')) + '...';
                            this[array[i][0]] = text;
                        }    
                    });
                }
            },

            initEvents = function () {
                $el.find('img').click(function (e) {
                    var target = $(e.currentTarget);
                    console.log(target.data('id'));
                    return false;
                });
            },

            consoleTest = function (target) {
                render([target.attr('data')]);
            },

            applyFilters = function (context, filters){
                if (filters == ''){
                    return context;
                } else {
                    var filteredResults = [];
                    for (var i = 0; i < filters.length; i++){
                        $(context).each(function(){
                            for (var x = 0; x < this['categories'].length; x++){
                                if (this['categories'][x] === filters[i]){
                                    filteredResults.push(this);
                                }
                            }
                        });
                    }
                    return filteredResults;
                }
            },

            render = function (filters) {
                var context = Config.get(CONTEXT);
                truncateString(context, [['description', 160],['title', 45]]);
                $el.empty();
                $el.append(template({
                    content: applyFilters(context, filters)
                }));
            };

        return {
            initialize: initialize,
            consoleTest: consoleTest
        };
    }());

module.exports = ContentView;