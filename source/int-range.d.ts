import type {BuildTuple, Subtract} from './internal';

/**
Create a union of numbers from `Start` (inclusive) to `End` (exclusive). Can skip numbers using `Step`.

Use-case: Easier to create union types of consecutive numbers.

@example
```
import type {IntRange} from 'type-fest';

// create union type `0 | 1 | ... | 9`
type ZeroToNine = IntRange<0, 10>;

// create union type `100 | 200 | 300 | ... | 900`
type Hundreds = IntRange<100, 901, 100>;
```
*/
export type IntRange<Start extends number, End extends number, Step extends number = 1> = PrivateIntRange<Start, End, Step>;

/**
The actual implementation of `IntRange`. It's private because it has some argument that don't need to be exposed.
*/
type PrivateIntRange<
	Start extends number,
	End extends number,
	Step extends number,
	Gap extends number = Subtract<Step, 1>, // The gap between each number, gap = step - 1
	List extends unknown[] = BuildTuple<Start, never>, // The final `List` is [...StartLengthTuple, ...[number, ...GapLengthTuple], ...[number, ...GapLengthTuple], ... ...], So can initialize the `List` with [...StartLengthTuple]
	EndLengthTuple extends unknown[] = BuildTuple<End>,
> = Gap extends 0 ?
	// Handle the case that without `Step`
	List['length'] extends End // The result of "List[length] === End"
		? Exclude<List[number], never> // All unused elements are `never`, so exclude them
		: PrivateIntRange<Start, End, Step, Gap, [...List, List['length'] ]>
	// Handle the case that with `Step`
	: List extends [...(infer U), ...EndLengthTuple] // The result of "List[length] >= End", because the `...BuildTuple<Gap, never>` maybe make `List` too long.
		? Exclude<List[number], never>
		: PrivateIntRange<Start, End, Step, Gap, [...List, List['length'], ...BuildTuple<Gap, never>]>;
