/* eslint-disable @typescript-eslint/consistent-type-definitions */
// TODO: Convert the `interface`'s to `type`s.
import {expectTypeOf} from 'expect-type';
import type {EmptyObject, Jsonify, JsonValue, NegativeInfinity, PositiveInfinity} from '..';

interface A {
	a: number;
}

class B {
	a!: number;
}

interface V {
	a?: number;
}

interface X {
	a: Date;
}

interface Y {
	a?: Date;
}

interface Z {
	a: number | undefined;
}

interface W {
	a?: () => any;
}

declare const a: Jsonify<A>;
declare const b: Jsonify<B>;

declare const v: V; // Not assignable to JsonValue because it is defined as interface

declare const x: X; // Not assignable to JsonValue because it contains Date value
declare const y: Y; // Not assignable to JsonValue because it contains Date value

declare const z: Z; // Not assignable to JsonValue because undefined is not valid Json value
declare const w: W; // Not assignable to JsonValue because a function is not valid Json value

expectTypeOf<null>().toMatchTypeOf<JsonValue>();
expectTypeOf<false>().toMatchTypeOf<JsonValue>();
expectTypeOf<0>().toMatchTypeOf<JsonValue>();
expectTypeOf<''>().toMatchTypeOf<JsonValue>();
expectTypeOf<[]>().toMatchTypeOf<JsonValue>();
expectTypeOf<{}>().toMatchTypeOf<JsonValue>();
expectTypeOf<[0]>().toMatchTypeOf<JsonValue>();
expectTypeOf<{a: 0}>().toMatchTypeOf<JsonValue>();
expectTypeOf(a).toMatchTypeOf<JsonValue>();
expectTypeOf(b).toMatchTypeOf<JsonValue>();
expectTypeOf<{a: {b: true; c: {}}; d: [{}, 2, 'hi']}>().toMatchTypeOf<JsonValue>();
expectTypeOf<[{}, {a: 'hi'}, null, 3]>().toMatchTypeOf<JsonValue>();

expectTypeOf(new Date()).not.toMatchTypeOf<JsonValue>();
expectTypeOf([new Date()]).not.toMatchTypeOf<JsonValue>();
expectTypeOf({a: new Date()}).not.toMatchTypeOf<JsonValue>();
expectTypeOf(v).not.toMatchTypeOf<JsonValue>();
expectTypeOf(x).not.toMatchTypeOf<JsonValue>();
expectTypeOf(y).not.toMatchTypeOf<JsonValue>();
expectTypeOf(z).not.toMatchTypeOf<JsonValue>();
expectTypeOf(w).not.toMatchTypeOf<JsonValue>();
expectTypeOf<undefined>().not.toMatchTypeOf<JsonValue>();

// TODO: Convert this to a `type`.
interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1],
};

expectTypeOf(point).not.toMatchTypeOf<JsonValue>();
expectTypeOf(point).toMatchTypeOf<Jsonify<Geometry>>();

// The following const values are examples of values `v` that are not JSON, but are *jsonable* using
// `v.toJSON()` or `JSON.parse(JSON.stringify(v))`
declare const dateToJSON: Jsonify<Date>;
expectTypeOf(dateToJSON).toMatchTypeOf<string>();
expectTypeOf(dateToJSON).toMatchTypeOf<JsonValue>();

// The following commented `= JSON.parse(JSON.stringify(x))` is an example of how `parsedStringifiedX` could be created.
// * Note that this would be an unsafe assignment because `JSON.parse()` returns type `any`.
//   But by inspection `JSON.stringify(x)` will use `x.a.toJSON()`. So the `JSON.parse()` result can be
//   assigned to `Jsonify<X>` if the `@typescript-eslint/no-unsafe-assignment` ESLint rule is ignored
//   or an `as Jsonify<X>` is added.
// * This test is not about how `parsedStringifiedX` is created, but about its type, so the `const` value is declared.
declare const parsedStringifiedX: Jsonify<X>; // = JSON.parse(JSON.stringify(x));
expectTypeOf(parsedStringifiedX).toMatchTypeOf<JsonValue>();
expectTypeOf(parsedStringifiedX.a).toMatchTypeOf<string>();

class NonJsonWithToJSON {
	public fixture = new Map<string, number>([['a', 1], ['b', 2]]);

	public toJSON(): {fixture: Array<[string, number]>} {
		return {
			fixture: [...this.fixture.entries()],
		};
	}
}

