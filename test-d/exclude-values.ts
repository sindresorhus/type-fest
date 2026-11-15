import {expectTypeOf} from 'nz';
import type {ExcludeValues, Falsy, IndexTuple, TupleOf} from '../index.d.ts';

// The examples from the docs
type Foo = {
	foo: number | null;
	bar?: string;
	baz: undefined;
};

expectTypeOf<ExcludeValues<Foo, undefined>>().toBe<{foo: number | null; bar?: string}>();
expectTypeOf<ExcludeValues<Foo, undefined | null>>().toBe<{foo: number; bar?: string}>();

type DbUser = {
	id: number;
	name: string | null;
	email: string | null;
};

expectTypeOf<ExcludeValues<DbUser, null>>().toBe<{id: number; name: string; email: string}>();

expectTypeOf<ExcludeValues<{a: string | undefined; b?: undefined}, undefined>>().toBe<{a: string}>();
expectTypeOf<ExcludeValues<Array<string | undefined>, undefined>>().toBe<string[]>();
expectTypeOf<ExcludeValues<[string, number | undefined, undefined?], undefined>>().toBe<[string, number]>();

// Strips the given type from every value union, while keeping values that are not fully excluded
expectTypeOf<ExcludeValues<{a: number; b: number | string}, string>>().toBe<{a: number; b: number}>();
expectTypeOf<ExcludeValues<{a: 'x' | 'y'; b: string}, 'x'>>().toBe<{a: 'y'; b: string}>();
expectTypeOf<ExcludeValues<{a: 1 | 2 | 3; b: number}, 2>>().toBe<{a: 1 | 3; b: number}>();
expectTypeOf<ExcludeValues<{a: `prefix-${string}`; b: string}, `prefix-${string}`>>().toBe<{b: string}>();

// A union `ExcludedType` strips matching members from every value
expectTypeOf<ExcludeValues<{a: string | number; b: null | number}, string | null>>().toBe<{a: number; b: number}>();

// Removes properties whose value is fully excluded
expectTypeOf<ExcludeValues<{a: string; b: undefined; c: null}, undefined | null>>().toBe<{a: string}>();
expectTypeOf<ExcludeValues<{a: string; b: 'x' | 'y'}, string>>().toBe<{}>();
expectTypeOf<ExcludeValues<{a: 1; b: 2}, 1 | 2>>().toBe<{}>();

// A `never` value is fully excluded by anything, like `Exclude<never, string>`
expectTypeOf<ExcludeValues<{a: never}, string>>().toBe<{}>();

// `boolean` distributes, like `Exclude`
expectTypeOf<ExcludeValues<{a: true | false; b: boolean}, false>>().toBe<{a: true; b: true}>();

// Keeps the `readonly` and optional modifiers
expectTypeOf<ExcludeValues<{readonly a?: string | undefined; b: null}, null>>().toBe<{readonly a?: string | undefined}>();
expectTypeOf<ExcludeValues<{a?: string; readonly b?: string; c: null}, null>>().toBe<{a?: string; readonly b?: string}>();

// An optional property whose value contains `undefined` keeps its optional modifier
expectTypeOf<ExcludeValues<{a?: string | undefined}, undefined>>().toBe<{a?: string}>();

// An optional property is removed when its declared value is fully excluded, like an optional tuple element
expectTypeOf<ExcludeValues<{a?: string}, string>>().toBe<{}>();

// A property that explicitly declares `undefined` is kept when only its other members are excluded
expectTypeOf<ExcludeValues<{a?: string | undefined}, string>>().toBe<{a?: undefined}>();

// `Required` composition from the docs
expectTypeOf<Required<ExcludeValues<Foo, undefined>>>().toBe<{foo: number | null; bar: string}>();

// Matching uses assignability, like `Exclude`
expectTypeOf<ExcludeValues<{a: 'unicorn'}, string>>().toBe<{}>();
expectTypeOf<ExcludeValues<{a: string | number}, string>>().toBe<{a: number}>();

// `any` and `unknown` values are kept as is, like with `Exclude`
expectTypeOf<ExcludeValues<{a: any; b: unknown}, string>>().toBe<{a: any; b: unknown}>();

// A `void` value is not excluded by `undefined`
expectTypeOf<ExcludeValues<{a: void}, undefined>>().toBe<{a: void}>();

