import {expectTypeOf} from 'nz';
import type {IsUnionMember} from '../index.d.ts';

// A member of a union of literals.
expectTypeOf<IsUnionMember<'foo' | 'bar', 'foo'>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'bar'>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'baz'>>().toBe<false>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'Foo'>>().toBe<false>();
expectTypeOf<IsUnionMember<1 | 2 | 3, 2>>().toBe<true>();
expectTypeOf<IsUnionMember<1 | 2 | 3, 4>>().toBe<false>();
expectTypeOf<IsUnionMember<1 | '1', '1'>>().toBe<true>();
expectTypeOf<IsUnionMember<1, '1'>>().toBe<false>();

// A type that is not a union is a union of one member.
expectTypeOf<IsUnionMember<'foo', 'foo'>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo', 'bar'>>().toBe<false>();
expectTypeOf<IsUnionMember<string, string>>().toBe<true>();
expectTypeOf<IsUnionMember<number, number>>().toBe<true>();
expectTypeOf<IsUnionMember<null, null>>().toBe<true>();

// The arguments are not interchangeable.
expectTypeOf<IsUnionMember<'foo', 'foo' | 'bar'>>().toBe<false>();

// A union `Member` is included when every one of its members is a member of `Union`.
expectTypeOf<IsUnionMember<'foo' | 'bar', 'foo' | 'bar'>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar' | 'baz', 'foo' | 'baz'>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'foo' | 'baz'>>().toBe<false>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'foo' | 'bar' | 'baz'>>().toBe<false>();
expectTypeOf<IsUnionMember<1 | 2 | 3, 1 | 4>>().toBe<false>();
expectTypeOf<IsUnionMember<1 | 2 | 3, 2 | 3>>().toBe<true>();
expectTypeOf<IsUnionMember<string | null | undefined, null | undefined>>().toBe<true>();

// `Member` is reduced like any union before the check, so only the reduced members count.
expectTypeOf<IsUnionMember<string, string | 'foo'>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'foo' | never>>().toBe<true>();

// `undefined`, `null`, and `void`.
expectTypeOf<IsUnionMember<string | undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<string, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<null | undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<null | undefined, null>>().toBe<true>();
expectTypeOf<IsUnionMember<string | null, null>>().toBe<true>();
expectTypeOf<IsUnionMember<string | null, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<void, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<undefined, void>>().toBe<false>();
expectTypeOf<IsUnionMember<void, void>>().toBe<true>();
expectTypeOf<IsUnionMember<void | null, void | null>>().toBe<true>();
expectTypeOf<IsUnionMember<undefined | null, undefined | null>>().toBe<true>();
expectTypeOf<IsUnionMember<undefined | null, void>>().toBe<false>();
expectTypeOf<IsUnionMember<string | null, null | undefined>>().toBe<false>();

// The cases from the request in #693.
expectTypeOf<IsUnionMember<string | number, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<number, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<null, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<boolean | undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<boolean, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<object | undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<object, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<{message: string} | undefined, undefined>>().toBe<true>();

// `unknown` is not a union, so its only member is `unknown`.
expectTypeOf<IsUnionMember<unknown, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<unknown, string>>().toBe<false>();
expectTypeOf<IsUnionMember<unknown, unknown>>().toBe<true>();
expectTypeOf<IsUnionMember<string, unknown>>().toBe<false>();
expectTypeOf<IsUnionMember<never, unknown>>().toBe<false>();

// A union with `unknown` reduces to `unknown`.
expectTypeOf<IsUnionMember<unknown | undefined, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<unknown | null, null>>().toBe<false>();
expectTypeOf<IsUnionMember<string | unknown, unknown>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'foo' | unknown>>().toBe<false>();

// `never` is not a member of any union, and `never` as `Union` has no members.
expectTypeOf<IsUnionMember<never, never>>().toBe<false>();
expectTypeOf<IsUnionMember<never, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<never, any>>().toBe<false>();
expectTypeOf<IsUnionMember<unknown, never>>().toBe<false>();
expectTypeOf<IsUnionMember<'foo', never>>().toBe<false>();
expectTypeOf<IsUnionMember<'foo' | 'bar', never>>().toBe<false>();

