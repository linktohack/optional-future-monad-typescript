"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
lib_1.Optional
    .of({ x: 5, y: { z: { t: 10 } } })
    .k('y')
    .k('z')
    .k('t')
    .flatMap(it => new lib_1.Optional(`${JSON.stringify(it)} aaaa`))
    .match({
    some(x) {
        console.log('this is x', x);
    },
    none() {
        console.log('nothing');
    }
});
console.log('val', lib_1.Optional
    .of(1)
    .flatMap(it => lib_1.Optional
    .of(2)
    .map(it2 => it + it2))
    .value);
const optional = lib_1.doM(function* () {
    const val1 = yield lib_1.Optional.of(1);
    const val2 = yield lib_1.Optional.of(2);
    return lib_1.Optional.of(val1 + val2);
});
optional.match({
    some(it) {
        console.log('some', it);
    },
    none() {
        console.log('none');
    }
});
const future = lib_1.doM(function* () {
    const val1 = yield new lib_1.Future(((resolve, reject) => setTimeout(() => resolve(5), 1000)));
    console.log('val1', val1);
    const val2 = yield new lib_1.Future(((resolve, reject) => setTimeout(() => resolve(7), 2000)));
    console.log('val2', val2);
    return new lib_1.Future(((resolve, reject) => setTimeout(() => resolve(val1 + val2), 3000)));
});
future.match({
    resolve(x) {
        console.log(x);
    },
    reject: console.log.bind(console)
});
lib_1.Future
    .resolve(5)
    .map(it => {
    return it + 1;
})
    .flatMap(it => {
    return new lib_1.Future((resolve, reject) => {
        setTimeout(() => {
            // resolve(`${it} bbb`);
            reject(new Error('what'));
        }, 1000);
    });
})
    .match({
    resolve(value) {
        console.log('resolve', value);
    },
    reject(error) {
        console.log('reject', error);
    }
});
