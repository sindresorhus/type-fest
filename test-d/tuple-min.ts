import {expectTypeOf} from 'nz';
import type {ArraySlice, Flavor, IntRange, NegativeInfinity, Opaque, PositiveInfinity, Tagged, TupleMax, TupleMin, TupleOf} from '../index.d.ts';

expectTypeOf<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0]>>().toBe<-9>();
expectTypeOf<TupleMin<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity, NegativeInfinity]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMin<[1, 1, 1, 1, 1, 1]>>().toBe<1>();
expectTypeOf<TupleMin<[-1, -2, -5]>>().toBe<-5>();
expectTypeOf<TupleMin<[-1, -2, number, -5]>>().toBe<never>();

// Every possible integer choice contributes its own minimum, independent of tuple position.
expectTypeOf<TupleMin<[1 | 4, 3]>>().toBe<1 | 3>();
expectTypeOf<TupleMin<[3, 1 | 4]>>().toBe<1 | 3>();
expectTypeOf<TupleMin<[1 | 4, 2 | 3]>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleMin<[1 | 4]>>().toBe<1 | 4>();
expectTypeOf<TupleMin<[Tagged<1 | 4, 'Bound'>, 3]>>().toBe<Tagged<1, 'Bound'> | 3>();
expectTypeOf<TupleMin<[]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMin<any>>().toBe<never>();
expectTypeOf<TupleMin<never>>().toBe<never>();
expectTypeOf<TupleMin<[1] | [number]>>().toBe<1>();
expectTypeOf<TupleMin<[number]>>().toBe<never>();

// Unknown-length arrays cannot determine an exact minimum.
expectTypeOf<TupleMin<Array<1>>>().toBe<never>();
expectTypeOf<TupleMin<[1, ...Array<2>]>>().toBe<never>();
expectTypeOf<TupleMin<[...Array<1>, 2]>>().toBe<never>();
expectTypeOf<TupleMin<[Tagged<number, 'Bound'>, 3]>>().toBe<never>();
// @ts-expect-error Candidates must be numbers.
type UnknownMinimumCandidate = TupleMin<[unknown]>;

declare function minimum<const Values extends number[]>(...values: Values): TupleMin<Values>;
expectTypeOf(minimum(1 as 1 | 4, 3)).toBe<1 | 3>();

function _readGenericMinimum<Value extends number>(value: TupleMin<[Value, 3]>): number {
	return value;
}

// Empty, singleton, readonly, labelled, and const-inferred tuples.
expectTypeOf<TupleMin<readonly []>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMin<[0]>>().toBe<0>();
expectTypeOf<TupleMin<[-42]>>().toBe<-42>();
expectTypeOf<TupleMin<readonly [2, 8, 4]>>().toBe<2>();
expectTypeOf<TupleMin<readonly [low: 2, high: 8]>>().toBe<2>();
const retryDelays = [100, 250, 500] as const;
expectTypeOf<TupleMin<typeof retryDelays>>().toBe<100>();

// Position, equality, signs, and different digit lengths.
expectTypeOf<TupleMin<[1, 2, 9]>>().toBe<1>();
expectTypeOf<TupleMin<[9, 1, 2]>>().toBe<1>();
expectTypeOf<TupleMin<[9, 2, 1]>>().toBe<1>();
expectTypeOf<TupleMin<[-100, -9, -10]>>().toBe<-100>();
expectTypeOf<TupleMin<[1, 0, 2]>>().toBe<0>();
expectTypeOf<TupleMin<[0, -0]>>().toBe<0>();
expectTypeOf<TupleMin<[999, 1000, 99]>>().toBe<99>();
expectTypeOf<TupleMin<[1_000_000, 999_999, -1_000_000]>>().toBe<-1_000_000>();
expectTypeOf<TupleMin<[-9_007_199_254_740_990, -9_007_199_254_740_991]>>().toBe<-9_007_199_254_740_991>();
expectTypeOf<TupleMin<[0b10, 0o10, 0x10]>>().toBe<2>();

