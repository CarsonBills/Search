var googleHelper = (function () {
    'use strict';


    var getGoogleData = function(data){
            if (data.length !== 0){
                for (var x = 0; x < data['refinements'].length; x++){
                    var google = data['displayName'].replace(/L/g, '').replace(/([A-Z])/g, '$1').toLowerCase().replace(/ies/g, 'y');
                    data['refinements'][x]['google'] = google;
                }
            }
            return data;
                
        },

        getGoogleFilterData = function(data){
            for (var x = 0; x < data.length; x++){
                for(var y = 0; y < data[x]['refinements'].length; y++){
                    var google = data[x]['displayName'].replace(/ /g, '_').replace(/([A-Z])/g, '$1').toLowerCase();
                    data[x]['refinements'][y]['google'] = google;
                }
            }
            return data;
        },

        getGoogleResourceData = function(data){
            for (var x = 0; x < data.length; x++){
                if (data[x]['metadata'][0]['value'] === 'Resources'){
                    for(var y = 0; y < data[x]['refinements'].length; y++){
                        var google = data[x]['metadata'][0]['value'].toLowerCase();
                        data[x]['refinements'][y]['google'] = google;
                        data[x]['refinements'][y]['value'] = data[x]['displayName'];
                    }
                }
            }
            return data;
        };

    return {
        getGoogleData: getGoogleData,
        getGoogleFilterData: getGoogleFilterData,
        getGoogleResourceData: getGoogleResourceData
    };
}());

module.exports = googleHelper;