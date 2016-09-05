'use strict';

let ajaxproxy = require('ajaxproxy');

let messageQueue = require('consume-queue');

let {
    forEach
} = require('bolzano');

let captureCallback = null;

let {
    proxyAjax
} = ajaxproxy();

let {
    produce, consume
} = messageQueue();

let rootCache = [];

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


module.exports = (callback) => {
    if (!captureCallback) {
        captureCallback = callback;

        forEach(rootCache, (result) => {
            captureCallback(result);
        });
    } else {
        captureCallback = callback;
    }
};