// Decimals compare numerically, including unequal fractional lengths.
expectTypeOf<TupleMin<[1.25, 1.5, 1.05]>>().toBe<1.05>();
expectTypeOf<TupleMin<[1.01, 1.001, 1]>>().toBe<1>();
expectTypeOf<TupleMin<[0.9, 1, 0.99]>>().toBe<0.9>();
expectTypeOf<TupleMin<[9.9, 10.01]>>().toBe<9.9>();
expectTypeOf<TupleMin<[-1.25, -1.5, -1.05]>>().toBe<-1.5>();
expectTypeOf<TupleMin<[-0.5, 0, 0.25]>>().toBe<-0.5>();
expectTypeOf<TupleMin<[0.000001, 0.000002]>>().toBe<0.000001>();
expectTypeOf<TupleMin<[1.5 | 4.5, 3.5]>>().toBe<1.5 | 3.5>();

// Infinities remain valid candidates, including when every value is infinite.
expectTypeOf<TupleMin<[PositiveInfinity]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMin<[NegativeInfinity]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMin<[PositiveInfinity, PositiveInfinity]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMin<[PositiveInfinity, -1, NegativeInfinity]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMin<[PositiveInfinity, -3]>>().toBe<-3>();
expectTypeOf<TupleMin<[NegativeInfinity | 1, 3]>>().toBe<NegativeInfinity | 1>();

// Tuple unions preserve correlations; each element union represents independent choices.
expectTypeOf<TupleMin<[1, 4] | readonly [8, 2]>>().toBe<1 | 2>();
expectTypeOf<TupleMin<[1, 4] | [4, 1]>>().toBe<1>();
expectTypeOf<TupleMin<[] | [2, 5]>>().toBe<PositiveInfinity | 2>();
expectTypeOf<TupleMin<[1, 2] | [never, 3]>>().toBe<1>();
expectTypeOf<TupleMin<[1, 2] | number[]>>().toBe<1>();
expectTypeOf<TupleMin<[1, 2] | [3, ...Array<4>]>>().toBe<1>();
expectTypeOf<TupleMin<[1 | 4, 2 | 5, 3 | 6]>>().toBe<1 | 2 | 3 | 4>();
expectTypeOf<TupleMin<[1 | 2, 3 | 4]>>().toBe<1 | 2>();
expectTypeOf<TupleMin<[-4 | -1, -3 | -2]>>().toBe<-4 | -3 | -2>();

// Unknown and impossible numeric elements cannot produce an exact result.
expectTypeOf<TupleMin<[any]>>().toBe<never>();
expectTypeOf<TupleMin<[1, any, 3]>>().toBe<never>();
expectTypeOf<TupleMin<[never]>>().toBe<never>();
expectTypeOf<TupleMin<[never, 3]>>().toBe<never>();
expectTypeOf<TupleMin<[3, never]>>().toBe<never>();
expectTypeOf<TupleMin<[NegativeInfinity, number]>>().toBe<never>();
expectTypeOf<TupleMin<readonly number[]>>().toBe<never>();
expectTypeOf<TupleMin<any[]>>().toBe<never>();
expectTypeOf<TupleMin<never[]>>().toBe<never>();
expectTypeOf<TupleMin<[1, ...Array<2>, 3]>>().toBe<never>();

