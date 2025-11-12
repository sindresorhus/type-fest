import type {If} from './if.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a tuple type of the specified length with elements of the specified type.

@example
```
import type {TupleOf} from 'type-fest';

type RGB = TupleOf<3, number>;
//=> [number, number, number]

type Line = TupleOf<2, {x: number; y: number}>;
//=> [{x: number; y: number}, {x: number; y: number}]

type TicTacToeBoard = TupleOf<3, TupleOf<3, 'X' | 'O' | null>>;
//=> [['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null], ['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null], ['X' | 'O' | null, 'X' | 'O' | null, 'X' | 'O' | null]]
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQK5gDYoDyAZgL5zFQQhwDkSqAtMSgM4y0DcAUNw2gCUA4gCE4AXjg58RYgB4AzABo4AO2wgARiigA+HgHoD43XADa6rTpWXtUGxrsBdXvzgAZYKrSTpBEnIATCroAB4AXGqOOpxwiJG2OqT63EYm5mEJ0VCx8VFWUKQhEfl2uVkFpC58yGiYwADGmACGTRAoIhDNUAAmElK4-vLKAzIBI7QAGrRwAD50hDPz6nh4uilppmZmU0sLeyt4Krtz+6eHx9OntIvn2KtOKjtX8zcH90d0L2fLH5d7bzuDyeJ1et1+q3+13BUUhXwBMMOTicQA)

@example
```
import type {TupleOf} from 'type-fest';

type Range<Start extends number, End extends number> = Exclude<keyof TupleOf<End>, keyof TupleOf<Start>>;

type ZeroToFour = Range<0, 5>;
//=> '0' | '1' | '2' | '3' | '4'

type ThreeToEight = Range<3, 9>;
//=> '3' | '4' | '5' | '6' | '7' | '8'
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQK5gDYoDyAZgL5zFQQhwDkSqAtMSgM4y0DcAUNw2gCUAhgDsA5igA8AZRhDYcFAA8YKEQBNWcEdhAAjFFAA0cAKIbFKtZu26DUAHxwAvGaUBjPNnVSA1ikQIYjgcfCJiSXN1BxN-QODQghIZOVgHBx4+ZDQALUMITAgAMQhsKBc4YXEpAAYTAFYM7gB6ZucnWhraOAAfOgBGbr7aACYhugBmcdoAFlpefhCACygUFELTYDEl+FcqiUkJkwBOJtb2yem53rp66YA2aYB2aYAOWiA)

Note: If the specified length is the non-literal `number` type, the result will not be a tuple but a regular array.

@example
```
import type {TupleOf} from 'type-fest';

type StringArray = TupleOf<number, string>;
//=> string[]
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQK5gDYoDyAZgL5zFQQhwDkSqAtMSgM4y0DcAUNw2gGUYUYADsA5gEEoUAIaI4AXjg58RYgB5R2EACMUUADRx2IiQD4eAeiuLzJ4WPEBtALpA)

Note: If the type for elements is not specified, it will default to `unknown`.

@example
```
import type {TupleOf} from 'type-fest';

type UnknownTriplet = TupleOf<3>;
//=> [unknown, unknown, unknown]
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQK5gDYoDyAZgL5zFQQhwDkSqAtMSgM4y0DcAUNw2gFUAdgGshEAO5DMUYPhTwAvHBzySAHgDMAPh4B6PYu1wA2tlHipAGjjmxkoTbuWhAXSA)

Note: If the specified length is negative, the result will be an empty tuple.

@example
```
import type {TupleOf} from 'type-fest';

type EmptyTuple = TupleOf<-3, string>;
//=> []
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gFQK5gDYoDyAZgL5zFQQhwDkSqAtMSgM4y0DcAUNw2gFFwSHPjQBeOKIIkAPIwDMAGjjsowAHYBzAHw8A9PvE64AbQC6QA)

Note: If you need a readonly tuple, simply wrap this type with `Readonly`, for example, to create `readonly [number, number, number]` use `Readonly<TupleOf<3, number>>`.

@category Array
*/
export type TupleOf<Length extends number, Fill = unknown> = IfNotAnyOrNever<Length,
	_TupleOf<If<IsNegative<Length>, 0, Length>, Fill, []>,
	Fill[], []>;

type _TupleOf<L extends number, Fill, Accumulator extends UnknownArray> = number extends L
	? Fill[]
	: L extends Accumulator['length']
		? Accumulator
		: _TupleOf<L, Fill, [...Accumulator, Fill]>;

export {};
