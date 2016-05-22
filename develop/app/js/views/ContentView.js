var Config = require('modules/Config'),
    searchHelper = require("modules/search_helper"),
    template = require('modules/contentTemplate.hbs'),
    ContentView = (function () {
        'use strict';
        var $el,
            CONTEXT = 'records',

            initialize = function (options) {
                $el = $(options.el);
                render('');
                xBreadcrumb();
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
                render(target.records);
                
            },

            xBreadcrumb = function (data){
                $("p.crumb_x").click(function (){
                    render("reset")
                    $('.search_container').trigger("clearBreadcrumbs")
                    $(".breadcrumbs").hide();
                })
            },

            setRefinements = function(data) {
                refinements = data;
            },

            applyFilters = function (context){
                return context
            },

            render = function (context) {
                console.log(context)
                if (context === ''){
                    context = Config.get(CONTEXT);
                } else if (context === "reset"){
                    context = Config.reset();
                }
                // truncateString(context, [['description', 160],['title', 45]]);
                var breadcrumbs = $el.find(".breadcrumbs").html()
                $el.empty();
                $el.append(template({
                    content: context,
                    breadcrumbs: breadcrumbs
                }));
                $el.find(".breadcrumbs").show()
                xBreadcrumb();
            };

        return {
            initialize: initialize,
            showFiltered: showFiltered,
        };
    }());

module.exports = ContentView;