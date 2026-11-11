import {expectTypeOf} from 'nz';
import type {ArraySlice, Flavor, IntRange, NegativeInfinity, Opaque, PositiveInfinity, Tagged, TupleMax, TupleMin, TupleOf} from '../index.d.ts';

expectTypeOf<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0]>>().toBe<7>();
expectTypeOf<TupleMax<[1, 2, 5, 3, 7, -9, -5, 0, PositiveInfinity]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMax<[1, 1, 1, 1, 1, 1]>>().toBe<1>();
expectTypeOf<TupleMax<[-1, -2, -5]>>().toBe<-1>();
expectTypeOf<TupleMax<[10, 2]>>().toBe<10>();

// Enum members are compared by their known values, like in `TupleMin`.
enum Limit {
	Low = 1,
	High = 5,
}
expectTypeOf<TupleMax<[Limit.Low, 2]>>().toBe<2>();
expectTypeOf<TupleMax<[Limit.High, 2]>>().toBe<Limit.High>();
expectTypeOf<TupleMax<[1, number]>>().toBe<never>();

// Every possible integer choice contributes its own maximum, independent of tuple position.
expectTypeOf<TupleMax<[1 | 4, 3]>>().toBe<3 | 4>();
expectTypeOf<TupleMax<[3, 1 | 4]>>().toBe<3 | 4>();
expectTypeOf<TupleMax<[1 | 4, 2 | 3]>>().toBe<2 | 3 | 4>();
expectTypeOf<TupleMax<[1 | 4]>>().toBe<1 | 4>();
expectTypeOf<TupleMax<[Tagged<1 | 4, 'Bound'>, 3]>>().toBe<Tagged<4, 'Bound'> | 3>();
expectTypeOf<TupleMax<[]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMax<any>>().toBe<never>();
expectTypeOf<TupleMax<never>>().toBe<never>();
expectTypeOf<TupleMax<[1] | [number]>>().toBe<1>();
expectTypeOf<TupleMax<[number]>>().toBe<never>();

// Unknown-length arrays cannot determine an exact maximum.
expectTypeOf<TupleMax<Array<1>>>().toBe<never>();
expectTypeOf<TupleMax<[1, ...Array<2>]>>().toBe<never>();
expectTypeOf<TupleMax<[...Array<1>, 2]>>().toBe<never>();
expectTypeOf<TupleMax<[Tagged<number, 'Bound'>, 3]>>().toBe<never>();
// @ts-expect-error Candidates must be numbers.
type UnknownMaximumCandidate = TupleMax<[unknown]>;

declare function maximum<const Values extends number[]>(...values: Values): TupleMax<Values>;
expectTypeOf(maximum(1 as 1 | 4, 3)).toBe<3 | 4>();

function _readGenericMaximum<Value extends number>(value: TupleMax<[Value, 3]>): number {
	return value;
}

// Empty, singleton, readonly, labelled, and const-inferred tuples.
expectTypeOf<TupleMax<readonly []>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMax<[0]>>().toBe<0>();
expectTypeOf<TupleMax<[-42]>>().toBe<-42>();
expectTypeOf<TupleMax<readonly [2, 8, 4]>>().toBe<8>();
expectTypeOf<TupleMax<readonly [low: 2, high: 8]>>().toBe<8>();
const concurrencyLimits = [2, 4, 8] as const;
expectTypeOf<TupleMax<typeof concurrencyLimits>>().toBe<8>();

// Position, equality, signs, and different digit lengths.
expectTypeOf<TupleMax<[9, 2, 1]>>().toBe<9>();
expectTypeOf<TupleMax<[1, 9, 2]>>().toBe<9>();
expectTypeOf<TupleMax<[1, 2, 9]>>().toBe<9>();
expectTypeOf<TupleMax<[-100, -9, -10]>>().toBe<-9>();
expectTypeOf<TupleMax<[-1, 0, -2]>>().toBe<0>();
expectTypeOf<TupleMax<[0, -0]>>().toBe<0>();
expectTypeOf<TupleMax<[999, 1000, 99]>>().toBe<1000>();
expectTypeOf<TupleMax<[1_000_000, 999_999, -1_000_000]>>().toBe<1_000_000>();
expectTypeOf<TupleMax<[9_007_199_254_740_990, 9_007_199_254_740_991]>>().toBe<9_007_199_254_740_991>();
expectTypeOf<TupleMax<[0b10, 0o10, 0x10]>>().toBe<16>();

