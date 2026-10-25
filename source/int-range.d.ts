import type {TupleOf} from './tuple-of.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Absolute} from './absolute.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ReverseSign, TupleMin, UnwrapBrand} from './internal/index.d.ts';
import type {IntClosedRange} from './int-closed-range.d.ts'; // For `@link`

/**
Generate a union of numbers between a specified start (inclusive) and end (exclusive), with an optional step.

You skip over numbers using the `Step` parameter (defaults to `1`). For example, `IntRange<0, 10, 2>` will create a union of `0 | 2 | 4 | 6 | 8`.

Note: `Start` and `End` must each be between `-998` and `999`. Negative ranges reach TypeScript's instantiation-depth limit one value earlier, so their supported minimum is one smaller in magnitude than the maximum. If `Start` is greater than `End`, the result is `never`. A non-literal bound or step, such as `number`, also gives `never`.

Use-cases:
1. This can be used to define a set of valid input/output values. for example:

@example
```
import type {IntRange} from 'type-fest';

type Age = IntRange<0, 20>;
//=> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19

type FontSize = IntRange<10, 20>;
//=> 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19

type EvenNumber = IntRange<0, 11, 2>;
//=> 0 | 2 | 4 | 6 | 8 | 10

type Offset = IntRange<-3, 3>;
//=> -3 | -2 | -1 | 0 | 1 | 2
```

2. This can be used to define random numbers in a range. For example, `type RandomNumber = IntRange<0, 100>;`

@example
```
import type {IntRange} from 'type-fest';

type ZeroToNine = IntRange<0, 10>;
//=> 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9

type Hundreds = IntRange<100, 901, 100>;
//=> 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
```

@see {@link IntClosedRange}
*/
export type IntRange<Start extends number, End extends number, Step extends number = 1> =
	// Both bounds are distributed, because a comparison against a union only considers the first member, which would silently give a smaller range than the bound asks for. The result is the union of the ranges of every combination of members, so the widest pair of bounds decides how far the range reaches. `Start` needs it as much as `End` does: it is compared and counted through `TupleOf<Start>`, and `TupleOf<-1 | 0>` is an empty tuple, so a negative member was dropped and a positive one made the recursion non-terminating. Each `Step` member also generates its entire range independently, so the recursion cannot mix different steps between iterations.
	Start extends unknown
		? End extends unknown
			? Step extends unknown
				// Non-literal bounds or steps, like `number` or `any`, cannot be counted, so they give no range.
				// Check each member's primitive values before arithmetic so a brand cannot hide an unknown number; normalization follows distribution to retain finite alternatives beside it.
				// Numeric enum members also accept `number`, so compare printed values to recognize known bounds.
				? `${number}` extends `${UnwrapBrand<Start> | UnwrapBrand<End> | UnwrapBrand<Step>}`
					? never
					: IsNegative<Start> extends true
						? PrivateNegativeIntRange<Start, End, Step>
						: PrivateIntRange<Start, End, Step>
				: never // Should never happen
			: never // Should never happen
		: never; // Should never happen

/**
Removes `StepTuple['length']` elements from the front of `Tuple`, or empties it when it is too short.
*/
type DropStep<Tuple extends UnknownArray, StepTuple extends UnknownArray> =
	Tuple extends [...StepTuple, ...infer Rest extends UnknownArray] ? Rest : [];

/**
The implementation of `IntRange` for a negative `Start`.

A tuple length can never be negative, so instead of counting up to the value, `Magnitude` counts down from `-Start` and the value is `-Magnitude['length']`. Once `Magnitude` is too short to step again, the range has crossed zero and the rest is delegated to `PrivateIntRange`.
*/
type PrivateNegativeIntRange<
	Start extends number,
	End extends number,
	Step extends number,
	// How much of the range is left to generate, shortened by the bounded step each time, so the range stops at `End`
	Remaining extends UnknownArray = TupleOf<Subtract<End, Start>>,
	// A `Step` below `1` cannot advance the range, so fall back to `1` like `PrivateIntRange` does. A step beyond the remaining span needs no larger tuple.
	StepTuple extends UnknownArray = TupleOf<TupleMin<[Step, Remaining['length']]>> extends [] ? [unknown] : TupleOf<TupleMin<[Step, Remaining['length']]>>,
	// The magnitude of the current value, so the value itself is `-Magnitude['length']`
	Magnitude extends UnknownArray = TupleOf<Absolute<Start>>,
	Result = never,
> = Remaining extends []
	? Result
	: Magnitude extends [...StepTuple, ...infer NextMagnitude extends UnknownArray]
		? PrivateNegativeIntRange<Start, End, Step, DropStep<Remaining, StepTuple>, StepTuple, NextMagnitude, Result | ReverseSign<Magnitude['length']>>
		// Less than a step is left below zero, so `Crossover` is the amount the next step overshoots it by, and counting up can take over from there
		: StepTuple extends [...Magnitude, ...infer Crossover extends UnknownArray]
			? Result | ReverseSign<Magnitude['length']> | PrivateIntRange<Crossover['length'], End, Step>
			: never;

/**
The actual implementation of `IntRange`. It's private because it has some arguments that don't need to be exposed.
*/
type PrivateIntRange<
	Start extends number,
	End extends number,
	Step extends number,
	// The gap between each number, gap = step - 1
	Gap extends number = Subtract<Step, 1>,
	// Count positions from `Start` without storing generated values in the tuple.
	Counter extends unknown[] = TupleOf<Start>,
	EndLengthTuple extends unknown[] = TupleOf<End>,
	// Avoid `GreaterThan<Start, End>` here because the extra type instantiations would make `IntRange<0, 999>` exceed TypeScript's instantiation-depth limit
	// `TupleOf` represents a negative length as an empty tuple, so a negative `End` must be detected before comparing the tuple lengths
	// Recursive calls pass `false` because reversal only depends on the initial bounds; the termination checks below still handle reaching or overshooting `End` without repeating this tuple comparison
	IsReversed extends boolean = IsNegative<End> extends true ? true : Counter extends [...EndLengthTuple, unknown, ...unknown[]] ? true : false,
	// The values reached while advancing the counter.
	Result extends number = never,
> = IsReversed extends true
	? never
	: Gap extends 0
	// Handle the case that without `Step`
		? Counter['length'] extends EndLengthTuple['length'] // Compare against the already normalized endpoint so branded bounds can terminate.
			? Result // Return the values reached before the exclusive end.
			: PrivateIntRange<Start, End, Step, Gap, [...Counter, unknown], EndLengthTuple, false, Result | Counter['length']>
	// Handle the case that with `Step`; a gap larger than the end only needs enough padding to reach it.
		: Counter extends [...EndLengthTuple, ...unknown[]] // The result of "Counter[length] >= End", because the `...TupleOf<Gap>` maybe make `Counter` too long.
			? Result
			: PrivateIntRange<Start, End, Step, Gap, [...Counter, unknown, ...TupleOf<TupleMin<[Gap, EndLengthTuple['length']]>>], EndLengthTuple, false, Result | Counter['length']>;

export {};
