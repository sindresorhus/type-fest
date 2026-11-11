import {expectTypeOf} from 'nz';
import type {ArrayLength, ArrayReverse, ArraySlice, ArraySplice, ArrayTail, FixedLengthArray, TupleLength, TupleOf, UnknownArray, Writable} from '../index.d.ts';

// Fixed lengths do not depend on the element types or tuple labels.
expectTypeOf<TupleLength<[]>>().toBe<0>();
expectTypeOf<TupleLength<[string, number, boolean]>>().toBe<3>();
expectTypeOf<TupleLength<[any]>>().toBe<1>();
expectTypeOf<TupleLength<[never]>>().toBe<1>();
expectTypeOf<TupleLength<[unknown]>>().toBe<1>();
expectTypeOf<TupleLength<[undefined, null]>>().toBe<2>();
expectTypeOf<TupleLength<[string | number, boolean]>>().toBe<2>();
expectTypeOf<TupleLength<[start: Date, end: Date]>>().toBe<2>();
expectTypeOf<TupleLength<[[string, number], boolean[]]>>().toBe<2>();

// Readonly tuples, including inferred constant arrays.
expectTypeOf<TupleLength<readonly []>>().toBe<0>();
expectTypeOf<TupleLength<readonly [string, number]>>().toBe<2>();

const coordinates = [10, 20, 30] as const;
expectTypeOf<TupleLength<typeof coordinates>>().toBe<3>();

// Optional elements contribute every possible length, including zero.
expectTypeOf<TupleLength<[string?]>>().toBe<0 | 1>();
expectTypeOf<TupleLength<[string?, number?, boolean?]>>().toBe<0 | 1 | 2 | 3>();
expectTypeOf<TupleLength<[string, number?, boolean?]>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleLength<readonly [x: number, y: number, z?: number]>>().toBe<2 | 3>();
expectTypeOf<TupleLength<[any?]>>().toBe<0 | 1>();
expectTypeOf<TupleLength<[never?]>>().toBe<0 | 1>();
expectTypeOf<TupleLength<[unknown?]>>().toBe<0 | 1>();
expectTypeOf<TupleLength<[string | undefined, number]>>().toBe<2>();
expectTypeOf<TupleLength<Partial<[string, number]>>>().toBe<0 | 1 | 2>();
expectTypeOf<TupleLength<Required<[string?, number?]>>>().toBe<2>();

// An array of unknown length has no tuple length to report.
expectTypeOf<TupleLength<string[]>>().toBe<never>();
expectTypeOf<TupleLength<readonly number[]>>().toBe<never>();
expectTypeOf<TupleLength<any[]>>().toBe<never>();
expectTypeOf<TupleLength<never[]>>().toBe<never>();
expectTypeOf<TupleLength<UnknownArray>>().toBe<never>();

// An unbounded rest element excludes the whole tuple, regardless of its position.
expectTypeOf<TupleLength<[string, ...number[]]>>().toBe<never>();
expectTypeOf<TupleLength<[string?, ...number[]]>>().toBe<never>();
expectTypeOf<TupleLength<[...number[], string]>>().toBe<never>();
expectTypeOf<TupleLength<[string, ...number[], boolean]>>().toBe<never>();
expectTypeOf<TupleLength<readonly [string, ...number[]]>>().toBe<never>();
expectTypeOf<TupleLength<readonly [...number[], string]>>().toBe<never>();
expectTypeOf<TupleLength<readonly [string, ...number[], boolean]>>().toBe<never>();
expectTypeOf<TupleLength<[string, ...any[]]>>().toBe<never>();
expectTypeOf<TupleLength<[string, ...never[]]>>().toBe<never>();

// Finite tuple spreads retain their known lengths.
expectTypeOf<TupleLength<[string, ...[]]>>().toBe<1>();
expectTypeOf<TupleLength<[string, ...[number, boolean?]]>>().toBe<2 | 3>();
expectTypeOf<TupleLength<[...[string, number], boolean]>>().toBe<3>();
expectTypeOf<TupleLength<[string, ...([] | [number, boolean])]>>().toBe<1 | 3>();

