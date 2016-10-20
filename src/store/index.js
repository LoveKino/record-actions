'use strict';

let addAction = require('./addAction');

let addPageState = require('./addPageState');

module.exports = (memory, {
    pageInfoKey,
    playedTime
}) => {
    let updateTasks = Promise.resolve();

    let get = () => memory.get(pageInfoKey).then(list => {
        return list || {
            nodes: []
        };
    });

    let set = (list) => memory.set(pageInfoKey, list);

    let remove = () => memory.remove(pageInfoKey);

    /**
     * get recordInfo, modify it and save the result as a new recordInfo
     *
     * must wait for the lastest update job finished
     *
     * @param modify
     *      recordInfo -> recordInfo
     */
    let updateRecordInfo = (modify) => {
        return new Promise((resolve, reject) => {
            updateTasks = updateTasks.then(() => {
                return get().then((recordInfo) => {
                    let newRecordInfo = modify(recordInfo);
                    if (!newRecordInfo) return null;
                    return set(newRecordInfo);
                }).then(resolve).catch(reject);
            });
        });
    };

    let receiveAction = (action) => {
        return updateRecordInfo((recordInfo) => {
            addAction(action, recordInfo, {
                playedTime
            });
            return recordInfo;
        });
    };

    /**
     * state = {
     *     state,
     *     moment,
     *     refreshId,
     *     winId,
     *     continueWinId
     * }
     */
    let receiveState = (stateData) => {
        return updateRecordInfo((recordInfo) => {
            addPageState(recordInfo, stateData);
            return recordInfo;
        });
    };

    return {
        clearRecordData: remove,
        getRecordData: get,
        updateRecordInfo,
        receiveAction,
        receiveState
    };
};
