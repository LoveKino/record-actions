'use strict';

/**
 *
 * information
 *
 *      user action
 *
 *      system response
 */
let record = require('./record');

let idgener = require('idgener');

let stateRecorder = require('./stateRecorder');

let {
    runSequence
} = require('jsenhance');

let {
    map
} = require('bolzano');

let Store = require('./store');

module.exports = () => {
    let plugins = stateRecorder();

    return ({
        winId,
        rootId,
        refreshId,
        passData,
        memory,
        playedTime,
        continueWinId
    }) => {
        const pageInfoKey = `${rootId}-pageInfo`;

        let {
            clearRecordData,
            getRecordData,
            updateRecordInfo,
            receiveAction,
            receiveState
        } = Store(memory, {
            pageInfoKey, playedTime
        });

        // get current page's refreshId
        refreshId = refreshId || idgener();

        let store = {
            updateRecordInfo,
            receiveState
        };

        let start = () => {
            return record(passData.config.action, {
                refreshId,
                playedTime,
                winId,
                continueWinId
            }, {
                startRecording: (opts) => {
                    return runSequence(map(plugins, (plugin) => plugin.startRecording), [
                        opts, store
                    ]);
                },

                beforeAddAction: (opts) => {
                    return runSequence(map(plugins, (plugin) => plugin.beforeAddAction), [
                        opts, store
                    ]);
                },

                receiveAction
            });
        };

        return {
            clearRecordData,
            getRecordData,
            start,
            stop: () => {
                let opts = {
                    refreshId,
                    winId,
                    continueWinId
                };
                return runSequence(map(plugins, (plugin) => plugin.stopRecording), [opts, store]);
            }
        };
    };
};
