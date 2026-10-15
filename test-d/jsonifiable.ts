import {expectTypeOf} from 'nz';
import type {Jsonifiable, JsonObject, Simplify, SimplifyDeep} from '../index.d.ts';

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