// Built-in values are kept
expectTypeOf<ExcludeValues<{a: Date | undefined; b: RegExp | null}, undefined | null>>().toBe<{a: Date; b: RegExp}>();
expectTypeOf<ExcludeValues<{a: symbol | undefined; b: string}, undefined>>().toBe<{a: symbol; b: string}>();
expectTypeOf<ExcludeValues<{a: 1n; b: bigint}, 1n>>().toBe<{b: bigint}>();

// Function values are kept when excluding a primitive
expectTypeOf<ExcludeValues<{a: () => void; b: string | (() => void)}, string>>().toBe<{a: () => void; b: () => void}>();

// Excluding `Function` strips function members from value unions
expectTypeOf<ExcludeValues<{a: string | (() => void)}, Function>>().toBe<{a: string}>();

// A function value is stripped of `undefined` like any other union
expectTypeOf<ExcludeValues<{callback: (() => void) | undefined}, undefined>>().toBe<{callback: () => void}>();

// Values inside functions are not touched
expectTypeOf<ExcludeValues<{a: (value?: string) => string | undefined}, string>>().toBe<{a: (value?: string) => string | undefined}>();

// Excluding `object` removes object and function values, since functions are assignable to `object`
expectTypeOf<ExcludeValues<{a: string; b: {x: number}; c: () => void}, object>>().toBe<{a: string}>();

// An `ExcludedType` of `never` changes nothing
expectTypeOf<ExcludeValues<Foo, never>>().toBe<Foo>();

// An `ExcludedType` of `any` or `unknown` removes every property
expectTypeOf<ExcludeValues<{a: string; b: number}, any>>().toBe<{}>();
expectTypeOf<ExcludeValues<{a: string; b: number}, unknown>>().toBe<{}>();

// Arrays and tuples
expectTypeOf<ExcludeValues<ReadonlyArray<string | undefined>, undefined>>().toBe<readonly string[]>();
expectTypeOf<ExcludeValues<[string, ...undefined[]], undefined>>().toBe<[string]>();
expectTypeOf<ExcludeValues<[number | null, ...Array<string | null>], null>>().toBe<[number, ...string[]]>();
expectTypeOf<ExcludeValues<readonly [string, undefined?], undefined>>().toBe<readonly [string]>();
expectTypeOf<ExcludeValues<[string | undefined, ...Array<string | undefined>], undefined>>().toBe<[string, ...string[]]>();
expectTypeOf<ExcludeValues<[string | undefined, ...Array<string | undefined>, number | undefined], undefined>>().toBe<[string, ...string[], number]>();
expectTypeOf<ExcludeValues<[...Array<string | undefined>, string], undefined>>().toBe<[...string[], string]>();
expectTypeOf<ExcludeValues<readonly [string?, number?], undefined>>().toBe<readonly [string?, number?]>();

// Tuple labels are dropped
expectTypeOf<ExcludeValues<[length: string | undefined], undefined>>().toBe<[string]>();

// An optional tuple element whose declared value is fully excluded is removed too
expectTypeOf<ExcludeValues<[a?: string], string>>().toBe<[]>();

// An `ExcludedType` of `never` changes nothing for arrays and tuples too
expectTypeOf<ExcludeValues<Array<string | undefined>, never>>().toBe<Array<string | undefined>>();
expectTypeOf<ExcludeValues<[string, number | undefined], never>>().toBe<[string, number | undefined]>();

// A union of an object and an array distributes over each member
expectTypeOf<ExcludeValues<Array<string | undefined> | {a: string | undefined}, undefined>>().toBe<string[] | {a: string}>();

// Index signatures
expectTypeOf<ExcludeValues<{[key: string]: string | undefined}, undefined>>().toBe<{[key: string]: string}>();
expectTypeOf<ExcludeValues<{[key: string]: undefined}, undefined>>().toBe<{}>();
expectTypeOf<ExcludeValues<{[key: string]: string | undefined; [key: number]: undefined}, undefined>>().toBe<{[key: string]: string}>();
expectTypeOf<ExcludeValues<{readonly [key: string]: string | undefined}, undefined>>().toBe<{readonly [key: string]: string}>();
expectTypeOf<ExcludeValues<{[key: symbol]: string | undefined}, undefined>>().toBe<{[key: symbol]: string}>();
expectTypeOf<ExcludeValues<{[key: string]: string | undefined}, string>>().toBe<{[key: string]: undefined}>();

