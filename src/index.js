'use strict';

/**
 * information
 *
 *      user action
 *
 *      system response
 */
let stateRecorder = require('./stateRecorder');

let ActionCapturer = require('capture-action');

let idgener = require('idgener');

let {
    runSequence
} = require('jsenhance');

let {
    map
} = require('bolzano');

/**
 * @param actionConfig
 * @param options
 * @param callbacks
 */
let record = (actionConfig, options, {
    receiveAction,
    startRecording,
    beforeAddAction
}) => {
    startRecording();

    let {
        capture
    } = ActionCapturer(actionConfig);

    let accept = (action) => {
        // at this moment, the event handlers still not triggered, but UI may changed (like scroll, user input)
        return beforeAddAction().then(() => {
            return receiveAction(action);
        });
    };

    capture(accept);
};

module.exports = () => {
    let plugins = stateRecorder();
    /**
     * @param options
     * @param store
     *      clearRecordData
     *      getRecordData
     *      receiveAction
     *      receiveState
     *      receiveAjax
     *      ...
     */
    return (options, store) => {
        // get current page's refreshId
        options.refreshId = options.refreshId || idgener();
        let {
            passData
        } = options;

        let {
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
            start,
            stop: () => {
                return runSequence(map(plugins, (plugin) => plugin.stopRecording), [options, store]);
            }
        };
    };

};
