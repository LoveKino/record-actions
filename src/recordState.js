'use strict';

let jsoneq = require('cl-jsoneq');

/**
 * record state of page
 */
module.exports = (duration, callback) => {
    let stateCache = null;

    let recordState = (duration, callback) => {
        setTimeout(() => {
            let curState = getPageState();

            // only when changed happened
            // TODO use diff algo
            if (!jsoneq(curState, stateCache)) {
                callback && callback(curState);
                stateCache = curState;
            }

            //
            recordState(duration, callback);
        }, duration);
    };


    return {
        start: () => recordState(duration, callback),
        getPageState
    };
};

let getPageState = () => {
    return {
        type: 'state',
        url: window.location.href,
        cookie: document.cookie
    };
};
