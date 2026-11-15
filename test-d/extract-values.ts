import {expectTypeOf} from 'nz';
import type {ExcludeValues, ExtractValues} from '../index.d.ts';

// The examples from the docs
expectTypeOf<ExtractValues<[1, 'a', 2, 'b'], number>>().toBe<[1, 2]>();
expectTypeOf<ExtractValues<readonly [string, number?, ...boolean[]], number | boolean>>().toBe<readonly [number?, ...boolean[]]>();
expectTypeOf<ExtractValues<Array<string | number>, number>>().toBe<number[]>();
expectTypeOf<ExtractValues<[1 | 'a', 2, 'b'], number>>().toBe<[1, 2]>();

type User = {
	id: number;
	name: string;
	nickname?: string;
	contact: string | {email: string};
	isAdmin: boolean;
};

expectTypeOf<ExtractValues<User, string>>().toBe<{name: string; nickname?: string; contact: string}>();

// Narrows every value union to the matching members
expectTypeOf<ExtractValues<{a: number | string; b: string}, string>>().toBe<{a: string; b: string}>();
expectTypeOf<ExtractValues<{a: 'x' | 'y'; b: 'z'}, 'x' | 'z'>>().toBe<{a: 'x'; b: 'z'}>();
expectTypeOf<ExtractValues<{a: 1 | 2 | 3; b: 4}, 2 | 3>>().toBe<{a: 2 | 3}>();
expectTypeOf<ExtractValues<{a: `prefix-${string}`; b: string}, `prefix-${string}`>>().toBe<{a: `prefix-${string}`}>();

// Removes properties with no matching member
expectTypeOf<ExtractValues<{a: string; b: number; c: null}, boolean>>().toBe<{}>();

// A `never` value has no matching member
expectTypeOf<ExtractValues<{a: never; b: string}, string>>().toBe<{b: string}>();

// `boolean` distributes, like `Extract`
expectTypeOf<ExtractValues<{a: boolean; b: false}, true>>().toBe<{a: true}>();

// Keeps the `readonly` and optional modifiers
expectTypeOf<ExtractValues<{readonly a?: string | number; b: number}, string>>().toBe<{readonly a?: string}>();

// An optional property is removed when its declared value has no matching member
expectTypeOf<ExtractValues<{a?: string}, undefined>>().toBe<{}>();

// A property that explicitly declares `undefined` is kept with an `undefined` value
expectTypeOf<ExtractValues<{a?: string | undefined}, undefined>>().toBe<{a?: undefined}>();

// Matching uses assignability, like `Extract`: a wide type is not narrowed to a narrower one
expectTypeOf<ExtractValues<{a: 'unicorn'; b: string}, string>>().toBe<{a: 'unicorn'; b: string}>();
expectTypeOf<ExtractValues<{a: string}, 'unicorn'>>().toBe<{}>();
expectTypeOf<ExtractValues<string[], 'a'>>().toBe<[]>();

// `any` values are kept, and `unknown` values are removed unless the type is `unknown`, like with `Extract`
expectTypeOf<ExtractValues<{a: any; b: unknown}, string>>().toBe<{a: any}>();
expectTypeOf<ExtractValues<{a: any; b: unknown}, unknown>>().toBe<{a: any; b: unknown}>();

// Function and object values
expectTypeOf<ExtractValues<{a: string | (() => void); b: number}, Function>>().toBe<{a: () => void}>();
expectTypeOf<ExtractValues<{a: string; b: {x: number}; c: () => void}, object>>().toBe<{b: {x: number}; c: () => void}>();

// Values inside functions are not touched
expectTypeOf<ExtractValues<{a: (value?: string) => string | undefined}, Function>>().toBe<{a: (value?: string) => string | undefined}>();

// An `ExtractedType` of `unknown` or `any` changes nothing
expectTypeOf<ExtractValues<User, unknown>>().toBe<User>();
expectTypeOf<ExtractValues<User, any>>().toBe<User>();
expectTypeOf<ExtractValues<[1, 'a'], unknown>>().toBe<[1, 'a']>();

// An `ExtractedType` of `never` removes everything
expectTypeOf<ExtractValues<User, never>>().toBe<{}>();
expectTypeOf<ExtractValues<[1, 'a'], never>>().toBe<[]>();
expectTypeOf<ExtractValues<string[], never>>().toBe<[]>();