// A union drops `never`, and `any` absorbs a union.
expectTypeOf<IsUnionMember<string | never, string>>().toBe<true>();
expectTypeOf<IsUnionMember<never | undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar', never | undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<any | {a: 1}, 'foo'>>().toBe<true>();
expectTypeOf<IsUnionMember<any | undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<'foo' | 'bar', 'baz' | any>>().toBe<true>();

// `any` matches on either side, except against `never`.
expectTypeOf<IsUnionMember<any, any>>().toBe<true>();
expectTypeOf<IsUnionMember<any, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<any, 'foo'>>().toBe<true>();
expectTypeOf<IsUnionMember<any, 'foo' | 'bar'>>().toBe<true>();
expectTypeOf<IsUnionMember<any, never>>().toBe<false>();
expectTypeOf<IsUnionMember<'foo', any>>().toBe<true>();
expectTypeOf<IsUnionMember<unknown, any>>().toBe<true>();
expectTypeOf<IsUnionMember<void, any>>().toBe<true>();

// Primitive types. A literal is not a member of the widened type that contains it.
expectTypeOf<IsUnionMember<string, 'foo'>>().toBe<false>();
expectTypeOf<IsUnionMember<number, 5>>().toBe<false>();
expectTypeOf<IsUnionMember<string | number, 5>>().toBe<false>();
expectTypeOf<IsUnionMember<string | number, string>>().toBe<true>();
expectTypeOf<IsUnionMember<string | number, string | number>>().toBe<true>();
expectTypeOf<IsUnionMember<string, 'foo' | undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<number | bigint, bigint>>().toBe<true>();
expectTypeOf<IsUnionMember<number, bigint>>().toBe<false>();

// `symbol` and `bigint` members. A unique symbol is not a member of `symbol`, and `symbol` is not a member of a union of unique symbols.
declare const symbolA: unique symbol;
declare const symbolB: unique symbol;

expectTypeOf<IsUnionMember<typeof symbolA | typeof symbolB, typeof symbolA>>().toBe<true>();
expectTypeOf<IsUnionMember<typeof symbolA | string, typeof symbolB>>().toBe<false>();
expectTypeOf<IsUnionMember<typeof symbolA | string, symbol>>().toBe<false>();
expectTypeOf<IsUnionMember<symbol, typeof symbolA>>().toBe<false>();
expectTypeOf<IsUnionMember<symbol | number, symbol>>().toBe<true>();
expectTypeOf<IsUnionMember<1n | 2n, 1n>>().toBe<true>();
expectTypeOf<IsUnionMember<bigint, 1n>>().toBe<false>();

// `boolean` is a union of `true` and `false`.
expectTypeOf<IsUnionMember<boolean, boolean>>().toBe<true>();
expectTypeOf<IsUnionMember<boolean, true>>().toBe<true>();
expectTypeOf<IsUnionMember<boolean, false>>().toBe<true>();
expectTypeOf<IsUnionMember<boolean | undefined, boolean>>().toBe<true>();
expectTypeOf<IsUnionMember<boolean | undefined, boolean | undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<boolean, boolean | undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<true, boolean>>().toBe<false>();
expectTypeOf<IsUnionMember<true | 1, boolean>>().toBe<false>();
expectTypeOf<IsUnionMember<string | boolean, boolean>>().toBe<true>();

// `object` and `{}` are members, but they do not contain the object types assignable to them.
expectTypeOf<IsUnionMember<object | undefined, object>>().toBe<true>();
expectTypeOf<IsUnionMember<object | undefined, {a: 1}>>().toBe<false>();
expectTypeOf<IsUnionMember<object, null>>().toBe<false>();
expectTypeOf<IsUnionMember<{}, {a: 1}>>().toBe<false>();
expectTypeOf<IsUnionMember<{}, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<{}, null>>().toBe<false>();
expectTypeOf<IsUnionMember<{} | null | undefined, null | undefined>>().toBe<true>();