// Literal brands are retained, and broad brands must not hide unknown values.
expectTypeOf<TupleMin<[Tagged<1, 'Count'>, 3]>>().toBe<Tagged<1, 'Count'>>();
expectTypeOf<TupleMin<[3, Tagged<1, 'Count'>]>>().toBe<Tagged<1, 'Count'>>();
expectTypeOf<TupleMin<[Tagged<3, 'First'>, Tagged<3, 'Second'>]>>().toBe<Tagged<3, 'First'>>();
expectTypeOf<TupleMin<[3, Tagged<3, 'Count'>]>>().toBe<3>();
expectTypeOf<TupleMin<[Tagged<PositiveInfinity, 'Bound'>]>>().toBe<Tagged<PositiveInfinity, 'Bound'>>();
expectTypeOf<TupleMin<[Tagged<PositiveInfinity, 'Bound'>, PositiveInfinity]>>().toBe<Tagged<PositiveInfinity, 'Bound'>>();
expectTypeOf<TupleMin<[Tagged<1.5, 'Scale'>, 2]>>().toBe<Tagged<1.5, 'Scale'>>();
expectTypeOf<TupleMin<[Opaque<1, 'Count'>, 3]>>().toBe<Opaque<1, 'Count'>>();
expectTypeOf<TupleMin<[Tagged<Tagged<1, 'Count'>, 'Checked'>, 3]>>().toBe<Tagged<Tagged<1, 'Count'>, 'Checked'>>();
expectTypeOf<TupleMin<[Opaque<number, 'Count'>, 3]>>().toBe<never>();
expectTypeOf<TupleMin<[3, Tagged<number, 'Count'>]>>().toBe<never>();
expectTypeOf<TupleMin<[(number & {}), 3]>>().toBe<never>();

// Known enum values are comparable, while runtime enum values are unknown.
enum Limit {
	Low = 1,
	High = 5,
}
expectTypeOf<TupleMin<[Limit.Low, 2]>>().toBe<Limit.Low>();
expectTypeOf<TupleMin<[Limit.High, 2]>>().toBe<2>();
expectTypeOf<TupleMin<[Limit.Low, Limit.High]>>().toBe<Limit.Low>();
expectTypeOf<TupleMin<[Limit]>>().toBe<Limit>();
expectTypeOf<TupleMin<[Limit, 3]>>().toBe<Limit.Low | 3>();
expectTypeOf<TupleMin<[Limit.Low, 1]>>().toBe<Limit.Low>();
declare enum RuntimeLimit {
	Value,
}
expectTypeOf<TupleMin<[RuntimeLimit.Value, 3]>>().toBe<never>();

// Composition, negative assignability, and generic inference through the public exports.
expectTypeOf<TupleMin<[TupleMax<[2, 5]>, TupleMin<[3, 8]>]>>().toBe<3>();
expectTypeOf<TupleMin<[...TupleOf<50, 1>, -2]>>().toBe<-2>();
expectTypeOf<2>().not.toBeAssignableTo<TupleMin<[1, 2, 5]>>();
expectTypeOf(minimum()).toBe<PositiveInfinity>();
expectTypeOf(minimum(...retryDelays)).toBe<100>();
expectTypeOf(minimum(1.25, 1.5, 1.05)).toBe<1.05>();
declare function minimumFromTuple<const Values extends readonly number[]>(values: Values): TupleMin<Values>;
expectTypeOf(minimumFromTuple(retryDelays)).toBe<100>();
declare const alternateLimits: readonly [2, 4] | readonly [8, 1];
expectTypeOf(minimumFromTuple(alternateLimits)).toBe<1 | 2>();

// @ts-expect-error The accumulator is not part of the public API.
type ExtraMinimumArgument = TupleMin<[1], 2>;
// @ts-expect-error Unknown inputs must be narrowed to numeric tuples.
type UnknownMinimum = TupleMin<unknown>;
// @ts-expect-error Optional elements are not supported.
type OptionalMinimum = TupleMin<[1, 2?]>;
// @ts-expect-error Bigints are not accepted by Math.min().
type BigIntMinimum = TupleMin<[1n, 2n]>;
// @ts-expect-error Strings are not numeric elements.
type StringMinimum = TupleMin<[1, '2']>;
// @ts-expect-error Explicit undefined is not a numeric element.
type UndefinedMinimum = TupleMin<[1, undefined]>;
// @ts-expect-error Scalar numbers are not tuples.
type ScalarMinimum = TupleMin<1>;

