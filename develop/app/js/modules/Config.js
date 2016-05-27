/*eslint no-console: [2, { allow: ["log", "error"] }] */

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

            reset = function () {
                return Data
            },

            echo = function (prop) {
                console.log(Data[prop]);
            },

            get = function (prop) {
                if (prop){
                    return Data[prop];
                } else {
                    return Data
                }
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
            reset: reset,
            setup: setup
        };
    }());

module.exports = Config;