// `{}` does not absorb the other members of the union.
expectTypeOf<IsUnionMember<{} | undefined, {}>>().toBe<true>();
expectTypeOf<IsUnionMember<{} | undefined, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<string | {}, string>>().toBe<true>();

// Built-in unions.
expectTypeOf<IsUnionMember<PropertyKey, string>>().toBe<true>();
expectTypeOf<IsUnionMember<PropertyKey, 'foo'>>().toBe<false>();
expectTypeOf<IsUnionMember<string | symbol, PropertyKey>>().toBe<false>();
expectTypeOf<IsUnionMember<string | number, PropertyKey>>().toBe<false>();
expectTypeOf<IsUnionMember<keyof {a: 1; b: 2}, 'a'>>().toBe<true>();
expectTypeOf<IsUnionMember<keyof {a: 1; b: 2}, string>>().toBe<false>();
expectTypeOf<IsUnionMember<keyof {[key: string]: unknown}, number>>().toBe<true>();
expectTypeOf<IsUnionMember<keyof {[key: string]: unknown}, string | number>>().toBe<true>();

// Object members follow the assignability rules, so `readonly` properties do not matter and `readonly` arrays do.
expectTypeOf<IsUnionMember<{a: 1} | {b: 2}, {a: 1}>>().toBe<true>();
expectTypeOf<IsUnionMember<{a: 1} | {a: 1; b: 2}, {a: 1}>>().toBe<true>();
expectTypeOf<IsUnionMember<{readonly a: 1} | {b: 2}, {a: 1}>>().toBe<true>();
expectTypeOf<IsUnionMember<{a: 1}, {readonly a: 1}>>().toBe<true>();
expectTypeOf<IsUnionMember<{a: 1; b: 2} | {c: 3}, {a: 1}>>().toBe<false>();
expectTypeOf<IsUnionMember<[1, 2] | 3, [1, 2]>>().toBe<true>();
expectTypeOf<IsUnionMember<readonly [1, 2] | 3, [1, 2]>>().toBe<false>();
expectTypeOf<IsUnionMember<readonly [1, 2] | 3, readonly [1, 2]>>().toBe<true>();
expectTypeOf<IsUnionMember<[1] | [2], [1]>>().toBe<true>();
expectTypeOf<IsUnionMember<string | {a: never}, {a: never}>>().toBe<true>();

// An intersection and the object type it describes are the same member, in any order.
expectTypeOf<IsUnionMember<({a: 1} & {b: 2}) | 3, {a: 1} & {b: 2}>>().toBe<true>();
expectTypeOf<IsUnionMember<({a: 1} & {b: 2}) | 3, {b: 2} & {a: 1}>>().toBe<true>();
expectTypeOf<IsUnionMember<3 | {a: 1; b: 2}, {a: 1} & {b: 2}>>().toBe<true>();

// A type that several members cover together is not a member. The two types are mutually assignable as a whole, but no single member matches.
expectTypeOf<IsUnionMember<{a: 1} | {a: 2}, {a: 1 | 2}>>().toBe<false>();
expectTypeOf<IsUnionMember<{a: 1 | 2}, {a: 1} | {a: 2}>>().toBe<false>();
expectTypeOf<IsUnionMember<[1] | [2], [1 | 2]>>().toBe<false>();
expectTypeOf<IsUnionMember<[1 | 2], [1] | [2]>>().toBe<false>();
expectTypeOf<IsUnionMember<{a: 1; b: 'x'} | {a: 1; b: 'y'} | {a: 2; b: 'x'} | {a: 2; b: 'y'}, {a: 1 | 2; b: 'x' | 'y'}>>().toBe<false>();
expectTypeOf<IsUnionMember<{a: 1} | {a: 2} | undefined, {a: 1 | 2} | undefined>>().toBe<false>();

