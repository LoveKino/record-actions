'use strict';

/**
 * store api
 */

let RecordModel = require('./recordModel');

module.exports = (store, key, opts) => {
    // get history
    return store.get(key).then(historyInfo => {
        let recordModel = RecordModel(historyInfo, opts);

        let addAction = (action) => {
            recordModel.addAction(action);
            // save
            store.set(key, recordModel.getModel());
        };

        let getRecordData = () => {
            return recordModel.getModel();
        };

        let updateState = (state, moment) => {
            let ret = recordModel.updateState(state, moment);
            // save
            ret && store.set(key, recordModel.getModel());
        };

        return {
            addAction,
            getRecordData,
            updateState
        };
    });
};
