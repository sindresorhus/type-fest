/**
Create a type for values that can either be a promise or it's return value.

Use cases:
- A function accepts a callback that may either return a value synchronously or may return a promised value.
- Specifically this type could be the return type of `Promise.then()`, `Promise.catch()` and `Promise.finally()` callbacks.

Please upvote [this issue](https://github.com/microsoft/TypeScript/issues/31394) if you want to have this type as a built-in in TypeScript.

@example
```
import {Promisable} from 'type-fest';

async function logger(getLogEntry: () => Promisable<string>): Promise<void> {
    const entry = await getLogEntry();
    console.log(entry);
}

logger(() => 'foo');
logger(() => Promise.resolve('bar'));
```
*/
export type Promisable<T> = T | PromiseLike<T>;