// Equal values retain the earliest winner, even after it replaces an earlier candidate.
expectTypeOf<TupleMin<[Tagged<3, 'Second'>, Tagged<3, 'First'>]>>().toBe<Tagged<3, 'Second'>>();
expectTypeOf<TupleMin<[Tagged<3, 'Count'>, 3]>>().toBe<Tagged<3, 'Count'>>();
expectTypeOf<TupleMin<[9, Tagged<1, 'First'>, 8, Tagged<1, 'Last'>]>>().toBe<Tagged<1, 'First'>>();
expectTypeOf<TupleMin<[Tagged<5, 'First'>, Tagged<1, 'Second'>, 3]>>().toBe<Tagged<1, 'Second'>>();
expectTypeOf<TupleMin<[Tagged<5, 'First'>, 4, Tagged<5, 'Last'>]>>().toBe<4>();
expectTypeOf<TupleMin<[Tagged<3, 'Count', 'first'>, Tagged<3, 'Count', 'last'>]>>().toBe<Tagged<3, 'Count', 'first'>>();
expectTypeOf<TupleMin<[Opaque<3, 'First'>, Opaque<3, 'Last'>]>>().toBe<Opaque<3, 'First'>>();
expectTypeOf<TupleMin<[Tagged<0, 'Zero'>, -0]>>().toBe<Tagged<0, 'Zero'>>();
expectTypeOf<TupleMin<[Tagged<-1.5, 'Scale'>, -1.5, -1]>>().toBe<Tagged<-1.5, 'Scale'>>();

// Independent branded choices preserve both the winning value and its identity.
expectTypeOf<TupleMin<[Tagged<1, 'Low'> | Tagged<4, 'High'>, Tagged<3, 'Middle'>]>>().toBe<Tagged<1, 'Low'> | Tagged<3, 'Middle'>>();
expectTypeOf<TupleMin<[Tagged<1 | 5, 'First'>, Tagged<1, 'Second'>]>>().toBe<Tagged<1, 'First'> | Tagged<1, 'Second'>>();
expectTypeOf<TupleMin<[Tagged<1, 'First'> | Tagged<1, 'Second'>, Tagged<1, 'Last'>]>>().toBe<Tagged<1, 'First'> | Tagged<1, 'Second'>>();
expectTypeOf<TupleMin<[Tagged<1 | 4, 'First'>, Tagged<1 | 3, 'Second'>]>>().toBe<Tagged<1, 'First'> | Tagged<1 | 3, 'Second'>>();
expectTypeOf<TupleMin<[5, Tagged<1 | 4, 'First'>, Tagged<1 | 3, 'Second'>, 2]>>().toBe<2 | Tagged<1, 'First'> | Tagged<1, 'Second'>>();
expectTypeOf<TupleMin<[Tagged<1 | 4, 'First'>, Tagged<1 | 3, 'Second'>, Tagged<1, 'Last'>]>>().toBe<Tagged<1, 'First'> | Tagged<1, 'Second'> | Tagged<1, 'Last'>>();
expectTypeOf<TupleMin<[Tagged<3, 'Count'> | 2]>>().toBe<Tagged<3, 'Count'> | 2>();

// Single-object custom brands and optional flavors use the same comparison contract.
type Count = 1 & {readonly __brand: 'Count'};
type OptionalCount = 1 & {readonly __brand?: 'Count'};
expectTypeOf<TupleMin<[Count, 3]>>().toBe<Count>();
expectTypeOf<TupleMin<[3, Count]>>().toBe<Count>();
expectTypeOf<TupleMin<[Count, 1]>>().toBe<Count>();
expectTypeOf<TupleMin<[1, Count]>>().toBe<1>();
expectTypeOf<TupleMin<[OptionalCount, 3]>>().toBe<OptionalCount>();
expectTypeOf<TupleMin<[Flavor<1, 'Count'>, 3]>>().toBe<Flavor<1, 'Count'>>();
expectTypeOf<TupleMin<[5, Flavor<1, 'Count'>]>>().toBe<Flavor<1, 'Count'>>();
expectTypeOf<TupleMin<[Flavor<1, 'Count'>, Flavor<1, 'Other'>]>>().toBe<Flavor<1, 'Count'>>();
expectTypeOf<TupleMin<[Flavor<1 | 5, 'Count'>, 3]>>().toBe<3 | Flavor<1, 'Count'>>();
expectTypeOf<TupleMin<[number & {readonly __brand: 'Count'}, 3]>>().toBe<never>();
expectTypeOf<TupleMin<[number & {readonly __brand?: 'Count'}, 3]>>().toBe<never>();
expectTypeOf<TupleMin<[Flavor<number, 'Count'>, 3]>>().toBe<never>();

