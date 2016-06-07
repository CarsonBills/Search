var googleHelper = (function () {
    'use strict';
    var deferred = $.Deferred(),

        getGoogleData = function(data){
            console.log("GOOGLE DATA BEGIN", data);
            for (var x = 0; x < data['refinements'].length; x++){
                var google = data['displayName'].replace(/L/g, "").replace(/([A-Z])/g, "$1").toLowerCase().replace(/ies/g, "y");
                data['refinements'][x]['google'] = google 
            }
            console.log("GOOGLE DATA END", data);
            return data
        },

        getGoogleFilterData = function(data){
            for (var x = 0; x < data.length; x++){
                for(var y = 0; y < data[x]['refinements'].length; y++){
                    var google = data[x]['displayName'].replace(/ /g, "_").replace(/([A-Z])/g, "$1").toLowerCase();
                    data[x]['refinements'][y]['google'] = google 
                }
            }
            return data
        }

    return {
        getGoogleData: getGoogleData,
        getGoogleFilterData: getGoogleFilterData,
    };
}());

module.exports = googleHelper;