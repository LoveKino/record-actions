'use strict';

/**
 * record state of page
 */
let start = (duration, callback) => {
    let recordState = (duration, callback) => {
        setTimeout(() => {
            let curState = getPageState();

            callback && callback(curState);
            //
            recordState(duration, callback);
        }, duration);
    };

    recordState(duration, callback);
};

let getPageState = () => {
    return {
        type: 'state',
        url: window.location.href,
        cookie: document.cookie
    };
};

module.exports = {
    start,
    getPageState
};
