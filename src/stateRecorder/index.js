'use strict';

let PageStateRecorder = require('./page');
let AjaxRecorder = require('./ajax');

let {
    map
} = require('bolzano');

module.exports = () => {
    return map([
        PageStateRecorder,
        AjaxRecorder
    ], (high) => high());
};
