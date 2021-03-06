'use strict';

let Recorder = require('../../index');

let record = Recorder();

let log = console.log; // eslint-disable-line

let {
    start
} = record({
    passData: {
        config: {
            action: {
                eventTypeList: [
                    'click'
                ]
            }
        }
    },
    winId: 1
}, {
    receiveState: () => {},
    receiveAction: (action) => {
        log(action);
    }
});

start();
