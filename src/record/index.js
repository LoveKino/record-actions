'use strict';

let ActionCapturer = require('capture-action');

let NodeUnique = require('./nodeUique');

let nodeUnique = NodeUnique();

let completeActionInfo = (action, {
    winId,
    continueWinId,
    refreshId
}, event) => {
    // node flag
    let id = nodeUnique(event.target);
    action.source.domNodeId = id;

    winId = continueWinId || winId;
    // type
    action.type = 'action';

    // tag refreshId
    action.refreshId = refreshId;

    // tag winId
    action.winId = winId;
};

/**
 * @param actionConfig
 * @param options
 * @param callbacks
 */
module.exports = (actionConfig, options, {
    receiveAction,
    startRecording,
    beforeAddAction
}) => {
    startRecording();

    let {
        capture
    } = ActionCapturer(actionConfig);

    let accept = (action, event) => {
        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
        return beforeAddAction().then(() => {
            // compelete action info
            completeActionInfo(action, options, event);

            // add action
            return receiveAction(action);
        });
    };

    capture(accept);
};
