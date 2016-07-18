'use strict';

/**
 * (action, actions) => null
 */
let rules = [];
module.exports = (action, actions) => {
    for (let i = 0; i < rules.length; i++) {
        rules[i](action, actions);
    }
};

/**
 * a special situation: use click enter in a input area and trigger a click event at a little before
 */
rules.push((action, actions) => {
    if (action.event.type === 'keyup' &&
        action.event.which === 13) {
        let prev = actions[actions.length - 1];
        if (!prev) return;
        if (prev.event.type === 'click') {
            // trigger this event as fast as you can after click event
            // otherwise may refresh page to cause a problem
            action.gapTimeToPrev = 1;
        }
    }
});
