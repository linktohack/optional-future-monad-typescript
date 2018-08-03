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
        this.resolve = function (_) {
        };
        this.reject = function (_) {
        };
        fn(function (value) { return _this.resolve(value); }, function (error) { return _this.reject(error); });
    }
    Future.resolve = function (value) {
        return new Future(function (resolve, _) {
            setImmediate(function () {
                resolve(value);
            });
        });
    };
    Future.reject = function (error) {
        return new Future(function (_, reject) {
            setImmediate(function () {
                reject(error);
            });
        });
    };
    Future.prototype.flatMap = function (fn) {
        var _this = this;
        return new Future(function (resolve, reject) {
            _this.resolve = function (value) {
                fn(value)
                    .match({ resolve: resolve, reject: reject });
            };
            _this.reject = reject;
        });
    };
    Future.prototype.map = function (fn) {
        var _this = this;
        return new Future(function (resolve, reject) {
            _this.resolve = function (value) {
                resolve(fn(value));
            };
            _this.reject = reject;
        });
    };
    Future.prototype.match = function (_a) {
        var resolve = _a.resolve, reject = _a.reject;
        this.resolve = resolve;
        this.reject = reject;
    };
    return Future;
}());
Optional
    .of({ x: 5, y: 7 })
    .map(function (it) { return it.x; })
    .flatMap(function (it) { return new Optional(it + " aaaa"); })
    .match({
    some: function (x) {
        console.log('this is x', x);
    },
    none: function () {
        console.log('nothing');
    }
});
Future
    .resolve(5)
    .map(function (it) {
    return it + 1;
})
    .flatMap(function (it) {
    return new Future(function (resolve, reject) {
        setTimeout(function () {
            resolve(it + " bbb");
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
