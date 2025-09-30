import type {TupleOf} from './tuple-of.d.ts';

/**
Create a type that represents a read-only tuple of the given type and length.

Use-cases:
- Declaring fixed-length tuples with a large number of items.
- Creating a range union (for example, `0 | 1 | 2 | 3 | 4` from the keys of such a type) without having to resort to recursive types.
- Creating a tuple of coordinates with a static length, for example, length of 3 for a 3D vector.

@example
```
import {ReadonlyTuple} from 'type-fest';

type FencingTeam = ReadonlyTuple<string, 3>;

const guestFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

const homeFencingTeam: FencingTeam = ['George', 'John'];
//=> error TS2322: Type string[] is not assignable to type 'FencingTeam'

guestFencingTeam.push('Sam');
//=> error TS2339: Property 'push' does not exist on type 'FencingTeam'
```

@deprecated This type will be removed in the next major version. Use the built-in `Readonly` type in combination with the {@link TupleOf} type instead, like `Readonly<TupleOf<Length, Element>>`.

@category Utilities
*/
export type ReadonlyTuple<Element, Length extends number> = Readonly<TupleOf<Length, Element>>;

export {};
