import {expectTypeOf} from 'nz';
import type {FixedLengthArray, If, IsReadonlyArray, Tagged, UnknownArray, Writable} from '../index.d.ts';

// Non-readonly arrays
expectTypeOf<IsReadonlyArray<[]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<number[]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<[string, number?, ...string[]]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<[x: number, y: number, z?: number]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<[...string[], number, string]>>().toBe<false>();

// Readonly arrays
expectTypeOf<IsReadonlyArray<readonly []>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly number[]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly [string, number?, ...string[]]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly [x: number, y: number, z?: number]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly [...string[], number, string]>>().toBe<true>();

// Union
expectTypeOf<boolean>().toBe<IsReadonlyArray<[] | readonly []>>();
expectTypeOf<boolean>().toBe<IsReadonlyArray<[string, number] | readonly [string, number, ...string[]]>>();
expectTypeOf<IsReadonlyArray<[] | [string, number]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [] | readonly [string, number]>>().toBe<true>();

// Boundary types
expectTypeOf<boolean>().toBe<IsReadonlyArray<any>>();
expectTypeOf<IsReadonlyArray<never>>().toBe<false>();

// Element types do not affect array mutability.
expectTypeOf<IsReadonlyArray<any[]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly any[]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<never[]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly never[]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<unknown[]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<UnknownArray>>().toBe<true>();
expectTypeOf<IsReadonlyArray<[any, never, unknown]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [any, never, unknown]>>().toBe<true>();

// Optional-only tuples and rest elements in every position.
expectTypeOf<IsReadonlyArray<[string?, number?]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [string?, number?]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<[string?, ...number[]]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [string?, ...number[]]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<[string, ...number[], boolean]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [string, ...number[], boolean]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<[...readonly string[]]>>().toBe<false>();

// Only the outer array's mutability matters.
expectTypeOf<IsReadonlyArray<Array<readonly string[]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly string[][]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Array<{readonly value: string}>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [{value: string}]>>().toBe<true>();
type Container = {readonly items: string[]};
expectTypeOf<IsReadonlyArray<Container['items']>>().toBe<false>();

// Standard mapped types and inferred const tuples.
type MutableStringArray = string[];
expectTypeOf<IsReadonlyArray<Readonly<MutableStringArray>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Readonly<[string, number?]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Partial<readonly [string, number]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Required<readonly [string?, number?]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Writable<readonly string[]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Writable<readonly [string, number?]>>>().toBe<false>();
const coordinates = [1, 2] as const;
expectTypeOf<IsReadonlyArray<typeof coordinates>>().toBe<true>();

// Unions distribute over arrays and tuples independently of element type.
expectTypeOf<IsReadonlyArray<string[] | number[]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly string[] | readonly number[]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<string[] | readonly number[]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<[string] | readonly number[]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<readonly [string] | number[]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<string[] | readonly string[]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<string[] | never>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly string[] | never>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly string[] | any>>().toBe<boolean>();

// Extra properties, branding, and intersections follow structural assignability.
expectTypeOf<IsReadonlyArray<string[] & {readonly id: string}>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly string[] & {id: string}>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Tagged<string[], 'Names'>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Tagged<readonly string[], 'Names'>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly string[] & string[]>>().toBe<false>();

// Custom arrays without the full mutable interface are treated as readonly, even with writable indices.
declare const fixedLength: FixedLengthArray<string, 3>;
fixedLength[0] = 'updated';
expectTypeOf<IsReadonlyArray<typeof fixedLength>>().toBe<true>();

// Invalid inputs are rejected rather than silently classified as readonly.
// @ts-expect-error Unknown is not known to be an array.
type UnknownInput = IsReadonlyArray<unknown>;
// @ts-expect-error Objects are not arrays.
type ObjectInput = IsReadonlyArray<{value: string}>;
// @ts-expect-error Array-like objects are not arrays.
type ArrayLikeInput = IsReadonlyArray<ArrayLike<string>>;
// @ts-expect-error Strings are not arrays.
type StringInput = IsReadonlyArray<string>;
// @ts-expect-error Null is not an array.
type NullInput = IsReadonlyArray<null>;
// @ts-expect-error Undefined is not an array.
type UndefinedInput = IsReadonlyArray<undefined>;
// @ts-expect-error Every union member must be an array.
type NonArrayUnionInput = IsReadonlyArray<string[] | number>;
// @ts-expect-error Typed arrays do not have the array interface.
type TypedArrayInput = IsReadonlyArray<Uint8Array>;