// Finite spreads preserve possible lengths. A required suffix makes preceding optional positions required.
expectTypeOf<TupleLength<[...readonly [string, number?]]>>().toBe<1 | 2>();
expectTypeOf<TupleLength<readonly [...readonly [string?], ...readonly [number?]]>>().toBe<0 | 1 | 2>();
expectTypeOf<TupleLength<readonly [Date, ...readonly [string, number?]]>>().toBe<2 | 3>();
expectTypeOf<TupleLength<[...readonly [string?], number]>>().toBe<2>();
expectTypeOf<TupleLength<[...[string?, number?], boolean]>>().toBe<3>();
expectTypeOf<TupleLength<[...[string], ...[number, boolean?]]>>().toBe<2 | 3>();

// Union spreads keep only their finite alternatives, including when placed before a suffix.
expectTypeOf<TupleLength<[...([] | [string]), number]>>().toBe<1 | 2>();
expectTypeOf<TupleLength<readonly [Date, ...([] | [string, number?])]>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleLength<[...([] | [string]), ...([] | [number])]>>().toBe<0 | 1 | 2>();
expectTypeOf<TupleLength<[boolean, ...([] | number[])]>>().toBe<1>();
expectTypeOf<TupleLength<[...([] | number[]), boolean]>>().toBe<1>();
expectTypeOf<TupleLength<[Date, ...([string, number?] | boolean[])]>>().toBe<2 | 3>();
expectTypeOf<TupleLength<readonly [...([] | [string?] | number[])]>>().toBe<0 | 1>();

// A union reports the length of every member that has one. The empty tuple's length is `0`, and the array of unknown length drops out entirely.
expectTypeOf<TupleLength<[] | [1, 2, 3] | number[]>>().toBe<0 | 3>();
expectTypeOf<TupleLength<[] | [string] | readonly [number, boolean]>>().toBe<0 | 1 | 2>();
expectTypeOf<TupleLength<[string?] | readonly [number, number, number?]>>().toBe<0 | 1 | 2 | 3>();
expectTypeOf<TupleLength<[string, number] | readonly number[]>>().toBe<2>();
expectTypeOf<TupleLength<readonly [string?] | [number, ...boolean[]]>>().toBe<0 | 1>();
expectTypeOf<TupleLength<[string, ...number[]] | [...boolean[], Date]>>().toBe<never>();
expectTypeOf<TupleLength<[string] | [number]>>().toBe<1>();
expectTypeOf<TupleLength<[] | never>>().toBe<0>();

// A broad array does not erase a finite member when it occurs in a different union branch.
expectTypeOf<TupleLength<[string, number?] | unknown[]>>().toBe<1 | 2>();
expectTypeOf<TupleLength<readonly [string, number?] | readonly unknown[]>>().toBe<1 | 2>();
expectTypeOf<TupleLength<[never] | never[]>>().toBe<1>();
expectTypeOf<TupleLength<readonly [] | readonly never[]>>().toBe<0>();
expectTypeOf<TupleLength<[any] | any[]>>().toBe<1>();
expectTypeOf<TupleLength<[] | [string, ...number[]]>>().toBe<0>();
expectTypeOf<TupleLength<[string, number?] | readonly [...number[], Date]>>().toBe<1 | 2>();
expectTypeOf<TupleLength<[string, boolean?] | [Date, ...number[], Date] | readonly [Date, Date, Date, Date]>>().toBe<1 | 2 | 4>();
expectTypeOf<TupleLength<string[] | readonly number[] | boolean[]>>().toBe<never>();

// The result must contain only valid finite lengths, with no widening to `number`.
expectTypeOf<0>().toBeAssignableTo<TupleLength<[string?, number?]>>();
expectTypeOf<2>().toBeAssignableTo<TupleLength<[string?, number?]>>();
expectTypeOf<3>().not.toBeAssignableTo<TupleLength<[string?, number?]>>();
expectTypeOf<-1>().not.toBeAssignableTo<TupleLength<[string?, number?]>>();
expectTypeOf<number>().not.toBeAssignableTo<TupleLength<[] | [string, number] | number[]>>();
expectTypeOf<1>().not.toBeAssignableTo<TupleLength<[] | [string, number] | number[]>>();

// ArrayLength keeps unknown lengths; TupleLength discards them.
expectTypeOf<ArrayLength<[] | [number, number] | number[]>>().toBe<number>();
expectTypeOf<TupleLength<[] | [number, number] | number[]>>().toBe<0 | 2>();