// Decimals compare numerically, including unequal fractional lengths.
expectTypeOf<TupleMax<[1.25, 1.5, 1.05]>>().toBe<1.5>();
expectTypeOf<TupleMax<[1.01, 1.001, 1]>>().toBe<1.01>();
expectTypeOf<TupleMax<[0.9, 1, 0.99]>>().toBe<1>();
expectTypeOf<TupleMax<[9.9, 10.01]>>().toBe<10.01>();
expectTypeOf<TupleMax<[-1.25, -1.5, -1.05]>>().toBe<-1.05>();
expectTypeOf<TupleMax<[-0.5, 0, 0.25]>>().toBe<0.25>();
expectTypeOf<TupleMax<[0.000001, 0.000002]>>().toBe<0.000002>();
expectTypeOf<TupleMax<[1.5 | 4.5, 3.5]>>().toBe<3.5 | 4.5>();

// Infinities remain valid candidates, including when every value is infinite.
expectTypeOf<TupleMax<[PositiveInfinity]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMax<[NegativeInfinity]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMax<[NegativeInfinity, NegativeInfinity]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMax<[PositiveInfinity, -1, NegativeInfinity]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMax<[NegativeInfinity, -3]>>().toBe<-3>();
expectTypeOf<TupleMax<[PositiveInfinity | 1, 3]>>().toBe<PositiveInfinity | 3>();

// Tuple unions preserve correlations; each element union represents independent choices.
expectTypeOf<TupleMax<[1, 4] | readonly [8, 2]>>().toBe<4 | 8>();
expectTypeOf<TupleMax<[1, 4] | [4, 1]>>().toBe<4>();
expectTypeOf<TupleMax<[] | [2, 5]>>().toBe<NegativeInfinity | 5>();
expectTypeOf<TupleMax<[1, 2] | [never, 3]>>().toBe<2>();
expectTypeOf<TupleMax<[1, 2] | number[]>>().toBe<2>();
expectTypeOf<TupleMax<[1, 2] | [3, ...Array<4>]>>().toBe<2>();
expectTypeOf<TupleMax<[1 | 4, 2 | 5, 3 | 6]>>().toBe<3 | 4 | 5 | 6>();
expectTypeOf<TupleMax<[1 | 2, 3 | 4]>>().toBe<3 | 4>();
expectTypeOf<TupleMax<[-4 | -1, -3 | -2]>>().toBe<-3 | -2 | -1>();

// Unknown and impossible numeric elements cannot produce an exact result.
expectTypeOf<TupleMax<[any]>>().toBe<never>();
expectTypeOf<TupleMax<[1, any, 3]>>().toBe<never>();
expectTypeOf<TupleMax<[never]>>().toBe<never>();
expectTypeOf<TupleMax<[never, 3]>>().toBe<never>();
expectTypeOf<TupleMax<[3, never]>>().toBe<never>();
expectTypeOf<TupleMax<[PositiveInfinity, number]>>().toBe<never>();
expectTypeOf<TupleMax<readonly number[]>>().toBe<never>();
expectTypeOf<TupleMax<any[]>>().toBe<never>();
expectTypeOf<TupleMax<never[]>>().toBe<never>();
expectTypeOf<TupleMax<[1, ...Array<2>, 3]>>().toBe<never>();