// A type that has parts of several members is not a member either.
expectTypeOf<IsUnionMember<{a: 1; b: 1} | {a: 2; b: 2}, {a: 1 | 2; b: 1 | 2}>>().toBe<false>();
expectTypeOf<IsUnionMember<Array<1 | 2>, Array<1> | Array<2>>>().toBe<false>();
expectTypeOf<IsUnionMember<Array<1> | Array<2>, Array<1 | 2>>>().toBe<false>();

// The same members, written as a union on both sides, still match.
expectTypeOf<IsUnionMember<{a: 1} | {a: 2}, {a: 1} | {a: 2}>>().toBe<true>();
expectTypeOf<IsUnionMember<{a: 1} | {a: 2} | {a: 3}, {a: 1} | {a: 3}>>().toBe<true>();

// A member with a union property matches only that same type, not a narrower one.
expectTypeOf<IsUnionMember<{a: 1 | 2}, {a: 1 | 2}>>().toBe<true>();
expectTypeOf<IsUnionMember<string | {a: 1 | 2}, {a: 1 | 2}>>().toBe<true>();
expectTypeOf<IsUnionMember<string | {a: 1 | 2}, {a: 1}>>().toBe<false>();

// Optional properties follow `exactOptionalPropertyTypes`.
expectTypeOf<IsUnionMember<number | {a?: string}, {a?: string}>>().toBe<true>();
expectTypeOf<IsUnionMember<number | {a?: string}, {a?: string | undefined}>>().toBe<false>();
expectTypeOf<IsUnionMember<number | {a?: string}, {a: string}>>().toBe<false>();
expectTypeOf<IsUnionMember<number | {a: string}, {a?: string}>>().toBe<false>();
expectTypeOf<IsUnionMember<number | {a: string | undefined}, {a?: string}>>().toBe<false>();

// Index signatures.
expectTypeOf<IsUnionMember<Record<string, number> | string, {[key: string]: number}>>().toBe<true>();
expectTypeOf<IsUnionMember<Record<string, number> | string, {a: number}>>().toBe<false>();
expectTypeOf<IsUnionMember<Record<'a' | 'b', number> | string, {a: number; b: number}>>().toBe<true>();

// Arrays and tuples.
expectTypeOf<IsUnionMember<string[] | number[], string[]>>().toBe<true>();
expectTypeOf<IsUnionMember<string[] | number[], Array<string | number>>>().toBe<false>();
expectTypeOf<IsUnionMember<Array<string | number>, string[]>>().toBe<false>();
expectTypeOf<IsUnionMember<string[] | number, readonly string[]>>().toBe<false>();
expectTypeOf<IsUnionMember<readonly string[] | number, string[]>>().toBe<false>();
expectTypeOf<IsUnionMember<[string] | number, string[]>>().toBe<false>();
expectTypeOf<IsUnionMember<string[] | number, [string]>>().toBe<false>();
expectTypeOf<IsUnionMember<[] | [string], []>>().toBe<true>();
expectTypeOf<IsUnionMember<[1?] | 3, []>>().toBe<false>();
expectTypeOf<IsUnionMember<[1, 2] | 3, [1, 2?]>>().toBe<false>();
expectTypeOf<IsUnionMember<[string, number?] | null, [string]>>().toBe<false>();
expectTypeOf<IsUnionMember<[string, ...number[]] | null, [string, ...number[]]>>().toBe<true>();

// Generic types are compared with their type arguments.
expectTypeOf<IsUnionMember<Promise<string> | Promise<number>, Promise<string>>>().toBe<true>();
expectTypeOf<IsUnionMember<Promise<string> | Promise<number>, Promise<string | number>>>().toBe<false>();
expectTypeOf<IsUnionMember<Map<string, number> | Set<string>, Set<string>>>().toBe<true>();
expectTypeOf<IsUnionMember<Map<string, number> | Set<string>, Set<number>>>().toBe<false>();

// A class instance is a member, but a type that only has the same public shape is not when the class has private members.
class Secret {
	private secret() {
		return 1;
	}

	readSecret() {
		return this.secret();
	}
}

expectTypeOf<IsUnionMember<Secret | string, Secret>>().toBe<true>();
expectTypeOf<IsUnionMember<Secret | string, {readSecret(): number}>>().toBe<false>();

