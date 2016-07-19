'use strict';

/**
 * encapsulate data structure and logic
 *
 *
 * state: (start, duration, end)
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
        // type
        action.type = 'action';

        // tag refreshId
        action.refreshId = refreshId;

        // tag winId
        action.winId = winId;

        // tag gap time
        let prev = getLastActionNode();

        setGapTime(prev, action, playedTime);

        // process
        processor(action, historyInfo.actions);

        // add action
        addNode(action);
    };

    let getLastItem = () => {
        return historyInfo.actions[historyInfo.actions.length - 1];
    };

    let getLastActionNode = () => {
        let list = historyInfo.actions;
        let index = list.length - 1;
        let item = list[index];

        while (item) {
            if (item.type === 'action') {
                return item;
            } else {
                index--;
                item = list[index];
            }
        }
    };

    let addNode = (node) => historyInfo.actions.push(node);

    let updateState = (state, moment) => {
        let last = getLastItem();
        if (!last || last.type === 'action') {
            let node = {
                type: 'state',
                duration: [{
                    state, moment
                }]
            };

            // add new node
            addNode(node);
        } else {
            // update
            last.duration.push({
                state,
                moment
            });
        }
    };

    let getModel = () => historyInfo;

    return {
        addAction,
        getModel,
        updateState
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
