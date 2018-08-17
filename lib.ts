export interface M<T> {
    map<V>(fn: (value: T) => V): M<V>

    flatMap<V>(fn: (value: T) => M<V>): M<V>
}

export function doM<T>(generator: () => IterableIterator<M<T>>) {
    const gen1 = generator();
    return function fn(value?: T): M<T> {
        const result = gen1.next(value);
        if (result.done) {
            return result.value;
        }
        return result.value.flatMap(fn);
    }();
}

export class Optional<T> implements M<T> {
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

    k<K extends keyof T>(key: K) {
        return this.map<T[K]>(value => value[key]);
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

export class Future<T> implements M<T> {
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