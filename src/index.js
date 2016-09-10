'use strict';

/**
 *
 * information
 *
 *      user action
 *
 *      system response
 */

let PageStateRecorder = require('./stateRecorder/page');
let AjaxRecorder = require('./stateRecorder/ajax');

let Recorder = require('./recorder');

let idgener = require('idgener');

module.exports = () => {
    let pageStateRecorder = PageStateRecorder();
    let ajaxRecorder = AjaxRecorder();

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

        let {
            record, stop
        } = Recorder([
            pageStateRecorder,
            ajaxRecorder
        ], recordInfoStore, {
            refreshId,
            playedTime,
            winId,
            continueWinId
        });

        return {
            start: () => record(passData.config.action),

            stop,

            clearRecordData: () => recordInfoStore.remove(),

            getRecordData: () => recordInfoStore.get(),
        };
    };
};
