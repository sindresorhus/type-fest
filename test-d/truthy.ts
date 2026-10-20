import {expectTypeOf} from 'nz';
import type {Falsy, Filter, LiteralUnion, Tagged, Truthy} from '../index.d.ts';

// Falsy literal types are removed
expectTypeOf<Truthy<'a' | '' | 0 | 1 | null | undefined>>().toBe<'a' | 1>();
expectTypeOf<Truthy<1n | 0n>>().toBe<1n>();
expectTypeOf<Truthy<-0 | -1>>().toBe<-1>();
expectTypeOf<Truthy<'' | ' ' | '0' | 'false'>>().toBe<' ' | '0' | 'false'>();
expectTypeOf<Truthy<boolean>>().toBe<true>();
expectTypeOf<Truthy<boolean | undefined>>().toBe<true>();
expectTypeOf<Truthy<string | null | undefined>>().toBe<string>();
expectTypeOf<Truthy<number | false>>().toBe<number>();
expectTypeOf<Truthy<keyof {0: 1; a: 2; '': 3}>>().toBe<'a'>();

// Only falsy types
expectTypeOf<Truthy<Falsy>>().toBe<never>();
expectTypeOf<Truthy<false>>().toBe<never>();
expectTypeOf<Truthy<0>>().toBe<never>();
expectTypeOf<Truthy<0n>>().toBe<never>();
expectTypeOf<Truthy<''>>().toBe<never>();
expectTypeOf<Truthy<null>>().toBe<never>();
expectTypeOf<Truthy<undefined>>().toBe<never>();

// Truthy types are kept
expectTypeOf<Truthy<true>>().toBe<true>();
expectTypeOf<Truthy<symbol>>().toBe<symbol>();
expectTypeOf<Truthy<{a: 0}>>().toBe<{a: 0}>();
expectTypeOf<Truthy<[]>>().toBe<[]>();
expectTypeOf<Truthy<string[]>>().toBe<string[]>();
expectTypeOf<Truthy<() => void>>().toBe<() => void>();
expectTypeOf<Truthy<Date | RegExp>>().toBe<Date | RegExp>();
expectTypeOf<Truthy<`a${string}`>>().toBe<`a${string}`>();
expectTypeOf<Truthy<'' | `a${string}`>>().toBe<`a${string}`>();
expectTypeOf<Truthy<`${number}` | ''>>().toBe<`${number}`>(); // A number string is never empty

declare const uniqueSymbol: unique symbol;
expectTypeOf<Truthy<typeof uniqueSymbol | undefined>>().toBe<typeof uniqueSymbol>();

declare function overloaded(value: string): string;
declare function overloaded(value: number): number;
expectTypeOf<Truthy<typeof overloaded | undefined>>().toBe<typeof overloaded>();

// A boxed primitive is an object, so it is always truthy
expectTypeOf<Truthy<Boolean | Number | String>>().toBe<Boolean | Number | String>();

// Object types are kept, and the falsy types are removed from the union
expectTypeOf<Truthy<null | 0 | {a: number}>>().toBe<{a: number}>();
expectTypeOf<Truthy<object | undefined>>().toBe<object>();
expectTypeOf<Truthy<null | {}>>().toBe<{}>();
expectTypeOf<Truthy<readonly string[] | undefined>>().toBe<readonly string[]>();
expectTypeOf<Truthy<readonly [0, ''] | null>>().toBe<readonly [0, '']>();
expectTypeOf<Truthy<Promise<0> | 0>>().toBe<Promise<0>>();
expectTypeOf<Truthy<Map<string, 0> | Set<''> | undefined>>().toBe<Map<string, 0> | Set<''>>();
expectTypeOf<Truthy<Record<string, unknown> | null>>().toBe<Record<string, unknown>>();

// Wide types cannot be narrowed (limitation)
expectTypeOf<Truthy<number>>().toBe<number>();
expectTypeOf<Truthy<string>>().toBe<string>();
expectTypeOf<Truthy<bigint>>().toBe<bigint>();
expectTypeOf<Truthy<Lowercase<string>>>().toBe<Lowercase<string>>();

// Intersections are removed when they are falsy, and kept otherwise
expectTypeOf<Truthy<0 & {brand: true}>>().toBe<never>();
expectTypeOf<Truthy<(string & {brand: true}) | ''>>().toBe<string & {brand: true}>();

type UserId = Tagged<string, 'UserId'>;
expectTypeOf<Truthy<UserId | undefined>>().toBe<UserId>();
expectTypeOf<Truthy<Tagged<0, 'Zero'> | Tagged<1, 'One'>>>().toBe<Tagged<1, 'One'>>();
expectTypeOf<Truthy<Tagged<'', 'Empty'> | 'a'>>().toBe<'a'>();

// `string & {}` becomes `string`, like `NonNullable` does (limitation)
expectTypeOf<Truthy<string & {}>>().toBe<string>();
expectTypeOf<Truthy<'a' | (string & {})>>().toBe<string>();
expectTypeOf<Truthy<(string & {}) | ''>>().toBe<string>();

