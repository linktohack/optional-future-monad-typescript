
class Optional<T>  {
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
            return new Optional<V>(this.value)
        }
        return new Optional(fn(this.value))
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


class Future<T> {
    _resolve: (value: T) => void = () => { };
    resolve: (value: T) => void = (value) => {
        this._resolve(value);
    };
    _reject: (error: Error) => void = () => { };
    reject: (error: Error) => void = (error) => {
        this._reject(error);
    };

    constructor(public fn: (resolve: (value: T) => void, reject: (error: Error) => void) => void) {
        fn(this.resolve, this.reject);
    }

    static of<T>(fn: (resolve: (value: T) => void, reject: (error: Error) => void) => void) {
        return new Future(fn);
    }

    flatMap<V>(fn: (value: T) => Future<V>): Future<V> {
        return new Future((resolve1, reject1) => {
            this._resolve = (value) => {
                fn(value)
                    .match({
                        resolve(value1) { resolve1(value1) },
                        reject(error) { reject1(error) }
                    })
            }
            this._reject = reject1;
        })
    }

    map<V>(fn: (value: T) => V): Future<V> {
        return new Future((resolve1, reject1) => {
            this._resolve = (value) => {
                resolve1(fn(value))
            }
            this._reject = reject1;
        })
    }

    match({ resolve, reject }: {
        resolve: ((value: T) => void),
        reject: ((error: Error) => void)
    }) {
        this._resolve = resolve;
        this._reject = reject;
    }
}

Optional
    .of({ x: 5, y: 7 })
    .map(it => it.x)
    .flatMap(x => new Optional<string>(undefined))
    .match({
        some(x) { console.log('this is x', x) },
        none() { console.log('nothing'); }
    })

Future
    .of<number>((resolve, reject) => {
        setImmediate(() => {
            resolve(5);
        })
        setTimeout(() => {
            // resolve(5);
            // reject(new Error('oops'))
        }, 0);
    })
    .map(it => it + 1)
    .flatMap(it => {
        return Future.of((resolve, reject) => {
            setImmediate(() => {
                // reject(new Error('what'));
            })
            setTimeout(() => {
                // resolve(it + 2)
                reject(new Error('oops'))
            }, 1000);
        })
    })
    .match({
        resolve(value) { console.log('resolve', value) },
        reject(error) { console.log('reject', error) }
    })


// console.log(c);