// Enums with equal, negative, decimal, and automatically assigned values keep their member types.
enum Offset {
	Negative = -10,
	Fraction = -1.5,
	Zero = 0,
	Positive = 5,
	Next,
}
enum OtherLimit {
	Low = 1,
}
enum MixedLimit {
	Numeric = 1,
	Text = 'unlimited',
}
const enum FixedLimit {
	Low = -8,
}
expectTypeOf<TupleMin<[Offset.Negative, -5]>>().toBe<Offset.Negative>();
expectTypeOf<TupleMin<[Offset.Fraction, -1]>>().toBe<Offset.Fraction>();
expectTypeOf<TupleMin<[Offset.Fraction, -2]>>().toBe<-2>();
expectTypeOf<TupleMin<[Offset.Zero, 1]>>().toBe<Offset.Zero>();
expectTypeOf<TupleMin<[Offset, 3]>>().toBe<Offset.Negative | Offset.Fraction | Offset.Zero | 3>();
expectTypeOf<TupleMin<[Offset, Offset]>>().toBe<Offset>();
expectTypeOf<TupleMin<[Offset.Next, Offset.Positive]>>().toBe<Offset.Positive>();
expectTypeOf<TupleMin<[Limit.Low, OtherLimit.Low]>>().toBe<Limit.Low>();
expectTypeOf<TupleMin<[OtherLimit.Low, Limit.Low]>>().toBe<OtherLimit.Low>();
expectTypeOf<TupleMin<[1, Limit.Low]>>().toBe<1>();
expectTypeOf<TupleMin<[FixedLimit.Low, -7]>>().toBe<FixedLimit.Low>();
expectTypeOf<TupleMin<[MixedLimit.Numeric, 3]>>().toBe<MixedLimit.Numeric>();
expectTypeOf<TupleMin<[Tagged<Limit.Low, 'Count'>, 3]>>().toBe<Tagged<Limit.Low, 'Count'>>();

// Infinity does not short-circuit validation or discard a first winner's brand.
expectTypeOf<TupleMin<[1, Tagged<NegativeInfinity, 'Limit'>, NegativeInfinity]>>().toBe<Tagged<NegativeInfinity, 'Limit'>>();
expectTypeOf<TupleMin<[NegativeInfinity, Tagged<NegativeInfinity, 'Limit'>]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMin<[PositiveInfinity, Tagged<1, 'Count'>]>>().toBe<Tagged<1, 'Count'>>();
expectTypeOf<TupleMin<[NegativeInfinity | 2, PositiveInfinity | 1]>>().toBe<NegativeInfinity | 1 | 2>();
expectTypeOf<TupleMin<[NegativeInfinity | PositiveInfinity, NegativeInfinity | PositiveInfinity]>>().toBe<NegativeInfinity | PositiveInfinity>();
expectTypeOf<TupleMin<[NegativeInfinity, never]>>().toBe<never>();
expectTypeOf<TupleMin<[NegativeInfinity, any]>>().toBe<never>();
expectTypeOf<TupleMin<[NegativeInfinity, Tagged<number, 'Count'>]>>().toBe<never>();

