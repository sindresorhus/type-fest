import type {UnknownArrayOrTuple} from './internal/array.d.ts';

/**
Concatenate two array types into a single type.

`Concat` is the equivalent of `array1.concat(array2)`.

@example
```
import type {Concat} from 'type-fest';

type Coordinates = [number, number];

type CoordinatesInSpace = Concat<Coordinates, [number]>;
//=> [number, number, number]
```

`Concat` works best with tuples, but it supports all kinds of array types.

Combine it with `TupleOf` to define longer tuples.

@see {@link TupleOf}

@example
```
import type {Concat, TupleOf} from 'type-fest';

type LongerTuple = Concat<TupleOf<2, string>, TupleOf<3, number>>;
//=> [string, string, number, number, number]
```

@category Array
*/

export type Concat<
	First extends UnknownArrayOrTuple,
	Second extends UnknownArrayOrTuple,
> = [...First, ...Second];

export {};