// Number and symbol keys work like string keys
declare const symbolKey: unique symbol;
expectTypeOf<ExcludeValues<{0: undefined; 1: string; [symbolKey]: undefined}, undefined>>().toBe<{1: string}>();

// Each member of a union is handled by itself
expectTypeOf<ExcludeValues<{a: string; b?: undefined} | {b: number; c?: undefined}, undefined>>().toBe<{a: string} | {b: number}>();

// Methods are kept, including one that only returns `undefined`
expectTypeOf<ExcludeValues<{run(value?: string): void; stop(): undefined}, undefined>>().toBe<{run: (value?: string) => void; stop: () => undefined}>();

// Optional methods keep their optional modifier
expectTypeOf<ExcludeValues<{run?(value: string): void}, undefined>>().toBe<{run?: (value: string) => void}>();

// Generic methods stay generic
expectTypeOf<ExcludeValues<{map<Value>(value: string): Value[]}, undefined>>().toBe<{map: <Value>(value: string) => Value[]}>();

// Only the top level is checked
expectTypeOf<ExcludeValues<{a: {b: string | undefined}}, undefined>>().toBe<{a: {b: string | undefined}}>();
expectTypeOf<ExcludeValues<{a?: {b: string | undefined}}, undefined>>().toBe<{a?: {b: string | undefined}}>();

// Call and construct signatures are dropped, like with `Pick`
expectTypeOf<ExcludeValues<{(value: string): void; a: string | undefined}, undefined>>().toBe<{a: string}>();
expectTypeOf<ExcludeValues<{new (): object; a?: undefined}, undefined>>().toBe<{}>();
expectTypeOf<ExcludeValues<(value: string) => void, undefined>>().toBe<{}>();

// Intersections are flattened by the mapped type
expectTypeOf<ExcludeValues<{a?: undefined} & {b: string}, undefined>>().toBe<{b: string}>();
expectTypeOf<ExcludeValues<{a: string | undefined} & Record<string, string | undefined>, undefined>>().toBe<{[key: string]: string; a: string}>();

// Protected members are left out, like with `keyof`
declare class Store {
	value: string | undefined;
	protected cached: string | undefined;
}
expectTypeOf<ExcludeValues<Store, undefined>>().toBe<{value: string}>();

// Private and static members are left out too, like with `keyof`
declare class Counter {
	static count: number | undefined;
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members -- The private member makes the class nominal.
	private readonly cache: string | undefined;
	value: string | undefined;
}
expectTypeOf<ExcludeValues<Counter, undefined>>().toBe<{value: string}>();

// An object with no property left becomes `{}`
expectTypeOf<ExcludeValues<{a: 'x' | 'y'} | {b: string}, 'x' | 'y'>>().toBe<{} | {b: string}>();

// A generic `Base` is not assignable to the result
function assignGeneric<ObjectType extends {a: string | undefined; b?: undefined}>(object: ObjectType) {
	// @ts-expect-error A generic `Base` is not assignable to the result.
	const result: ExcludeValues<ObjectType, undefined> = object;
}

// Inference works at call sites
declare function cleanValue<Base extends object>(value: Base): ExcludeValues<Base, undefined>;
const cleaned = cleanValue({a: 'x', b: undefined, c: 1});
expectTypeOf(cleaned).toBe<{a: string; c: number}>();

// `ExcludedType` is inferred at call sites too
declare function withoutValue<Base extends object, ExcludedType>(value: Base, excluded: ExcludedType): ExcludeValues<Base, ExcludedType>;
const withoutUndefined = withoutValue({a: 'x', b: undefined}, undefined);
expectTypeOf(withoutUndefined).toBe<{a: string}>();

// The removed property is not accessible
declare const result: ExcludeValues<Foo, undefined>;
expectTypeOf<keyof typeof result>().toBe<'foo' | 'bar'>();
expectTypeOf(result.foo).toBe<number | null>();
// @ts-expect-error The property whose value was fully excluded is gone.
const _baz: unknown = result.baz;

// The result is not assignable to the original type, since the removed property is missing
expectTypeOf<ExcludeValues<Foo, undefined>>().not.toBeAssignableTo<Foo>();

// The excluded value cannot come back through a required property
expectTypeOf<{a: string | undefined}>().not.toBeAssignableTo<ExcludeValues<{a: string | undefined}, undefined>>();

// The same structural removal, pinned for the tuple branch
expectTypeOf<[string | undefined, string | undefined]>().not.toBeAssignableTo<ExcludeValues<[string | undefined, string | undefined], undefined>>();

