'use strict';

let {
    genId
} = require('./util');

let {
    find
} = require('bolzano');

module.exports = () => {
    /**
     * cacheMap = [[node, id]]
     */
    let cacheMap = [];

    return (node) => {
        if (!node) return null;
        let ret = find(cacheMap, node, {
            eq: (node, item) => node === item[0]
        });
        if (ret) return ret[1];

        let id = genId();
        cacheMap.push([node, id]);
        return id;
    };
};
