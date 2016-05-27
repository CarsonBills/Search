var ajaxHelper = (function () {
    'use strict';
    var deferred = $.Deferred(),

        load = function (url) {
            $.ajax({
                dataType: 'json',
                url: url,
                method: 'POST',
                data: {
                    'query': "America",
                    'fields': ['*'],
                    'sort': {
                    'field': 'title',
                    'order': 'Ascending'
                    },
                    'pruneRefinements': false,
                    'skip': 0,
                    'pageSize': 25
                    },
                success: function (response) {
                    if (response) {
                        console.log("FIRST RESPONSE", response)
                        deferred.resolve(response);
                    }
                },
                fail: function () {
                    deferred.reject('failed to load data');
                }
            });
            return deferred.promise();
        };

    return {
        load: load
    };
}());

module.exports = ajaxHelper;