// Two classes with the same private member are not the same member.
class Cat {
	private sound() {
		return 'meow';
	}

	speak() {
		return this.sound();
	}
}

class Dog {
	private sound() {
		return 'meow';
	}

	speak() {
		return this.sound();
	}
}

expectTypeOf<IsUnionMember<Cat | string, Dog>>().toBe<false>();
expectTypeOf<IsUnionMember<Cat | Dog, Dog>>().toBe<true>();

// A class without private members is compared by its shape.
class Point {
	x = 0;
	y = 0;
}

expectTypeOf<IsUnionMember<Point | string, {x: number; y: number}>>().toBe<true>();
expectTypeOf<IsUnionMember<string | {x: number; y: number}, Point>>().toBe<true>();
expectTypeOf<IsUnionMember<typeof Point | string, typeof Point>>().toBe<true>();
expectTypeOf<IsUnionMember<typeof Point | string, Point>>().toBe<false>();

// A built-in class instance is a member, but a structural type it happens to satisfy is not.
expectTypeOf<IsUnionMember<Date | string, Date>>().toBe<true>();
expectTypeOf<IsUnionMember<Date | string, {toString(): string}>>().toBe<false>();

// A function type that needs a parameter is not a member of a union holding a parameterless function.
expectTypeOf<IsUnionMember<(() => void) | string, () => void>>().toBe<true>();
expectTypeOf<IsUnionMember<(() => void) | string, (value: string) => void>>().toBe<false>();

// Function types are compared by their parameter and return types, not by parameter names. Parameters are not bivariant.
expectTypeOf<IsUnionMember<((value: string) => void) | number, (renamed: string) => void>>().toBe<true>();
expectTypeOf<IsUnionMember<((value: string) => void) | number, (value: 'x') => void>>().toBe<false>();
expectTypeOf<IsUnionMember<((value: 'x') => void) | number, (value: string) => void>>().toBe<false>();
expectTypeOf<IsUnionMember<(() => string) | number, () => 'x'>>().toBe<false>();

// Branded types.
type UserId = string & {readonly brand: 'UserId'};
type PostId = string & {readonly brand: 'PostId'};

expectTypeOf<IsUnionMember<UserId | number, UserId>>().toBe<true>();
expectTypeOf<IsUnionMember<UserId | PostId, PostId>>().toBe<true>();
expectTypeOf<IsUnionMember<UserId | number, string>>().toBe<false>();
expectTypeOf<IsUnionMember<string | number, UserId>>().toBe<false>();
expectTypeOf<IsUnionMember<UserId, PostId>>().toBe<false>();

// Template literal types and string mapping types are compared as types, so such a type and a literal it matches are not members of each other.
expectTypeOf<IsUnionMember<`a${string}`, 'abc'>>().toBe<false>();
expectTypeOf<IsUnionMember<'abc', `a${string}`>>().toBe<false>();
expectTypeOf<IsUnionMember<`a${string}`, `a${string}`>>().toBe<true>();
expectTypeOf<IsUnionMember<`a${string}` | `b${string}`, `a${string}`>>().toBe<true>();
expectTypeOf<IsUnionMember<`${number}` | boolean, `${number}`>>().toBe<true>();
expectTypeOf<IsUnionMember<`${number}`, '1'>>().toBe<false>();
expectTypeOf<IsUnionMember<Lowercase<string>, string>>().toBe<false>();
expectTypeOf<IsUnionMember<string, Lowercase<string>>>().toBe<false>();
expectTypeOf<IsUnionMember<Uppercase<string> | 1, Uppercase<string>>>().toBe<true>();

// A template literal type with a union in it is a union of literals.
expectTypeOf<IsUnionMember<`on${'Click' | 'Hover'}`, 'onClick'>>().toBe<true>();
expectTypeOf<IsUnionMember<`on${'Click' | 'Hover'}`, 'onclick'>>().toBe<false>();
expectTypeOf<IsUnionMember<'1' | '2', `${1 | 2}`>>().toBe<true>();