// `any`, `never`, and `object` stay as they are
expectTypeOf<ExcludeValues<any, undefined>>().toBe<any>();
expectTypeOf<ExcludeValues<never, undefined>>().toBe<never>();
expectTypeOf<ExcludeValues<object, undefined>>().toBe<object>();
expectTypeOf<ExcludeValues<{}, undefined>>().toBe<{}>();

// `Map`, `Set`, and `Promise` are treated as plain objects: their methods are kept as is, so their inner values are not stripped
expectTypeOf<ExcludeValues<Map<string, string | undefined>, undefined>['size']>().toBe<number>();
expectTypeOf<ExcludeValues<Map<string, string | undefined>, undefined>['get']>().toBe<(key: string) => string | undefined>();
expectTypeOf<ExcludeValues<Promise<string | undefined>, undefined>['then']>().toBe<Promise<string | undefined>['then']>();

// An `ExcludedType` that matches nothing changes nothing
expectTypeOf<ExcludeValues<Foo, Date>>().toBe<Foo>();

// Applying it again changes nothing
expectTypeOf<ExcludeValues<ExcludeValues<Foo, undefined>, undefined>>().toBe<ExcludeValues<Foo, undefined>>();

// @ts-expect-error
type DoesNotAllowUnknown = ExcludeValues<unknown, undefined>;
// @ts-expect-error
type DoesNotAllowPrimitives = ExcludeValues<string, undefined>;
// @ts-expect-error
type DoesNotAllowUndefined = ExcludeValues<undefined, undefined>;

// Falsy values are removed with `Falsy`, like `.filter(Boolean)`
expectTypeOf<ExcludeValues<[0, 'a', '', null, 1, boolean], Falsy>>().toBe<['a', 1, true]>();
expectTypeOf<ExcludeValues<Array<string | 0 | undefined>, Falsy>>().toBe<string[]>();

// More arrays and tuples
// Removing values does not change whether the remaining tuple positions are optional.
expectTypeOf<ExcludeValues<readonly ['remove', 1, 'remove'?, (2 | undefined)?], string>>().toBe<readonly [1, (2 | undefined)?]>();
expectTypeOf<ExcludeValues<['remove', ...Array<string | boolean>, 'remove', 2], string>>().toBe<[...boolean[], 2]>();
expectTypeOf<ExcludeValues<readonly ['remove', 1?] | ['remove', 2], string>>().toBe<readonly [1?] | [2]>();

// All required elements
expectTypeOf<ExcludeValues<[1, 2, 3, 4], 2>>().toBe<[1, 3, 4]>();

// All optional elements
expectTypeOf<ExcludeValues<[1?, 2?, 3?, 4?], 2>>().toBe<[1?, 3?, 4?]>();

// Mixed required and optional elements
expectTypeOf<ExcludeValues<[1, 2, 3?, 4?], 2>>().toBe<[1, 3?, 4?]>();
expectTypeOf<ExcludeValues<[1, 2?, 3?, 4?], 2>>().toBe<[1, 3?, 4?]>();

// Explicit undefined in optional elements
expectTypeOf<ExcludeValues<[1, (2 | undefined)?, 3?], 2>>().toBe<[1, undefined?, 3?]>();

// Union elements
expectTypeOf<ExcludeValues<[1, 2 | 3, 4 | 5], 2>>().toBe<[1, 3, 4 | 5]>();

// Excluding unions
expectTypeOf<ExcludeValues<[1, 2 | 3, 4 | 5], 2 | 4>>().toBe<[1, 3, 5]>();

// Required and rest element
// Trailing rest element
expectTypeOf<ExcludeValues<[1, 2, ...string[]], 1>>().toBe<[2, ...string[]]>();
expectTypeOf<ExcludeValues<[1, 2, ...string[]], 1 | 2>>().toBe<string[]>();
// Leading rest element
expectTypeOf<ExcludeValues<[...string[], 1, 2], 1>>().toBe<[...string[], 2]>();
expectTypeOf<ExcludeValues<[...string[], 1, 2], 1 | 2>>().toBe<string[]>();
// Rest element in the middle
expectTypeOf<ExcludeValues<[1, 2, ...string[], 3, 4], 2 | 4>>().toBe<[1, ...string[], 3]>();
expectTypeOf<ExcludeValues<[1, 2, ...string[], 3, 4], 1 | 2 | 3 | 4>>().toBe<string[]>();