// `LiteralUnion` keeps the literals
type Pet = LiteralUnion<'dog' | 'cat', string>;
expectTypeOf<Truthy<Pet | undefined>>().toBe<Pet>();

// `unknown` becomes `{}`, like `if (value)` does
expectTypeOf<Truthy<unknown>>().toBe<{}>();

// `void` is removed, like `if (value)` does
expectTypeOf<Truthy<void>>().toBe<never>();
expectTypeOf<Truthy<string | void>>().toBe<string>();
expectTypeOf<Truthy<Promise<void> | void>>().toBe<Promise<void>>();

// `any` and `never`
expectTypeOf<Truthy<any>>().toBe<any>();
expectTypeOf<Truthy<never>>().toBe<never>();

// Enums
enum Status {
	Off = 0,
	On = 1,
}

enum Label {
	Empty = '',
	Text = 'text',
}

enum Mixed {
	Zero = 0,
	Empty = '',
	Text = 'text',
}

expectTypeOf<Truthy<Status>>().toBe<Status.On>();
expectTypeOf<Truthy<Label>>().toBe<Label.Text>();
expectTypeOf<Truthy<Mixed>>().toBe<Mixed.Text>();

// Idempotent
expectTypeOf<Truthy<Truthy<'a' | '' | null>>>().toBe<'a'>();

// Not distributed into object properties or array elements
expectTypeOf<Truthy<{a: 0 | 1}>>().toBe<{a: 0 | 1}>();
expectTypeOf<Truthy<Array<0 | 1>>>().toBe<Array<0 | 1>>();

// Falsy values are not assignable
expectTypeOf(0 as const).not.toBeAssignableTo<Truthy<0 | 1>>();
expectTypeOf('' as const).not.toBeAssignableTo<Truthy<'' | 'a'>>();
expectTypeOf(null).not.toBeAssignableTo<Truthy<unknown>>();
expectTypeOf(undefined).not.toBeAssignableTo<Truthy<unknown>>();
expectTypeOf(false as const).not.toBeAssignableTo<Truthy<boolean>>();

// Matches the narrowing of `if (value)`
declare const mixed: 'a' | '' | 0 | 1 | 0n | 1n | true | false | null | undefined;
if (mixed) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
	expectTypeOf(mixed).toBe<Truthy<typeof mixed>>();
}

declare const unknownValue: unknown;
if (unknownValue) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
	expectTypeOf(unknownValue).toBe<Truthy<unknown>>();
}

declare const optionalVoid: string | void;
if (optionalVoid) { // eslint-disable-line @typescript-eslint/strict-boolean-expressions
	expectTypeOf(optionalVoid).toBe<Truthy<typeof optionalVoid>>();
}

// In a generic function
function generic<Value>(truthy: Truthy<Value>) {
	const value: Value = truthy;
	const nonNullable: NonNullable<Value> = truthy;
	const object: {} = truthy;
}

function constrained<Value extends string | undefined>(truthy: Truthy<Value>) {
	const value: string = truthy;
}

declare function truthyOrNever<Value extends 'a' | '' | null>(value: Value): Truthy<Value>;
expectTypeOf(truthyOrNever('a')).toBe<'a'>();
expectTypeOf(truthyOrNever('')).toBe<never>();
expectTypeOf(truthyOrNever(null)).toBe<never>();

// Filtering an array
declare const array: Array<string | number | boolean | null | undefined>;
expectTypeOf(array.filter((value): value is Truthy<typeof value> => Boolean(value))).toBe<Array<string | number | true>>();

declare const unknownArray: unknown[];
expectTypeOf(unknownArray.filter((value): value is Truthy<typeof value> => Boolean(value))).toBe<Array<{}>>();

const tuple = ['a', '', 0, 1, null, undefined, false] as const;
expectTypeOf<Truthy<typeof tuple[number]>>().toBe<'a' | 1>();

// Same result as `Filter` with `Boolean`, for elements that are not unions
expectTypeOf<Filter<[0, 'a', null, 1n, false, {}], Boolean>[number]>().toBe<Truthy<0 | 'a' | null | 1n | false | {}>>();

// A `compact` function
declare function compact<Value>(array: readonly Value[]): Array<Truthy<Value>>;
expectTypeOf(compact(['a', '', undefined])).toBe<string[]>();
expectTypeOf(compact([1, 0, null])).toBe<number[]>();
expectTypeOf(compact([{a: 1}, undefined, false])).toBe<Array<true | {a: number}>>();
expectTypeOf(compact(tuple)).toBe<Array<'a' | 1>>();

// A type guard narrows the `true` branch, but also the `else` branch, which is wrong for wide types (limitation)
declare function isTruthy<Value>(value: Value): value is Truthy<Value>;

declare const optionalString: string | undefined;
if (isTruthy(optionalString)) {
	expectTypeOf(optionalString).toBe<string>();
} else {
	expectTypeOf(optionalString).toBe<undefined>(); // Can also be `''` at runtime
}

declare const literals: 'a' | '' | null;
if (isTruthy(literals)) {
	expectTypeOf(literals).toBe<'a'>();
} else {
	expectTypeOf(literals).toBe<'' | null>();
}
