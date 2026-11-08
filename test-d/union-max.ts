import {expectTypeOf} from 'nz';
import type {IntRange, NegativeInfinity, Opaque, PositiveInfinity, Tagged, UnionMax, UnionMin} from '../index.d.ts';

expectTypeOf<UnionMax<1 | 3 | 2>>().toBe<3>();
expectTypeOf<UnionMax<10 | 5 | 2>>().toBe<10>();
expectTypeOf<UnionMax<0 | 5 | 2 | 1>>().toBe<5>();
expectTypeOf<UnionMax<1 | 2 | 5 | 3 | 7 | 9 | 0>>().toBe<9>();

// Negative finite numbers are only supported as a single value. In a union the counter never matches them, so these exceed the recursion limit.
// expectTypeOf<UnionMax<-1 | -3 | -2>>().toBe<-1>();
// expectTypeOf<UnionMax<0 | -5 | -2>>().toBe<0>();

// Edge cases
expectTypeOf<any>().toBe<UnionMax<any>>();
expectTypeOf<never>().toBe<UnionMax<never>>();
expectTypeOf<number>().toBe<UnionMax<number>>();
expectTypeOf<number>().toBe<UnionMax<(number & {})>>();
expectTypeOf<number>().toBe<UnionMax<(number & {}) | 1 | 5>>();
expectTypeOf<PositiveInfinity>().toBe<UnionMax<PositiveInfinity>>();
expectTypeOf<NegativeInfinity>().toBe<UnionMax<NegativeInfinity>>();
expectTypeOf<PositiveInfinity>().toBe<UnionMax<1 | PositiveInfinity>>();
expectTypeOf<1>().toBe<UnionMax<1 | NegativeInfinity>>();
expectTypeOf<UnionMax<(number & {}) | 1_000_000>>().toBe<number>();
expectTypeOf<UnionMax<Tagged<any, 'Count'>>>().toBe<any>();

expectTypeOf<UnionMax<0>>().toBe<0>();
expectTypeOf<UnionMax<0 | 100>>().toBe<100>();
expectTypeOf<PositiveInfinity>().toBe<UnionMax<PositiveInfinity | NegativeInfinity>>();
expectTypeOf<UnionMax<0 | NegativeInfinity>>().toBe<0>();
expectTypeOf<2>().not.toBeAssignableTo<UnionMax<1 | 3 | 2>>();

const retryCounts = [0, 2, 5] as const;
expectTypeOf<UnionMax<typeof retryCounts[number]>>().toBe<5>();

// @ts-expect-error Non-numeric unions are not supported.
type InvalidUnion = UnionMax<'1' | '2'>;

// Sparse and dense unions keep their exact maximum across different magnitudes.
expectTypeOf<UnionMax<1 | 900>>().toBe<900>();
expectTypeOf<UnionMax<0 | 900 | NegativeInfinity>>().toBe<900>();
expectTypeOf<UnionMax<900 | PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>>().toBe<9>();

// Finding a maximum should not spend a second recursion step removing each matched member.
type DenseCandidates = IntRange<0, 600>;
expectTypeOf<UnionMax<DenseCandidates>>().toBe<599>();
expectTypeOf<UnionMax<Exclude<DenseCandidates, 0>>>().toBe<599>();
expectTypeOf<UnionMax<DenseCandidates | NegativeInfinity>>().toBe<599>();
expectTypeOf<UnionMax<DenseCandidates | PositiveInfinity>>().toBe<PositiveInfinity>();
// @ts-expect-error - An unknown value cannot be compared.
type UnknownMaximum = UnionMax<unknown>;

// Enum members retain their known numeric values.
enum RetryLimit {
	None = 0,
	Low = 2,
	High = 5,
}
expectTypeOf<UnionMax<RetryLimit.Low | RetryLimit.High>>().toBe<5>();
expectTypeOf<UnionMax<RetryLimit.None>>().toBe<0>();
expectTypeOf<UnionMax<RetryLimit>>().toBe<5>();

