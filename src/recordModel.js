'use strict';

let jsoneq = require('cl-jsoneq');

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
        nodes: []
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
        processor(action, historyInfo.nodes);

        // add action
        addNode(action);

        // add state
        addNode({
            type: 'state',
            duration: [],
            assertion: {}
        });
    };

    let getLastItem = () => {
        return historyInfo.nodes[historyInfo.nodes.length - 1];
    };

    let getLastActionNode = () => {
        let list = historyInfo.nodes;
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

    let addNode = (node) => historyInfo.nodes.push(node);

    let updateState = (state, moment) => {
        let last = getLastItem();
        if (!last || last.type === 'action') {
            let node = {
                type: 'state',
                duration: [{
                    state, moment, refreshId, winId
                }]
            };

            // add new node
            addNode(node);
        } else {
            // update
            let duration = last.duration;
            let lastDuration = duration[duration.length - 1] || null;

            // TODO diff
            if (!jsoneq(lastDuration && lastDuration.state, state)) {
                duration.push({
                    state,
                    moment,
                    refreshId,
                    winId
                });
            }
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
    let gap = getGapTime(prev, cur, playedTime);
    if (gap !== undefined) {
        cur.gapTimeToPrev = gap;
    }
};

let getGapTime = (prev, cur, playedTime) => {
    if (!prev) {
        if (playedTime) {
            return cur.time - playedTime;
        }
    } else {
        return cur.time - prev.time;
    }
};
