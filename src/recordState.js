'use strict';

let {
    getDisplayText
} = require('page-text');

/**
 * record state of page
 */
let start = (duration, callback) => {
    let recordState = (duration, callback) => {
        setTimeout(() => {
            if (document.body) {
                let curState = getPageState();

                callback && callback(curState);
                //
                recordState(duration, callback);
            }
        }, duration);
    };

    recordState(duration, callback);
};

let getPageState = () => {
    return {
        type: 'state',
        url: window.location.href,
        cookie: document.cookie,
        pageText: getDisplayText(document.body),
        title: document.title
    };
};

module.exports = {
    start,
    getPageState
};
