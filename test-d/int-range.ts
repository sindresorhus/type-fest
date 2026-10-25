import {expectTypeOf} from 'nz';
import type {Opaque, Tagged} from '../index.d.ts';
import type {IntRange} from '../source/int-range.d.ts';

declare const test: IntRange<0, 5>;
expectTypeOf(test).toBe<0 | 1 | 2 | 3 | 4>();

declare const startTest: IntRange<5, 10>;
expectTypeOf(startTest).toBe<5 | 6 | 7 | 8 | 9>();

declare const stepTest1: IntRange<10, 20, 2>;
expectTypeOf(stepTest1).toBe<10 | 12 | 14 | 16 | 18>();

// Test for step > end - start
declare const stepTest2: IntRange<10, 20, 100>;
expectTypeOf(stepTest2).toBe<10>();

declare const maxNumberTest: IntRange<0, 999>;
expectTypeOf(maxNumberTest).toBeAssignableTo<number>();

// A range that spans both sides of zero is generated in two halves, so it can be much wider
type WideTest = IntRange<-998, 998>;
expectTypeOf<-998>().toBeAssignableTo<WideTest>();
expectTypeOf<0>().toBeAssignableTo<WideTest>();
expectTypeOf<997>().toBeAssignableTo<WideTest>();
expectTypeOf<998>().not.toBeAssignableTo<WideTest>();

// The documented bounds
type FullRange = IntRange<-998, 999>;
expectTypeOf<-998>().toBeAssignableTo<FullRange>();
expectTypeOf<998>().toBeAssignableTo<FullRange>();
expectTypeOf<999>().not.toBeAssignableTo<FullRange>();
expectTypeOf<-999>().not.toBeAssignableTo<FullRange>();

// Empty range
declare const emptyTest: IntRange<5, 5>;
expectTypeOf(emptyTest).toBe<never>();

// Negative start
declare const negativeTest: IntRange<-2, 2>;
expectTypeOf(negativeTest).toBe<-2 | -1 | 0 | 1>();

// Both negative
declare const bothNegativeTest: IntRange<-5, -2>;
expectTypeOf(bothNegativeTest).toBe<-5 | -4 | -3>();

// Empty negative range
declare const emptyNegativeTest: IntRange<-5, -5>;
expectTypeOf(emptyNegativeTest).toBe<never>();

// Single negative value
declare const singleNegativeTest: IntRange<-1, 0>;
expectTypeOf(singleNegativeTest).toBe<-1>();

// Negative start with a step crossing zero
declare const negativeStepTest: IntRange<-5, 5, 3>;
expectTypeOf(negativeStepTest).toBe<-5 | -2 | 1 | 4>();

// Negative start with step > end - start
declare const negativeStepTest2: IntRange<-2, 2, 100>;
expectTypeOf(negativeStepTest2).toBe<-2>();

// A non-positive step falls back to `1`, same as for a non-negative start
declare const zeroStepTest: IntRange<-2, 2, 0>;
expectTypeOf(zeroStepTest).toBe<-2 | -1 | 0 | 1>();

// Start greater than end
declare const reversedTest: IntRange<2, -2>;
expectTypeOf(reversedTest).toBe<never>();

declare const reversedTest2: IntRange<5, 2>;
expectTypeOf(reversedTest2).toBe<never>();

declare const reversedFromZeroTest: IntRange<0, -1>;
expectTypeOf(reversedFromZeroTest).toBe<never>();

declare const anyTest: IntRange<any, any>;
expectTypeOf(anyTest).toBe<never>();

// A non-literal bound has no range to count, the same as a non-literal `End`.
expectTypeOf<IntRange<any, 4>>().toBe<never>();
expectTypeOf<IntRange<number, 4>>().toBe<never>();
expectTypeOf<IntRange<0, any>>().toBe<never>();
expectTypeOf<IntRange<0, number>>().toBe<never>();
expectTypeOf<IntRange<-2, number>>().toBe<never>();
expectTypeOf<IntRange<-2, any>>().toBe<never>();
expectTypeOf<IntRange<-2 | 2, number, 2>>().toBe<never>();

declare const neverTest: IntRange<never, never>;
expectTypeOf(neverTest).toBe<never>();

// @ts-expect-error
type UnknownTest = IntRange<unknown, unknown>;

// A union bound silently keeps only its first member, so `IntRange<0, 5 | 10>` gives `0..4` where the range `0..9` is what the numbers mean. The union of both single-bound ranges is what is expected, because a range covers every value up to the bound.
declare const unionEnd: IntRange<0, 5 | 10>;
expectTypeOf(unionEnd).toBe<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>();

// The start is a bound the same way the end is, so it is distributed for the same reason.
declare const unionStart: IntRange<-1 | 0, 2>;
expectTypeOf(unionStart).toBe<-1 | 0 | 1>();

