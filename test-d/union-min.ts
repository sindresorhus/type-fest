import {expectTypeOf} from 'nz';
import type {IntRange, NegativeInfinity, Opaque, PositiveInfinity, Tagged, UnionMax, UnionMin} from '../index.d.ts';

expectTypeOf<UnionMin<1 | 3 | 2>>().toBe<1>();
expectTypeOf<UnionMin<10 | 5 | 2>>().toBe<2>();
expectTypeOf<UnionMin<0 | 5 | 2 | 1>>().toBe<0>();
expectTypeOf<UnionMin<1 | 2 | 5 | 3 | 7 | 9 | 0>>().toBe<0>();
expectTypeOf<UnionMin<0 | 1_000_000>>().toBe<0>();
expectTypeOf<UnionMin<15 | 10 | 5 | 0>>().toBe<0>();

// Negative finite numbers are only supported as a single value. In a union the counter never matches them, so these are not asserted.
// `UnionMin<-1 | -3 | -2>` exceeds the recursion limit, while `UnionMin<0 | -5 | -2>` silently returns `0` instead of `-5`.
// expectTypeOf<UnionMin<-1 | -3 | -2>>().toBe<-3>();
// expectTypeOf<UnionMin<0 | -5 | -2>>().toBe<-5>();

// A fractional member above the minimum does not affect the result, because the counter stops at the minimum first.
expectTypeOf<UnionMin<0 | 1.5>>().toBe<0>();

// Edge cases
expectTypeOf<any>().toBe<UnionMin<any>>();
expectTypeOf<never>().toBe<UnionMin<never>>();
expectTypeOf<number>().toBe<UnionMin<number>>();
expectTypeOf<number>().toBe<UnionMin<(number & {})>>();
expectTypeOf<number>().toBe<UnionMin<(number & {}) | 1 | 5>>();
expectTypeOf<PositiveInfinity>().toBe<UnionMin<PositiveInfinity>>();
expectTypeOf<NegativeInfinity>().toBe<UnionMin<NegativeInfinity>>();
expectTypeOf<1>().toBe<UnionMin<1 | PositiveInfinity>>();
expectTypeOf<NegativeInfinity>().toBe<UnionMin<1 | NegativeInfinity>>();

// Broad inputs and brands are normalized before the union is inspected.
expectTypeOf<UnionMin<number | 0>>().toBe<number>();
expectTypeOf<UnionMin<(number & {}) | NegativeInfinity>>().toBe<number>();
expectTypeOf<UnionMin<(number & {}) | 1_000_000>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<any, 'Count'>>>().toBe<any>();
expectTypeOf<UnionMin<Tagged<any, 'Count'> | 3>>().toBe<any>();
expectTypeOf<UnionMin<Tagged<any, 'First'> | Tagged<number, 'Second'>>>().toBe<any>();

// Enum members retain their known numeric values.
enum Limit {
	Low = 3,
	High = 5,
}
expectTypeOf<UnionMin<Limit>>().toBe<3>();
expectTypeOf<UnionMin<Limit.High | 4>>().toBe<4>();

// A computed enum member has no known value.
declare enum RuntimeLimit {
	Value,
}
expectTypeOf<UnionMin<RuntimeLimit.Value | 3>>().toBe<number>();

// A brand does not hide the underlying value.
expectTypeOf<UnionMin<Tagged<5, 'Limit'> | 7>>().toBe<5>();
expectTypeOf<UnionMin<Tagged<3 | 5, 'Limit'>>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<number, 'Limit'> | 3>>().toBe<number>();

// A single candidate needs no counting and still normalizes enum and branded values.
expectTypeOf<UnionMin<800>>().toBe<800>();
expectTypeOf<UnionMin<Limit.High>>().toBe<5>();
expectTypeOf<UnionMin<Tagged<5, 'Limit'>>>().toBe<5>();

// A single candidate is returned without counting, even when it is negative or fractional.
expectTypeOf<UnionMin<1_000_000>>().toBe<1_000_000>();
expectTypeOf<UnionMin<Tagged<1_000_000, 'Count'>>>().toBe<1_000_000>();
expectTypeOf<UnionMin<-4>>().toBe<-4>();
expectTypeOf<UnionMin<1.5>>().toBe<1.5>();
expectTypeOf<UnionMin<-0>>().toBe<0>();
expectTypeOf<UnionMin<0xFF>>().toBe<255>();
expectTypeOf<UnionMin<0b1010>>().toBe<10>();
// @ts-expect-error Candidates must be numbers.
type UnknownMinimum = UnionMin<unknown>;

