var searchHelper = (function () {
    'use strict';
    var deferred = $.Deferred(),

        getRefinements = function (data, e) {
            console.log("QWERTY", data)
            var refinements = [];
                if (data) {
                    for (var j = 0; j < data.length; j++){
                        refinements += JSON.stringify({
                            'type':'Value',
                            'navigationName': data[j].name,
                            'value': data[j].refinements[0].value
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
                console.log("BLORP", refinements)
                return refinements
        }

    return {
        getRefinements: getRefinements,
    };
}());

module.exports = searchHelper;