declare const unionStartOnlyNegative: IntRange<-2 | 0, 1>;
expectTypeOf(unionStartOnlyNegative).toBe<-2 | -1 | 0>();

declare const unionStartBothSigns: IntRange<-2 | 1, 3>;
expectTypeOf(unionStartBothSigns).toBe<-2 | -1 | 0 | 1 | 2>();

declare const unionStartWithStep: IntRange<0 | 2, 6, 2>;
expectTypeOf(unionStartWithStep).toBe<0 | 2 | 4>();

// The end is exclusive, so a range whose start equals its end is empty. `show.sh` truncates a long union, which makes an inclusive end look plausible, so these count the members exactly.
declare const emptyRange: IntRange<0, 0>;
expectTypeOf(emptyRange).toBe<never>();

declare const singleValue: IntRange<0, 1>;
expectTypeOf(singleValue).toBe<0>();

declare const threeValues: IntRange<0, 3>;
expectTypeOf(threeValues).toBe<0 | 1 | 2>();

declare const fromThree: IntRange<3, 6>;
expectTypeOf(fromThree).toBe<3 | 4 | 5>();

declare const stepTwoShort: IntRange<0, 4, 2>;
expectTypeOf(stepTwoShort).toBe<0 | 2>();

declare const stepTwoOnEnd: IntRange<0, 5, 2>;
expectTypeOf(stepTwoOnEnd).toBe<0 | 2 | 4>();

declare const negativeRange: IntRange<-3, 3>;
expectTypeOf(negativeRange).toBe<-3 | -2 | -1 | 0 | 1 | 2>();

// A union bound is distributed for every shape of pair, including one where the members are equal to each other and one where they are far apart.
expectTypeOf<IntRange<0 | 1, 2>>().toBe<0 | 1>();
expectTypeOf<IntRange<-3 | 0, 1>>().toBe<-3 | -2 | -1 | 0>();
expectTypeOf<IntRange<0, 5 | 10>>().toBe<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>();
expectTypeOf<IntRange<0, 9, 2 | 4>>().toBe<0 | 2 | 4 | 6 | 8>();

// Different steps produce complete ranges independently, rather than mixing the steps between iterations.
expectTypeOf<IntRange<0, 7, 2 | 3>>().toBe<0 | 2 | 3 | 4 | 6>();
expectTypeOf<IntRange<-4, 3, 2 | 3>>().toBe<-4 | -2 | -1 | 0 | 2>();

// A brand on the exclusive end does not prevent the counter from reaching it.
expectTypeOf<IntRange<0, Tagged<3, 'Limit'>>>().toBe<0 | 1 | 2>();
expectTypeOf<IntRange<-2, Tagged<3, 'Limit'>>>().toBe<-2 | -1 | 0 | 1 | 2>();

expectTypeOf<IntRange<Tagged<1, 'Start'>, Tagged<4, 'Limit'>>>().toBe<1 | 2 | 3>();
expectTypeOf<IntRange<Tagged<-5, 'Start'>, Tagged<-1, 'Limit'>>>().toBe<-5 | -4 | -3 | -2>();
expectTypeOf<IntRange<3, Tagged<3, 'Limit'>>>().toBe<never>();
expectTypeOf<IntRange<4, Tagged<3, 'Limit'>>>().toBe<never>();
expectTypeOf<IntRange<-3, Tagged<-3, 'Limit'>>>().toBe<never>();
expectTypeOf<IntRange<-2, Tagged<-3, 'Limit'>>>().toBe<never>();
expectTypeOf<IntRange<-1, Tagged<0, 'Limit'>>>().toBe<-1>();
expectTypeOf<IntRange<0, Tagged<-1, 'Limit'>>>().toBe<never>();
expectTypeOf<IntRange<0, Opaque<3, 'Limit'>>>().toBe<0 | 1 | 2>();
expectTypeOf<IntRange<0, Tagged<Tagged<3, 'Limit'>, 'Validated'>>>().toBe<0 | 1 | 2>();
expectTypeOf<IntRange<0, 3 & {readonly __brand: unique symbol}>>().toBe<0 | 1 | 2>();
expectTypeOf<IntRange<Tagged<0 | 2, 'Start'>, Tagged<3 | 4, 'Limit'>>>().toBe<0 | 1 | 2 | 3>();
expectTypeOf<IntRange<0, 3 | Tagged<4, 'Limit'>>>().toBe<0 | 1 | 2 | 3>();
expectTypeOf<IntRange<-5, Tagged<5, 'Limit'>, Tagged<3, 'Step'>>>().toBe<-5 | -2 | 1 | 4>();
expectTypeOf<IntRange<0, Tagged<7, 'Limit'>, 2 | 3>>().toBe<0 | 2 | 3 | 4 | 6>();
expectTypeOf<IntRange<never, Tagged<3, 'Limit'>>>().toBe<never>();

