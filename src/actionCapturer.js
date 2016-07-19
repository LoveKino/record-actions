'use strict';

let captureEvent = require('./captureEvent');

let {
    serializeEvent, serializeNode, serializePath
} = require('serialize-front');

let getAction = (event) => {
    let node = event.target;
    event = serializeEvent(event);
    let path = serializePath(node);

    let nodeInfo = serializeNode(node, {
        textContent: true
    });

    return {
        type: 'action',
        event: event,
        time: new Date().getTime(),
        attachedUIStates: getAttachedUIStates(node),
        source: {
            path,
            node: nodeInfo
        },
        extra: {
            url: window.location.href,
            pageTitle: window.document.title
        }
    };
};

let getAttachedUIStates = (node) => {
    return {
        window: {
            pageYOffset: window.pageYOffset,
            pageXOffset: window.pageXOffset
        },

        current: {
            value: node.value,
            scrollTop: node.scrollTop,
            scrollLeft: node.scrollLeft
        }
    };
};

module.exports = (opts = {
    eventTypeList: []
}) => {
    return {
        capture: (handle) => {
            captureEvent(opts.eventTypeList || [], event => {
                let action = getAction(event);
                handle(action);
            }, {
                onlyUserAction: true
            });
        }
    };
};
