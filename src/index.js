'use strict';

/**
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

module.exports = () => {
    let plugins = stateRecorder();

    return (options, store) => {
        // get current page's refreshId
        options.refreshId = options.refreshId || idgener();
        let {
            passData
        } = options;

        let {
            clearRecordData,
            getRecordData,
            receiveAction
        } = store;

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
