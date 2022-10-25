/**
Given three types `A`, `B` and `C` returns `B` if `A` is any, `C` otherwise.

@example
```ts
import type {IfAny} from 'type-fest';

let a: IfAny<any, number, string> = 1;
```

@category Utilities
*/
export type IfAny<Cond, Then, Else> = 0 extends 1 & Cond ? Then : Else;