declare enum RuntimeRetryLimit {
	Value,
}
expectTypeOf<UnionMax<RetryLimit.Low | 3>>().toBe<3>();
expectTypeOf<UnionMax<RetryLimit.High | 3>>().toBe<5>();
expectTypeOf<UnionMax<RetryLimit.None | NegativeInfinity>>().toBe<0>();
expectTypeOf<UnionMax<RetryLimit.High | NegativeInfinity>>().toBe<5>();
expectTypeOf<UnionMax<RetryLimit.High | PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<RuntimeRetryLimit.Value>>().toBe<number>();
expectTypeOf<UnionMax<RuntimeRetryLimit.Value | RetryLimit.Low>>().toBe<number>();
expectTypeOf<UnionMax<RuntimeRetryLimit.Value | PositiveInfinity>>().toBe<number>();
expectTypeOf<UnionMax<RuntimeRetryLimit.Value | NegativeInfinity>>().toBe<number>();
expectTypeOf<UnionMax<RetryLimit | number>>().toBe<number>();
expectTypeOf<UnionMax<RetryLimit | any>>().toBe<any>();
expectTypeOf<UnionMax<RetryLimit | never>>().toBe<5>();

// Brands must not prevent the counter from removing a smaller candidate.
expectTypeOf<UnionMax<Tagged<1 | 3, 'Count'>>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<number, 'Count'>>>().toBe<number>();
expectTypeOf<UnionMax<Tagged<Tagged<number, 'Count'>, 'Validated'>>>().toBe<number>();
expectTypeOf<UnionMax<Opaque<number, 'Count'>>>().toBe<number>();

expectTypeOf<UnionMax<Opaque<1 | 3, 'Count'>>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<Tagged<1 | 3, 'Count'>, 'Validated'>>>().toBe<3>();
expectTypeOf<UnionMax<(1 | 3) & {readonly __brand: unique symbol}>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<0, 'Count'>>>().toBe<0>();
expectTypeOf<UnionMax<Tagged<3, 'Count'>>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<3, 'Count', {unit: 'retries'}>>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<3, 'First'> | Tagged<3, 'Second'>>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<1 | 5, 'First'> | Tagged<2 | 3, 'Second'>>>().toBe<5>();
expectTypeOf<UnionMax<Tagged<2, 'Count'> | 3>>().toBe<3>();
expectTypeOf<UnionMax<1 | Tagged<3, 'Count'>>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<1 | 3, 'Count'> | NegativeInfinity>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<NegativeInfinity, 'Count'>>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMax<Tagged<1 | PositiveInfinity, 'Count'>>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<Tagged<1, 'Count'> | Tagged<number, 'Other'>>>().toBe<number>();
expectTypeOf<UnionMax<Tagged<number, 'Count'> | PositiveInfinity>>().toBe<number>();
expectTypeOf<UnionMax<Tagged<number, 'Count'> | NegativeInfinity>>().toBe<number>();
expectTypeOf<UnionMax<Tagged<RuntimeRetryLimit.Value, 'Count'>>>().toBe<number>();
expectTypeOf<UnionMax<Tagged<1 | 3, 'Count'> | any>>().toBe<any>();
expectTypeOf<UnionMax<Tagged<1 | 3, 'Count'> | never>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<IntRange<0, 100>, 'Count'>>>().toBe<99>();
expectTypeOf<2>().not.toBeAssignableTo<UnionMax<Tagged<1 | 3, 'Count'>>>();

// A single candidate is its own maximum and keeps the same plain numeric result as a union.
expectTypeOf<UnionMax<900>>().toBe<900>();
expectTypeOf<UnionMax<999>>().toBe<999>();
expectTypeOf<UnionMax<RetryLimit.High>>().toBe<5>();
expectTypeOf<UnionMax<Tagged<900, 'Count'>>>().toBe<900>();
expectTypeOf<UnionMax<Tagged<10_000, 'Count'>>>().toBe<10_000>();
expectTypeOf<UnionMax<Tagged<1 | 3, 'Count'>>>().not.toBeAssignableTo<Tagged<3, 'Count'>>();

// A single candidate is returned without counting, even when it is negative or fractional.
expectTypeOf<UnionMax<1_000_000>>().toBe<1_000_000>();
expectTypeOf<UnionMax<-4>>().toBe<-4>();
expectTypeOf<UnionMax<1.5>>().toBe<1.5>();
expectTypeOf<UnionMax<0xFF>>().toBe<255>();

expectTypeOf<UnionMax<Tagged<0 | 998, 'Count'>>>().toBe<998>();

function _readMaximum<Candidates extends number>(value: UnionMax<Candidates>): number {
	return value;
}

