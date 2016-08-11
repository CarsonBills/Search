var Config = require('modules/Config'),
    template = require('modules/contentTemplate.hbs'),
    Handlebars = require('handlebars'),
    ContentView = (function () {
        'use strict';
        var $el,

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

            enlargeImage = function(data){
                for (var e = 0; e < data['records'].length; e++){
                    if(data['records'][e]['allMeta']['cover_image']){
                        var url = data['records'][e]['allMeta']['cover_image'];
                        if (url.slice(-20).split('_')[1] === '72.jpg'){
                            data['records'][e]['allMeta']['cover_image'] = url.slice(0, -6)+'198.jpg';
                        } else if (url.slice(-20).split('_')[1] === '72.jpeg'){
                            data['records'][e]['allMeta']['cover_image'] = url.slice(0, -7)+'198.jpeg';
                        }
                    }
                }
                return data;
            },

            scrapePrice = function(data){
                for (var q = 0; q < data['records'].length; q++){
                    if (data['records'][q]['allMeta']['lowest_price']  && data['records'][q]['allMeta']['lowest_price'].includes(' ')) {
                        data['records'][q]['allMeta']['lowest_price'] = data['records'][q]['allMeta']['lowest_price'].split(' ')[1]; 
                    }
                    if (!data['records'][q]['allMeta']['lowest_price'].includes('.')){
                        data['records'][q]['allMeta']['lowest_price'] = data['records'][q]['allMeta']['lowest_price']+'.00';
                    }
                }
                return data;
            },

            processResults = function(data){
                var formattedData = scrapePrice(enlargeImage(data));
                return formattedData;
            },

            gettotalCount = function(context){
                if(context.records.length !== context.totalRecordCount){
                    return context.totalRecordCount;
                } else {
                    return '';
                }
            },

            render = function (context) {
                if (context === ''){
                    context = Config.get();
                } else if (context === 'reset'){
                    context = Config.reset();
                }
                // truncateString(context, [['description', 160],['title', 45]]);
                var breadcrumbs = $el.find('.breadcrumbs').html();
                $el.empty();
                $el.append(template({
                    content: processResults(context),
                    totalCount: gettotalCount(context),
                    breadcrumbs: breadcrumbs
                }));
                $el.find('.breadcrumbs').show();
            };

        return {
            initialize: initialize,
            showFiltered: showFiltered
        };
    }());

module.exports = ContentView;