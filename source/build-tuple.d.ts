import type {If} from './if.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Creates a tuple type of the specified length with elements of the specified type.

@example
```
import type {BuildTuple} from 'type-fest';

type RGB = BuildTuple<3, number>;
// => [number, number, number]

type Line = BuildTuple<2, {x: number; y: number}>;
//=> [{x: number; y: number}, {x: number; y: number}]

type TicTacToeBoard = BuildTuple<3, BuildTuple<3, 'X' | 'O' | null>>;
//=> [['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null], ['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null], ['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null]]
```

Note: If the specified length is the non-literal `number` type, the result will not be a tuple but a regular array.

@example
```
import type {BuildTuple} from 'type-fest';

type StringArray = BuildTuple<number, string>;
//=> string[]
```

Note: If the type for elements is not specified, it will default to `unknown`.

@example
```
import type {BuildTuple} from 'type-fest';

type UnknownTriplet = BuildTuple<3>;
//=> [unknown, unknown, unknown]
```

Note: If the specified length is negative, the result will be an empty tuple.

@example
```
import type {BuildTuple} from 'type-fest';

type EmptyTuple = BuildTuple<-3, string>;
//=> []
```
*/
export type BuildTuple<Length extends number, Fill = unknown> = IfNotAnyOrNever<Length, _BuildTuple<If<IsNegative<Length>, 0, Length>, Fill, []>, Fill[], []>;

type _BuildTuple<L extends number, Fill, Accumulator extends UnknownArray> = number extends L
	? Fill[]
	: L extends Accumulator['length']
		? Accumulator
		: _BuildTuple<L, Fill, [...Accumulator, Fill]>;

export {};
