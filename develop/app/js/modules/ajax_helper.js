var ajaxHelper = (function () {
    'use strict';
    var deferred = $.Deferred(),

        load = function (url) {
            $.ajax({
                dataType: 'json',
                url: url,
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