// The normalized comparison still supports the documented maximum exclusive end.
type BrandedMaximumRange = IntRange<0, Tagged<999, 'Limit'>>;
expectTypeOf<0>().toBeAssignableTo<BrandedMaximumRange>();
expectTypeOf<998>().toBeAssignableTo<BrandedMaximumRange>();
expectTypeOf<999>().not.toBeAssignableTo<BrandedMaximumRange>();
expectTypeOf<IntRange<998, Tagged<999, 'Limit'>>>().toBe<998>();

// A step beyond the bounded range contributes only its start, without building an oversized gap tuple.
expectTypeOf<IntRange<0, 10, 10_000>>().toBe<0>();
expectTypeOf<IntRange<3, 10, 10_000>>().toBe<3>();
expectTypeOf<IntRange<-2, 2, 10_000>>().toBe<-2>();
expectTypeOf<IntRange<-5, -2, 10_000>>().toBe<-5>();

// The step cap keeps the exclusive boundary and the existing fallback for nonpositive steps.
expectTypeOf<IntRange<2, 9, 7>>().toBe<2>();
expectTypeOf<IntRange<-5, 4, 9>>().toBe<-5>();
expectTypeOf<IntRange<-5, 5, 9>>().toBe<-5 | 4>();
expectTypeOf<IntRange<1, 4, -2>>().toBe<1 | 2 | 3>();
expectTypeOf<IntRange<-2, 2, -2>>().toBe<-2 | -1 | 0 | 1>();
expectTypeOf<IntRange<3, 3, 10_000>>().toBe<never>();
expectTypeOf<IntRange<3, 2, 10_000>>().toBe<never>();
expectTypeOf<IntRange<-998, 999, 1_000_000>>().toBe<-998>();

enum LargeRangeStep {
	Skip = 10_000,
}
expectTypeOf<IntRange<-2, 3, LargeRangeStep.Skip>>().toBe<-2>();
expectTypeOf<IntRange<-2, 3, Tagged<10_000, 'Step'>>>().toBe<-2>();
expectTypeOf<IntRange<-2 | 1, 3 | 5, 10_000>>().toBe<-2 | 1>();
expectTypeOf<IntRange<0, 7, 2 | 10_000>>().toBe<0 | 2 | 4 | 6>();

function readRangeTable<Value>(values: Record<IntRange<-3, 4, 2>, Value>): Value {
	return values[-1];
}

expectTypeOf(readRangeTable({'-3': 'first', '-1': 'second', 1: 'third', 3: 'last'} as const)).toBe<'first' | 'second' | 'third' | 'last'>();

declare function acceptsLargeStep<const Value extends IntRange<3, 10, 10_000>>(value: Value): Value;
expectTypeOf(acceptsLargeStep(3)).toBe<3>();
// @ts-expect-error No later value is reached when the step exceeds the range.
acceptsLargeStep(4);

// The generated values remain numeric even when the bounds and step are generic.
function _rangeResult<Start extends number, End extends number, Step extends number>(value: IntRange<Start, End, Step>): number {
	return value;
}

expectTypeOf<IntRange<0, 5, never>>().toBe<never>();
// @ts-expect-error A step must be numeric.
type UnknownStep = IntRange<0, 5, unknown>;

// A stepped interval keeps only reached positions, including the last partial step.
expectTypeOf<IntRange<3, 22, 4>>().toBe<3 | 7 | 11 | 15 | 19>();

function makeRangeTable<const Value>(value: Value): Record<IntRange<2, 8, 2>, Value> {
	return {2: value, 4: value, 6: value};
}

const inferredRangeTable = makeRangeTable({id: 'item'});
expectTypeOf(inferredRangeTable[4]).toBe<{readonly id: 'item'}>();
// @ts-expect-error The exclusive endpoint is not a generated position.
const _excludedBoundary: unknown = inferredRangeTable[8];
// @ts-expect-error Inferred nested values retain their readonly property.
inferredRangeTable[4].id = 'item';

// Counting positions separately retains the first value and a partial final step.
expectTypeOf<IntRange<19, 20, 2>>().toBe<19>();
expectTypeOf<IntRange<-7, 8, 4>>().toBe<-7 | -3 | 1 | 5>();

function _readReachedValue<Value>(values: Record<IntRange<3, 22, 4>, Value>): Value {
	return values[19];
}

function isPage<End extends number>(value: number, end: End): value is IntRange<0, End> {
	return Number.isSafeInteger(value) && value >= 0 && value < end;
}