// Composition with tuple builders and function parameter lists.
expectTypeOf<TupleLength<TupleOf<5, string>>>().toBe<5>();
expectTypeOf<TupleLength<TupleOf<0 | 2 | 4>>>().toBe<0 | 2 | 4>();
expectTypeOf<TupleLength<FixedLengthArray<string, 3>>>().toBe<3>();
expectTypeOf<TupleLength<Parameters<() => void>>>().toBe<0>();
expectTypeOf<TupleLength<Parameters<(path: string, encoding?: string) => void>>>().toBe<1 | 2>();
expectTypeOf<TupleLength<Parameters<(message: string, ...values: unknown[]) => void>>>().toBe<never>();

// Tuple builders and modifiers preserve the distinction between known and unknown lengths.
expectTypeOf<TupleLength<TupleOf<number, string>>>().toBe<never>();
expectTypeOf<TupleLength<TupleOf<3, never>>>().toBe<3>();
expectTypeOf<TupleLength<Readonly<TupleOf<2 | 4, string>>>>().toBe<2 | 4>();
expectTypeOf<TupleLength<Partial<TupleOf<4, string>>>>().toBe<0 | 1 | 2 | 3 | 4>();
expectTypeOf<TupleLength<Readonly<Partial<[string, number]>>>>().toBe<0 | 1 | 2>();
expectTypeOf<TupleLength<Required<readonly [string?, number?]>>>().toBe<2>();
expectTypeOf<TupleLength<Writable<readonly [string, number?]>>>().toBe<1 | 2>();
expectTypeOf<TupleLength<Partial<[string, ...number[]]>>>().toBe<never>();
expectTypeOf<TupleLength<Required<[string?, ...number[]]>>>().toBe<never>();
expectTypeOf<TupleLength<FixedLengthArray<unknown, 0 | 3>>>().toBe<0 | 3>();

// Common tuple operations can change the known lengths without widening them.
expectTypeOf<TupleLength<ArrayTail<[string, number?, boolean?]>>>().toBe<0 | 1 | 2>();
expectTypeOf<TupleLength<ArrayTail<[string]>>>().toBe<0>();
expectTypeOf<TupleLength<ArrayReverse<readonly [string, number?, boolean?]>>>().toBe<1 | 2 | 3>();
expectTypeOf<TupleLength<ArrayReverse<[string, ...number[]]>>>().toBe<never>();
expectTypeOf<TupleLength<ArraySlice<readonly [string, number, boolean], 1>>>().toBe<2>();
expectTypeOf<TupleLength<ArraySlice<[string, number, boolean], 1, 1>>>().toBe<0>();
expectTypeOf<TupleLength<ArraySplice<[string, number, boolean], 1, 1, [Date, Date]>>>().toBe<4>();
expectTypeOf<TupleLength<ArraySplice<[string, number], 0, 2>>>().toBe<0>();

// Function arity is based on the parameter tuple, including rest tuples and `this` parameters.
expectTypeOf<TupleLength<Parameters<(this: Date, value: string) => void>>>().toBe<1>();
expectTypeOf<TupleLength<Parameters<(value?: string) => void>>>().toBe<0 | 1>();
expectTypeOf<TupleLength<Parameters<(...values: [string, number?]) => void>>>().toBe<1 | 2>();
expectTypeOf<TupleLength<Parameters<(...values: [] | [string, number]) => void>>>().toBe<0 | 2>();
expectTypeOf<TupleLength<Parameters<(...values: [string] | number[]) => void>>>().toBe<1>();
expectTypeOf<TupleLength<Parameters<(...values: string[]) => void>>>().toBe<never>();
expectTypeOf<TupleLength<Parameters<(...values: [...string[], Date]) => void>>>().toBe<never>();
expectTypeOf<TupleLength<Parameters<((value: string) => void) | ((first: number, second: number) => void)>>>().toBe<1 | 2>();
expectTypeOf<TupleLength<Parameters<<Value>(value: Value, fallback?: Value) => Value>>>().toBe<1 | 2>();
expectTypeOf<TupleLength<Parameters<(...values: never[]) => void>>>().toBe<never>();

