'use strict';

let PageStateRecorder = require('./page');
let Ajaxtamper = require('ajaxtamper').recordPlugin;

let {
    map
} = require('bolzano');

module.exports = () => {
    return map([
        PageStateRecorder,
        Ajaxtamper
    ], (high) => high());
};
