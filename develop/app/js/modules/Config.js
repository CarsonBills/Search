var helper = require('modules/ajax_helper'),
    Config = (function () {
        'use strict';
        var deferred = $.Deferred(),
            Data = {
                // global variables here
                'errorMessage': 'Something went wrong!'
            },

            setup = function (path) {
                helper.load(path).done(function (response) {
                    if (response) {
                        $.extend(Data, response.data);
                        deferred.resolve();
                    }
                });
                return deferred.promise();
            },

            echo = function (prop) {
                console.log(Data[prop]);
            },

            get = function (prop) {
                return Data[prop];
            },

            set = function (prop, value) {
                if (value !== undefined) {
                    Data[prop] = value;
                }
            };

        return {
            get: get,
            set: set,
            echo: echo,
            setup: setup
        };
    }());

module.exports = Config;