const nonJsonWithToJSON = new NonJsonWithToJSON();
expectTypeOf(nonJsonWithToJSON).not.toMatchTypeOf<JsonValue>();
expectTypeOf(nonJsonWithToJSON.toJSON()).toMatchTypeOf<JsonValue>();
expectTypeOf(nonJsonWithToJSON.toJSON()).toMatchTypeOf<Jsonify<NonJsonWithToJSON>>();

class NonJsonWithToJSONWrapper {
	public inner: NonJsonWithToJSON = nonJsonWithToJSON;
	public override = 42;

	public toJSON() {
		const stringOverride = 'override';

		return {
			override: stringOverride,
			inner: this.inner,
			innerDeep: {inner: this.inner},
		};
	}
}

expectTypeOf(new NonJsonWithToJSONWrapper()).not.toMatchTypeOf<JsonValue>();

type InnerFixture = {fixture: Array<[string, number]>};

expectTypeOf({} as Jsonify<NonJsonWithToJSONWrapper>).toEqualTypeOf<{
	override: string;
	inner: InnerFixture;
	innerDeep: {inner: InnerFixture};
}>();

class NonJsonWithInvalidToJSON {
	public fixture = new Map<string, number>([['a', 1], ['b', 2]]);

	// This is intentionally invalid `.toJSON()`.
	// It is invalid because the result is not assignable to `JsonValue`.
	public toJSON(): {fixture: Map<string, number>} {
		return {
			fixture: this.fixture,
		};
	}
}

const nonJsonWithInvalidToJSON = new NonJsonWithInvalidToJSON();
expectTypeOf(nonJsonWithInvalidToJSON).not.toMatchTypeOf<JsonValue>();
expectTypeOf(nonJsonWithInvalidToJSON.toJSON()).not.toMatchTypeOf<JsonValue>();

// Not jsonable types; these types behave differently when used as plain values, as members of arrays and as values of objects
declare const undefined: undefined;
expectTypeOf<undefined>().not.toMatchTypeOf<JsonValue>();

declare const fn: (_: any) => void;
expectTypeOf(fn).not.toMatchTypeOf<JsonValue>();

declare const symbol: symbol;
expectTypeOf(symbol).not.toMatchTypeOf<JsonValue>();

// Plain values fail JSON.stringify()
declare const plainUndefined: Jsonify<typeof undefined>;
expectTypeOf(plainUndefined).toEqualTypeOf<never>();

declare const plainFn: Jsonify<typeof fn>;
expectTypeOf(plainFn).toEqualTypeOf<never>();

declare const plainSymbol: Jsonify<typeof symbol>;
expectTypeOf(plainSymbol).toEqualTypeOf<never>();

// Array members become null
declare const arrayMemberUndefined: Jsonify<Array<typeof undefined>>;
expectTypeOf(arrayMemberUndefined).toEqualTypeOf<null[]>();

declare const arrayMemberFn: Jsonify<Array<typeof fn>>;
expectTypeOf(arrayMemberFn).toEqualTypeOf<null[]>();

declare const arrayMemberSymbol: Jsonify<Array<typeof symbol>>;
expectTypeOf(arrayMemberSymbol).toEqualTypeOf<null[]>();

// When used in object values, these keys are filtered
declare const objectValueUndefined: Jsonify<{keep: string; undefined: typeof undefined}>;
expectTypeOf(objectValueUndefined).toEqualTypeOf<{keep: string}>();

declare const objectValueFn: Jsonify<{keep: string; fn: typeof fn}>;
expectTypeOf(objectValueFn).toEqualTypeOf<{keep: string}>();

declare const objectValueSymbol: Jsonify<{keep: string; symbol: typeof symbol}>;
expectTypeOf(objectValueSymbol).toEqualTypeOf<{keep: string}>();

// Symbol keys are filtered
declare const objectKeySymbol: Jsonify<{[key: typeof symbol]: number; keep: string}>;
expectTypeOf(objectKeySymbol).toEqualTypeOf<{keep: string}>();

// Number, String and Boolean values are turned into primitive counterparts
declare const number: Number;
expectTypeOf(number).not.toMatchTypeOf<JsonValue>();

declare const string: String;
expectTypeOf(string).not.toMatchTypeOf<JsonValue>();

declare const boolean: Boolean;
expectTypeOf(boolean).not.toMatchTypeOf<JsonValue>();

declare const numberJson: Jsonify<typeof number>;
expectTypeOf(numberJson).toEqualTypeOf<number>();

declare const stringJson: Jsonify<typeof string>;
expectTypeOf(stringJson).toEqualTypeOf<string>();

