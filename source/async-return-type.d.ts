import {PromiseValue} from 'type-fest';

type AsyncFunction = (...args: unknown[]) => Promise<unknown>;

/**
Unpack the return type of a function that returns a `Promise`.

@example
```ts
import {AsyncReturnType} from 'type-fest';
import {asyncFunction} from 'api';

// This type resolves to the unpacked return type of `asyncFunction`.
type Value = AsyncReturnType<typeof asyncFunction>;

let value: Value = await asyncFunction();
```
 */
export type AsyncReturnType<Target extends AsyncFunction> = PromiseValue<ReturnType<Target>>;
