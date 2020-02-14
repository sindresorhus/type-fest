import {PromiseValue} from './promise-value';

type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

/**
Unpack the return type of a function that returns a `Promise`.
There has been discussion about implementing this type in TypeScript [here](https://github.com/microsoft/TypeScript/pull/35998).

@example
```ts
import {AsyncReturnType} from 'type-fest';
import {asyncFunction} from 'api';

// This type resolves to the unpacked return type of `asyncFunction`.
type Value = AsyncReturnType<typeof asyncFunction>;

async function doSomething (value: Value) {}

asyncFunction().then(value => doSomething(value));
```
 */
export type AsyncReturnType<Target extends AsyncFunction> = PromiseValue<ReturnType<Target>>;
