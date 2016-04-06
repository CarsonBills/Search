var Config = require('modules/Config'),
    contentToFilter = require('views/ContentView.js'),
    template = require('modules/navTemplate.hbs'),
    NavView = (function () {
        'use strict';
        var $el,
            CONTEXT = 'content',

            initialize = function (options) {
                $el = $(options.el);
                render();
                collapseCategory();
                filterView();
            },

            filterView = function(){
                $el.find('h3').click(function (e) {
                    var target = $(e.currentTarget);
                    console.log($(target).html())
                    contentToFilter.consoleTest($(target.html()));
                    return false;
                });
            },

            organizeData = function(data, type){
                var filters = [];
                for (var i = 0; i < data.length; i++){
                    for (var x = 0; x < data[i][type].length; x++){
                        if (filters.indexOf(data[i][type][x]) === -1){
                            filters.push(data[i][type][x]);
                        }
                    }
                }
                return filters;
            },

            collapseCategory = function(){
                $el.find(".nav_heading").click(function (e) {
                    // console.log($(e.currentTarget).next('.filters_checkboxes'))
                    $(e.currentTarget).toggleClass("collapsed").next('.filters_checkboxes').slideToggle("fast");
                    // $(e.currentTarget).next('.filters_checkboxes').slideToggle("fast")
                })
            },

            render = function () {
                var context = Config.get(CONTEXT);
                $el.append(template({
                    categories: organizeData(context, 'categories'),
                    formats: organizeData(context, 'formats')
                }));
            };

        return {
            initialize: initialize
        };

    }());

module.exports = NavView;