// Constructor parameter tuples follow the same rules as function parameter tuples.
expectTypeOf<TupleLength<ConstructorParameters<new () => Date>>>().toBe<0>();
expectTypeOf<TupleLength<ConstructorParameters<new (name: string, enabled?: boolean) => object>>>().toBe<1 | 2>();
expectTypeOf<TupleLength<ConstructorParameters<abstract new (value: unknown) => object>>>().toBe<1>();
expectTypeOf<TupleLength<ConstructorParameters<new (...values: [] | [string, number]) => object>>>().toBe<0 | 2>();
expectTypeOf<TupleLength<ConstructorParameters<new (...values: string[]) => object>>>().toBe<never>();
expectTypeOf<TupleLength<ConstructorParameters<(new (name: string) => object) | (new (...values: number[]) => object)>>>().toBe<1>();

// A generic return type keeps lengths inferred from tuple arguments, while widened arrays have no known length.
declare function getTupleLength<const Tuple extends UnknownArray>(tuple: Tuple): TupleLength<Tuple>;

expectTypeOf(getTupleLength([10, 20])).toBe<2>();
expectTypeOf(getTupleLength([])).toBe<0>();
expectTypeOf(getTupleLength(coordinates)).toBe<3>();

const widenedCoordinates = [10, 20];
expectTypeOf(getTupleLength(widenedCoordinates)).toBe<never>();

declare const optionalCoordinates: readonly [number, number?];
expectTypeOf(getTupleLength(optionalCoordinates)).toBe<1 | 2>();

declare const variableCoordinates: [number, ...number[]];
expectTypeOf(getTupleLength(variableCoordinates)).toBe<never>();

declare const possibleCoordinates: readonly [number, number] | readonly number[];
expectTypeOf(getTupleLength(possibleCoordinates)).toBe<2>();

// Extra properties do not change the length. Length refinements follow TypeScript's own rules.
expectTypeOf<TupleLength<[string, number] & {description: string}>>().toBe<2>();
expectTypeOf<TupleLength<string[] & {length: 2 | 3}>>().toBe<2 | 3>();
expectTypeOf<TupleLength<readonly [string, number?] & {description: string}>>().toBe<1 | 2>();
expectTypeOf<TupleLength<[string, number?] & {length: 2}>>().toBe<2>();
expectTypeOf<TupleLength<readonly unknown[] & {readonly length: 0}>>().toBe<0>();
expectTypeOf<TupleLength<[string, ...number[]] & {length: 3}>>().toBe<3>();
expectTypeOf<TupleLength<(string[] & {length: 2}) | readonly number[]>>().toBe<2>();
expectTypeOf<TupleLength<string[] & {description: string}>>().toBe<never>();
expectTypeOf<TupleLength<([string] | [string, number]) & {description: string}>>().toBe<1 | 2>();

// Special types do not invent a known length.
expectTypeOf<TupleLength<any>>().toBe<never>();
expectTypeOf<TupleLength<never>>().toBe<never>();
expectTypeOf<TupleLength<any | [string]>>().toBe<never>();

// Non-array inputs are rejected rather than silently filtered from unions.
// @ts-expect-error
type UnknownInput = TupleLength<unknown>;
// @ts-expect-error
type StringInput = TupleLength<'hello'>;
// @ts-expect-error
type NumberInput = TupleLength<2>;
// @ts-expect-error
type NullInput = TupleLength<null>;
// @ts-expect-error
type UndefinedInput = TupleLength<undefined>;
// @ts-expect-error
type ObjectInput = TupleLength<{length: 2}>;
// @ts-expect-error
type ArrayLikeInput = TupleLength<ArrayLike<string>>;
// @ts-expect-error
type InvalidUnionInput = TupleLength<[string] | undefined>;
// @ts-expect-error
type BooleanInput = TupleLength<boolean>;
// @ts-expect-error
type SymbolInput = TupleLength<symbol>;
// @ts-expect-error
type BigIntInput = TupleLength<bigint>;
// @ts-expect-error
type FunctionInput = TupleLength<() => void>;
// @ts-expect-error
type NumericIndexInput = TupleLength<{[index: number]: string; length: 2}>;
// @ts-expect-error
type TypedArrayInput = TupleLength<Uint8Array>;
// @ts-expect-error
type SetInput = TupleLength<Set<string>>;
// @ts-expect-error
type IterableInput = TupleLength<Iterable<string>>;
// @ts-expect-error
type PromiseInput = TupleLength<Promise<[string, number]>>;
// @ts-expect-error
type InvalidObjectUnionInput = TupleLength<readonly [string] | {length: 1}>;
