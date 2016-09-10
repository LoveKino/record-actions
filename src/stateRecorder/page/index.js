'use strict';

let addPageState = require('./addPageState');

module.exports = () => {
    return {
        startRecording: (recordInfo, recordState, {
            refreshId,
            winId,
            continueWinId
        }) => {
            // TODO using observable
            setInterval(() => {
                addPageState(recordInfo, {
                    moment: 'regular',
                    refreshId,
                    winId,
                    continueWinId
                });

                recordState && recordState();
            }, 50);
        },

        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
        beforeAddAction: (recordInfo, {
            refreshId,
            winId,
            continueWinId
        }) => {
            addPageState(recordInfo, {
                moment: 'beforeRecordAction',
                refreshId,
                winId,
                continueWinId
            });
        },

        stopRecording: (recordInfo, {
            refreshId,
            winId,
            continueWinId
        }) => {
            // save current state
            addPageState(recordInfo, {
                moment: 'closewindow',
                refreshId,
                winId,
                continueWinId
            });
        }
    };
};