// Literal brands are retained, and broad brands must not hide unknown values.
expectTypeOf<TupleMax<[Tagged<5, 'Count'>, 3]>>().toBe<Tagged<5, 'Count'>>();
expectTypeOf<TupleMax<[1, Tagged<5, 'Count'>]>>().toBe<Tagged<5, 'Count'>>();
expectTypeOf<TupleMax<[Tagged<3, 'First'>, Tagged<3, 'Second'>]>>().toBe<Tagged<3, 'First'>>();
expectTypeOf<TupleMax<[3, Tagged<3, 'Count'>]>>().toBe<3>();
expectTypeOf<TupleMax<[Tagged<NegativeInfinity, 'Bound'>]>>().toBe<Tagged<NegativeInfinity, 'Bound'>>();
expectTypeOf<TupleMax<[Tagged<NegativeInfinity, 'Bound'>, NegativeInfinity]>>().toBe<Tagged<NegativeInfinity, 'Bound'>>();
expectTypeOf<TupleMax<[Tagged<1.5, 'Scale'>, 1]>>().toBe<Tagged<1.5, 'Scale'>>();
expectTypeOf<TupleMax<[Opaque<5, 'Count'>, 3]>>().toBe<Opaque<5, 'Count'>>();
expectTypeOf<TupleMax<[Tagged<Tagged<5, 'Count'>, 'Checked'>, 3]>>().toBe<Tagged<Tagged<5, 'Count'>, 'Checked'>>();
expectTypeOf<TupleMax<[Opaque<number, 'Count'>, 3]>>().toBe<never>();
expectTypeOf<TupleMax<[3, Tagged<number, 'Count'>]>>().toBe<never>();
expectTypeOf<TupleMax<[(number & {}), 3]>>().toBe<never>();

// Known enum values are comparable, while runtime enum values are unknown.
expectTypeOf<TupleMax<[Limit.Low, Limit.High]>>().toBe<Limit.High>();
expectTypeOf<TupleMax<[Limit]>>().toBe<Limit>();
expectTypeOf<TupleMax<[Limit, 3]>>().toBe<3 | Limit.High>();
expectTypeOf<TupleMax<[Limit.High, 5]>>().toBe<Limit.High>();
declare enum RuntimeLimit {
	Value,
}
expectTypeOf<TupleMax<[RuntimeLimit.Value, 3]>>().toBe<never>();

// Composition, negative assignability, and generic inference through the public exports.
expectTypeOf<TupleMax<[TupleMax<[2, 5]>, TupleMin<[3, 8]>]>>().toBe<5>();
expectTypeOf<TupleMax<[...TupleOf<50, -1>, 2]>>().toBe<2>();
expectTypeOf<2>().not.toBeAssignableTo<TupleMax<[1, 2, 5]>>();
expectTypeOf(maximum()).toBe<NegativeInfinity>();
expectTypeOf(maximum(...concurrencyLimits)).toBe<8>();
expectTypeOf(maximum(1.25, 1.5, 1.05)).toBe<1.5>();
declare function maximumFromTuple<const Values extends readonly number[]>(values: Values): TupleMax<Values>;
expectTypeOf(maximumFromTuple(concurrencyLimits)).toBe<8>();
declare const alternateLimits: readonly [2, 4] | readonly [8, 1];
expectTypeOf(maximumFromTuple(alternateLimits)).toBe<4 | 8>();

// @ts-expect-error The accumulator is not part of the public API.
type ExtraMaximumArgument = TupleMax<[1], 2>;
// @ts-expect-error Unknown inputs must be narrowed to numeric tuples.
type UnknownMaximum = TupleMax<unknown>;
// @ts-expect-error Optional elements are not supported.
type OptionalMaximum = TupleMax<[1, 2?]>;
// @ts-expect-error Bigints are not accepted by Math.max().
type BigIntMaximum = TupleMax<[1n, 2n]>;
// @ts-expect-error Strings are not numeric elements.
type StringMaximum = TupleMax<[1, '2']>;
// @ts-expect-error Explicit undefined is not a numeric element.
type UndefinedMaximum = TupleMax<[1, undefined]>;
// @ts-expect-error Scalar numbers are not tuples.
type ScalarMaximum = TupleMax<1>;

