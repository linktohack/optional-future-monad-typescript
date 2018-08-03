"use strict";
var Optional = /** @class */ (function () {
    function Optional(value) {
        this.value = value;
    }
    Optional.of = function (value) {
        return new Optional(value);
    };
    Optional.prototype.flatMap = function (fn) {
        if (!this.value) {
            return new Optional(this.value);
        }
        return fn(this.value);
    };
    Optional.prototype.map = function (fn) {
        if (!this.value) {
            return new Optional(this.value);
        }
        return new Optional(fn(this.value));
    };
    Optional.prototype.match = function (_a) {
        var some = _a.some, none = _a.none;
        if (!this.value && none) {
            return none();
        }
        if (this.value && some) {
            return some(this.value);
        }
    };
    return Optional;
}());
var Future = /** @class */ (function () {
    function Future(fn) {
        var _this = this;
        this.fn = fn;
        this._resolve = function () { };
        this.resolve = function (value) {
            _this._resolve(value);
        };
        this._reject = function () { };
        this.reject = function (error) {
            _this._reject(error);
        };
        fn(this.resolve, this.reject);
    }
    Future.of = function (fn) {
        return new Future(fn);
    };
    Future.prototype.flatMap = function (fn) {
        var _this = this;
        return new Future(function (resolve1, reject1) {
            _this._resolve = function (value) {
                fn(value)
                    .match({
                    resolve: function (value1) { resolve1(value1); },
                    reject: function (error) { reject1(error); }
                });
            };
            _this._reject = reject1;
        });
    };
    Future.prototype.map = function (fn) {
        var _this = this;
        return new Future(function (resolve1, reject1) {
            _this._resolve = function (value) {
                resolve1(fn(value));
            };
            _this._reject = reject1;
        });
    };
    Future.prototype.match = function (_a) {
        var resolve = _a.resolve, reject = _a.reject;
        this._resolve = resolve;
        this._reject = reject;
    };
    return Future;
}());
Optional
    .of({ x: 5, y: 7 })
    .map(function (it) { return it.x; })
    .flatMap(function (x) { return new Optional(undefined); })
    .match({
    some: function (x) { console.log('this is x', x); },
    none: function () { console.log('nothing'); }
});
Future
    .of(function (resolve, reject) {
    setImmediate(function () {
        resolve(5);
    });
    setTimeout(function () {
        // resolve(5);
        // reject(new Error('oops'))
    }, 0);
})
    .map(function (it) { return it + 1; })
    .flatMap(function (it) {
    return Future.of(function (resolve, reject) {
        setImmediate(function () {
            // reject(new Error('what'));
        });
        setTimeout(function () {
            // resolve(it + 2)
            reject(new Error('oops'));
        }, 1000);
    });
})
    .match({
    resolve: function (value) { console.log('resolve', value); },
    reject: function (error) { console.log('reject', error); }
});
// console.log(c);
