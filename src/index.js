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

let addAction = require('./addAction');

let {
    runSequence
} = require('jsenhance');

let {
    map
} = require('bolzano');

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

        // get current page's refreshId
        refreshId = refreshId || idgener();

        let recordInfoStore = {
            get: () => memory.get(pageInfoKey).then(list => {
                return list || {
                    nodes: []
                };
            }),

            set: (list) => memory.set(pageInfoKey, list),

            remove: () => memory.remove(pageInfoKey)
        };

        /**
         * get recordInfo, modify it and save the result as a new recordInfo
         *
         * @param modify
         *      recordInfo -> recordInfo
         */
        let updateRecordInfo = (modify) => {
            return recordInfoStore.get().then((recordInfo) => {
                let newRecordInfo = modify(recordInfo);
                if (!newRecordInfo) return null;
                return recordInfoStore.set(newRecordInfo);
            });
        };

        let start = () => {
            return record(passData.config.action, {
                refreshId,
                playedTime,
                winId,
                continueWinId
            }, {
                receiveAction: (action) => {
                    updateRecordInfo((recordInfo) => {
                        addAction(action, recordInfo, {
                            playedTime
                        });
                        return recordInfo;
                    });
                },

                startRecording: (opts) => {
                    runSequence(map(plugins, (plugin) => plugin.startRecording), [
                        opts, {
                            updateRecordInfo
                        }
                    ]);
                },

                beforeAddAction: (opts) => {
                    runSequence(map(plugins, (plugin) => plugin.beforeAddAction), [
                        opts, {
                            updateRecordInfo
                        }
                    ]);
                }
            });
        };

        return {
            clearRecordData: () => recordInfoStore.remove(),

            getRecordData: () => recordInfoStore.get(),
            start,

            stop: () => {
                return recordInfoStore.get().then((recordInfo) => {
                    runSequence(map(plugins, (plugin) => plugin.stopRecording), [recordInfo, {
                        refreshId,
                        winId,
                        continueWinId
                    }]);
                    return recordInfoStore.set(recordInfo);
                });
            }
        };
    };
};
