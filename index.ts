import { Future, Optional } from './lib';


Optional
    .of({ x: 5, y: { z: { t: 10 } } })
    .map(it => it.y)
    .map(it => it.z)
    .flatMap(it => new Optional(`${JSON.stringify(it)} aaaa`))
    .match({
        some(x) {
            console.log('this is x', x);
        },
        none() {
            console.log('nothing');
        }
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
