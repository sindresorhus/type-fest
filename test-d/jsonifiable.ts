import {expectTypeOf} from 'nz';
import type {Jsonifiable, JsonifiableArray, JsonifiableObject, JsonObject, JsonPrimitive, Simplify, SimplifyDeep} from '../index.d.ts';

expectTypeOf<1>().toBeAssignableTo<Jsonifiable>();
expectTypeOf<''>().toBeAssignableTo<Jsonifiable>();
expectTypeOf<null>().toBeAssignableTo<Jsonifiable>();
expectTypeOf(new Date()).toBeAssignableTo<Jsonifiable>();
({a: new Date()}) satisfies Jsonifiable;
[new Date()] satisfies Jsonifiable;
({a: undefined}) satisfies Jsonifiable;
expectTypeOf([1, 2, 3] as const).toBeAssignableTo<Jsonifiable>();
expectTypeOf({a: new Date()} as const).toBeAssignableTo<Jsonifiable>();
({a: {deeply: {nested: {toJsonObject: new Date()}}}}) satisfies Jsonifiable;
({toJSON: () => new Date()}) satisfies Jsonifiable;
({
	toJSON() {
		return {
			foo: {
				toJSON() {
					return {bar: 'bar'};
				},
			},
		};
	},
}) satisfies Jsonifiable;

expectTypeOf<undefined>().not.toBeAssignableTo<Jsonifiable>();
expectTypeOf(new Map()).not.toBeAssignableTo<Jsonifiable>();
expectTypeOf({a: new Map()}).not.toBeAssignableTo<Jsonifiable>();
expectTypeOf([new Map()]).not.toBeAssignableTo<Jsonifiable>();

// `JSON.stringify` passes the property key to `toJSON`, so `toJSON` may declare parameters.
declare const toJSONWithKey: {toJSON(key: string): string};
expectTypeOf(toJSONWithKey).toBeAssignableTo<Jsonifiable>();

declare const toJSONWithoutKey: {toJSON(): string};
expectTypeOf(toJSONWithoutKey).toBeAssignableTo<Jsonifiable>();

declare const toJSONReturningMap: {toJSON(): Map<string, number>};
expectTypeOf(toJSONReturningMap).not.toBeAssignableTo<Jsonifiable>();

