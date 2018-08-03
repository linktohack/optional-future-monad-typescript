
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
    resolve: (value: T) => void = (value) => { };
    reject: (error: Error) => void = (error) => { };

    constructor(public fn: (resolve: (value: T) => void, reject: (error: Error) => void) => void) {
        fn((value) => this.resolve(value), error => this.reject(error));
    }

    static resolve<T>(value: T) {
        return new Future<T>((resolve, _) => {
            setImmediate(() => {
                resolve(value)
            })
        })
    }

    static reject<T>(error: Error) {
        return new Future<T>((_, reject) => {
            setImmediate(() => {
                reject(error)
            })
        })
    }

    flatMap<V>(fn: (value: T) => Future<V>): Future<V> {
        return new Future((resolve, reject) => {
            this.resolve = (value) => {
                fn(value)
                    .match({ resolve, reject })
            }
            this.reject = reject;
        })
    }

    map<V>(fn: (value: T) => V): Future<V> {
        return new Future((resolve, reject) => {
            this.resolve = (value) => {
                resolve(fn(value))
            }
            this.reject = reject;
        })
    }

    match({ resolve, reject }: {
        resolve: ((value: T) => void),
        reject: ((error: Error) => void)
    }) {
        this.resolve = resolve;
        this.reject = reject;
    }
}

Optional
    .of({ x: 5, y: 7 })
    .map(it => it.x)
    .flatMap(x => new Optional<string>('aa'))
    .match({
        some(x) { console.log('this is x', x) },
        none() { console.log('nothing'); }
    })

Future
    .resolve(5)
    .map(it => {
        return it + 1
    })
    .flatMap<string>(it => {
        return new Future((resolve, reject) => {
            setTimeout(() => {
                resolve(`${it} wwowowow`)
            }, 1000);
        })
    })
    .match({
        resolve(value) { console.log('resolve', value) },
        reject(error) { console.log('reject', error) }
    })


// console.log(c);