// Generic results remain usable as boolean flags without assuming readonly access.
function _readArrayFlag<Array_ extends readonly unknown[]>(flag: IsReadonlyArray<Array_>): boolean {
	return flag;
}

function _readMutableArrayFlag<Array_ extends unknown[]>(flag: IsReadonlyArray<Array_>): false {
	return flag;
}

function _cannotAssumeReadonly<Array_ extends readonly unknown[]>(flag: IsReadonlyArray<Array_>): true {
	// @ts-expect-error The constraint also accepts mutable arrays.
	return flag;
}

function _cannotAssumeMutable<Array_ extends readonly unknown[]>(flag: IsReadonlyArray<Array_>): false {
	// @ts-expect-error The input may be readonly.
	return flag;
}

// The documentation's transformation preserves mutability per union member.
type WrapElements<Array_ extends readonly unknown[]> = Array_ extends unknown
	? If<IsReadonlyArray<Array_>, ReadonlyArray<{value: Array_[number]}>, Array<{value: Array_[number]}>>
	: never;

expectTypeOf<WrapElements<string[]>>().toBe<Array<{value: string}>>();
expectTypeOf<WrapElements<readonly number[]>>().toBe<ReadonlyArray<{value: number}>>();
expectTypeOf<WrapElements<[string, number?]>>().toBe<Array<{value: string | number | undefined}>>();
expectTypeOf<WrapElements<string[] | readonly number[]>>().toBe<Array<{value: string}> | ReadonlyArray<{value: number}>>();
expectTypeOf<WrapElements<never>>().toBe<never>();

// Mapped types preserve the outer mutability even when they change element presence or values.
expectTypeOf<IsReadonlyArray<Partial<string[]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Partial<readonly string[]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Required<Partial<string[]>>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Required<Partial<readonly string[]>>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Readonly<[]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Writable<readonly []>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Readonly<[string, ...number[]]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Writable<readonly [...string[], number]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Readonly<Writable<readonly [string?]>>>>().toBe<true>();

type BoxElements<Array_ extends UnknownArray> = {[Key in keyof Array_]: {value: Array_[Key]}};
expectTypeOf<IsReadonlyArray<BoxElements<string[]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<BoxElements<readonly string[]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<BoxElements<[string, number?]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<BoxElements<readonly [string, ...number[]]>>>().toBe<true>();

// Array subclasses are checked structurally too.
declare class Names extends Array<string> {
	id: string;
}

expectTypeOf<IsReadonlyArray<Names>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Names | readonly string[]>>().toBe<boolean>();

// Having one mutator is insufficient; the complete mutable array interface is required.
expectTypeOf<IsReadonlyArray<Omit<string[], 'push'>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Omit<string[], 'pop'>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly string[] & Pick<string[], 'push'>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly string[] & Pick<string[], 'push' | 'pop'>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Pick<string[], keyof string[]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Pick<readonly string[], keyof readonly string[]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<readonly [string] & [string]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Tagged<readonly [string, number?], 'Coordinates'>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Tagged<[string, ...number[]], 'Coordinates'>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<FixedLengthArray<unknown, 0>>>().toBe<true>();

// Inference distinguishes a readonly constraint from a readonly result.
const mutableNames = ['Ada', 'Grace'] satisfies readonly string[];
const readonlyNames = ['Ada', 'Grace'] as const satisfies readonly string[];
const spreadNames = [...readonlyNames];
const slicedNames = readonlyNames.slice(1);
const frozenNames = Object.freeze(['Ada', 'Grace']);
const frozenCoordinates = Object.freeze([1, 2] as [number, number]);
expectTypeOf<IsReadonlyArray<typeof mutableNames>>().toBe<false>();
expectTypeOf<IsReadonlyArray<typeof readonlyNames>>().toBe<true>();
expectTypeOf<IsReadonlyArray<typeof spreadNames>>().toBe<false>();
expectTypeOf<IsReadonlyArray<typeof slicedNames>>().toBe<false>();
expectTypeOf<IsReadonlyArray<typeof frozenNames>>().toBe<true>();
expectTypeOf<IsReadonlyArray<typeof frozenCoordinates>>().toBe<true>();

declare function inferArray<const Array_ extends UnknownArray>(array: Array_): IsReadonlyArray<Array_>;
expectTypeOf(inferArray(['Ada', 'Grace'])).toBe<true>();
expectTypeOf(inferArray(mutableNames)).toBe<false>();
expectTypeOf(inferArray(readonlyNames)).toBe<true>();