// A changing accumulator must still reject an impossible or unknown later element.
expectTypeOf<TupleMin<[5, 1, never, 2]>>().toBe<never>();
expectTypeOf<TupleMin<[5, 1, 2, never]>>().toBe<never>();
expectTypeOf<TupleMin<[5, 1, any]>>().toBe<never>();
expectTypeOf<TupleMin<[any, 1, 2]>>().toBe<never>();
expectTypeOf<TupleMin<[5, 1, number]>>().toBe<never>();
expectTypeOf<TupleMin<[1 | Tagged<number, 'Count'>, 3]>>().toBe<never>();
expectTypeOf<TupleMin<[1, Opaque<number, 'Count'>]>>().toBe<never>();
expectTypeOf<TupleMin<[Tagged<Tagged<number, 'Count'>, 'Checked'>]>>().toBe<never>();
expectTypeOf<TupleMin<readonly [any, ...Array<1>]>>().toBe<never>();
expectTypeOf<TupleMin<readonly [...Array<1>, 2]>>().toBe<never>();
expectTypeOf<TupleMin<[...never[], 2]>>().toBe<never>();

// Validation applies independently to each tuple alternative, including different lengths.
expectTypeOf<TupleMin<readonly [2] | [1, 4, 3] | readonly [8, 5]>>().toBe<1 | 2 | 5>();
expectTypeOf<TupleMin<readonly [] | [2] | readonly [1, 4, 3]>>().toBe<PositiveInfinity | 1 | 2>();
expectTypeOf<TupleMin<[2, 4] | [Tagged<number, 'Count'>]>>().toBe<2>();
expectTypeOf<TupleMin<[2, 4] | [RuntimeLimit.Value]>>().toBe<2>();
expectTypeOf<TupleMin<[2, 4] | [any]>>().toBe<2>();
expectTypeOf<TupleMin<[2, 4] | [1, never]>>().toBe<2>();
expectTypeOf<TupleMin<readonly [] | readonly [number]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMin<[Tagged<number, 'Count'>] | readonly [any]>>().toBe<never>();
expectTypeOf<TupleMin<[Tagged<1, 'First'>, 4] | readonly [4, Tagged<1, 'Second'>]>>().toBe<Tagged<1, 'First'> | Tagged<1, 'Second'>>();

// Finite spreads retain their exact length, even when the spread itself is a union.
expectTypeOf<TupleMin<[...[2, 5], ...readonly [3, 4]]>>().toBe<2>();
expectTypeOf<TupleMin<readonly [5, ...([2] | [3, 4])]>>().toBe<2 | 3>();
expectTypeOf<TupleMin<[...([] | [2, 5]), 3]>>().toBe<2 | 3>();
expectTypeOf<TupleMin<[...TupleOf<3, 1 | 2>, 3]>>().toBe<1 | 2>();
expectTypeOf<TupleMin<[...TupleOf<40, 5>, Tagged<1, 'Count'>, ...TupleOf<40, 2>]>>().toBe<Tagged<1, 'Count'>>();

// Later choices can replace, tie, or lose against each possible accumulated result.
expectTypeOf<TupleMin<[1 | 5, 2 | 4, 3]>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleMin<[0 | 2, 1 | 3, 2 | 4, 3 | 5]>>().toBe<0 | 1 | 2>();
expectTypeOf<TupleMin<[-2 | 0, -1 | 1, 0]>>().toBe<-2 | -1 | 0>();
expectTypeOf<TupleMin<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleMin<[-1.5 | 0.5, -0.5 | 1.5]>>().toBe<-1.5 | -0.5 | 0.5>();
expectTypeOf<TupleMin<[-10, -2, -5]>>().toBe<-10>();
expectTypeOf<TupleMin<[10.001, 10.01, 10.0001]>>().toBe<10.0001>();
expectTypeOf<TupleMin<[-10.001, -10.01, -10.0001]>>().toBe<-10.01>();

