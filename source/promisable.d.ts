/**
Create a type for values that can either be a promise or it's return value

@example
```
import {Promisable} from 'type-fest';

async function logger(getLogEntry: () => Awaitable<string>): Promise<void> {
    const entry = await getLogEntry();
    console.log(entry);
}

logger(() => 'foo');
logger(() => Promise.resolve('bar'));
```
*/
export type Promisable<T> = T | PromiseLike<T>;
