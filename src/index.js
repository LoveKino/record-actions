'use strict';

/**
 *
 * information
 *
 *      user action
 *
 *      system response
 */

let ActionCapturer = require('capture-action');

let recordState = require('./recordState');

let RecordStore = require('./recordStore');

let NodeUnique = require('./nodeUique');

let {
    genId
} = require('./util');

module.exports = ({
    winId,
    rootId,
    refreshId,
    passData,
    memory,
    playedTime,
    continueWinId
}) => {
    const pageInfoKey = `${rootId}-pageInfo`;

    // get current page's refreshId
    refreshId = refreshId || genId();

    let nodeUnique = NodeUnique();

    let record = ({
        addAction,
        updateState
    }, actionConfig) => {
        let {
            capture
        } = ActionCapturer(actionConfig);

        let accept = (action, event) => {
            // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
            updateState(recordState.getPageState(), 'beforeRecordAction');
            // node flag
            let id = nodeUnique(event.target);

            action.source.domNodeId = id;

            // add action
            addAction(action);
        };

        capture(accept);

        recordState.start(50, (state) => {
            updateState(state);
        }, 'regular');
    };

    let stop = () => {
        // save current state
        return getStore().then(({
            updateState
        }) => {
            return updateState(recordState.getPageState(), 'closeWindow');
        });
    };

    let getStore = () => RecordStore(memory, pageInfoKey, {
        winId,
        continueWinId,
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
        stop,
        getRecordData
    };
};
