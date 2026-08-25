import type {TupleOf} from './tuple-of.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Absolute} from './absolute.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ReverseSign} from './internal/index.d.ts';

/**
Generate a union of numbers between a specified start (inclusive) and end (exclusive), with an optional step.

You skip over numbers using the `Step` parameter (defaults to `1`). For example, `IntRange<0, 10, 2>` will create a union of `0 | 2 | 4 | 6 | 8`.

Note: `Start` and `End` must each be between `-998` and `999`. Negative ranges reach TypeScript's instantiation-depth limit one value earlier, so their supported minimum is one smaller in magnitude than the maximum. If `Start` is greater than `End`, the result is `never`.

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
	IsNegative<Start> extends true
		? PrivateNegativeIntRange<Start, End, Step>
		: PrivateIntRange<Start, End, Step>;

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
	// A `Step` below `1` cannot advance the range, so fall back to `1` like `PrivateIntRange` does
	StepTuple extends UnknownArray = TupleOf<Step> extends [] ? [unknown] : TupleOf<Step>,
	// How much of the range is left to generate, shortened by `Step` each time, so the range stops at `End`
	Remaining extends UnknownArray = TupleOf<Subtract<End, Start>>,
	// The magnitude of the current value, so the value itself is `-Magnitude['length']`
	Magnitude extends UnknownArray = TupleOf<Absolute<Start>>,
	Result = never,
> = Remaining extends []
	? Result
	: Magnitude extends [...StepTuple, ...infer NextMagnitude extends UnknownArray]
		? PrivateNegativeIntRange<Start, End, Step, StepTuple, DropStep<Remaining, StepTuple>, NextMagnitude, Result | ReverseSign<Magnitude['length']>>
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
	// The final `List` is `[...StartLengthTuple, ...[number, ...GapLengthTuple], ...[number, ...GapLengthTuple], ... ...]`, so can initialize the `List` with `[...StartLengthTuple]`
	List extends unknown[] = TupleOf<Start, never>,
	EndLengthTuple extends unknown[] = TupleOf<End>,
	// Avoid `GreaterThan<Start, End>` here because the extra type instantiations would make `IntRange<0, 999>` exceed TypeScript's instantiation-depth limit
	// `TupleOf` represents a negative length as an empty tuple, so a negative `End` must be detected before comparing the tuple lengths
	// Recursive calls pass `false` because reversal only depends on the initial bounds; the termination checks below still handle reaching or overshooting `End` without repeating this tuple comparison
	IsReversed extends boolean = IsNegative<End> extends true ? true : List extends [...EndLengthTuple, unknown, ...unknown[]] ? true : false,
> = IsReversed extends true
	? never
	: Gap extends 0
	// Handle the case that without `Step`
		? List['length'] extends End // The result of "List[length] === End"
			? Exclude<List[number], never> // All unused elements are `never`, so exclude them
			: PrivateIntRange<Start, End, Step, Gap, [...List, List['length'] ], EndLengthTuple, false>
	// Handle the case that with `Step`
		: List extends [...(infer U), ...EndLengthTuple] // The result of "List[length] >= End", because the `...TupleOf<Gap, never>` maybe make `List` too long.
			? Exclude<List[number], never>
			: PrivateIntRange<Start, End, Step, Gap, [...List, List['length'], ...TupleOf<Gap, never>], EndLengthTuple, false>;

export {};
