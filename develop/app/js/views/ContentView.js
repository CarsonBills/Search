var Config = require('modules/Config'),
    searchHelper = require("modules/search_helper"),
    template = require('modules/contentTemplate.hbs'),
    Handlebars = require('handlebars'),
    ContentView = (function () {
        'use strict';
        var $el,
            COUNT = 'totalRecordCount',
            CONTEXT = 'records',

            initialize = function (options) {
                $el = $(options.el);
                render('');
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

            showFiltered = function (target) {
                render(target);
            },

            setRefinements = function(data) {
                refinements = data;
            },

            enlargeImage = function(data){
                for (var e = 0; e < data.length; e++){
                    if(data[e]["allMeta"]["cover_image"]){
                        var url = data[e]['allMeta']['cover_image']
                        if (url.slice(-6, -4) === "72"){
                            url = url.slice(0, -6)+"198.jpg"
                            data[e]['allMeta']['cover_image'] = url;
                        }
                    }
                }
                return data
            },

            gettotalCount = function(context){
                if(context.records.length !== context.totalRecordCount){
                    return context.totalRecordCount;
                } else {
                    return "";
                }
            },

            applyFilters = function (context){
                return context
            },

            render = function (context) {
                if (context === ''){
                    context = Config.get();
                } else if (context === "reset"){
                    context = Config.reset();
                }
                // truncateString(context, [['description', 160],['title', 45]]);
                var breadcrumbs = $el.find(".breadcrumbs").html()
                $el.empty();
                $el.append(template({
                    content: enlargeImage(context.records),
                    totalCount: gettotalCount(context),
                    breadcrumbs: breadcrumbs
                }));
                $el.find(".breadcrumbs").show()
            };

        return {
            initialize: initialize,
            showFiltered: showFiltered,
        };
    }());

module.exports = ContentView;