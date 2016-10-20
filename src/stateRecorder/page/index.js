'use strict';

let getPageState = require('./getPageState');

module.exports = () => {
    return {
        startRecording: ({
            refreshId,
            winId,
            continueWinId
        }, {
            receiveState
        }) => {
            // TODO using observable
            setInterval(() => {
                receiveState({
                    state: getPageState(),
                    moment: 'regular',
                    refreshId,
                    winId,
                    continueWinId
                });
            }, 100);
        },

        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
        beforeAddAction: ({
            refreshId,
            winId,
            continueWinId
        }, {
            receiveState
        }) => {
            return receiveState({
                state: getPageState(),
                moment: 'beforeRecordAction',
                refreshId,
                winId,
                continueWinId
            });
        },

        stopRecording: ({
            refreshId,
            winId,
            continueWinId
        }, {
            receiveState
        }) => {
            return receiveState({
                state: getPageState(),
                moment: 'closewindow',
                refreshId,
                winId,
                continueWinId
            });
        }
    };
};
