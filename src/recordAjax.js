'use strict';

let ajaxproxy = require('ajaxproxy');

let messageQueue = require('consume-queue');

module.exports = (callback) => {
    let {
        proxyAjax
    } = ajaxproxy();
    let {
        produce, consume
    } = messageQueue();

    proxyAjax({
        xhr: {
            proxyOptions: (options) => {
                let {
                    result, data
                } = produce({
                    a: 1
                });

                options.id = data.id;

                callback(result);

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
};