declare const pageCandidate: number;
if (isPage(pageCandidate, 5)) {
	expectTypeOf(pageCandidate).toBe<0 | 1 | 2 | 3 | 4>();
}

// Numeric enum bounds represent their numeric values, not an unknown number.
enum RangeBoundary {
	Start = 1,
	End = 4,
	NegativeStart = -3,
	Zero = 0,
}
expectTypeOf<IntRange<RangeBoundary.Start, RangeBoundary.End>>().toBe<1 | 2 | 3>();
expectTypeOf<IntRange<RangeBoundary.NegativeStart, RangeBoundary.Start>>().toBe<-3 | -2 | -1 | 0>();
expectTypeOf<IntRange<RangeBoundary.Zero, RangeBoundary.End>>().toBe<0 | 1 | 2 | 3>();

// Enum steps and unions retain the same inclusive-start, exclusive-end semantics.
enum RangeStep {
	Two = 2,
}
expectTypeOf<IntRange<RangeBoundary.NegativeStart, RangeBoundary.End, RangeStep.Two>>().toBe<-3 | -1 | 1 | 3>();
expectTypeOf<IntRange<RangeBoundary.Start | RangeBoundary.Zero, RangeBoundary.End, RangeStep.Two>>().toBe<0 | 1 | 2 | 3>();
expectTypeOf<IntRange<RangeBoundary.End, RangeBoundary.Start>>().toBe<never>();
expectTypeOf<IntRange<RangeBoundary.Start, RangeBoundary.Start>>().toBe<never>();

// An enum whose value is unknown cannot provide a countable starting point.
declare enum UnknownBoundary {
	Start,
}
expectTypeOf<IntRange<UnknownBoundary.Start, 4>>().toBe<never>();

declare function acceptsEnumRange<Value extends IntRange<RangeBoundary.Start, RangeBoundary.End>>(value: Value): Value;
expectTypeOf(acceptsEnumRange(2)).toBe<2>();
// @ts-expect-error The exclusive endpoint is outside the range.
acceptsEnumRange(4);
// @ts-expect-error Values below the starting bound are outside the range.
acceptsEnumRange(0);

// Stepped termination stops both on an exact boundary and after overshooting it.
expectTypeOf<IntRange<12, 21, 3>>().toBe<12 | 15 | 18>();
expectTypeOf<IntRange<12, 20, 3>>().toBe<12 | 15 | 18>();
expectTypeOf<IntRange<2, 20, 4 | 7>>().toBe<2 | 6 | 9 | 10 | 14 | 16 | 18>();

// A brand does not make an unknown numeric bound countable.
expectTypeOf<IntRange<Tagged<number, 'Start'>, 4>>().toBe<never>();
expectTypeOf<IntRange<Opaque<number, 'Start'>, 4>>().toBe<never>();
expectTypeOf<IntRange<number & {readonly __brand: unique symbol}, 4>>().toBe<never>();
expectTypeOf<IntRange<-2, Tagged<number, 'End'>>>().toBe<never>();

// An unknown step cannot identify reached positions inside the interval.
expectTypeOf<IntRange<0, 4, number>>().toBe<never>();
expectTypeOf<IntRange<-2, 2, number>>().toBe<never>();
expectTypeOf<IntRange<0, 4, any>>().toBe<never>();
expectTypeOf<IntRange<0, 4, Tagged<number, 'Step'>>>().toBe<never>();

// Reject an unknown branded choice without losing the other finite choices.
expectTypeOf<IntRange<Tagged<number, 'Start'> | 1, 4>>().toBe<1 | 2 | 3>();
expectTypeOf<IntRange<0, 5, Tagged<number, 'Step'> | 2>>().toBe<0 | 2 | 4>();

expectTypeOf<IntRange<0, Tagged<number, 'End'> | 3>>().toBe<0 | 1 | 2>();
expectTypeOf<IntRange<0, 4, Opaque<number, 'Step'>>>().toBe<never>();
expectTypeOf<IntRange<Tagged<Tagged<number, 'Start'>, 'Validated'>, 4>>().toBe<never>();
expectTypeOf<IntRange<-3, 3, Opaque<2, 'Step'>>>().toBe<-3 | -1 | 1>();

function makeBrandedRangeTable<const Value>(value: Value): Record<IntRange<Tagged<-1, 'Start'>, Tagged<4, 'End'>, Tagged<2, 'Step'>>, Value> {
	return {'-1': value, 1: value, 3: value};
}

const brandedRangeTable = makeBrandedRangeTable({id: 'kept'});
expectTypeOf(brandedRangeTable[1]).toBe<{readonly id: 'kept'}>();
// @ts-expect-error The exclusive endpoint is not a reached position.
expectTypeOf(brandedRangeTable[4]);
