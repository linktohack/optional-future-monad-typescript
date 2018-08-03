
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
        // fn(this.resolve, this.reject);
    }

    static of<T>(fn: (resolve: (value: T) => void, reject: (error: Error) => void) => void) {
        return new Future<T>(fn);
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
    .flatMap(x => new Optional<string>(undefined))
    .match({
        some(x) { console.log('this is x', x) },
        none() { console.log('nothing'); }
    })

Future
    .of<number>((resolve, reject) => {
        // setImmediate(() => {
        //     resolve(5);
        // })
        setTimeout(() => {
            resolve(5);
            // reject(new Error('oops'))
        }, 1000);
    })
    .map(it => it + 1)

    .flatMap<string>(it => {
        return Future.of((resolve, reject) => {
            setImmediate(() => {
                // reject(new Error('what'));
            })
            setTimeout(() => {
                // resolve(`${it} wwowowow`)
                reject(new Error('oops'))
            }, 1000);
        })
    })
    .match({
        resolve(value) { console.log('resolve', value) },
        reject(error) { console.log('reject', error) }
    })


// console.log(c);