// Optional properties, tuple elements, and parameters contribute an actual `undefined` member.
expectTypeOf<IsUnionMember<Partial<{name: string}>['name'], undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<{name?: string}['name'], undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<Required<{name?: string}>['name'], undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<[name?: string][0], undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<Parameters<(name?: string) => void>[0], undefined>>().toBe<true>();

// The result follows the type that other utilities produce.
expectTypeOf<IsUnionMember<Exclude<'a' | 'b', 'a'>, 'a'>>().toBe<false>();
expectTypeOf<IsUnionMember<NonNullable<string | null>, null>>().toBe<false>();
expectTypeOf<IsUnionMember<Awaited<Promise<string | undefined>>, undefined>>().toBe<true>();
expectTypeOf<IsUnionMember<ReturnType<() => string | void>, void>>().toBe<true>();
expectTypeOf<IsUnionMember<ReturnType<() => string | void>, undefined>>().toBe<false>();

// Nested types are not searched.
expectTypeOf<IsUnionMember<{value: null}, null>>().toBe<false>();
expectTypeOf<IsUnionMember<readonly [null], null>>().toBe<false>();
expectTypeOf<IsUnionMember<Promise<undefined>, undefined>>().toBe<false>();
expectTypeOf<IsUnionMember<Array<string | undefined>, undefined>>().toBe<false>();

// A discriminated union is a union of its members, and its tag is a union of the tag values.
type Shape =
	| {kind: 'circle'; radius: number}
	| {kind: 'square'; side: number};

expectTypeOf<IsUnionMember<Shape, {kind: 'circle'; radius: number}>>().toBe<true>();
expectTypeOf<IsUnionMember<Shape, {kind: 'circle'}>>().toBe<false>();
expectTypeOf<IsUnionMember<Shape['kind'], 'circle'>>().toBe<true>();
expectTypeOf<IsUnionMember<Shape['kind'], 'triangle'>>().toBe<false>();

// A type with a union tag is not a member of the discriminated union it covers.
type Sized =
	| {kind: 'small'; size: number}
	| {kind: 'large'; size: number};

expectTypeOf<IsUnionMember<Sized, {kind: 'small' | 'large'; size: number}>>().toBe<false>();
expectTypeOf<IsUnionMember<Sized, {kind: 'small'; size: number}>>().toBe<true>();

// An enum is a union of its members.
enum Status {
	Active,
	Inactive,
}

expectTypeOf<IsUnionMember<Status, Status.Active>>().toBe<true>();
expectTypeOf<IsUnionMember<Status, Status>>().toBe<true>();
expectTypeOf<IsUnionMember<Status, Status.Active | Status.Inactive>>().toBe<true>();
expectTypeOf<IsUnionMember<Status.Active, Status>>().toBe<false>();
expectTypeOf<IsUnionMember<Status | undefined, undefined>>().toBe<true>();

// A string enum member is not its string value.
enum Color {
	Red = 'red',
	Blue = 'blue',
}

expectTypeOf<IsUnionMember<Color, Color.Blue>>().toBe<true>();
expectTypeOf<IsUnionMember<Color, Color>>().toBe<true>();
expectTypeOf<IsUnionMember<Color.Red, Color>>().toBe<false>();
expectTypeOf<IsUnionMember<Color, 'red'>>().toBe<false>();
expectTypeOf<IsUnionMember<'red' | 'blue', Color.Red>>().toBe<false>();

// Known limitation: Types that are mutually assignable count as the same member, even when they are different types.
expectTypeOf<IsUnionMember<Status, 0>>().toBe<true>();
expectTypeOf<IsUnionMember<number, Status.Active>>().toBe<true>();
expectTypeOf<IsUnionMember<{} | undefined, object>>().toBe<true>();
expectTypeOf<IsUnionMember<{a: any}, {a: string}>>().toBe<true>();
expectTypeOf<IsUnionMember<1 | {a: any}, {a: string}>>().toBe<true>();
expectTypeOf<IsUnionMember<(() => void) | 1, () => unknown>>().toBe<true>();

