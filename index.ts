import { doM, Future, Optional } from './lib';

Optional
    .of({ x: 5, y: { z: { t: 10 } } })
    .k('y')
    .k('z')
    .k('t')
    .flatMap(it => new Optional(`${JSON.stringify(it)} aaaa`))
    .match({
        some(x) {
            console.log('this is x', x);
        },
        none() {
            console.log('nothing');
        }
    });

console.log('val', Optional
    .of(1)
    .flatMap(it => Optional
        .of(2)
        .map(it2 => it + it2))
    .value);

const optional = doM(function* () {
    const val1 = yield Optional.of(1);
    const val2 = yield  Optional.of(2);
    return Optional.of(val1 + val2);
}) as Optional<number>;

optional.match({
    some(it) {
        console.log('some', it);
    },
    none() {
        console.log('none');
    }
});


const future = doM(function* () {
    const val1 = yield new Future<number>(((resolve, reject) => setTimeout(() => resolve(5), 1000)));
    console.log('val1', val1);
    const val2 = yield new Future<number>(((resolve, reject) => setTimeout(() => resolve(7), 2000)));
    console.log('val2', val2);
    return new Future<number>(((resolve, reject) => setTimeout(() => resolve(val1 + val2), 3000)));
}) as Future<number>;


future.match({
    resolve(x) {
        console.log(x);
    },
    reject: console.log.bind(console)
});

Future
    .resolve(5)
    .map(it => {
        return it + 1;
    })
    .flatMap<string>(it => {
        return new Future((resolve, reject) => {
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