declare function maximumRetryCount<const Counts extends readonly number[]>(counts: Counts): UnionMax<Counts[number]>;
expectTypeOf(maximumRetryCount([7])).toBe<7>();
expectTypeOf(maximumRetryCount([2, 5, 3])).toBe<5>();
expectTypeOf(maximumRetryCount([0, 2, 5])).toBe<5>();
declare const runtimeCounts: number[];
expectTypeOf(maximumRetryCount(runtimeCounts)).toBe<number>();
declare const brandedCounts: readonly [Tagged<3, 'Count'>, Tagged<7, 'Count'>];
expectTypeOf(maximumRetryCount(brandedCounts)).toBe<7>();
// @ts-expect-error A singleton maximum cannot be a different supported count.
const wrongSingletonMaximum: UnionMax<7> = 6;

// Removing a losing infinity retains known finite enum and branded candidates.
expectTypeOf<UnionMax<RetryLimit | NegativeInfinity>>().toBe<5>();
expectTypeOf<UnionMax<Tagged<0 | 4 | NegativeInfinity, 'Candidates'>>>().toBe<4>();
expectTypeOf<0>().not.toBeAssignableTo<UnionMax<0 | 4 | NegativeInfinity>>();

function _readMaximumWithInfinity<Candidates extends number>(value: UnionMax<Candidates | NegativeInfinity>): number {
	return value;
}

// Numeric order wins over string order, including ties in the leading digits.
expectTypeOf<UnionMax<9 | 10 | 99 | 100>>().toBe<100>();
expectTypeOf<UnionMax<789 | 798 | 790>>().toBe<798>();
expectTypeOf<UnionMax<100 | 101 | 110>>().toBe<110>();
expectTypeOf<UnionMax<98 | 99 | 100>>().toBe<100>();
expectTypeOf<UnionMax<0b1010 | 0b1100>>().toBe<12>();
expectTypeOf<UnionMax<0o17 | 0o20>>().toBe<16>();
expectTypeOf<UnionMax<0xFF | 0x1_00>>().toBe<256>();

// Derive a shared capacity from independent worker pool configurations.
type WorkerPools = {
	interactive: {maxConcurrency: 32};
	batch: {maxConcurrency: 128};
	serial: {maxConcurrency: 1};
};
type MaximumConcurrency = UnionMax<WorkerPools[keyof WorkerPools]['maxConcurrency']>;
expectTypeOf<MaximumConcurrency>().toBe<128>();
expectTypeOf<32>().not.toBeAssignableTo<MaximumConcurrency>();
expectTypeOf(maximumRetryCount([80, 101, 99] as const)).toBe<101>();

// A dense interval need not begin at zero or include every leading digit.
expectTypeOf<UnionMax<IntRange<128, 256>>>().toBe<255>();

// The documented counting limit stays within the recursion limit, including branded candidates.
expectTypeOf<UnionMax<997 | 998>>().toBe<998>();
expectTypeOf<UnionMax<998 | NegativeInfinity>>().toBe<998>();
expectTypeOf<UnionMax<Tagged<997 | 998, 'Count'>>>().toBe<998>();

// Every candidate must be a primitive number.
// @ts-expect-error Every union member must be numeric.
type MixedMaximum = UnionMax<1 | '2'>;
// @ts-expect-error Bigints are not supported.
type BigintMaximum = UnionMax<1n | 2n>;
// @ts-expect-error Optional values must be narrowed before comparison.
type OptionalMaximum = UnionMax<number | undefined>;
// @ts-expect-error Boxed numbers are not primitive numbers.
type BoxedMaximum = UnionMax<Number>;

// Unknown numeric inputs take precedence over otherwise decisive literals and infinities.
expectTypeOf<UnionMax<number | NegativeInfinity>>().toBe<number>();
expectTypeOf<UnionMax<number | PositiveInfinity>>().toBe<number>();
expectTypeOf<UnionMax<any | PositiveInfinity>>().toBe<any>();
expectTypeOf<UnionMax<never | PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<never | NegativeInfinity>>().toBe<NegativeInfinity>();

// Equal values from distinct enums collapse to the same plain numeric result.
enum AlternateRetryLimit {
	Low = 2,
	High = 8,
}
expectTypeOf<UnionMax<RetryLimit.Low | AlternateRetryLimit.Low>>().toBe<2>();
expectTypeOf<UnionMax<RetryLimit.High | AlternateRetryLimit>>().toBe<8>();
expectTypeOf<UnionMax<Tagged<RetryLimit.Low, 'Count'> | AlternateRetryLimit.Low>>().toBe<2>();
expectTypeOf<UnionMax<Tagged<RetryLimit, 'Count'> | Opaque<AlternateRetryLimit, 'Other'>>>().toBe<8>();