// Spreading readonly elements into a tuple creates a mutable outer tuple.
expectTypeOf<IsReadonlyArray<[...readonly [string, number?]]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [...[string, number?]]>>().toBe<true>();
expectTypeOf<IsReadonlyArray<[boolean, ...readonly string[], number]>>().toBe<false>();
expectTypeOf<IsReadonlyArray<readonly [boolean, ...string[], number]>>().toBe<true>();

type SearchArguments = Parameters<(query: string, limit?: number) => void>;
expectTypeOf<IsReadonlyArray<SearchArguments>>().toBe<false>();
expectTypeOf<IsReadonlyArray<Readonly<SearchArguments>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<ConstructorParameters<ArrayConstructor>>>().toBe<false>();

// Distribution also works with overlapping element types and optional tuple lengths.
expectTypeOf<IsReadonlyArray<[string?] | readonly [number?]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<[...string[], number] | readonly [boolean, ...number[]]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<Readonly<string[] | [number?]>>>().toBe<true>();
expectTypeOf<IsReadonlyArray<Writable<readonly string[] | readonly [number?]>>>().toBe<false>();
expectTypeOf<IsReadonlyArray<[] | readonly string[]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<unknown[] | readonly string[]>>().toBe<boolean>();
expectTypeOf<IsReadonlyArray<any[] | readonly never[]>>().toBe<boolean>();

// A predicate can select union members without conflating readonly and mutable inputs.
type ReadonlyMembers<Array_ extends UnknownArray> = Array_ extends unknown
	? IsReadonlyArray<Array_> extends true ? Array_ : never
	: never;

type MutableMembers<Array_ extends UnknownArray> = Array_ extends unknown
	? IsReadonlyArray<Array_> extends false ? Array_ : never
	: never;

expectTypeOf<ReadonlyMembers<string[] | readonly number[]>>().toBe<readonly number[]>();
expectTypeOf<MutableMembers<string[] | readonly number[]>>().toBe<string[]>();
expectTypeOf<ReadonlyMembers<[string] | readonly [number?]>>().toBe<readonly [number?]>();
expectTypeOf<MutableMembers<[string] | readonly [number?]>>().toBe<[string]>();
expectTypeOf<ReadonlyMembers<string[]>>().toBe<never>();
expectTypeOf<MutableMembers<readonly string[]>>().toBe<never>();

// Generic element types do not make the outer mutability ambiguous.
function _readGenericElementFlags<Element>() {
	expectTypeOf<IsReadonlyArray<Element[]>>().toBe<false>();
	expectTypeOf<IsReadonlyArray<readonly Element[]>>().toBe<true>();
	expectTypeOf<IsReadonlyArray<[Element, Element?]>>().toBe<false>();
	expectTypeOf<IsReadonlyArray<readonly [Element, ...Element[]]>>().toBe<true>();
}

// The documented transformation wraps values shallowly, including empty and nested inputs.
expectTypeOf<WrapElements<[]>>().toBe<Array<{value: never}>>();
expectTypeOf<WrapElements<readonly []>>().toBe<ReadonlyArray<{value: never}>>();
expectTypeOf<WrapElements<any>>().toBe<Array<{value: any}> | ReadonlyArray<{value: any}>>();
expectTypeOf<WrapElements<readonly unknown[]>>().toBe<ReadonlyArray<{value: unknown}>>();
expectTypeOf<WrapElements<Array<readonly string[]>>>().toBe<Array<{value: readonly string[]}>>();
expectTypeOf<WrapElements<readonly string[][]>>().toBe<ReadonlyArray<{value: string[]}>>();

// Invalid inputs cannot bypass the constraint by resembling containers.
// @ts-expect-error A nullable array is not always an array.
type NullableInput = IsReadonlyArray<readonly string[] | null>;
// @ts-expect-error An optional array is not always an array.
type OptionalInput = IsReadonlyArray<string[] | undefined>;
// @ts-expect-error Iterability does not supply the array interface.
type IterableInput = IsReadonlyArray<Iterable<string>>;
// @ts-expect-error Sets are not arrays.
type SetInput = IsReadonlyArray<ReadonlySet<string>>;
// @ts-expect-error Numeric keys and a length do not supply the array interface.
type TupleLikeInput = IsReadonlyArray<{0: string; length: 1}>;
