'use strict';

let ActionCapturer = require('capture-action');

let NodeUnique = require('./nodeUique');

let nodeUnique = NodeUnique();

let completeActionInfo = (action, {
    winId,
    continueWinId,
    refreshId,
    event
}) => {
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
 * @param opts
 * @param callbacks
 */
module.exports = (actionConfig, {
    refreshId,
    playedTime,
    winId,
    continueWinId
}, {
    receiveAction,
    startRecording,
    beforeAddAction
}) => {
    startRecording({
        refreshId,
        playedTime,
        winId,
        continueWinId
    });

    let {
        capture
    } = ActionCapturer(actionConfig);

    let accept = (action, event) => {
        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
        beforeAddAction({
            refreshId,
            playedTime,
            winId,
            continueWinId
        });

        // compelete action info
        completeActionInfo(action, {
            winId,
            continueWinId,
            refreshId,
            event
        });

        // add action
        receiveAction(action);
    };

    capture(accept);
};
