var searchHelper = (function () {
    'use strict';
    var getSort = function(){
            if ($('select.sort_select').children(':selected').attr('value')){
                return $('select.sort_select').children(':selected').attr('sortvalue').split('-');
            } else {
                return '';              
            }           
        },

        moreRecordsSkip = function(calls){
            var size = parseInt($('.current_results').text());
            if (calls === 1) {
                return 0;
            } else {
                return size;
            }
        },

        recordsSkip = function(calls){
            var size = parseInt($('.current_results').text());
            if (calls === 1) {
                return 0;
            } else if (size < 100){
                return size;
            } else {
                return 0;
            }
        },

        recordsPageSize = function(calls){
            // meant to increase page size
            var size = parseInt($('.current_results').text());
            if (calls === 1 && (size + 15) < 100){
                return size + 15;
            } else {
                return 15;
            }
        },

        sortRecordsSkip = function(totalcalls, callsleft){
            if (totalcalls === 1) {
                return 0;
            } else {
                return (totalcalls - callsleft)*90;
            }
        },

        sortRecordsPageSize = function(calls){
            // Sort does not increase page size 
            var size = parseInt($('.current_results').text());
            if (calls === 1 && size < 100){
                return size;
            } else if (calls > 1) {
                return 90;
            } else {
                return 15;
            }
        },

        sortCallbackPageSize = function(totalcalls, callsleft){
            var pagesize = parseInt($('.current_results').text());
            if (callsleft > 1){
                return 90;
            } else {
                return pagesize - ((totalcalls - callsleft) * 90);
                // return pagesize - (totalcalls * 100)
            }
        },

        getUrlQuery = function(){
            if (window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[0] === 'searchtext'){
                return window.location.href.slice(window.location.href.indexOf('?') + 1).split('=')[1].replace(/\+/g, ' ');
            }
        },

        getSearchBarQuery = function(){
            return $('input#ctl00_searchtext').val().replace(/ /g, '+');
        },

        getValue = function(data){
            if (data.find('h2').text() === 'Reading Guides'){
                return 1;
            } else {
                return data.find('h2').text();
            }
        },

        domRefinements = function(e){
            var refinements = $('.breadcrumb');
            // If clicked Reading Guides!!
            if (e && $(e.currentTarget).parents('.resources').length && $(e.currentTarget).parent().find('input.filter-checkbox').prop('checked') ){
                var newRefinements = JSON.stringify({
                    'type': 'Value',
                    'navigationName': $(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text(),
                    'value': '1'
                });

            // if click is a nav refinement not a breadcrumb ADDS TO REFINEMENTS
            } else if (e && $(e.currentTarget).closest('.filter_group').hasClass('filters') && $(e.currentTarget).parent().find('input.filter-checkbox').length && !$(e.currentTarget).parent().find('input.filter-checkbox').prop('checked')){
                for (var b = 0; b < refinements.length; b++){
                    if ($(refinements[b]).find('h2').text() === $(e.currentTarget).text()){
                        refinements.splice(b, 1);
                    }
                }
            } else if (e && $(e.currentTarget).closest('.filter_group').hasClass('resources') && $(e.currentTarget).parent().find('input.filter-checkbox').length && !$(e.currentTarget).parent().find('input.filter-checkbox').prop('checked')){
                for (var m = 0; m < refinements.length; m++){
                    if ($(refinements[m]).find('h2').text() === $(e.currentTarget).text()){
                        refinements.splice(m, 1);
                    }
                }
            } else if (e && $(e.currentTarget).parent('.breadcrumb').length === 0 && !$(e.currentTarget).hasClass('show_more') && !$(e.currentTarget).hasClass('nav_show_more')){
                var newRefinements = JSON.stringify({
                    'type': 'Value',
                    'navigationName': $(e.currentTarget).closest('.filters_checkboxes').siblings('.category_level').text(),
                    'value': $(e.currentTarget).text()
                });
            } else {
                // No NEW Refinements
                var newRefinements = '';
            }
            // If Breadcrumbs exist, format them into refinments
            if (refinements.length !== 0){
                var fromDom = [];
                for (var x = 0; x < refinements.length; x++){
                    fromDom += JSON.stringify({
                        'type': 'Value',
                        'navigationName': $(refinements[x]).attr('name'),
                        'value': getValue($(refinements[x]))
                    }) +',';
                }
                // refinements = JSON.stringify(refinements);
                if (newRefinements) {
                    refinements = '[' + fromDom + newRefinements + ']';
                } else {
                    refinements = '[' + fromDom.slice(0,-1) + ']';
                }
            } else {
                refinements = '['+ newRefinements + ']';
            }
            if (refinements === '[]' || refinements === '[undefined]'){
                // do nothing
            } else {
                return refinements;
            }
        };

    return {
        domRefinements: domRefinements,
        getUrlQuery: getUrlQuery,
        getSearchBarQuery: getSearchBarQuery,
        getSort: getSort,
        recordsSkip: recordsSkip,
        moreRecordsSkip: moreRecordsSkip,
        recordsPageSize: recordsPageSize,
        sortRecordsPageSize: sortRecordsPageSize,
        sortRecordsSkip: sortRecordsSkip,
        sortCallbackPageSize: sortCallbackPageSize

    };
}());

module.exports = searchHelper;