var searchHelper = require('modules/search_helper'),
    ajaxHelper = (function () {
        'use strict';
        var deferred = $.Deferred(),
            searchQuery = searchHelper.getUrlQuery(),
            load = function (url) {
                $.ajax({
                    dataType: 'json',
                    url: url,
                    method: 'POST',
                    data: {
                        'collection': 'bookSearchProduction',
                        'area': 'bookSearchProductionGBTuning',
                        'disableAutocorrection': true,
                        'query': searchQuery,
                        'fields': ['*'],
                        'pruneRefinements': false,
                        'skip': 0,
                        'matchStrategyName': 'default',
                        'pageSize': 15
                    },
                    success: function (response) {
                        if (response) {
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