// Equal values retain the earliest winner, even after it replaces an earlier candidate.
expectTypeOf<TupleMax<[Tagged<3, 'Second'>, Tagged<3, 'First'>]>>().toBe<Tagged<3, 'Second'>>();
expectTypeOf<TupleMax<[Tagged<3, 'Count'>, 3]>>().toBe<Tagged<3, 'Count'>>();
expectTypeOf<TupleMax<[1, Tagged<5, 'First'>, 2, Tagged<5, 'Last'>]>>().toBe<Tagged<5, 'First'>>();
expectTypeOf<TupleMax<[Tagged<1, 'First'>, Tagged<5, 'Second'>, 3]>>().toBe<Tagged<5, 'Second'>>();
expectTypeOf<TupleMax<[Tagged<5, 'First'>, 6, Tagged<5, 'Last'>]>>().toBe<6>();
expectTypeOf<TupleMax<[Tagged<3, 'Count', 'first'>, Tagged<3, 'Count', 'last'>]>>().toBe<Tagged<3, 'Count', 'first'>>();
expectTypeOf<TupleMax<[Opaque<3, 'First'>, Opaque<3, 'Last'>]>>().toBe<Opaque<3, 'First'>>();
expectTypeOf<TupleMax<[Tagged<0, 'Zero'>, -0]>>().toBe<Tagged<0, 'Zero'>>();
expectTypeOf<TupleMax<[Tagged<-1.5, 'Scale'>, -1.5, -2]>>().toBe<Tagged<-1.5, 'Scale'>>();

// Independent branded choices preserve both the winning value and its identity.
expectTypeOf<TupleMax<[Tagged<1, 'Low'> | Tagged<4, 'High'>, Tagged<3, 'Middle'>]>>().toBe<Tagged<4, 'High'> | Tagged<3, 'Middle'>>();
expectTypeOf<TupleMax<[Tagged<1 | 5, 'First'>, Tagged<5, 'Second'>]>>().toBe<Tagged<5, 'First'> | Tagged<5, 'Second'>>();
expectTypeOf<TupleMax<[Tagged<5, 'First'> | Tagged<5, 'Second'>, Tagged<5, 'Last'>]>>().toBe<Tagged<5, 'First'> | Tagged<5, 'Second'>>();
expectTypeOf<TupleMax<[Tagged<1 | 4, 'First'>, Tagged<2 | 4, 'Second'>]>>().toBe<Tagged<4, 'First'> | Tagged<2 | 4, 'Second'>>();
expectTypeOf<TupleMax<[0, Tagged<1 | 4, 'First'>, Tagged<2 | 4, 'Second'>, 3]>>().toBe<3 | Tagged<4, 'First'> | Tagged<4, 'Second'>>();
expectTypeOf<TupleMax<[Tagged<1 | 4, 'First'>, Tagged<2 | 4, 'Second'>, Tagged<4, 'Last'>]>>().toBe<Tagged<4, 'First'> | Tagged<4, 'Second'> | Tagged<4, 'Last'>>();
expectTypeOf<TupleMax<[Tagged<3, 'Count'> | 2]>>().toBe<Tagged<3, 'Count'> | 2>();

// Single-object custom brands and optional flavors use the same comparison contract.
type Count = 5 & {readonly __brand: 'Count'};
type OptionalCount = 5 & {readonly __brand?: 'Count'};
expectTypeOf<TupleMax<[Count, 3]>>().toBe<Count>();
expectTypeOf<TupleMax<[3, Count]>>().toBe<Count>();
expectTypeOf<TupleMax<[Count, 5]>>().toBe<Count>();
expectTypeOf<TupleMax<[5, Count]>>().toBe<5>();
expectTypeOf<TupleMax<[OptionalCount, 3]>>().toBe<OptionalCount>();
expectTypeOf<TupleMax<[Flavor<5, 'Count'>, 3]>>().toBe<Flavor<5, 'Count'>>();
expectTypeOf<TupleMax<[1, Flavor<5, 'Count'>]>>().toBe<Flavor<5, 'Count'>>();
expectTypeOf<TupleMax<[Flavor<5, 'Count'>, Flavor<5, 'Other'>]>>().toBe<Flavor<5, 'Count'>>();
expectTypeOf<TupleMax<[Flavor<1 | 5, 'Count'>, 3]>>().toBe<3 | Flavor<5, 'Count'>>();
expectTypeOf<TupleMax<[number & {readonly __brand: 'Count'}, 3]>>().toBe<never>();
expectTypeOf<TupleMax<[number & {readonly __brand?: 'Count'}, 3]>>().toBe<never>();
expectTypeOf<TupleMax<[Flavor<number, 'Count'>, 3]>>().toBe<never>();

