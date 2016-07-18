'use strict';

/**
 * capture event
 *
 * opts = {
 *      onlyUserAction: true
 * }
 */
module.exports = (eventList, callback, opts = {}) => {
    // TODO window close event
    let captureUIAction = (document) => {
        // dom event
        eventList.forEach((item) => {
            document.addEventListener(item, (e) => {
                if (opts.onlyUserAction) {
                    if (e.isTrusted) {
                        callback && callback(e);
                    }
                } else {
                    callback && callback(e);
                }
            }, true); // capture model
        });
    };

    captureUIAction(window.document);
};
