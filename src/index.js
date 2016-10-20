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

    return (options) => {
        // get current page's refreshId
        options.refreshId = options.refreshId || idgener();
        let {
            rootId, passData, playedTime
        } = options;

        const pageInfoKey = `${rootId}-pageInfo`;

        let store = null;
        let {
            clearRecordData,
            getRecordData,
            receiveAction
        } = store = Store(options.memory, {
            pageInfoKey, playedTime
        });

        let start = () => {
            return record(passData.config.action, options, {
                startRecording: () => {
                    return runSequence(map(plugins, (plugin) => plugin.startRecording), [
                        options, store
                    ]);
                },

                beforeAddAction: () => {
                    return runSequence(map(plugins, (plugin) => plugin.beforeAddAction), [
                        options,
                        store
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
                return runSequence(map(plugins, (plugin) => plugin.stopRecording), [options, store]);
            }
        };
    };
};
