"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lib_1 = require("./lib");
lib_1.Optional
    .of({ x: 5, y: { z: { t: 10 } } })
    .map(function (it) { return it.y; })
    .map(function (it) { return it.z; })
    .flatMap(function (it) { return new lib_1.Optional(JSON.stringify(it) + " aaaa"); })
    .match({
    some: function (x) {
        console.log('this is x', x);
    },
    none: function () {
        console.log('nothing');
    }
});
lib_1.Future
    .resolve(5)
    .map(function (it) {
    return it + 1;
})
    .flatMap(function (it) {
    return new lib_1.Future(function (resolve, reject) {
        setTimeout(function () {
            // resolve(`${it} bbb`);
            reject(new Error('what'));
        }, 1000);
    });
})
    .match({
    resolve: function (value) {
        console.log('resolve', value);
    },
    reject: function (error) {
        console.log('reject', error);
    }
});
