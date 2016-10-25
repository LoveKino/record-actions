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
    }
}, {
    receiveState: () => {},
    receiveAction: (action) => {
        log(action);
    },
    receiveAjax: (ajax) => {
        log(ajax);
    }
});

start();

let sendAjax = () => {
    // send ajax
    let xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            //
        }
    };

    xhr.open('GET', window.location.href);
    xhr.send();
};

sendAjax();

document.getElementById('test').addEventListener('click', sendAjax);
