/**
Infers the length of an array. Tuples resolve to numeric literals,
while non-tuples resolve to the `number` type.

Useful for enforcing fixed-length arrays and distinguishing between
tuple and non-tuple like arrays.

@example
```
import type {ArrayLength} from 'type-fest';

type TupleLength = ArrayLength<[1, 2, 3]>;
//=> 3

type TupleWithOptionalMembersLength = ArrayLength<[1, 2, number?]>;
//=> 2 | 3

type NonTupleArray = ArrayLength<string[]>;
//=> number

type TupleWithSpreadElements = ArrayLength<[1, 2, ...string[]]>;
//=> number

// Distinguish between arrays with determinable and non-determinable
// lengths
type IsDeterminableLength<T extends readonly unknown[]> =
  number extends ArrayLength<T> ? false : true;

type A = IsDeterminableLength<number[]>;
//=> false
type B = IsDeterminableLength<[1, 2, 3]>;
//=> true

```

@category Array
*/
export type ArrayLength<T extends readonly unknown[]> = T extends {readonly length: infer L} ? L : never;

export {};
