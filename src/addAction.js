'use strict';

let processor = require('./processor');

let NodeUnique = require('./nodeUique');

let nodeUnique = NodeUnique();

module.exports = (action, list, {
    refreshId,
    playedTime,
    winId,
    continueWinId,
    event
}) => {
    // node flag
    let id = nodeUnique(event.target);

    action.source.domNodeId = id;

    winId = continueWinId || winId;
    // type
    action.type = 'action';

    // tag refreshId
    action.refreshId = refreshId;

    // tag winId
    action.winId = winId;

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
