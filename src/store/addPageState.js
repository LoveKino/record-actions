'use strict';

let jsoneq = require('cl-jsoneq');

module.exports = (recordInfo, {
    state,
    moment,
    refreshId,
    winId,
    continueWinId
}) => {
    winId = continueWinId || winId;
    let last = recordInfo.nodes[recordInfo.nodes.length - 1];

    if (!last || last.type === 'action') {
        let node = {
            type: 'state',
            duration: [{
                state, moment, refreshId, winId
            }],
            externals: {
                ajax: []
            }
        };

        // add new node
        recordInfo.nodes.push(node);
        return true;
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
            return true;
        }
    }
    return false;
};
