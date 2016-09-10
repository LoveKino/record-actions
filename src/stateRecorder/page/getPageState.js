'use strict';

let {
    getDisplayText
} = require('page-text');

module.exports = () => {
    return {
        type: 'state',
        url: window.location.href,
        cookie: document.cookie,
        pageText: getDisplayText(document.body),
        title: document.title
    };
};