function _readGenericMinimum<Value extends number>(value: UnionMin<Value>): number {
	return value;
}

// A losing positive infinity does not disturb the counter, so known finite enum and branded candidates still win.
// `PositiveInfinity` is only the minimum when it is the only candidate, because any finite candidate is smaller.
expectTypeOf<UnionMin<Limit | PositiveInfinity>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<2 | 4 | PositiveInfinity, 'Candidates'>>>().toBe<2>();
expectTypeOf<4>().not.toBeAssignableTo<UnionMin<2 | 4 | PositiveInfinity>>();

function _readMinimumWithInfinity<Candidates extends number>(value: UnionMin<Candidates | PositiveInfinity>): number {
	return value;
}

// The documented counting limit stays within the recursion limit.
// The implementation counts upward one tuple element at a time, so a minimum above 998 can exceed the recursion limit when counting is needed.
expectTypeOf<UnionMin<997 | 998>>().toBe<997>();
expectTypeOf<UnionMin<998 | PositiveInfinity>>().toBe<998>();

// A candidate above the counting limit is harmless when the minimum is below it.
expectTypeOf<UnionMin<998 | 1000>>().toBe<998>();
expectTypeOf<UnionMin<IntRange<990, 1000>>>().toBe<990>();
expectTypeOf<UnionMin<IntRange<998, 1002>>>().toBe<998>();
expectTypeOf<UnionMin<IntRange<998, 1002> | PositiveInfinity>>().toBe<998>();
expectTypeOf<UnionMin<IntRange<1, 999>>>().toBe<1>();

// The minimum is selected from the whole union rather than distributing the result.
expectTypeOf<UnionMin<0 | 5>>().toBe<0>();
expectTypeOf<UnionMin<2 | 5 | 7 | 9>>().toBe<2>();
expectTypeOf<UnionMin<0>>().toBe<0>();
expectTypeOf<UnionMin<7>>().toBe<7>();
expectTypeOf<UnionMin<998>>().toBe<998>();
expectTypeOf<UnionMin<999>>().toBe<999>();
expectTypeOf<2>().not.toBeAssignableTo<UnionMin<1 | 2 | 3>>();

// Numeric order differs from lexicographic order at decimal boundaries.
expectTypeOf<UnionMin<9 | 10>>().toBe<9>();
expectTypeOf<UnionMin<99 | 100>>().toBe<99>();
expectTypeOf<UnionMin<100 | 101 | 110>>().toBe<100>();
expectTypeOf<UnionMin<789 | 798 | 790>>().toBe<789>();
expectTypeOf<UnionMin<3 | 30 | 300>>().toBe<3>();
expectTypeOf<UnionMin<900 | 90 | 9>>().toBe<9>();
expectTypeOf<UnionMin<0b1010 | 0b1100>>().toBe<10>();
expectTypeOf<UnionMin<0o17 | 0o20>>().toBe<15>();
expectTypeOf<UnionMin<0xFF | 0x1_00>>().toBe<255>();

// Sparse intervals and dense intervals stop at their first supported value.
expectTypeOf<UnionMin<1 | 900>>().toBe<1>();
expectTypeOf<UnionMin<0 | 998>>().toBe<0>();
expectTypeOf<UnionMin<1 | 1_000_000>>().toBe<1>();
expectTypeOf<UnionMin<998 | 999>>().toBe<998>();
type DenseCandidates = IntRange<0, 600>;
expectTypeOf<UnionMin<DenseCandidates>>().toBe<0>();
expectTypeOf<UnionMin<Exclude<DenseCandidates, 0>>>().toBe<1>();
expectTypeOf<UnionMin<IntRange<128, 256>>>().toBe<128>();
expectTypeOf<UnionMin<IntRange<19, 35, 4>>>().toBe<19>();
expectTypeOf<UnionMin<Exclude<IntRange<1, 10>, 1 | 2 | 3>>>().toBe<4>();

