export class Optional<T> {
    constructor(public value: T | undefined) {
    }

    static of<T>(value: T | undefined) {
        return new Optional(value);
    }

    flatMap<V>(fn: (value: T) => Optional<V>): Optional<V> {
        if (!this.value) {
            return new Optional<V>(this.value);
        }
        return fn(this.value);
    }

    map<V>(fn: (value: T) => V): Optional<V> {
        if (!this.value) {
            return new Optional<V>(this.value);
        }
        return new Optional(fn(this.value));
    }

    match({ some, none }: {
        some?: ((value: T) => void),
        none?: (() => void)
    }) {
        if (!this.value && none) {
            return none();
        }
        if (this.value && some) {
            return some(this.value);
        }
    }
}

export class Future<T> {
    resolve: (value: T) => void = (_) => {
    };
    reject: (error: Error) => void = (_) => {
    };

    constructor(public fn: (resolve: (value: T) => void, reject: (error: Error) => void) => void) {
        fn((value) => this.resolve(value), error => this.reject(error));
    }

    static resolve<T>(value: T) {
        return new Future<T>((resolve, _) => {
            setImmediate(() => {
                resolve(value);
            });
        });
    }

    static reject<T>(error: Error) {
        return new Future<T>((_, reject) => {
            setImmediate(() => {
                reject(error);
            });
        });
    }

    flatMap<V>(fn: (value: T) => Future<V>): Future<V> {
        return new Future((resolve, reject) => {
            this.resolve = (value) => {
                fn(value)
                    .match({ resolve, reject });
            };
            this.reject = reject;
        });
    }

    map<V>(fn: (value: T) => V): Future<V> {
        return new Future((resolve, reject) => {
            this.resolve = (value) => {
                resolve(fn(value));
            };
            this.reject = reject;
        });
    }

    match({ resolve, reject }: {
        resolve: ((value: T) => void),
        reject: ((error: Error) => void)
    }) {
        this.resolve = resolve;
        this.reject = reject;
    }
}