// Enums with equal, negative, decimal, and automatically assigned values keep their member types.
enum Offset {
	Negative = -10,
	Fraction = -1.5,
	Zero = 0,
	Positive = 5,
	Next,
}
enum OtherLimit {
	High = 5,
}
enum MixedLimit {
	Numeric = 5,
	Text = 'unlimited',
}
const enum FixedLimit {
	High = 8,
}
expectTypeOf<TupleMax<[Offset.Negative, -20]>>().toBe<Offset.Negative>();
expectTypeOf<TupleMax<[Offset.Fraction, -2]>>().toBe<Offset.Fraction>();
expectTypeOf<TupleMax<[Offset.Fraction, -1]>>().toBe<-1>();
expectTypeOf<TupleMax<[Offset.Zero, -1]>>().toBe<Offset.Zero>();
expectTypeOf<TupleMax<[Offset, 3]>>().toBe<3 | Offset.Positive | Offset.Next>();
expectTypeOf<TupleMax<[Offset, Offset]>>().toBe<Offset>();
expectTypeOf<TupleMax<[Offset.Next, Offset.Positive]>>().toBe<Offset.Next>();
expectTypeOf<TupleMax<[Limit.High, OtherLimit.High]>>().toBe<Limit.High>();
expectTypeOf<TupleMax<[OtherLimit.High, Limit.High]>>().toBe<OtherLimit.High>();
expectTypeOf<TupleMax<[5, Limit.High]>>().toBe<5>();
expectTypeOf<TupleMax<[FixedLimit.High, 7]>>().toBe<FixedLimit.High>();
expectTypeOf<TupleMax<[MixedLimit.Numeric, 3]>>().toBe<MixedLimit.Numeric>();
expectTypeOf<TupleMax<[Tagged<Limit.High, 'Count'>, 3]>>().toBe<Tagged<Limit.High, 'Count'>>();

// Infinity does not short-circuit validation or discard a first winner's brand.
expectTypeOf<TupleMax<[1, Tagged<PositiveInfinity, 'Limit'>, PositiveInfinity]>>().toBe<Tagged<PositiveInfinity, 'Limit'>>();
expectTypeOf<TupleMax<[PositiveInfinity, Tagged<PositiveInfinity, 'Limit'>]>>().toBe<PositiveInfinity>();
expectTypeOf<TupleMax<[NegativeInfinity, Tagged<-1, 'Count'>]>>().toBe<Tagged<-1, 'Count'>>();
expectTypeOf<TupleMax<[NegativeInfinity | 2, PositiveInfinity | 1]>>().toBe<1 | 2 | PositiveInfinity>();
expectTypeOf<TupleMax<[NegativeInfinity | PositiveInfinity, NegativeInfinity | PositiveInfinity]>>().toBe<NegativeInfinity | PositiveInfinity>();
expectTypeOf<TupleMax<[PositiveInfinity, never]>>().toBe<never>();
expectTypeOf<TupleMax<[PositiveInfinity, any]>>().toBe<never>();
expectTypeOf<TupleMax<[PositiveInfinity, Tagged<number, 'Count'>]>>().toBe<never>();

// A changing accumulator must still reject an impossible or unknown later element.
expectTypeOf<TupleMax<[1, 5, never, 2]>>().toBe<never>();
expectTypeOf<TupleMax<[1, 5, 2, never]>>().toBe<never>();
expectTypeOf<TupleMax<[1, 5, any]>>().toBe<never>();
expectTypeOf<TupleMax<[any, 5, 2]>>().toBe<never>();
expectTypeOf<TupleMax<[1, 5, number]>>().toBe<never>();
expectTypeOf<TupleMax<[1 | Tagged<number, 'Count'>, 3]>>().toBe<never>();
expectTypeOf<TupleMax<[1, Opaque<number, 'Count'>]>>().toBe<never>();
expectTypeOf<TupleMax<[Tagged<Tagged<number, 'Count'>, 'Checked'>]>>().toBe<never>();
expectTypeOf<TupleMax<readonly [any, ...Array<1>]>>().toBe<never>();
expectTypeOf<TupleMax<readonly [...Array<1>, 2]>>().toBe<never>();
expectTypeOf<TupleMax<[...never[], 2]>>().toBe<never>();

