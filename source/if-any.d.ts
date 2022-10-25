/**
Used to create a ternary operator above the `any` type.

Returns `Then` if `Cond` is `any`, `Else` otherwise.

@example
```ts
import type {IfAny} from 'type-fest';

let a: IfAny<any, number, string> = 1;
```

@category Utilities
*/
export type IfAny<Cond, Then, Else> = 0 extends 1 & Cond ? Then : Else;