// Large unions on both sides stay within the instantiation limit.
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type ThreeDigits = `${Digit}${Digit}${Digit}`;

expectTypeOf<IsUnionMember<ThreeDigits, '500'>>().toBe<true>();
expectTypeOf<IsUnionMember<ThreeDigits, '5000'>>().toBe<false>();
expectTypeOf<IsUnionMember<ThreeDigits, ThreeDigits>>().toBe<true>();
expectTypeOf<IsUnionMember<ThreeDigits, Exclude<ThreeDigits, '500'>>>().toBe<true>();
expectTypeOf<IsUnionMember<Exclude<ThreeDigits, '500'>, ThreeDigits>>().toBe<false>();

type Records = {[Id in `${Digit}${Digit}`]: {id: Id}}[`${Digit}${Digit}`];

expectTypeOf<IsUnionMember<Records, {id: '42'}>>().toBe<true>();
expectTypeOf<IsUnionMember<Records, {id: '420'}>>().toBe<false>();
expectTypeOf<IsUnionMember<Records, Records>>().toBe<true>();

// The result is `true` or `false`, never `boolean`, so it can be used in a conditional type.
type Handler<Properties> = IsUnionMember<Properties, undefined> extends true
	? (properties?: Properties) => void
	: (properties: Properties) => void;

declare const optionalHandler: Handler<{id: string} | undefined>;
expectTypeOf(optionalHandler).toBe<(properties?: {id: string}) => void>();

declare const requiredHandler: Handler<{id: string}>;
expectTypeOf(requiredHandler).toBe<(properties: {id: string}) => void>();

// The pattern from the request in #693: a messenger makes the properties optional only when the properties type includes `undefined`.
type MachineMessenger<
	Events extends string,
	EventProperties extends Record<Events, unknown>,
> = {
	[Event in Events]: IsUnionMember<EventProperties[Event], undefined> extends true
		? (properties?: EventProperties[Event]) => void
		: (properties: EventProperties[Event]) => void;
};

type Messenger = MachineMessenger<'start' | 'update', {start: {at: number}; update: {at: number} | undefined}>;

expectTypeOf<Messenger['start']>().toBe<(properties: {at: number}) => void>();
expectTypeOf<Messenger['update']>().toBe<(properties?: {at: number}) => void>();

// A mapped type over a model decides per property, not for the model as a whole.
type OptionalFlags<Model> = {
	readonly [Key in keyof Model]: IsUnionMember<Model[Key], undefined>;
};

declare function optionalFlags<const Model>(model: Model): OptionalFlags<Model>;

const flags = optionalFlags({name: 'session', cleared: undefined, active: true});
expectTypeOf(flags).toBe<{readonly name: false; readonly cleared: true; readonly active: false}>();

// The caller can distribute over candidates to keep only the members of a union.
type KeepMembers<Union, Candidates> = Candidates extends unknown
	? IsUnionMember<Union, Candidates> extends true ? Candidates : never
	: never;

expectTypeOf<KeepMembers<'a' | 'b' | 'c', 'a' | 'd'>>().toBe<'a'>();
expectTypeOf<KeepMembers<string | number, 'a' | string | 1>>().toBe<string>();

// The result can keep or drop a whole union.
type OnlyOptional<Union> = IsUnionMember<Union, undefined> extends true ? Union : never;

expectTypeOf<OnlyOptional<string | undefined>>().toBe<string | undefined>();
expectTypeOf<OnlyOptional<string>>().toBe<never>();

// An unresolved type parameter defers the answer instead of collapsing to a boolean literal.
function _readFlag<Value>(flag: IsUnionMember<Value, undefined>): boolean {
	expectTypeOf<IsUnionMember<Value, undefined>>().not.toBe<false>();
	return flag;
}

function _readMemberFlag<Member>(flag: IsUnionMember<string, Member>): boolean {
	expectTypeOf<IsUnionMember<string, Member>>().not.toBe<true>();
	return flag;
}

function _readGenericFlag<Union, Member>(flag: IsUnionMember<Union, Member>): boolean {
	return flag;
}
