'use strict';

let ajaxproxy = require('ajaxproxy');

let messageQueue = require('consume-queue');

let {
    forEach
} = require('bolzano');

let {
    proxyAjax
} = ajaxproxy();

module.exports = () => {
    let {
        produce, consume
    } = messageQueue();

    let rootCache = [];

    let captureCallback = null;

    proxyAjax({
        xhr: {
            proxyOptions: (options) => {
                let {
                    result, data
                } = produce({
                    a: 1
                });

                options.id = data.id;

                if (!captureCallback) {
                    rootCache.push(result);
                } else {
                    captureCallback(result);
                }

                // send point
                return options;
            },

            proxyResponse: (response, options) => {
                consume({
                    id: options.id,
                    data: {
                        options,
                        response
                    }
                });
                return response;
            }
        }
    });

    return (callback) => {
        if (!captureCallback) {
            captureCallback = callback;

            forEach(rootCache, (result) => {
                captureCallback(result);
            });
        } else {
            captureCallback = callback;
        }
    };
};
