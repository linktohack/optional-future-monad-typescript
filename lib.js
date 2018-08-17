"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function doM(generator) {
    const gen1 = generator();
    return function fn(value) {
        const result = gen1.next(value);
        if (result.done) {
            return result.value;
        }
        return result.value.flatMap(fn);
    }();
}
exports.doM = doM;
class Optional {
    constructor(value) {
        this.value = value;
    }
    static of(value) {
        return new Optional(value);
    }
    flatMap(fn) {
        if (!this.value) {
            return new Optional(this.value);
        }
        return fn(this.value);
    }
    map(fn) {
        if (!this.value) {
            return new Optional(this.value);
        }
        return new Optional(fn(this.value));
    }
    k(key) {
        return this.map(value => value[key]);
    }
    match({ some, none }) {
        if (!this.value && none) {
            return none();
        }
        if (this.value && some) {
            return some(this.value);
        }
    }
}
exports.Optional = Optional;
class Future {
    constructor(fn) {
        this.fn = fn;
        this.resolve = (_) => {
        };
        this.reject = (_) => {
        };
        fn((value) => this.resolve(value), error => this.reject(error));
    }
    static resolve(value) {
        return new Future((resolve, _) => {
            setImmediate(() => {
                resolve(value);
            });
        });
    }
    static reject(error) {
        return new Future((_, reject) => {
            setImmediate(() => {
                reject(error);
            });
        });
    }
    flatMap(fn) {
        return new Future((resolve, reject) => {
            this.resolve = (value) => {
                fn(value)
                    .match({ resolve, reject });
            };
            this.reject = reject;
        });
    }
    map(fn) {
        return new Future((resolve, reject) => {
            this.resolve = (value) => {
                resolve(fn(value));
            };
            this.reject = reject;
        });
    }
    match({ resolve, reject }) {
        this.resolve = resolve;
        this.reject = reject;
    }
}
exports.Future = Future;
