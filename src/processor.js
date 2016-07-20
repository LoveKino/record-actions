'use strict';

/**
 * (action, nodes) => null
 */
let rules = [];
module.exports = (action, nodes) => {
    for (let i = 0; i < rules.length; i++) {
        rules[i](action, nodes);
    }
};

/**
 * a special situation: use click enter in a input area and trigger a click event at a little before
 */
rules.push((action, nodes) => {
    if (action.event.type === 'keyup' &&
        action.event.which === 13) {
        let prev = nodes[nodes.length - 1];
        if (!prev) return;
        if (prev.event.type === 'click') {
            // trigger this event as fast as you can after click event
            // otherwise may refresh page to cause a problem
            action.gapTimeToPrev = 1;
        }
    }
});