// An interface is not assignable, because TypeScript does not give it an implicit index signature.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Inner {
	foo: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Outer {
	inner: Inner;
	date: Date;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InnerJson extends JsonObject {
	foo: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface OuterJsonifiable extends Record<string, Jsonifiable | undefined> {
	date: Date;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface NonJsonifiableInterface extends Record<string, Jsonifiable | undefined> {
	// @ts-expect-error
	map: Map<string, number>;
}

expectTypeOf<Inner>().not.toBeAssignableTo<Jsonifiable>();
expectTypeOf<{inner: Inner}>().not.toBeAssignableTo<Jsonifiable>();
expectTypeOf<Simplify<Outer>>().not.toBeAssignableTo<Jsonifiable>(); // `Simplify` is shallow
expectTypeOf<SimplifyDeep<Outer>>().toBeAssignableTo<Jsonifiable>();
expectTypeOf<{inner: InnerJson}>().toBeAssignableTo<Jsonifiable>();
expectTypeOf<{outer: OuterJsonifiable}>().toBeAssignableTo<Jsonifiable>();

// `Jsonifiable` is made of the three parts, and an object is not an array.
expectTypeOf<Jsonifiable>().toBe<JsonPrimitive | JsonifiableObject | JsonifiableArray>();
expectTypeOf<Exclude<Jsonifiable, JsonPrimitive>>().toBe<JsonifiableObject | JsonifiableArray>();
expectTypeOf<JsonifiableObject>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<JsonifiableArray>().not.toBeAssignableTo<JsonifiableObject>();

// `JsonifiableObject`
expectTypeOf<unknown>().not.toBeAssignableTo<JsonifiableObject>();

({}) satisfies JsonifiableObject;
({a: 1, b: 'b', c: true, d: null}) satisfies JsonifiableObject;
({a: {b: [1, {c: new Date()}]}}) satisfies JsonifiableObject;
({1: 'a'}) satisfies JsonifiableObject;
({a: undefined}) satisfies JsonifiableObject;
expectTypeOf({a: 1, b: [1, 2]} as const).toBeAssignableTo<JsonifiableObject>();
expectTypeOf<{a?: number; b: string | undefined}>().toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Record<string, number>>().toBeAssignableTo<JsonifiableObject>();
expectTypeOf<{a: 1} | {b: Date}>().toBeAssignableTo<JsonifiableObject>();
expectTypeOf<InnerJson>().toBeAssignableTo<JsonifiableObject>();

// It matches the input value, so an object with `toJSON` matches even when `toJSON` returns a primitive.
expectTypeOf(new Date()).toBeAssignableTo<JsonifiableObject>();
({toJSON: () => 1}) satisfies JsonifiableObject;
({toJSON: () => ({a: 1})}) satisfies JsonifiableObject;
expectTypeOf<{toJSON(): Map<string, number>}>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<{toJSON(): object}>().not.toBeAssignableTo<JsonifiableObject>();

// `JSON.stringify` ignores symbol keys, and TypeScript does not check them against a string index signature.
({[Symbol('a')]: new Map()}) satisfies JsonifiableObject;

// It can be extended with known fields.
({level: 1, message: 'a'}) satisfies JsonifiableObject & {level: number};
// @ts-expect-error
({level: 1, message: new Map()}) satisfies JsonifiableObject & {level: number};

expectTypeOf<string>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<number>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<boolean>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<null>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<undefined>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<() => void>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<number[]>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<readonly [1, 2]>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Map<string, number>>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Set<number>>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<RegExp>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Error>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Uint8Array>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Record<string, unknown>>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<{a: bigint}>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<{a: () => void}>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<{a: {b: Map<string, number>}}>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Inner>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<[1] | {a: 1}>().not.toBeAssignableTo<JsonifiableObject>();
expectTypeOf<Map<string, number> | {a: 1}>().not.toBeAssignableTo<JsonifiableObject>();

// A class instance has no implicit index signature, like an interface.
class Point {
	x = 1;
	y = 2;
}

expectTypeOf(new Point()).not.toBeAssignableTo<JsonifiableObject>();

class SerializablePoint extends Point {
	toJSON() {
		return {x: this.x, y: this.y};
	}
}

expectTypeOf(new SerializablePoint()).toBeAssignableTo<JsonifiableObject>();

// Generic constraint
declare function saveSettings<Settings extends JsonifiableObject>(settings: Settings): Settings;

expectTypeOf(saveSettings({theme: 'dark', updatedAt: new Date()})).toBe<{theme: string; updatedAt: Date}>();
// @ts-expect-error
saveSettings('dark');
// @ts-expect-error
saveSettings({theme: new Map()});

// `JsonifiableArray`
expectTypeOf<unknown>().not.toBeAssignableTo<JsonifiableArray>();

[] satisfies JsonifiableArray;
[1, 'a', true, null] satisfies JsonifiableArray;
[{a: new Date()}, [1, [2]], new Date()] satisfies JsonifiableArray;
expectTypeOf<string[]>().toBeAssignableTo<JsonifiableArray>();
expectTypeOf<readonly string[]>().toBeAssignableTo<JsonifiableArray>();
expectTypeOf<[1, 'a', {b: Date}]>().toBeAssignableTo<JsonifiableArray>();
expectTypeOf([1, {a: 'a'}] as const).toBeAssignableTo<JsonifiableArray>();
expectTypeOf<Array<{a?: number}>>().toBeAssignableTo<JsonifiableArray>();

// `JSON.stringify([undefined])` is `[null]`, so `undefined` is not allowed as an element.
expectTypeOf<undefined[]>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<Array<number | undefined>>().not.toBeAssignableTo<JsonifiableArray>();

expectTypeOf<string>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<null>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<{a: 1}>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<{length: 0}>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<Uint8Array>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<Set<number>>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<bigint[]>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<Array<() => void>>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<Array<Map<string, number>>>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<Inner[]>().not.toBeAssignableTo<JsonifiableArray>();
expectTypeOf<string[] | [1]>().toBeAssignableTo<JsonifiableArray>();
expectTypeOf<string[] | {a: 1}>().not.toBeAssignableTo<JsonifiableArray>();