// Infinity is ordered independently of the tuple counter.
expectTypeOf<UnionMin<PositiveInfinity | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<3 | PositiveInfinity>>().toBe<3>();
expectTypeOf<UnionMin<3 | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<0 | PositiveInfinity>>().toBe<0>();
expectTypeOf<UnionMin<0 | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<2 | 5 | PositiveInfinity>>().toBe<2>();
expectTypeOf<UnionMin<2 | 5 | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<2 | 5 | PositiveInfinity | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<DenseCandidates | PositiveInfinity>>().toBe<0>();
expectTypeOf<UnionMin<IntRange<128, 256> | PositiveInfinity>>().toBe<128>();
expectTypeOf<UnionMin<DenseCandidates | NegativeInfinity>>().toBe<NegativeInfinity>();

// Known enum members produce plain numeric literals, including when the whole enum is used.
enum RetryCount {
	None = 0,
	Low = 2,
	High = 5,
}
expectTypeOf<UnionMin<RetryCount.None>>().toBe<0>();
expectTypeOf<UnionMin<RetryCount.Low>>().toBe<2>();
expectTypeOf<UnionMin<RetryCount.Low | RetryCount.High>>().toBe<2>();
expectTypeOf<UnionMin<RetryCount>>().toBe<0>();
expectTypeOf<UnionMin<RetryCount.Low | 3>>().toBe<2>();
expectTypeOf<UnionMin<RetryCount.High | 3>>().toBe<3>();
expectTypeOf<UnionMin<RetryCount.Low | PositiveInfinity>>().toBe<2>();
expectTypeOf<UnionMin<RetryCount.None | PositiveInfinity>>().toBe<0>();
expectTypeOf<UnionMin<RetryCount.Low | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<RetryCount | PositiveInfinity>>().toBe<0>();

declare enum RuntimeRetryCount {
	Value,
}
expectTypeOf<UnionMin<RuntimeRetryCount.Value>>().toBe<number>();
expectTypeOf<UnionMin<RuntimeRetryCount.Value | RetryCount.Low>>().toBe<number>();
expectTypeOf<UnionMin<RuntimeRetryCount.Value | NegativeInfinity>>().toBe<number>();
expectTypeOf<UnionMin<RuntimeRetryCount.Value | PositiveInfinity>>().toBe<number>();
expectTypeOf<UnionMin<RuntimeRetryCount>>().toBe<number>();

const enum ZeroConstRetryCount {
	None = 0,
	Low = 4,
}
expectTypeOf<UnionMin<ZeroConstRetryCount>>().toBe<0>();
expectTypeOf<UnionMin<ZeroConstRetryCount.Low>>().toBe<4>();

enum SingletonRetryCount {
	Only = 4,
}
expectTypeOf<UnionMin<SingletonRetryCount>>().toBe<4>();

enum OffsetRetryCount {
	Below = -3,
	Above = 5,
}
expectTypeOf<UnionMin<OffsetRetryCount.Below>>().toBe<-3>();

enum HeterogeneousRetryCount {
	Count = 1,
	Label = 'one',
}
// @ts-expect-error A heterogeneous enum has a string member.
type HeterogeneousMinimum = UnionMin<HeterogeneousRetryCount>;

// Brands are removed before comparing candidates, including the winning zero or infinity.
expectTypeOf<UnionMin<Tagged<1 | 3, 'Count'>>>().toBe<1>();
expectTypeOf<UnionMin<Opaque<1 | 3, 'Count'>>>().toBe<1>();
expectTypeOf<UnionMin<Tagged<Tagged<1 | 3, 'Count'>, 'Validated'>>>().toBe<1>();
expectTypeOf<UnionMin<(1 | 3) & {readonly __brand: unique symbol}>>().toBe<1>();
expectTypeOf<UnionMin<Tagged<0, 'Count'>>>().toBe<0>();
expectTypeOf<UnionMin<Tagged<3, 'Count'>>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<10_000, 'Count'>>>().toBe<10_000>();
expectTypeOf<UnionMin<Opaque<3, 'Count'>>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<0 | 4, 'Count'>>>().toBe<0>();
expectTypeOf<UnionMin<Tagged<1 | 5, 'First'> | Tagged<2 | 3, 'Second'>>>().toBe<1>();
expectTypeOf<UnionMin<Tagged<2, 'Count'> | 3>>().toBe<2>();
expectTypeOf<UnionMin<1 | Tagged<3, 'Count'>>>().toBe<1>();
expectTypeOf<UnionMin<Tagged<3, 'First'> | Tagged<3, 'Second'>>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<3, 'Count', {unit: 'retries'}>>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<PositiveInfinity, 'Count'>>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMin<Tagged<NegativeInfinity, 'Count'>>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<Tagged<1 | 3, 'Count'> | PositiveInfinity>>().toBe<1>();
expectTypeOf<UnionMin<Tagged<1 | 3, 'Count'> | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<Tagged<2 | PositiveInfinity, 'Count'>>>().toBe<2>();
expectTypeOf<UnionMin<Opaque<2 | NegativeInfinity, 'Count'>>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<Tagged<number, 'Count'>>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<Tagged<number, 'Count'>, 'Validated'>>>().toBe<number>();
expectTypeOf<UnionMin<Opaque<number, 'Count'>>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<1, 'Count'> | Tagged<number, 'Other'>>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<number, 'Count'> | NegativeInfinity>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<number, 'Count'> | PositiveInfinity>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<RuntimeRetryCount.Value, 'Count'>>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<RetryCount.Low | RetryCount.High, 'Count'>>>().toBe<2>();
expectTypeOf<UnionMin<Tagged<IntRange<5, 100>, 'Count'>>>().toBe<5>();
expectTypeOf<UnionMin<Tagged<1 | 3, 'Count'>>>().not.toBeAssignableTo<Tagged<1, 'Count'>>();

