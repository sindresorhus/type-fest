/**
Unwraps `Promise` and returns lifted type.

@example
```
type A = Promise<string>;
type InnerType = Unpromise<A>; // string
```
*/
export type Unpromise<T> = T extends Promise<infer P> ? P : T;