declare const booleanJson: Jsonify<typeof boolean>;
expectTypeOf(booleanJson).toEqualTypeOf<boolean>();

declare const tupleJson: Jsonify<[string, Date]>;
expectTypeOf(tupleJson).toEqualTypeOf<[string, string]>();

declare const tupleRestJson: Jsonify<[string, ...Date[]]>;
expectTypeOf(tupleRestJson).toEqualTypeOf<[string, ...string[]]>();

// BigInt fails JSON.stringify
declare const bigInt: Jsonify<bigint>;
expectTypeOf(bigInt).toEqualTypeOf<never>();

declare const int8Array: Int8Array;
declare const int8ArrayJson: Jsonify<typeof int8Array>;
expectTypeOf(int8ArrayJson).toEqualTypeOf<Record<string, number>>();

declare const map: Map<string, number>;
declare const mapJson: Jsonify<typeof map>;
expectTypeOf(mapJson).toEqualTypeOf<EmptyObject>();
expectTypeOf<{}>().toMatchTypeOf<Jsonify<typeof map>>();

// Regression test for https://github.com/sindresorhus/type-fest/issues/466
expectTypeOf<42>().not.toMatchTypeOf<Jsonify<typeof map>>();
expectTypeOf<{foo: 42}>().not.toMatchTypeOf<Jsonify<typeof map>>();

declare const set: Set<string>;
declare const setJson: Jsonify<typeof set>;
expectTypeOf(setJson).toEqualTypeOf<EmptyObject>();
expectTypeOf<{}>().toMatchTypeOf<Jsonify<typeof set>>();

// Regression test for https://github.com/sindresorhus/type-fest/issues/466
expectTypeOf<42>().not.toMatchTypeOf<Jsonify<typeof set>>();
expectTypeOf<{foo: 42}>().not.toMatchTypeOf<Jsonify<typeof set>>();

// Positive and negative Infinity, NaN and null are turned into null
// NOTE: NaN is not detectable in TypeScript, so it is not tested; see https://github.com/sindresorhus/type-fest/issues/406
declare const positiveInfinity: PositiveInfinity;
declare const positiveInfJson: Jsonify<typeof positiveInfinity>;
expectTypeOf(positiveInfJson).toEqualTypeOf<null>();
declare const negativeInf: NegativeInfinity;
declare const negativeInfJson: Jsonify<typeof negativeInf>;
expectTypeOf(negativeInfJson).toEqualTypeOf<null>();

// Test that optional type members are not discarded wholesale.
type OptionalPrimitive = {
	a?: string;
};

type OptionalTypeUnion = {
	a?: string | (() => any);
};

type NonOptionalTypeUnion = {
	a: string | undefined;
};

declare const jsonifiedOptionalPrimitive: Jsonify<OptionalPrimitive>;
declare const jsonifiedOptionalTypeUnion: Jsonify<OptionalTypeUnion>;
declare const jsonifiedNonOptionalTypeUnion: Jsonify<NonOptionalTypeUnion>;

expectTypeOf(jsonifiedOptionalPrimitive).toEqualTypeOf<{a?: string}>();
expectTypeOf(jsonifiedOptionalTypeUnion).toEqualTypeOf<{}>();
expectTypeOf(jsonifiedNonOptionalTypeUnion).toEqualTypeOf<{a?: string}>();

// Test for 'Jsonify support for optional object keys, unserializable object values' #424
// See https://github.com/sindresorhus/type-fest/issues/424
type AppData = {
	// Should be kept
	requiredString: string;
	requiredUnion: number | boolean;

	// Should be kept and set to optional
	optionalString?: string;
	optionalUnion?: number | string;
	optionalStringUndefined: string | undefined;
	optionalUnionUndefined: number | string | undefined;

	// Should be omitted
	requiredFunction: () => any;
	optionalFunction?: () => any;
	requiredFunctionUnion: string | (() => any);
	optionalFunctionUnion?: string | (() => any);
	optionalFunctionUndefined: (() => any) | undefined;
	optionalFunctionUnionUndefined: string | (() => any) | undefined;
};

type ExpectedAppDataJson = {
	requiredString: string;
	requiredUnion: number | boolean;

	optionalString?: string;
	optionalUnion?: string | number;
	optionalStringUndefined?: string;
	optionalUnionUndefined?: string | number;
};

declare const response: Jsonify<AppData>;

expectTypeOf(response).toEqualTypeOf<ExpectedAppDataJson>();
