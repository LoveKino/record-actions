'use strict';

let counter = 0;

let genId = () => {
    counter++;
    if (counter > 10e6) {
        counter = 0;
    }
    let id = `${Math.random(Math.random(Math.random()))}-${new Date().getTime()}-${counter}`;
    id = id.replace(/\./g, '');
    return id;
};

module.exports = {
    genId
};