// Public wrappers preserve inferred const tuples and return never for widened numeric values.
expectTypeOf(minimumFromTuple([])).toBe<PositiveInfinity>();
expectTypeOf(minimumFromTuple([7])).toBe<7>();
expectTypeOf(minimumFromTuple([1, 7, 3])).toBe<1>();
expectTypeOf(minimumFromTuple([1, 7, 3] satisfies [number, number, number])).toBe<never>();
expectTypeOf(minimumFromTuple([1, 7, 3] as number[])).toBe<never>();
expectTypeOf(minimumFromTuple([1, 7, 3] as readonly number[])).toBe<never>();
expectTypeOf(minimum(2, Limit.Low, 3 as Tagged<3, 'Count'>)).toBe<Limit.Low>();
expectTypeOf(minimum(3, -1 as Tagged<-1, 'Count'>, Limit.Low)).toBe<Tagged<-1, 'Count'>>();
expectTypeOf(minimum(1, 7 as number)).toBe<never>();
expectTypeOf(minimum(1, 7 as any)).toBe<never>();

// The consumers moved to the public TupleMin retain their clamping and step behavior.
expectTypeOf<ArraySlice<readonly ['a', 'b', 'c', 'd'], TupleMin<[1, 2]>, 20>>().toBe<readonly ['b', 'c', 'd']>();
expectTypeOf<ArraySlice<['a', 'b', 'c', 'd'], 0, TupleMin<[2 | 3, 4]>>>().toBe<['a', 'b'] | ['a', 'b', 'c']>();
expectTypeOf<IntRange<1, TupleMin<[3, 5]>, 2>>().toBe<1>();
expectTypeOf<IntRange<-4, 3, TupleMin<[2, 20]>>>().toBe<-4 | -2 | 0 | 2>();
expectTypeOf<TupleMin<[TupleMin<[1 | 4, 2]>, TupleMin<[3, 5 | 6]>]>>().toBe<1 | 2>();
expectTypeOf<TupleMin<[TupleMin<[]>, TupleMax<[]>]>>().toBe<NegativeInfinity>();

// @ts-expect-error A heterogeneous enum includes a string member.
type MixedEnumMinimum = TupleMin<[MixedLimit]>;
// @ts-expect-error Readonly optional tuples are not supported.
type ReadonlyOptionalMinimum = TupleMin<readonly [1?, 2?]>;
// @ts-expect-error Null is not a numeric element.
type NullMinimum = TupleMin<[null]>;
// @ts-expect-error Booleans are not numeric elements.
type BooleanMinimum = TupleMin<[true, 2]>;
// @ts-expect-error Objects are not numeric elements.
type ObjectMinimum = TupleMin<[{value: 1}]>;
// @ts-expect-error Functions are not numeric elements.
type FunctionMinimum = TupleMin<[() => 1]>;
// @ts-expect-error Symbols are not numeric elements.
type SymbolMinimum = TupleMin<[symbol]>;
// @ts-expect-error Nested tuples are not numeric elements.
type NestedMinimum = TupleMin<[[1, 2]]>;

// Check every ordered pair independently, so a wrong result cannot vanish into a union.
type NumericCandidate = -100 | -10 | -1.5 | -1 | 0 | 0.25 | 2 | 10 | 100;
expectTypeOf<{
	[First in NumericCandidate]: {[Second in NumericCandidate]: TupleMin<[First, Second]>};
}>().toBe<{
	[-100]: {[-100]: -100; [-10]: -100; [-1.5]: -100; [-1]: -100; 0: -100; 0.25: -100; 2: -100; 10: -100; 100: -100};
	[-10]: {[-100]: -100; [-10]: -10; [-1.5]: -10; [-1]: -10; 0: -10; 0.25: -10; 2: -10; 10: -10; 100: -10};
	[-1.5]: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1.5; 0: -1.5; 0.25: -1.5; 2: -1.5; 10: -1.5; 100: -1.5};
	[-1]: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: -1; 0.25: -1; 2: -1; 10: -1; 100: -1};
	0: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0; 2: 0; 10: 0; 100: 0};
	0.25: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0.25; 2: 0.25; 10: 0.25; 100: 0.25};
	2: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0.25; 2: 2; 10: 2; 100: 2};
	10: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0.25; 2: 2; 10: 10; 100: 10};
	100: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0.25; 2: 2; 10: 10; 100: 100};
}>();
