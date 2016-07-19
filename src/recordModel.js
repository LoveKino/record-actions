'use strict';

/**
 * encapsulate data structure and logic
 */

let processor = require('./processor');

module.exports = (historyInfo, {
    playedTime,
    refreshId,
    winId
}) => {
    historyInfo = historyInfo || {
        actions: []
    };

    let addAction = (action) => {
        // tag refreshId
        action.refreshId = refreshId;

        // tag winId
        action.winId = winId;

        // tag gap time
        let prev = historyInfo.actions[historyInfo.actions.length - 1];

        setGapTime(prev, action, playedTime);

        // process
        processor(action, historyInfo.actions);

        // add action
        historyInfo.actions.push(action);
    };

    let getModel = () => historyInfo;

    return {
        addAction,
        getModel
    };
};

let setGapTime = (prev, cur, playedTime) => {
    if (!prev) {
        if (playedTime) {
            cur.gapTimeToPrev = cur.time - playedTime;
        }
    } else {
        let gap = cur.time - prev.time;
        cur.gapTimeToPrev = gap;
    }
};
