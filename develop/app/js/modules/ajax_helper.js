var searchHelper = require("modules/search_helper"),
    ajaxHelper = (function () {
    'use strict';
    var deferred = $.Deferred(),
        searchQuery = searchHelper.getQuery(),
        load = function (url) {
            $.ajax({
                dataType: 'json',
                url: url,
                method: 'POST',
                data: {
                    'query': searchQuery,
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