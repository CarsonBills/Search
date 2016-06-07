var searchHelper = (function () {
    'use strict';
    var deferred = $.Deferred(),
        getSort = function(){
            if ($("select.sort_select").children(":selected").attr('value')){
                return $("select.sort_select").children(":selected").attr('value').split('-');
            } else {
                return ""                
            }           
        },

        getUrlQuery = function(){
            return window.location.href.slice(window.location.href.indexOf('?') + 1).split("=")[1]
        },

        getSearchBarQuery = function(){
            return $('input#ctl00_searchtext').val().replace(/ /g, '+');
        },

        domRefinements = function(e){
            var refinements = $('.breadcrumb')
            // If clicked Reading Guides!!
            if (e && $(e.currentTarget).parents('.resources').length){
                var newRefinements = JSON.stringify({
                    'type': 'Value',
                    'navigationName': $(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text(),
                    'value': '1'
                })
            // if click is a nav refinement not a breadcrumb ADDS TO REFINEMENTS
            }else if (e && $(e.currentTarget).parent(".breadcrumb").length === 0 && !$(e.currentTarget).hasClass('show_more') && !$(e.currentTarget).hasClass('nav_show_more')){
                var newRefinements = JSON.stringify({
                    'type': 'Value',
                    'navigationName': $(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text(),
                    'value': $(e.currentTarget).text()
                })
            } else {
                // No NEW Refinements
                var newRefinements = "" 
            }
            // If Breadcrumbs exist, format them into refinments
            if (refinements.length !== 0){
                var fromDom = []
                for (var x = 0; x < refinements.length; x++){
                    fromDom += JSON.stringify({
                        'type': 'Value',
                        'navigationName': $(refinements[x]).attr('name'),
                        'value': $(refinements[x]).find("h2").text()
                    }) +",";
                }
                // refinements = JSON.stringify(refinements);
                if (newRefinements) {
                    refinements = '[' + fromDom + newRefinements + ']'
                } else {
                    refinements = '[' + fromDom.slice(0,-1) + ']'
                }
            } else {
                refinements = '['+ newRefinements + ']';
            }
            if (refinements === '[]'){
            } else {
                return refinements
            }
        }

    return {
        domRefinements: domRefinements,
        getUrlQuery: getUrlQuery,
        getSearchBarQuery: getSearchBarQuery,
        getSort: getSort,
    };
}());

module.exports = searchHelper;