const enum ConstantRetryLimit {
	Low = 6,
	High = 12,
}
expectTypeOf<UnionMax<ConstantRetryLimit>>().toBe<12>();
expectTypeOf<UnionMax<ConstantRetryLimit.Low>>().toBe<6>();

// Custom brands, overlapping tags, and nested tags normalize before union selection.
type CustomCount<Value extends number> = Value & {readonly countBrand: unique symbol};
expectTypeOf<UnionMax<CustomCount<6> | 9>>().toBe<9>();
expectTypeOf<UnionMax<CustomCount<number> | 0>>().toBe<number>();
expectTypeOf<UnionMax<CustomCount<PositiveInfinity> | 0>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<CustomCount<NegativeInfinity>>>().toBe<NegativeInfinity>();
expectTypeOf<UnionMax<Tagged<4, 'Count'> | 4>>().toBe<4>();
expectTypeOf<UnionMax<Tagged<2, 'Count', 'first'> | Tagged<2, 'Count', 'second'> | 5>>().toBe<5>();
expectTypeOf<UnionMax<Tagged<Tagged<0 | 6, 'Count'>, 'Validated'> | NegativeInfinity>>().toBe<6>();
expectTypeOf<UnionMax<Tagged<PositiveInfinity | NegativeInfinity, 'Count'>>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<Opaque<NegativeInfinity, 'Count'> | Tagged<3, 'Other'>>>().toBe<3>();
expectTypeOf<UnionMax<Tagged<never, 'Count'>>>().toBe<never>();

// Empty, optional, mutable, and union-valued containers preserve their indexed candidate types.
expectTypeOf(maximumRetryCount([])).toBe<never>();
declare const readonlyEmptyCounts: readonly [];
declare const mutableEmptyCounts: never[];
expectTypeOf(maximumRetryCount(readonlyEmptyCounts)).toBe<never>();
expectTypeOf(maximumRetryCount(mutableEmptyCounts)).toBe<never>();
declare const mutableLiteralCounts: Array<4 | 8 | 12>;
expectTypeOf(maximumRetryCount(mutableLiteralCounts)).toBe<12>();
declare const alternateCounts: readonly [2, 8] | readonly [4, 6];
expectTypeOf(maximumRetryCount(alternateCounts)).toBe<8>();
declare const optionalCounts: readonly [4, 8?];
expectTypeOf<UnionMax<Exclude<typeof optionalCounts[number], undefined>>>().toBe<8>();
// @ts-expect-error Optional array elements must be narrowed before comparison.
maximumRetryCount(optionalCounts);
expectTypeOf<UnionMax<[string, number?, boolean?]['length']>>().toBe<3>();
expectTypeOf<UnionMax<[string?, number?]['length']>>().toBe<2>();
expectTypeOf<UnionMax<[string, ...number[]]['length']>>().toBe<number>();
expectTypeOf<UnionMax<[]['length']>>().toBe<0>();
expectTypeOf<UnionMax<[...boolean[], 1]['length']>>().toBe<number>();

// Filtering and composing candidate sets must retain the exact selected literal.
type SharedCounts = Extract<2 | 4 | 8 | 16, 4 | 8 | 12>;
expectTypeOf<UnionMax<SharedCounts>>().toBe<8>();
expectTypeOf<UnionMax<Exclude<SharedCounts, 4 | 8>>>().toBe<never>();
expectTypeOf<UnionMax<UnionMax<4 | 8> | UnionMax<2 | 16>>>().toBe<16>();
expectTypeOf<UnionMax<UnionMax<4 | 8>>>().toBe<8>();
expectTypeOf<UnionMax<UnionMin<4 | 8>>>().toBe<4>();
expectTypeOf<UnionMax<Exclude<IntRange<0, 5>, 0 | 1>>>().toBe<4>();
expectTypeOf<UnionMax<keyof {0: 'a'; 1: 'b'}>>().toBe<1>();
expectTypeOf<Record<UnionMax<SharedCounts>, string>>().toBe<{8: string}>();
expectTypeOf<number>().not.toBeAssignableTo<UnionMax<SharedCounts>>();
expectTypeOf<UnionMax<RetryLimit.Low | AlternateRetryLimit.High>>().not.toBeAssignableTo<2>();

// @ts-expect-error Nullable values must be narrowed before comparison.
type NullableMaximum = UnionMax<1 | null>;
// @ts-expect-error Booleans are not numeric candidates.
type BooleanMaximum = UnionMax<false>;
// @ts-expect-error Symbols are not numeric candidates.
type SymbolMaximum = UnionMax<symbol>;