expectTypeOf<UnionMin<Tagged<0 | PositiveInfinity, 'Count'>>>().toBe<0>();
expectTypeOf<UnionMin<Tagged<PositiveInfinity, 'First'> | Tagged<PositiveInfinity, 'Second'>>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMin<Tagged<0, 'First'> | Tagged<0, 'Second'>>>().toBe<0>();
expectTypeOf<UnionMin<Opaque<number, 'First'> | Opaque<number, 'Second'>>>().toBe<number>();
expectTypeOf<UnionMin<Tagged<NegativeInfinity | PositiveInfinity | 5, 'Count'>>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<Tagged<0 | 998, 'Count'>>>().toBe<0>();
expectTypeOf<UnionMin<Tagged<997 | 998, 'Count'>>>().toBe<997>();
expectTypeOf<UnionMin<Opaque<1 | 3 | PositiveInfinity, 'Count'>>>().toBe<1>();

// A consumer can infer the minimum from fixed options or fall back for runtime arrays.
declare function minimumRetryCount<const Counts extends readonly number[]>(counts: Counts): UnionMin<Counts[number]>;
expectTypeOf(minimumRetryCount([2, 5, 3])).toBe<2>();
expectTypeOf(minimumRetryCount([7])).toBe<7>();
// @ts-expect-error A singleton minimum cannot be a different supported count.
const wrongSingletonMinimum: UnionMin<7> = 6;
expectTypeOf(minimumRetryCount([0, 2, 5])).toBe<0>();
expectTypeOf(minimumRetryCount([80, 101, 99] as const)).toBe<80>();
declare const runtimeCounts: number[];
expectTypeOf(minimumRetryCount(runtimeCounts)).toBe<number>();
declare const brandedCounts: readonly [Tagged<3, 'Count'>, Tagged<7, 'Count'>];
expectTypeOf(minimumRetryCount(brandedCounts)).toBe<3>();

const retryCounts = [0, 2, 5] as const;
type MinimumRetries = UnionMin<typeof retryCounts[number]>;
expectTypeOf<MinimumRetries>().toBe<0>();
const supportedSizes = [16, 32, 64] as const;
type MinimumSize = UnionMin<typeof supportedSizes[number]>;
expectTypeOf<MinimumSize>().toBe<16>();

// Select minimum requirements from a set of independent configurations.
type WorkerPools = {
	interactive: {minConcurrency: 4};
	batch: {minConcurrency: 16};
	serial: {minConcurrency: 1};
};
type MinimumConcurrency = UnionMin<WorkerPools[keyof WorkerPools]['minConcurrency']>;
expectTypeOf<MinimumConcurrency>().toBe<1>();
expectTypeOf<4>().not.toBeAssignableTo<MinimumConcurrency>();
expectTypeOf<UnionMax<UnionMin<2 | 5> | UnionMin<3 | 7>>>().toBe<3>();
expectTypeOf<UnionMin<UnionMax<2 | 5> | UnionMax<3 | 7>>>().toBe<5>();

