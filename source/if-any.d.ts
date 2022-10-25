/**
Used to create a ternary operator type above the `any` type.

Returns `Then` if `Cond` is `any`, `Else` otherwise.

@example
```ts
import type {IfAny} from 'type-fest';

type WithAnyValues = {
  a: any;
  b: number;
  c: string;
  d: any;
}

type WithoutAnyValues = { [K in keyof WithAnyValues]: IfAny<WithAnyValues[K], number, WithAnyValues[K]>}

let my_object: WithoutAnyValues = {
  a: 1,
  b: 2,
  c: "hello",
  d: 3,
}

// typeof my_object;
// {
//   a: number;
//   b: number;
//   c: string;
//   d: number;
// }
```

@category Utilities
*/
export type IfAny<Cond, Then, Else> = 0 extends 1 & Cond ? Then : Else;
