'use strict';

/**
 *
 * information
 *
 *      user action
 *
 *      system response
 */

let ActionCapturer = require('./actionCapturer');

// let recordState = require('./recordState');

let RecordStore = require('./recordStore');

let {
    genId
} = require('./util');

module.exports = ({
    winId,
    rootId,
    refreshId,
    passData,
    memory,
    playedTime
}) => {
    const pageInfoKey = `${rootId}-pageInfo`;

    refreshId = refreshId || genId();

    let record = ({
        addAction
    }, actionConfig) => {
        let {
            capture
        } = ActionCapturer(actionConfig);

        let accept = (action) => {
            // add action
            addAction(action);
            // record state
            // TODO last state problem
            // historyInfo.actions.push(recordState());
        };

        capture(accept);
    };

    let getStore = () => RecordStore(memory, pageInfoKey, {
        winId,
        playedTime,
        refreshId
    });

    let getRecordData = () => {
        // get history
        return getStore().then((store) => {
            return store.getRecordData();
        });
    };

    let start = () => getStore().then((store) => record(store, passData.config.action));

    return {
        start,
        getRecordData
    };
};
