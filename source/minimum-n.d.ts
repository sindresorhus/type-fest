import type {NonEmptyTuple} from './non-empty-tuple.d.ts'; // For `@link`
import type {TupleOf} from './tuple-of.d.ts';

/**
Create an array type with N or more elements of the given type.

Use-cases:
- Model data that requires a minimum number of items, like a sports team with at least 3 players or an auction with at least 2 competing bids.
- Type rest parameters to require a minimum number of arguments.

@example
```
import type {MinimumN} from 'type-fest';

type FencingTeam = MinimumN<string, 3>;
//=> [string, string, string, ...string[]]

const homeFencingTeam: FencingTeam = ['Josh', 'Michael', 'Robert'];

// @ts-expect-error
const awayFencingTeam: FencingTeam = ['George', 'John'];
// Error: Type '[string, string]' is not assignable to type '[string, string, string, ...string[]]'. Source has 2 element(s) but target requires 3.
```

@example
```
import type {MinimumN} from 'type-fest';

const average = (...numbers: MinimumN<number, 2>): number => numbers.reduce((total, value) => total + value, 0) / numbers.length;

average(1, 2);
// Ok

average(1, 2, 3);
// Ok

// @ts-expect-error
average(1);
// Error: Expected at least 2 arguments, but got 1.
```

Note: If the specified minimum is the non-literal `number` type, the result will not be a tuple but a regular array, since a minimum cannot be enforced for it.

@example
```
import type {MinimumN} from 'type-fest';

type StringArray = MinimumN<string, number>;
//=> string[]
```

Note: If the specified minimum is negative, the result will be a regular array.

@example
```
import type {MinimumN} from 'type-fest';

type NegativeMinimum = MinimumN<string, -3>;
//=> string[]
```

Note: If the specified minimum has a decimal part, the decimal part will be ignored.

@example
```
import type {MinimumN} from 'type-fest';

type DecimalMinimum = MinimumN<string, 2.5>;
//=> [string, string, ...string[]]
```

Note: If you need a readonly tuple, simply wrap this type with `Readonly`, for example, to create `readonly [string, string, ...string[]]` use `Readonly<MinimumN<string, 2>>`.

@see {@link TupleOf} for a tuple of an exact length.

@see {@link NonEmptyTuple} for a readonly tuple with one or more elements.

@category Array
*/
export type MinimumN<Element, Length extends number> = [...TupleOf<Length, Element>, ...Element[]];

export {};
