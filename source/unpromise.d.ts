/**
Unwraps `Promise` and returns lifted type.

@example
```
type A = Promise<string>;
type InnerType = Unpromise<A>; // string
```
*/
export type Unpromise<MaybePromise> = MaybePromise extends Promise<infer Type> ? Type : MaybePromise;
