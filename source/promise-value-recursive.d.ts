/**
Returns the type that is wrapped inside a `Promise` type.
If the type is not a Promise, the type itself is returned.
If the type wrapped in the Promise is itself a Promise, the resolved type will be unwrapped recursively.
If the Promise is guaranteed not to be recursive, use `PromiseValue` instead.

@example
```
import {PromiseValueRecursive} from 'type-fest';

type RecursiveAsyncData = Promise<Promise<string> >;
let recursiveAsyncData: PromiseValueRecursive<RecursiveAsyncData> = Promise.resolve(Promise.resolve('ABC'));

type Data = PromiseValue<RecursiveAsyncData>;
let data: Data = await asyncData;

// Here's an example that shows how this type reacts to non-recursive Promise types.
type AsyncData = PromiseValueRecursive<Promise<string> >;
let asyncData: AsyncData = await getAsyncData();

// Here's an example that shows how this type reacts to non-Promise types.
type SyncData = PromiseValueRecursive<string>;
let syncData: SyncData = getSyncData();
```
*/
export type PromiseValueRecursive<PromiseType, Otherwise = PromiseType> = PromiseType extends Promise<infer Value>
  ? {0: PromiseValueRecursive<Value>; 1: Value}[PromiseType extends Promise<any>? 0 : 1]
  : Otherwise;