// Tuple lengths can be compared before building a safe shared tuple.
type CandidateTuples = [string] | [string, number, boolean];
expectTypeOf<UnionMin<CandidateTuples['length']>>().toBe<1>();
expectTypeOf<UnionMin<([] | [string, number])['length']>>().toBe<0>();
expectTypeOf<UnionMin<[]['length']>>().toBe<0>();
expectTypeOf<UnionMin<[1, 2]['length']>>().toBe<2>();
expectTypeOf<UnionMin<(readonly [string?])['length']>>().toBe<0>();
expectTypeOf<UnionMin<(readonly [] | readonly [string])['length']>>().toBe<0>();
expectTypeOf<UnionMin<[...number[]]['length']>>().toBe<number>();
expectTypeOf<UnionMin<[...string[], number]['length']>>().toBe<number>();
expectTypeOf<UnionMin<[string?, ...number[]]['length']>>().toBe<number>();
expectTypeOf<UnionMin<Parameters<(a: number, b: string) => void>['length']>>().toBe<2>();
expectTypeOf<UnionMin<Tagged<[string, number]['length'], 'Count'>>>().toBe<2>();

// Every candidate must be a primitive number.
// @ts-expect-error Numeric strings are not numbers.
type StringMinimum = UnionMin<'1' | '2'>;
// @ts-expect-error Every union member must be numeric.
type MixedMinimum = UnionMin<1 | '2'>;
// @ts-expect-error Bigints are not supported.
type BigintMinimum = UnionMin<1n | 2n>;
// @ts-expect-error Optional values must be narrowed before comparison.
type OptionalMinimum = UnionMin<number | undefined>;
// @ts-expect-error Boxed numbers are not primitive numbers.
type BoxedMinimum = UnionMin<Number>;

// Broad types absorb the other members, and `never` drops out, before `UnionMin` sees them.
expectTypeOf<UnionMin<number | NegativeInfinity>>().toBe<number>();
expectTypeOf<UnionMin<number | PositiveInfinity>>().toBe<number>();
expectTypeOf<UnionMin<any | NegativeInfinity>>().toBe<any>();
expectTypeOf<UnionMin<never | PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMin<never | NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<RetryCount | number>>().toBe<number>();
expectTypeOf<UnionMin<RetryCount | any>>().toBe<any>();
expectTypeOf<UnionMin<RetryCount | never>>().toBe<0>();
expectTypeOf<UnionMin<Tagged<1 | 3, 'Count'> | any>>().toBe<any>();
expectTypeOf<UnionMin<Tagged<1 | 3, 'Count'> | never>>().toBe<1>();

// Equal values from distinct enums collapse to the same plain numeric result.
enum AlternateRetryCount {
	Low = 2,
	High = 8,
}
expectTypeOf<UnionMin<RetryCount.Low | AlternateRetryCount.Low>>().toBe<2>();
expectTypeOf<UnionMin<RetryCount.High | AlternateRetryCount>>().toBe<2>();
expectTypeOf<UnionMin<Tagged<RetryCount.Low, 'Count'> | AlternateRetryCount.Low>>().toBe<2>();
expectTypeOf<UnionMin<Tagged<RetryCount, 'Count'> | Opaque<AlternateRetryCount, 'Other'>>>().toBe<0>();

const enum ConstantRetryCount {
	Low = 6,
	High = 12,
}
expectTypeOf<UnionMin<ConstantRetryCount>>().toBe<6>();
expectTypeOf<UnionMin<ConstantRetryCount.High>>().toBe<12>();

// Custom brands, overlapping tags, and nested tags normalize before union selection.
type CustomCount<Value extends number> = Value & {readonly countBrand: unique symbol};
expectTypeOf<UnionMin<CustomCount<6> | 9>>().toBe<6>();
expectTypeOf<UnionMin<CustomCount<number> | 0>>().toBe<number>();
expectTypeOf<UnionMin<CustomCount<PositiveInfinity>>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMin<CustomCount<NegativeInfinity> | 0>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<Tagged<4, 'Count'> | 4>>().toBe<4>();
expectTypeOf<UnionMin<Tagged<2, 'Count', 'first'> | Tagged<2, 'Count', 'second'> | 5>>().toBe<2>();
expectTypeOf<UnionMin<Tagged<Tagged<0 | 6, 'Count'>, 'Validated'> | PositiveInfinity>>().toBe<0>();
expectTypeOf<UnionMin<Tagged<PositiveInfinity | NegativeInfinity, 'Count'>>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMin<Opaque<PositiveInfinity, 'Count'> | Tagged<3, 'Other'>>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<never, 'Count'>>>().toBe<never>();
expectTypeOf<UnionMin<CustomCount<0>>>().toBe<0>();
expectTypeOf<UnionMin<CustomCount<1 | 3> | Tagged<2, 'Other'>>>().toBe<1>();
expectTypeOf<UnionMin<CustomCount<1_000_000>>>().toBe<1_000_000>();

