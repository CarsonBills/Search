var searchHelper = (function () {
    'use strict';
    var deferred = $.Deferred(),

        getRefinements = function (data, e) {
            var refinements = [];
            if(data){
                if (typeof data === "string"){
                    data = JSON.parse(data);
                }
                if ($(e.currentTarget).text() === "SHOW MORE"){
                    for (var j = 0; j < data.length; j++){
                        refinements += JSON.stringify({
                            'type':'Value',
                            'navigationName': data[j]['name'],
                            'value': data[j].refinements[0].value
                        })+",";  
                    }   
                    refinements = '['+ refinements.slice(0, -1) + ']';
                } else if ($(e.currentTarget).parent().hasClass("breadcrumb")) {
                    for (var j = 0; j < data.length; j++){
                        refinements += JSON.stringify({
                            'type':'Value',
                            'navigationName': data[j]['navigationName'],
                            'value': data[j]['value']
                        })+",";  
                    }   
                    refinements = '['+ refinements.slice(0, -1) + ']';
                    
                } else {

                    for (var j = 0; j < data.length; j++){
                        if (data[j].refinements){
                            refinements += JSON.stringify({
                                'type':'Value',
                                'navigationName': data[j].name,
                                'value': data[j].refinements[0].value
                            })+","; 
                        } else {
                            refinements += JSON.stringify({
                                'type':'Value',
                                'navigationName': data[j].navigationName,
                                'value': data[j].value
                            })+",";  
                        }
                    }
                    var newRefinements = JSON.stringify({
                        'type': 'Value',
                        'navigationName': $(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text(),
                        'value': $(e.currentTarget).text()
                    })
                    if (refinements.length !== 0){
                        // refinements = JSON.stringify(refinements);
                        refinements = '[' + refinements + newRefinements + ']'
                    } else {
                        
                        refinements = '['+ newRefinements + ']';
                    }
                }
            } else {
                var newRefinements = JSON.stringify({
                    'type': 'Value',
                    'navigationName': $(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text(),
                    'value': $(e.currentTarget).text()
                })
                if (refinements.length !== 0){
                    // refinements = JSON.stringify(refinements);
                    refinements = '[' + refinements + newRefinements + ']'
                } else {
                    
                    refinements = '['+ newRefinements + ']';
                }
            }
            return refinements
        },

        getQuery = function(){
            return window.location.href.slice(window.location.href.indexOf('?') + 1).split("=")[1]
        },

        domRefinements = function(e){
console.log("CLICK EVENT", e)
            var refinements = $('.breadcrumb')
            if ($(e.currentTarget).parent(".breadcrumb").length === 0){
                var newRefinements = JSON.stringify({
                    'type': 'Value',
                    'navigationName': $(e.currentTarget).closest(".filters_checkboxes").siblings(".category_level").text(),
                    'value': $(e.currentTarget).text()
                })
            } else {
                // No New Refinements 
            }
            if (refinements.length !== 0){
                var fromDom = []
                for (var x = 0; x < refinements.length; x++){
                    fromDom += JSON.stringify({
                        'type': 'Value',
                        'navigationName': $(refinements[x]).attr('name'),
                        'value': $(refinements[x]).find("h2").text()
                    }) +",";
                    console.log("WEEWAHH", $(refinements[x]).attr('name'))

                }
                // refinements = JSON.stringify(refinements);
                if (newRefinements) {
                    refinements = '[' + fromDom + newRefinements + ']'
                } else {
                    refinements = '[' + fromDom.slice(0,-1) + ']'
                }
                console.log(refinements)
            } else {
                refinements = '['+ newRefinements + ']';
            }

            return refinements
        }

    return {
        getRefinements: getRefinements,
        domRefinements: domRefinements,
        getQuery: getQuery,
    };
}());

module.exports = searchHelper;