// Validation applies independently to each tuple alternative, including different lengths.
expectTypeOf<TupleMax<readonly [2] | [1, 4, 3] | readonly [8, 5]>>().toBe<2 | 4 | 8>();
expectTypeOf<TupleMax<readonly [] | [2] | readonly [1, 4, 3]>>().toBe<NegativeInfinity | 2 | 4>();
expectTypeOf<TupleMax<[2, 4] | [Tagged<number, 'Count'>]>>().toBe<4>();
expectTypeOf<TupleMax<[2, 4] | [RuntimeLimit.Value]>>().toBe<4>();
expectTypeOf<TupleMax<[2, 4] | [any]>>().toBe<4>();
expectTypeOf<TupleMax<[2, 4] | [1, never]>>().toBe<4>();
expectTypeOf<TupleMax<readonly [] | readonly [number]>>().toBe<NegativeInfinity>();
expectTypeOf<TupleMax<[Tagged<number, 'Count'>] | readonly [any]>>().toBe<never>();
expectTypeOf<TupleMax<[Tagged<4, 'First'>, 1] | readonly [1, Tagged<4, 'Second'>]>>().toBe<Tagged<4, 'First'> | Tagged<4, 'Second'>>();

// Finite spreads retain their exact length, even when the spread itself is a union.
expectTypeOf<TupleMax<[...[2, 5], ...readonly [3, 4]]>>().toBe<5>();
expectTypeOf<TupleMax<readonly [1, ...([2] | [3, 4])]>>().toBe<2 | 4>();
expectTypeOf<TupleMax<[...([] | [2, 5]), 3]>>().toBe<3 | 5>();
expectTypeOf<TupleMax<[...TupleOf<3, 1 | 2>, 0]>>().toBe<1 | 2>();
expectTypeOf<TupleMax<[...TupleOf<40, 1>, Tagged<5, 'Count'>, ...TupleOf<40, 2>]>>().toBe<Tagged<5, 'Count'>>();

// Later choices can replace, tie, or lose against each possible accumulated result.
expectTypeOf<TupleMax<[1 | 5, 2 | 4, 3]>>().toBe<3 | 4 | 5>();
expectTypeOf<TupleMax<[0 | 2, 1 | 3, 2 | 4, 3 | 5]>>().toBe<3 | 4 | 5>();
expectTypeOf<TupleMax<[-2 | 0, -1 | 1, 0]>>().toBe<0 | 1>();
expectTypeOf<TupleMax<[1 | 2 | 3, 1 | 2 | 3, 1 | 2 | 3]>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleMax<[-1.5 | 0.5, -0.5 | 1.5]>>().toBe<-0.5 | 0.5 | 1.5>();
expectTypeOf<TupleMax<[-10, -2, -5]>>().toBe<-2>();
expectTypeOf<TupleMax<[10.001, 10.01, 10.0001]>>().toBe<10.01>();
expectTypeOf<TupleMax<[-10.001, -10.01, -10.0001]>>().toBe<-10.0001>();

// Public wrappers preserve inferred const tuples and return never for widened numeric values.
expectTypeOf(maximumFromTuple([])).toBe<NegativeInfinity>();
expectTypeOf(maximumFromTuple([7])).toBe<7>();
expectTypeOf(maximumFromTuple([1, 7, 3])).toBe<7>();
expectTypeOf(maximumFromTuple([1, 7, 3] satisfies [number, number, number])).toBe<never>();
expectTypeOf(maximumFromTuple([1, 7, 3] as number[])).toBe<never>();
expectTypeOf(maximumFromTuple([1, 7, 3] as readonly number[])).toBe<never>();
expectTypeOf(maximum(1, Limit.High, 3 as Tagged<3, 'Count'>)).toBe<Limit.High>();
expectTypeOf(maximum(1, 7 as Tagged<7, 'Count'>, Limit.High)).toBe<Tagged<7, 'Count'>>();
expectTypeOf(maximum(1, 7 as number)).toBe<never>();
expectTypeOf(maximum(1, 7 as any)).toBe<never>();