// Arrays and tuples
expectTypeOf<ExtractValues<ReadonlyArray<string | undefined>, string>>().toBe<readonly string[]>();
expectTypeOf<ExtractValues<[string, ...number[]], number>>().toBe<number[]>();
expectTypeOf<ExtractValues<[number | null, ...Array<string | null>], null>>().toBe<[null, ...null[]]>();
expectTypeOf<ExtractValues<[string | undefined, ...Array<string | number>, number | undefined], string>>().toBe<[string, ...string[]]>();
expectTypeOf<ExtractValues<[...Array<string | number>, string], string>>().toBe<[...string[], string]>();
expectTypeOf<ExtractValues<readonly [string?, number?], number>>().toBe<readonly [number?]>();
expectTypeOf<ExtractValues<[1, 2, 3, 4, 5, 6, 'a', 7], number>>().toBe<[1, 2, 3, 4, 5, 6, 7]>();

// An optional tuple element with no matching member is removed
expectTypeOf<ExtractValues<[a?: string], number>>().toBe<[]>();

// Required elements stay required
expectTypeOf<ExtractValues<[string, number?], string>>().toBe<[string]>();

// Tuple labels are dropped
expectTypeOf<ExtractValues<[length: string | number], number>>().toBe<[number]>();

// Each member of a union is handled by itself
expectTypeOf<ExtractValues<Array<string | number> | {a: string | number}, number>>().toBe<number[] | {a: number}>();
expectTypeOf<ExtractValues<readonly ['a', 1] | [2, 'b'], number>>().toBe<readonly [1] | [2]>();

// Index signatures
expectTypeOf<ExtractValues<{[key: string]: string | undefined}, string>>().toBe<{[key: string]: string}>();
expectTypeOf<ExtractValues<{[key: string]: number}, string>>().toBe<{}>();

// Methods are kept when they match
expectTypeOf<ExtractValues<{run(value?: string): void; name: string}, Function>>().toBe<{run: (value?: string) => void}>();

// Only the top level is checked
expectTypeOf<ExtractValues<{a: {b: string | number}}, object>>().toBe<{a: {b: string | number}}>();

// Call signatures are dropped, like with `Pick`
expectTypeOf<ExtractValues<{(value: string): void; a: string | number}, string>>().toBe<{a: string}>();

// `ExtractValues` and `ExcludeValues` split a type into two parts
type Mixed = {a: string | number; b: number; c: string};
expectTypeOf<ExtractValues<Mixed, string>>().toBe<{a: string; c: string}>();
expectTypeOf<ExcludeValues<Mixed, string>>().toBe<{a: number; b: number}>();
expectTypeOf<ExtractValues<[1, 'a', 2 | 'b'], string>>().toBe<['a', 'b']>();
expectTypeOf<ExcludeValues<[1, 'a', 2 | 'b'], string>>().toBe<[1, 2]>();

// A generic `Base` is not assignable to the result
function assignGeneric<ObjectType extends {a: string | number}>(object: ObjectType) {
	// @ts-expect-error A generic `Base` is not assignable to the result.
	const result: ExtractValues<ObjectType, string> = object;
}

// Inference works at call sites
declare function stringsOf<Base extends object>(value: Base): ExtractValues<Base, string>;
expectTypeOf(stringsOf({a: 'x', b: 1})).toBe<{a: string}>();
expectTypeOf(stringsOf(['x', 1] as const)).toBe<readonly ['x']>();

// `any`, `never`, and `object` stay as they are
expectTypeOf<ExtractValues<any, string>>().toBe<any>();
expectTypeOf<ExtractValues<never, string>>().toBe<never>();
expectTypeOf<ExtractValues<object, string>>().toBe<object>();
expectTypeOf<ExtractValues<{}, string>>().toBe<{}>();

// Applying it again changes nothing
expectTypeOf<ExtractValues<ExtractValues<User, string>, string>>().toBe<ExtractValues<User, string>>();

// @ts-expect-error
type DoesNotAllowUnknown = ExtractValues<unknown, string>;
// @ts-expect-error
type DoesNotAllowPrimitives = ExtractValues<string, string>;
// @ts-expect-error
type DoesNotAllowUndefined = ExtractValues<undefined, string>;
