import type {TupleOf} from './tuple-of.d.ts';
import type {Subtract} from './subtract.d.ts';

/**
Generate a union of numbers.

The numbers are created from the given `Start` (inclusive) parameter to the given `End` (exclusive) parameter.

You skip over numbers using the `Step` parameter (defaults to `1`). For example, `IntRange<0, 10, 2>` will create a union of `0 | 2 | 4 | 6 | 8`.

Note: `Start` or `End` must be non-negative and smaller than `1000`.

Use-cases:
1. This can be used to define a set of valid input/output values. for example:

@example
```
import type {IntRange} from 'type-fest';

type Age = IntRange<0, 120>;
//=> 0 | 1 | 2 | ... | 119

type FontSize = IntRange<10, 20>;
//=> 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19

type EvenNumber = IntRange<0, 11, 2>;
//=> 0 | 2 | 4 | 6 | 8 | 10
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQHYwEoCG2A5igL5wBmUEIcA5EqgLSUoDOM9A3AFC9M0AQVJwAvHBz4ipADwAGADRwAjACZ5APj4B6HWM1x5cAD6rTcNRYB0tiypUBOfoLgAxCLgDKwAF5oJKUISFFkVJUstXX1DcPsVeyszFQBmewAWewBWewA2ewB2ewAOe2cBZDQAUQA3FGwAOQBXEAAjFChxSVxguQiHZTVtXj0DIwskuEyzfLNS5PkgA)

2. This can be used to define random numbers in a range. For example, `type RandomNumber = IntRange<0, 100>;`

@example
```
import type {IntRange} from 'type-fest';

type ZeroToNine = IntRange<0, 10>;
//=> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Hundreds = IntRange<100, 901, 100>;
//=> 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQHYwEoCG2A5igL5wBmUEIcA5EqgLSUoDOM9A3AFC9M0ALRQ0AKhABywbGgC8cHPiKkAPAAYANHACM6gHx8A9Ebn646uAB9d1uACY7AZjsAWOwFY7ANjsB2OwAOOwBOfkE4AAkAV2wAEygUOPY4BSVCEhRVPS04EPUdbRzDXhMzXXVLG3tK51qbV3q4DybvJr8mwKb89SA)

@see {@link IntClosedRange}
*/
export type IntRange<Start extends number, End extends number, Step extends number = 1> = PrivateIntRange<Start, End, Step>;

/**
The actual implementation of `IntRange`. It's private because it has some arguments that don't need to be exposed.
*/
type PrivateIntRange<
	Start extends number,
	End extends number,
	Step extends number,
	// The gap between each number, gap = step - 1
	Gap extends number = Subtract<Step, 1>,
	// The final `List` is `[...StartLengthTuple, ...[number, ...GapLengthTuple], ...[number, ...GapLengthTuple], ... ...]`, so can initialize the `List` with `[...StartLengthTuple]`
	List extends unknown[] = TupleOf<Start, never>,
	EndLengthTuple extends unknown[] = TupleOf<End>,
> = Gap extends 0 ?
	// Handle the case that without `Step`
	List['length'] extends End // The result of "List[length] === End"
		? Exclude<List[number], never> // All unused elements are `never`, so exclude them
		: PrivateIntRange<Start, End, Step, Gap, [...List, List['length'] ]>
	// Handle the case that with `Step`
	: List extends [...(infer U), ...EndLengthTuple] // The result of "List[length] >= End", because the `...TupleOf<Gap, never>` maybe make `List` too long.
		? Exclude<List[number], never>
		: PrivateIntRange<Start, End, Step, Gap, [...List, List['length'], ...TupleOf<Gap, never>]>;

export {};
