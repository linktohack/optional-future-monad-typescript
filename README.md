# optional-future-monad-typescript
Just in case

```
Optional
    .of({ x: 5, y: 7 })
    .map(it => it.x)
    .flatMap(it => new Optional<string>(`${it} aaaa`))
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
                resolve(`${it} bbb`);
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
```
