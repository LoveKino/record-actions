'use strict';

let {
    runSequence
} = require('jsenhance');

let ActionCapturer = require('capture-action');

let addAction = require('./addAction');

let {
    map
} = require('bolzano');

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

module.exports = (plugins, recordInfoStore, {
    refreshId,
    playedTime,
    winId,
    continueWinId
}) => {
    let record = (actionConfig) => {
        return recordInfoStore.get().then((recordInfo) => {
            let recordState = () => recordInfoStore.set(recordInfo);

            runSequence(map(plugins, (plugin) => plugin.startRecording), [
                recordInfo, recordState, {
                    refreshId,
                    playedTime,
                    winId,
                    continueWinId
                }
            ]);

            let {
                capture
            } = ActionCapturer(actionConfig);

            let accept = (action, event) => {
                // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
                runSequence(map(plugins, (plugin) => plugin.beforeAddAction), [recordInfo, {
                    refreshId,
                    playedTime,
                    winId,
                    continueWinId
                }]);

                // compelete action info
                completeActionInfo(action, {
                    winId,
                    continueWinId,
                    refreshId,
                    event
                });

                // add action
                addAction(action, recordInfo, {
                    playedTime
                });

                // save
                recordInfoStore.set(recordInfo);
            };

            capture(accept);
        });
    };

    let stop = () => {
        return recordInfoStore.get().then((recordInfo) => {
            runSequence(map(plugins, (plugin) => plugin.stopRecording), [
                recordInfo, {
                    refreshId,
                    winId,
                    continueWinId
                }
            ]);
            return recordInfoStore.set(recordInfo);
        });
    };

    return {
        record,
        stop
    };
};
