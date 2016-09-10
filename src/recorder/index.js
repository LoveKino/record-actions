'use strict';

let {
    runSequence
} = require('jsenhance');

let ActionCapturer = require('capture-action');

let addAction = require('./addAction');

let {
    map
} = require('bolzano');

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

                // add action
                addAction(action, recordInfo, {
                    refreshId,
                    playedTime,
                    winId,
                    continueWinId,
                    event
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