// Optional and rest element
expectTypeOf<ExcludeValues<[1?, 2?, ...string[]], 2>>().toBe<[1?, ...string[]]>();
expectTypeOf<ExcludeValues<[1?, 2?, ...string[]], 1 | 2>>().toBe<string[]>();

// Required, optional, and rest element
expectTypeOf<ExcludeValues<[1, 2, 3?, 4?, ...string[]], 2 | 3>>().toBe<[1, 4?, ...string[]]>();

// Excluding rest element
// Trailing rest element
expectTypeOf<ExcludeValues<[1, 2, ...string[]], string>>().toBe<[1, 2]>();
expectTypeOf<ExcludeValues<[1?, 2?, ...string[]], string>>().toBe<[1?, 2?]>();
expectTypeOf<ExcludeValues<[1, 2, 3?, 4?, ...string[]], string>>().toBe<[1, 2, 3?, 4?]>();
expectTypeOf<ExcludeValues<[1, 2, ...Array<string | number>], string>>().toBe<[1, 2, ...number[]]>();
expectTypeOf<ExcludeValues<[1?, 2?, ...Array<string | number>], string>>().toBe<[1?, 2?, ...number[]]>();
expectTypeOf<ExcludeValues<[1, 2, 3?, 4?, ...Array<string | number>], string>>().toBe<[1, 2, 3?, 4?, ...number[]]>();
// Leading rest element
expectTypeOf<ExcludeValues<[...string[], 1, 2], string>>().toBe<[1, 2]>();
expectTypeOf<ExcludeValues<[...Array<string | number>, 1, 2], string>>().toBe<[...number[], 1, 2]>();
// Rest element in the middle
expectTypeOf<ExcludeValues<[1, ...string[], 2, 3], string>>().toBe<[1, 2, 3]>();
expectTypeOf<ExcludeValues<[1, ...Array<string | number>, 2, 3], string>>().toBe<[1, ...number[], 2, 3]>();

// Excluding both rest element and non-rest elements
expectTypeOf<ExcludeValues<[1, 2, 3?, (4 | 5)?, ...Array<string | number>], 2 | 4 | string>>().toBe<[1, 3?, 5?, ...number[]]>();

// All elements excluded
expectTypeOf<ExcludeValues<[1, 2, 3], 1 | 2 | 3>>().toBe<[]>();
expectTypeOf<ExcludeValues<[string, number], string | number>>().toBe<[]>();
expectTypeOf<ExcludeValues<[1, 2?, 3?, ...string[]], any>>().toBe<[]>();
expectTypeOf<ExcludeValues<[1, 2?, 3?, ...string[]], unknown>>().toBe<[]>();

// No elements excluded
expectTypeOf<ExcludeValues<[1, 2, 3], 4>>().toBe<[1, 2, 3]>();
expectTypeOf<ExcludeValues<[1, 2?, 3?, ...string[]], never>>().toBe<[1, 2?, 3?, ...string[]]>();

// Non-tuple arrays
expectTypeOf<ExcludeValues<Array<string | number>, number>>().toBe<string[]>();
// An array of unknown length whose element type is fully excluded is empty, like a tuple whose rest element is fully excluded.
expectTypeOf<ExcludeValues<Array<string | number>, string | number>>().toBe<[]>();
expectTypeOf<ExcludeValues<boolean[], true>>().toBe<Array<false>>();

// Readonly arrays
expectTypeOf<ExcludeValues<readonly [1, 2, 3], 2>>().toBe<readonly [1, 3]>();
expectTypeOf<ExcludeValues<readonly [1, 2?, ...string[]], 1 | string>>().toBe<readonly [2?]>();
expectTypeOf<ExcludeValues<readonly [...string[], 1], string>>().toBe<readonly [1]>();
expectTypeOf<ExcludeValues<ReadonlyArray<string | number>, number>>().toBe<readonly string[]>();
expectTypeOf<ExcludeValues<readonly string[], string>>().toBe<readonly []>();

// Empty arrays
expectTypeOf<ExcludeValues<[], 1>>().toBe<[]>();
expectTypeOf<ExcludeValues<readonly [], 1>>().toBe<readonly []>();

// Unions of arrays are handled separately
expectTypeOf<ExcludeValues<[1, 2] | readonly ['a', 'b'], 2 | 'a'>>().toBe<[1] | readonly ['b']>();
expectTypeOf<ExcludeValues<[1, 'a'] | string[], string>>().toBe<[1] | []>();

