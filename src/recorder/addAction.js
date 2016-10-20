'use strict';

let processor = require('./processor');

module.exports = (action, list, {
    playedTime
}) => {
    // tag gap time
    let prev = getLastActionNode(list);

    setGapTime(prev, action, playedTime);

    // process
    processor(action, list.nodes);

    // add action
    list.nodes.push(action);

    // add state
    list.nodes.push({
        type: 'state',
        duration: [],
        assertion: {}
    });

    return list;
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

let getLastActionNode = (historyInfo) => {
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
