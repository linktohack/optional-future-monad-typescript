import { Future, Optional } from './lib';


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
