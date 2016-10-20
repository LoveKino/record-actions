'use strict';

let addPageState = require('./addPageState');

module.exports = () => {
    return {
        startRecording: ({
            refreshId,
            winId,
            continueWinId
        }, {
            updateRecordInfo
        }) => {
            // TODO using observable
            setInterval(() => {
                updateRecordInfo((recordInfo) => {
                    addPageState(recordInfo, {
                        moment: 'regular',
                        refreshId,
                        winId,
                        continueWinId
                    });
                    return recordInfo;
                });
            }, 50);
        },

        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
        beforeAddAction: ({
            refreshId,
            winId,
            continueWinId
        }, {
            updateRecordInfo
        }) => {
            updateRecordInfo((recordInfo) => {
                addPageState(recordInfo, {
                    moment: 'beforeRecordAction',
                    refreshId,
                    winId,
                    continueWinId
                });

                return recordInfo;
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