// The consumers moved to the public TupleMin retain their clamping and step behavior.
expectTypeOf<ArraySlice<readonly ['a', 'b', 'c', 'd'], TupleMax<[0, 1]>, TupleMax<[2, 10]>>>().toBe<readonly ['b', 'c', 'd']>();
expectTypeOf<ArraySlice<['a', 'b', 'c', 'd'], 0, TupleMax<[2 | 3, 1]>>>().toBe<['a', 'b'] | ['a', 'b', 'c']>();
expectTypeOf<IntRange<1, TupleMax<[3, 5]>, 2>>().toBe<1 | 3>();
expectTypeOf<IntRange<-4, 3, TupleMax<[2, 20]>>>().toBe<-4>();
expectTypeOf<TupleMax<[TupleMax<[1 | 4, 2]>, TupleMax<[3, 5 | 6]>]>>().toBe<5 | 6>();
expectTypeOf<TupleMax<[TupleMin<[]>, TupleMax<[]>]>>().toBe<PositiveInfinity>();

// @ts-expect-error A heterogeneous enum includes a string member.
type MixedEnumMaximum = TupleMax<[MixedLimit]>;
// @ts-expect-error Readonly optional tuples are not supported.
type ReadonlyOptionalMaximum = TupleMax<readonly [1?, 2?]>;
// @ts-expect-error Null is not a numeric element.
type NullMaximum = TupleMax<[null]>;
// @ts-expect-error Booleans are not numeric elements.
type BooleanMaximum = TupleMax<[true, 2]>;
// @ts-expect-error Objects are not numeric elements.
type ObjectMaximum = TupleMax<[{value: 1}]>;
// @ts-expect-error Functions are not numeric elements.
type FunctionMaximum = TupleMax<[() => 1]>;
// @ts-expect-error Symbols are not numeric elements.
type SymbolMaximum = TupleMax<[symbol]>;
// @ts-expect-error Nested tuples are not numeric elements.
type NestedMaximum = TupleMax<[[1, 2]]>;

// Check every ordered pair independently, so a wrong result cannot vanish into a union.
type NumericCandidate = -100 | -10 | -1.5 | -1 | 0 | 0.25 | 2 | 10 | 100;
expectTypeOf<{
	[First in NumericCandidate]: {[Second in NumericCandidate]: TupleMax<[First, Second]>};
}>().toBe<{
	[-100]: {[-100]: -100; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0.25; 2: 2; 10: 10; 100: 100};
	[-10]: {[-100]: -10; [-10]: -10; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0.25; 2: 2; 10: 10; 100: 100};
	[-1.5]: {[-100]: -1.5; [-10]: -1.5; [-1.5]: -1.5; [-1]: -1; 0: 0; 0.25: 0.25; 2: 2; 10: 10; 100: 100};
	[-1]: {[-100]: -1; [-10]: -1; [-1.5]: -1; [-1]: -1; 0: 0; 0.25: 0.25; 2: 2; 10: 10; 100: 100};
	0: {[-100]: 0; [-10]: 0; [-1.5]: 0; [-1]: 0; 0: 0; 0.25: 0.25; 2: 2; 10: 10; 100: 100};
	0.25: {[-100]: 0.25; [-10]: 0.25; [-1.5]: 0.25; [-1]: 0.25; 0: 0.25; 0.25: 0.25; 2: 2; 10: 10; 100: 100};
	2: {[-100]: 2; [-10]: 2; [-1.5]: 2; [-1]: 2; 0: 2; 0.25: 2; 2: 2; 10: 10; 100: 100};
	10: {[-100]: 10; [-10]: 10; [-1.5]: 10; [-1]: 10; 0: 10; 0.25: 10; 2: 10; 10: 10; 100: 100};
	100: {[-100]: 100; [-10]: 100; [-1.5]: 100; [-1]: 100; 0: 100; 0.25: 100; 2: 100; 10: 100; 100: 100};
}>();
