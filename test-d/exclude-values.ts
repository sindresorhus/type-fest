import {expectTypeOf} from 'nz';
import type {ExcludeValues} from '../index.d.ts';

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

// Arrays and tuples delegate to `ArrayExclude`
expectTypeOf<ExcludeValues<ReadonlyArray<string | undefined>, undefined>>().toBe<readonly string[]>();
expectTypeOf<ExcludeValues<[string, ...undefined[]], undefined>>().toBe<[string]>();
expectTypeOf<ExcludeValues<[number | null, ...Array<string | null>], null>>().toBe<[number, ...string[]]>();
expectTypeOf<ExcludeValues<readonly [string, undefined?], undefined>>().toBe<readonly [string]>();
expectTypeOf<ExcludeValues<[string | undefined, ...Array<string | undefined>], undefined>>().toBe<[string, ...string[]]>();
expectTypeOf<ExcludeValues<[string | undefined, ...Array<string | undefined>, number | undefined], undefined>>().toBe<[string, ...string[], number]>();
expectTypeOf<ExcludeValues<[...Array<string | undefined>, string], undefined>>().toBe<[...string[], string]>();
expectTypeOf<ExcludeValues<readonly [string?, number?], undefined>>().toBe<readonly [string?, number?]>();

// Tuple labels are dropped by the delegation, like `ArrayExclude`
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