// A union element keeps its remaining members
expectTypeOf<ExcludeValues<[boolean, 1], true>>().toBe<[false, 1]>();
expectTypeOf<ExcludeValues<[1 | 'a', ...Array<2 | 'b'>, 3 | 'c'], string>>().toBe<[1, ...Array<2>, 3]>();

// Labels are dropped, since the positions change
expectTypeOf<ExcludeValues<[a: 1, b: 2, c: 3], 2>>().toBe<[1, 3]>();

// `any`, `unknown`, and `never` elements
expectTypeOf<ExcludeValues<[1, any, 2], 1>>().toBe<[any, 2]>();
expectTypeOf<ExcludeValues<[1, unknown, 2], 1>>().toBe<[unknown, 2]>();
expectTypeOf<ExcludeValues<[1, never, 2], 1>>().toBe<[2]>();
expectTypeOf<ExcludeValues<any[], 1>>().toBe<any[]>();
expectTypeOf<ExcludeValues<unknown[], 1>>().toBe<unknown[]>();

// Excluding `undefined` keeps the optional modifier
expectTypeOf<ExcludeValues<[1, (2 | undefined)?], undefined>>().toBe<[1, 2?]>();

// Edge cases
expectTypeOf<ExcludeValues<any, 1>>().toBe<any>();
expectTypeOf<ExcludeValues<never, 1>>().toBe<never>();
expectTypeOf<ExcludeValues<string[], unknown>>().toBe<[]>();

// Long tuples
expectTypeOf<ExcludeValues<IndexTuple<TupleOf<500>>, 0 | 1>['length']>().toBe<498>();

// Required batches retain order and narrow each element independently.
expectTypeOf<ExcludeValues<[any, unknown, never, 1 | string, 2], string>>().toBe<[any, unknown, 1, 2]>();
expectTypeOf<ExcludeValues<readonly [0, 0, 0, 0, 0, 6], 0>>().toBe<readonly [6]>();
expectTypeOf<ExcludeValues<readonly [0, 1, 0, 2, 0, (3 | undefined)?, ...Array<0 | string>], 0 | undefined>>().toBe<readonly [1, 2, 3?, ...string[]]>();
expectTypeOf<ExcludeValues<[...Array<0 | string>, 0, 1, 0, 2, 0], 0>>().toBe<[...string[], 1, 2]>();

function makeRetainedBatch<const Value>(value: Value): ExcludeValues<readonly [number, {value: Value}, number, {value: Value}, number], number> {
	return [{value}, {value}];
}

const retainedBatch = makeRetainedBatch({id: 'kept'});
expectTypeOf(retainedBatch[1].value).toBe<{readonly id: 'kept'}>();

// Generic arrays
function _generic<ArrayType extends unknown[], ExcludeType>(array: ExcludeValues<ArrayType, ExcludeType>) {
	const arrayResult: readonly unknown[] = array;
	return [arrayResult, array.length];
}

// @ts-expect-error
type _NotArray = ExcludeValues<string, string>;

// The removed-element test distinguishes `never` from `any` and `unknown` at every position.
expectTypeOf<ExcludeValues<[any, unknown, never], never>>().toBe<[any, unknown]>();
expectTypeOf<ExcludeValues<[any, unknown, never], unknown>>().toBe<[]>();
expectTypeOf<ExcludeValues<[...any[], unknown, never], never>>().toBe<[...any[], unknown]>();
expectTypeOf<ExcludeValues<[1, ...unknown[], never], 1>>().toBe<unknown[]>();
expectTypeOf<ExcludeValues<readonly [...never[], 1, 2], 1>>().toBe<readonly [2]>();
expectTypeOf<ExcludeValues<[(1 | undefined)?], 1>>().toBe<[undefined?]>();
expectTypeOf<ExcludeValues<readonly [(1 | undefined)?, ...Array<2 | undefined>], undefined>>().toBe<readonly [1?, ...Array<2>]>();
expectTypeOf<ExcludeValues<readonly [1?, ...any[]], any>>().toBe<readonly []>();

