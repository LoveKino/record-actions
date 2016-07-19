'use strict';

/**
 * store api
 */

let RecordModel = require('./recordModel');

module.exports = (memory, key, opts) => {
    // get history
    return memory.get(key).then(historyInfo => {
        let recordModel = RecordModel(historyInfo, opts);

        let addAction = (action) => {
            recordModel.addAction(action);
            // save
            memory.set(key, recordModel.getModel());
        };

        let getRecordData = () => {
            return recordModel.getModel();
        };

        return {
            addAction,
            getRecordData
        };
    });
};