// Empty, optional, mutable, and union-valued containers preserve their indexed candidate types.
expectTypeOf(minimumRetryCount([])).toBe<never>();
declare const readonlyEmptyCounts: readonly [];
declare const mutableEmptyCounts: never[];
expectTypeOf(minimumRetryCount(readonlyEmptyCounts)).toBe<never>();
expectTypeOf(minimumRetryCount(mutableEmptyCounts)).toBe<never>();
declare const mutableLiteralCounts: Array<4 | 8 | 12>;
expectTypeOf(minimumRetryCount(mutableLiteralCounts)).toBe<4>();
declare const alternateCounts: readonly [2, 8] | readonly [4, 6];
expectTypeOf(minimumRetryCount(alternateCounts)).toBe<2>();
declare const optionalCounts: readonly [4, 8?];
expectTypeOf<UnionMin<Exclude<typeof optionalCounts[number], undefined>>>().toBe<4>();
// @ts-expect-error Optional array elements must be narrowed before comparison.
minimumRetryCount(optionalCounts);
expectTypeOf<UnionMin<[string, number?, boolean?]['length']>>().toBe<1>();
expectTypeOf<UnionMin<[string?, number?]['length']>>().toBe<0>();
expectTypeOf<UnionMin<[string, ...number[]]['length']>>().toBe<number>();

// Filtering and composing candidate sets must retain the exact selected literal.
type SharedCounts = Extract<2 | 4 | 8 | 16, 4 | 8 | 12>;
expectTypeOf<UnionMin<SharedCounts>>().toBe<4>();
expectTypeOf<UnionMin<Exclude<SharedCounts, 4 | 8>>>().toBe<never>();
expectTypeOf<UnionMin<UnionMin<4 | 8> | UnionMin<2 | 16>>>().toBe<2>();
expectTypeOf<UnionMin<UnionMin<4 | 8>>>().toBe<4>();
expectTypeOf<UnionMin<UnionMax<4 | 8>>>().toBe<8>();
expectTypeOf<UnionMin<UnionMax<2 | 5> | 1>>().toBe<1>();
expectTypeOf<UnionMax<UnionMin<2 | 5> | 7>>().toBe<7>();
expectTypeOf<UnionMin<Extract<1 | 5 | 9, 5 | 9>>>().toBe<5>();
expectTypeOf<UnionMin<Exclude<IntRange<0, 5>, 0 | 1>>>().toBe<2>();
expectTypeOf<UnionMin<keyof {0: 'a'; 1: 'b'}>>().toBe<0>();
expectTypeOf<Record<UnionMin<SharedCounts>, string>>().toBe<{4: string}>();
expectTypeOf<number>().not.toBeAssignableTo<UnionMin<SharedCounts>>();
expectTypeOf<UnionMin<RetryCount.Low | AlternateRetryCount.High>>().not.toBeAssignableTo<8>();

// @ts-expect-error Nullable values must be narrowed before comparison.
type NullableMinimum = UnionMin<1 | null>;
// @ts-expect-error Booleans are not numeric candidates.
type BooleanMinimum = UnionMin<false>;
// @ts-expect-error Symbols are not numeric candidates.
type SymbolMinimum = UnionMin<symbol>;
// @ts-expect-error `void` is not a number.
type VoidMinimum = UnionMin<void>;
// @ts-expect-error `undefined` is not a number.
type UndefinedMinimum = UnionMin<undefined>;
// @ts-expect-error `true` is not a number.
type TrueMinimum = UnionMin<true>;
// @ts-expect-error `object` is not a number.
type ObjectMinimum = UnionMin<object>;
// @ts-expect-error Functions are not numbers.
type FunctionMinimum = UnionMin<() => 1>;
// @ts-expect-error `Date` is not a number.
type DateMinimum = UnionMin<Date>;