// Excluded rest values and fixed values are tested independently.
expectTypeOf<ExcludeValues<readonly [1 | 'a', ...Array<2 | 'b'>, 3 | 'c'], string>>().toBe<readonly [1, ...Array<2>, 3]>();
expectTypeOf<ExcludeValues<[1 | 2, 3 | 4], 2 | 3>>().toBe<[1, 4]>();
expectTypeOf<ExcludeValues<readonly [undefined, void, null], undefined>>().toBe<readonly [void, null]>();
expectTypeOf<ExcludeValues<[] | readonly [1?, ...string[]] | [2, 3], number>>().toBe<[] | readonly string[]>();

// A kept value retains its nested readonly shape, and generic readonly inputs still yield arrays.
declare function excludeNumbers<const Array_ extends readonly unknown[]>(array: Array_): ExcludeValues<Array_, number>;
const remainingValues = excludeNumbers([0, {id: 1}, ['nested']] as const);
expectTypeOf(remainingValues).toBe<readonly [{readonly id: 1}, readonly ['nested']]>();
expectTypeOf(remainingValues[0].id).toBe<1>();
// @ts-expect-error A readonly input keeps its readonly result.
remainingValues[0] = {id: 1};

function _readonlyResult<Array_ extends readonly unknown[], Removed>(array: ExcludeValues<Array_, Removed>): readonly unknown[] {
	return array;
}

// A fully excluded tuple has no retained positions, including a readonly input or one member of a union.
type NumericPacket = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
expectTypeOf<ExcludeValues<NumericPacket, number>>().toBe<[]>();
expectTypeOf<ExcludeValues<Readonly<NumericPacket>, number>>().toBe<readonly []>();
expectTypeOf<ExcludeValues<NumericPacket | readonly [1, 'kept'], number>>().toBe<[] | readonly ['kept']>();

function makeRetained<const Value>(value: Value): ExcludeValues<[number, {value: Value}], number> {
	return [{value}];
}

const retainedBox = makeRetained({id: 'kept'});
expectTypeOf(retainedBox[0].value).toBe<{readonly id: 'kept'}>();
const fullyExcluded = excludeNumbers([1, 2, 3] as const);
expectTypeOf(fullyExcluded).toBe<readonly []>();
// @ts-expect-error A fully excluded result has no first element.
const _excludedFirst: unknown = fullyExcluded[0];

// Structural exclusions can remove every descriptor without losing a retained descriptor's literal kind.
expectTypeOf<ExcludeValues<readonly [{kind: 'internal'; name: 'id'}, {kind: 'internal'; name: 'cache'}], {kind: 'internal'}>>().toBe<readonly []>();

function makePublicField<const Value>(value: Value): ExcludeValues<readonly [{kind: 'internal'}, {kind: 'public'; value: Value}], {kind: 'internal'}> {
	return [{kind: 'public', value}];
}

const publicField = makePublicField({id: 'visible'});
expectTypeOf(publicField[0]).toBe<{kind: 'public'; value: {readonly id: 'visible'}}>();
// @ts-expect-error A readonly input still yields a readonly result with otherwise valid field values.
publicField[0] = {kind: 'public', value: {id: 'visible'}};

function _allRemoved<Values extends readonly number[]>(values: ExcludeValues<Values, number>): readonly [] {
	return values;
}

// A fully removed member and a partially retained member each keep their own access.
expectTypeOf<ExcludeValues<readonly number[] | [number, string], number>>().toBe<readonly [] | [string]>();
expectTypeOf<ExcludeValues<number[] | readonly [number, string?], number>>().toBe<[] | readonly [string?]>();
expectTypeOf<ExcludeValues<readonly [number?, ...string[]] | [boolean, ...number[]], number>>().toBe<readonly string[] | [boolean]>();
expectTypeOf<ExcludeValues<readonly [number, ...string[], boolean] | [Date, ...RegExp[], number], number>>().toBe<readonly [...string[], boolean] | [Date, ...RegExp[]]>();

// Excluding top-level elements does not recursively change the retained values.
expectTypeOf<ExcludeValues<[readonly string[], number], number>>().toBe<[readonly string[]]>();
expectTypeOf<ExcludeValues<readonly [number, {id: string}, string[]], number>>().toBe<readonly [{id: string}, string[]]>();
declare const shallowReadonlyExclusion: ExcludeValues<readonly [number, {id: string}, string[]], number>;
shallowReadonlyExclusion[0].id = 'updated';
shallowReadonlyExclusion[1].push('updated');
// @ts-expect-error A retained value cannot replace a readonly outer position.
shallowReadonlyExclusion[0] = {id: 'replacement'};
