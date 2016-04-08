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
                    window.location.hash = target.context.innerText.replace(/ /g, '%20');
                    $.ajax({
                        url: '//dev2-services.wwnorton.com/search/get_taxonomy.php',
                        success: function(data){
                            data = $.parseJSON(data);
                            for (var i = 0; i < data.length; i ++){
                                if (data[i]['name'] === target.context.innerText) {
                                    populateSubCatgories(data[i]['subnav']);
                                }
                            }
                            $('.breadcrumbs').append('<div class="breadcrumb"><h2>' + target.context.innerText + '</h2></div>').show();
                        }
                    });
                    contentToFilter.consoleTest(target.context.innerText);
                    return false;
                });
            },

            populateSubCatgories = function(subcats){
                var subcategories = [];
                for (var i = 0; i < subcats.length; i++){
                    subcategories.push(subcats[i]['name']);
                }
                $el.empty().append(template({
                    categories: subcategories
                }));
                collapseCategory();
                filterView();
            },

            organizeData = function(data, type){
                var filters = [];
                for (var i = 0; i < data.length; i++){
                    if (data[i][type]) {
                        for (var x = 0; x < data[i][type].length; x++){
                            if (filters.indexOf(data[i][type][x]) === -1){
                                filters.push(data[i][type][x]);
                            }
                        }
                    }
                }
                return filters;
            },

            collapseCategory = function(){
                $el.find('.nav_heading').click(function (e) {
                    // console.log($(e.currentTarget).next('.filters_checkboxes'))
                    $(e.currentTarget).toggleClass('collapsed').next('.filters_checkboxes').slideToggle('fast');
                    // $(e.currentTarget).next('.filters_checkboxes').slideToggle("fast")
                });
            },

            render = function () {
                var context = Config.get(CONTEXT);
                $el.append(template({
                    categories: organizeData(context, 'categories'),
                    formats: organizeData(context, 'formats'),
                    resources: organizeData(context, 'resources'),
                    pub_date: organizeData(context, 'pub_date'),
                    edition_text: organizeData(context, 'edition_text'),
                    volumes: organizeData(context, 'volumes'),
                    contributor_name: organizeData(context, 'contributor_name')
                }));
            };

        return {
            initialize: initialize
        };

    }());

module.exports = NavView;