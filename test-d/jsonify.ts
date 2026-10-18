import {expectTypeOf} from 'nz';
import type {EmptyObject, Jsonify, JsonArray, JsonObject, JsonValue, LiteralToPrimitiveDeep, NegativeInfinity, Opaque, PositiveInfinity, Tagged, TupleOf} from '../index.d.ts';

// An interface has no implicit index signature, so this checks that `Jsonify` makes it assignable to `JsonValue`.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface A {
	a: number;
}

class B {
	a!: number;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface V {
	a?: number;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface U extends JsonObject {
	a: number;
	b?: string; // Allowed because `exactOptionalPropertyTypes` is enabled
}

// Extending `JsonObject` still checks that the properties are JSON values.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface NonJsonInterface extends JsonObject {
	// @ts-expect-error
	a: Date;
}

type X = {
	a: Date;
};

type Y = {
	a?: Date;
};

type Z = {
	a: number | undefined;
};

type W = {
	a?: () => any;
};

declare const a: Jsonify<A>;
declare const b: Jsonify<B>;

declare const v: V; // Not assignable to JsonValue because it is defined as interface
declare const u: U; // Assignable to JsonValue because the interface extends JsonObject

declare const x: X; // Not assignable to JsonValue because it contains Date value
declare const y: Y; // Not assignable to JsonValue because it contains Date value

declare const z: Z; // Not assignable to JsonValue because undefined is not valid Json value
declare const w: W; // Not assignable to JsonValue because a function is not valid Json value

expectTypeOf<null>().toBeAssignableTo<JsonValue>();
expectTypeOf<false>().toBeAssignableTo<JsonValue>();
expectTypeOf<0>().toBeAssignableTo<JsonValue>();
expectTypeOf<''>().toBeAssignableTo<JsonValue>();
[] satisfies JsonValue;
expectTypeOf([] as const).toBeAssignableTo<JsonValue>();
({}) satisfies JsonValue;
[0] satisfies JsonValue;
({a: 0}) satisfies JsonValue;
expectTypeOf(a).toBeAssignableTo<JsonValue>();
expectTypeOf(b).toBeAssignableTo<JsonValue>();
expectTypeOf(u).toBeAssignableTo<JsonValue>();
({a: {b: true, c: {}}, d: [{}, 2, 'hi']}) satisfies JsonValue;
[{}, {a: 'hi'}, null, 3] satisfies JsonValue;

expectTypeOf(new Date()).not.toBeAssignableTo<JsonValue>();
expectTypeOf([new Date()]).not.toBeAssignableTo<JsonValue>();
expectTypeOf({a: new Date()}).not.toBeAssignableTo<JsonValue>();
expectTypeOf(v).not.toBeAssignableTo<JsonValue>();
expectTypeOf(x).not.toBeAssignableTo<JsonValue>();
expectTypeOf(y).not.toBeAssignableTo<JsonValue>();
expectTypeOf(z).not.toBeAssignableTo<JsonValue>();
expectTypeOf(w).not.toBeAssignableTo<JsonValue>();
expectTypeOf<undefined>().not.toBeAssignableTo<JsonValue>();
expectTypeOf(5 as number | undefined).not.toBeAssignableTo<JsonValue>();

// An interface, because an interface is not assignable to `JsonValue` while its `Jsonify` version is.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Geometry {
	type: 'Point' | 'Polygon';
	coordinates: [number, number];
}

const point: Geometry = {
	type: 'Point',
	coordinates: [1, 1],
};

expectTypeOf(point).not.toBeAssignableTo<JsonValue>();
expectTypeOf(point).toBeAssignableTo<Jsonify<Geometry>>();

// The following const values are examples of values `v` that are not JSON, but are *jsonable* using
// `v.toJSON()` or `JSON.parse(JSON.stringify(v))`
declare const dateToJSON: Jsonify<Date>;
expectTypeOf(dateToJSON).toBeAssignableTo<string>();
expectTypeOf(dateToJSON).toBeAssignableTo<JsonValue>();

// The following commented `= JSON.parse(JSON.stringify(x))` is an example of how `parsedStringifiedX` could be created.
// * Note that this would be an unsafe assignment because `JSON.parse()` returns type `any`.
//   But by inspection `JSON.stringify(x)` will use `x.a.toJSON()`. So the `JSON.parse()` result can be
//   assigned to `Jsonify<X>` if the `@typescript-eslint/no-unsafe-assignment` ESLint rule is ignored
//   or an `as Jsonify<X>` is added.
// * This test is not about how `parsedStringifiedX` is created, but about its type, so the `const` value is declared.
declare const parsedStringifiedX: Jsonify<X>; // = JSON.parse(JSON.stringify(x));
expectTypeOf(parsedStringifiedX).toBeAssignableTo<JsonValue>();
expectTypeOf(parsedStringifiedX.a).toBeAssignableTo<string>();

class NonJsonWithToJSON {
	public fixture = new Map<string, number>([['a', 1], ['b', 2]]);

	public toJSON(): {fixture: Array<[string, number]>} {
		return {
			fixture: [...this.fixture],
		};
	}
}

const nonJsonWithToJSON = new NonJsonWithToJSON();
expectTypeOf(nonJsonWithToJSON).not.toBeAssignableTo<JsonValue>();
expectTypeOf(nonJsonWithToJSON.toJSON()).toBeAssignableTo<JsonValue>();
expectTypeOf(nonJsonWithToJSON.toJSON()).toBeAssignableTo<Jsonify<NonJsonWithToJSON>>();

class NonJsonExtendPrimitiveWithToJSON extends Number {
	public fixture = 42n;

	public toJSON(): {fixture: string} {
		return {
			fixture: '42n',
		};
	}
}

const nonJsonExtendPrimitiveWithToJSON = new NonJsonExtendPrimitiveWithToJSON();
expectTypeOf(nonJsonExtendPrimitiveWithToJSON).not.toBeAssignableTo<JsonValue>();
expectTypeOf(nonJsonExtendPrimitiveWithToJSON.toJSON()).toBeAssignableTo<JsonValue>();
expectTypeOf(nonJsonExtendPrimitiveWithToJSON.toJSON()).toBeAssignableTo<Jsonify<NonJsonExtendPrimitiveWithToJSON>>();

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

expectTypeOf(new NonJsonWithToJSONWrapper()).not.toBeAssignableTo<JsonValue>();

type InnerFixture = {fixture: Array<[string, number]>};

expectTypeOf<Jsonify<NonJsonWithToJSONWrapper>>().toBe<{
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
expectTypeOf(nonJsonWithInvalidToJSON).not.toBeAssignableTo<JsonValue>();
expectTypeOf(nonJsonWithInvalidToJSON.toJSON()).not.toBeAssignableTo<JsonValue>();

// Not jsonable types; these types behave differently when used as plain values, as members of arrays and as values of objects
declare const undefined: undefined;
expectTypeOf<undefined>().not.toBeAssignableTo<JsonValue>();

declare const function_: (_: any) => void;
expectTypeOf(function_).not.toBeAssignableTo<JsonValue>();

declare const symbol: symbol;
expectTypeOf(symbol).not.toBeAssignableTo<JsonValue>();

// Plain values fail JSON.stringify()
declare const plainUndefined: Jsonify<typeof undefined>;
expectTypeOf(plainUndefined).toBe<never>();

declare const plainFunction: Jsonify<typeof function_>;
expectTypeOf(plainFunction).toBe<never>();

declare const plainSymbol: Jsonify<typeof symbol>;
expectTypeOf(plainSymbol).toBe<never>();

declare const plainNever: Jsonify<never>;
expectTypeOf(plainNever).toBe<never>();

// Array members become null
declare const arrayMemberUndefined: Jsonify<Array<typeof undefined>>;
expectTypeOf(arrayMemberUndefined).toBe<null[]>();

declare const arrayMemberUnionWithUndefined: Jsonify<Array<typeof undefined | typeof number>>;
expectTypeOf(arrayMemberUnionWithUndefined).toBe<Array<null | number>>();

declare const arrayMemberUnionWithUndefinedDeep: Jsonify<Array<Array<typeof undefined | typeof number>> | {foo: Array<typeof undefined | typeof number>}>;
expectTypeOf(arrayMemberUnionWithUndefinedDeep).toBe<Array<Array<null | number>> | {foo: Array<null | number>}>();

declare const arrayMemberFunction: Jsonify<Array<typeof function_>>;
expectTypeOf(arrayMemberFunction).toBe<null[]>();

declare const arrayMemberSymbol: Jsonify<Array<typeof symbol>>;
expectTypeOf(arrayMemberSymbol).toBe<null[]>();

// A non-JSON-able member of a union still becomes null instead of collapsing the union
declare const arrayMemberUnionWithSymbol: Jsonify<Array<typeof symbol | typeof number>>;
expectTypeOf(arrayMemberUnionWithSymbol).toBe<Array<null | number>>();

declare const arrayMemberUnionWithFunction: Jsonify<Array<typeof function_ | typeof number>>;
expectTypeOf(arrayMemberUnionWithFunction).toBe<Array<null | number>>();

// The same holds for tuple members
declare const tupleMemberUnionWithSymbol: Jsonify<[typeof string | typeof symbol, number]>;
expectTypeOf(tupleMemberUnionWithSymbol).toBe<[string | null, number]>();

// The member mapping is distributive, and distributing over the empty union gives `never` rather than `null`, so this changed from `null[]` to `never[]`. That is the better answer: an array of `never` can only be empty, and `JSON.stringify([])` is `'[]'`.
declare const arrayMemberNever: Jsonify<never[]>;
expectTypeOf(arrayMemberNever).toBe<never[]>();

// A tuple position cannot be empty, so a `never` member still becomes `null`.
declare const tupleMemberNever: Jsonify<[never]>;
expectTypeOf(tupleMemberNever).toBe<[null]>();

declare const tupleMemberNeverAfterString: Jsonify<[string, never]>;
expectTypeOf(tupleMemberNeverAfterString).toBe<[string, null]>();

// `JSON.stringify` throws for a `bigint`, so there is no runtime answer, but a member it cannot represent still follows the same rule as a symbol or a function.
declare const arrayMemberBigint: Jsonify<Array<1n>>;
expectTypeOf(arrayMemberBigint).toBe<null[]>();

// When used in object values, these keys are filtered
declare const objectValueUndefined: Jsonify<{keep: string; undefined: typeof undefined}>;
expectTypeOf(objectValueUndefined).toBe<{keep: string}>();

declare const objectValueFunction: Jsonify<{keep: string; fn: typeof function_}>;
expectTypeOf(objectValueFunction).toBe<{keep: string}>();

declare const objectValueSymbol: Jsonify<{keep: string; symbol: typeof symbol}>;
expectTypeOf(objectValueSymbol).toBe<{keep: string}>();

// Symbol keys are filtered
declare const objectKeySymbol: Jsonify<{[key: typeof symbol]: number; keep: string}>;
expectTypeOf(objectKeySymbol).toBe<{keep: string}>();

// Number, String and Boolean values are turned into primitive counterparts
declare const number: Number;
expectTypeOf(number).not.toBeAssignableTo<JsonValue>();

declare const string: String;
expectTypeOf(string).not.toBeAssignableTo<JsonValue>();

declare const boolean: Boolean;
expectTypeOf(boolean).not.toBeAssignableTo<JsonValue>();

declare const numberJson: Jsonify<typeof number>;
expectTypeOf(numberJson).toBe<number>();

declare const stringJson: Jsonify<typeof string>;
expectTypeOf(stringJson).toBe<string>();

declare const booleanJson: Jsonify<typeof boolean>;
expectTypeOf(booleanJson).toBe<boolean>();

declare const tupleJson: Jsonify<[string, Date]>;
expectTypeOf(tupleJson).toBe<[string, string]>();

declare const tupleRestJson: Jsonify<[string, ...Date[]]>;
expectTypeOf(tupleRestJson).toBe<[string, ...string[]]>();

declare const mixTupleJson: Jsonify<['1', (_: any) => void, 2]>;
expectTypeOf(mixTupleJson).toBe<['1', null, 2]>();

declare const tupleStringJson: Jsonify<string[] & ['some value']>;
expectTypeOf(tupleStringJson).toBe<['some value']>();

// A tagged primitive keeps its tag, because `JSON.parse` gives back the same value.
type UserId = Tagged<number, 'UserId'>;
expectTypeOf<Jsonify<UserId>>().toBe<UserId>();
expectTypeOf<Jsonify<{id: UserId}>>().toBe<{id: UserId}>();
expectTypeOf<Jsonify<{id?: UserId}>>().toBe<{id?: UserId}>();
expectTypeOf<Jsonify<Tagged<'a' | 'b', 'Letter'>>>().toBe<Tagged<'a' | 'b', 'Letter'>>();
expectTypeOf<Jsonify<UserId | undefined>>().toBe<UserId>();
expectTypeOf<Jsonify<UserId[]>>().toBe<UserId[]>();

// A tagged object, array, or `Date` becomes a new value and loses its tag.
expectTypeOf<Jsonify<Tagged<{a: Date}, 'X'>>>().toBe<{a: string}>();
expectTypeOf<Jsonify<Tagged<Date, 'X'>>>().toBe<string>();

// `LiteralToPrimitiveDeep` removes all tags, and also widens literals.
expectTypeOf<LiteralToPrimitiveDeep<Jsonify<{id: UserId; type: 'Point'}>>>().toBe<{id: number; type: string}>();

// A tagged tuple keeps all its elements. `JSON.stringify` drops the tag's symbol key, so the result is the same as for the untagged tuple.
expectTypeOf<Jsonify<Tagged<[number, number], 'Point'>>>().toBe<[number, number]>();
expectTypeOf<Jsonify<Tagged<[Date, number], 'T'>>>().toBe<[string, number]>();
expectTypeOf<Jsonify<Tagged<[1, 2, 3], 'T'>>>().toBe<[1, 2, 3]>();
expectTypeOf<Jsonify<Tagged<readonly [string, Date], 'T'>>>().toBe<[string, string]>();
expectTypeOf<Jsonify<Tagged<[string, Date?], 'T'>>>().toBe<[string] | [string, string | null]>();
expectTypeOf<Jsonify<Tagged<[string, ...Date[]], 'T'>>>().toBe<[string, ...string[]]>();
expectTypeOf<Jsonify<Tagged<[...Date[], number], 'T'>>>().toBe<Jsonify<[...Date[], number]>>();
expectTypeOf<Jsonify<Tagged<['1', (_: any) => void, symbol], 'T'>>>().toBe<['1', null, null]>();
expectTypeOf<Jsonify<Tagged<[], 'T'>>>().toBe<[]>();
expectTypeOf<Jsonify<Tagged<Date[], 'T'>>>().toBe<string[]>();
expectTypeOf<Jsonify<Tagged<TupleOf<200, Date>, 'T'>>>().toBe<TupleOf<200, string>>();

// With more than one tag, with metadata, and with the deprecated `Opaque`
expectTypeOf<Jsonify<Tagged<Tagged<[Date, number], 'A'>, 'B'>>>().toBe<[string, number]>();
expectTypeOf<Jsonify<Tagged<[Date, number], 'A' | 'B'>>>().toBe<[string, number]>();
expectTypeOf<Jsonify<Tagged<[Date, number], 'A', {unit: 'cm'}>>>().toBe<[string, number]>();
expectTypeOf<Jsonify<Opaque<[Date, number], 'O'>>>().toBe<[string, number]>();

// A union of tagged tuples, and tagged tuples nested in other types
expectTypeOf<Jsonify<Tagged<[Date] | [number, number], 'T'>>>().toBe<[string] | [number, number]>();
expectTypeOf<Jsonify<{point: Tagged<[number, number], 'Point'>}>>().toBe<{point: [number, number]}>();
expectTypeOf<Jsonify<Array<Tagged<[Date, number], 'T'>>>>().toBe<Array<[string, number]>>();
expectTypeOf<Jsonify<[Tagged<[Date, number], 'T'>, string]>>().toBe<[[string, number], string]>();

// A tagged array that contains itself is kept as it is, like an untagged one.
type TaggedTree = string | Tagged<TaggedTree[], 'Tree'>;
expectTypeOf<Jsonify<TaggedTree>>().toBe<TaggedTree>();
type TaggedDateTree = Date | Tagged<TaggedDateTree[], 'Tree'>;
expectTypeOf<Jsonify<TaggedDateTree>>().toBe<string | JsonValue[]>();

// A tagged primitive inside a tagged tuple keeps its tag, like any tagged primitive.
expectTypeOf<Jsonify<Tagged<[Tagged<number, 'Id'>, Date], 'T'>>>().toBe<[Tagged<number, 'Id'>, string]>();

// BigInt fails JSON.stringify
declare const bigInt: Jsonify<bigint>;
expectTypeOf(bigInt).toBe<never>();

declare const int8Array: Int8Array;
declare const int8ArrayJson: Jsonify<typeof int8Array>;
expectTypeOf(int8ArrayJson).toBe<Record<string, number>>();

declare const map: Map<string, number>;
declare const mapJson: Jsonify<typeof map>;
expectTypeOf(mapJson).toBe<EmptyObject>();
({}) satisfies Jsonify<typeof map>;

// Regression test for https://github.com/sindresorhus/type-fest/issues/466
expectTypeOf<42>().not.toBeAssignableTo<Jsonify<typeof map>>();
expectTypeOf<{foo: 42}>().not.toBeAssignableTo<Jsonify<typeof map>>();

declare const set: Set<string>;
declare const setJson: Jsonify<typeof set>;
expectTypeOf(setJson).toBe<EmptyObject>();
({}) satisfies Jsonify<typeof set>;

// Regression test for https://github.com/sindresorhus/type-fest/issues/466
expectTypeOf<42>().not.toBeAssignableTo<Jsonify<typeof set>>();
expectTypeOf<{foo: 42}>().not.toBeAssignableTo<Jsonify<typeof set>>();

// A `ReadonlyMap`/`ReadonlySet` is the same as a `Map`/`Set` at runtime and also stringifies to `{}`.
declare const readonlyMap: ReadonlyMap<string, number>;
declare const readonlyMapJson: Jsonify<typeof readonlyMap>;
expectTypeOf(readonlyMapJson).toBe<EmptyObject>();
({}) satisfies Jsonify<typeof readonlyMap>;
expectTypeOf<{size: 1}>().not.toBeAssignableTo<Jsonify<typeof readonlyMap>>();

declare const readonlySet: ReadonlySet<string>;
declare const readonlySetJson: Jsonify<typeof readonlySet>;
expectTypeOf(readonlySetJson).toBe<EmptyObject>();
({}) satisfies Jsonify<typeof readonlySet>;
expectTypeOf<{size: 1}>().not.toBeAssignableTo<Jsonify<typeof readonlySet>>();

// Positive and negative Infinity, NaN and null are turned into null
// NOTE: NaN is not detectable in TypeScript, so it is not tested; see https://github.com/sindresorhus/type-fest/issues/406
declare const positiveInfinity: PositiveInfinity;
declare const positiveInfJson: Jsonify<typeof positiveInfinity>;
expectTypeOf(positiveInfJson).toBe<null>();
declare const negativeInf: NegativeInfinity;
declare const negativeInfJson: Jsonify<typeof negativeInf>;
expectTypeOf(negativeInfJson).toBe<null>();

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

expectTypeOf(jsonifiedOptionalPrimitive).toBe<{a?: string}>();
expectTypeOf(jsonifiedOptionalTypeUnion).toBe<{}>();
expectTypeOf(jsonifiedNonOptionalTypeUnion).toBe<{a?: string}>();

// Test that optional properties don't leak `undefined` into the key set and that re-applying `Jsonify` is a no-op.
type OptionalMixed = {
	required: string;
	optional?: string;
};

declare const keyOfJsonifiedOptionalMixed: keyof Jsonify<OptionalMixed>;
expectTypeOf(keyOfJsonifiedOptionalMixed).toBe<'required' | 'optional'>();

declare const doubleJsonifiedOptionalMixed: Jsonify<Jsonify<OptionalMixed>>;
expectTypeOf(doubleJsonifiedOptionalMixed).toBe<OptionalMixed>();

declare const keyOfJsonifiedOptionalUnknown: keyof Jsonify<{a?: unknown}>;
expectTypeOf(keyOfJsonifiedOptionalUnknown).toBe<'a'>();

declare const keyOfJsonifiedOptionalAny: keyof Jsonify<{a?: any}>;
expectTypeOf(keyOfJsonifiedOptionalAny).toBe<'a'>();

// An `a?: never` property can only hold `undefined`, so the key is dropped like `{a: undefined}`.
declare const keyOfJsonifiedOptionalNever: keyof Jsonify<{a?: never}>;
expectTypeOf(keyOfJsonifiedOptionalNever).toBe<never>();

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

expectTypeOf(response).toBe<ExpectedAppDataJson>();

expectTypeOf<Jsonify<any>>().toBe<any>();

declare const objectWithAnyProperty: Jsonify<{
	a: any;
}>;
expectTypeOf(objectWithAnyProperty).toBe<{a: any}>();

declare const objectWithAnyProperties: Jsonify<Record<string, any>>;
expectTypeOf(objectWithAnyProperties).toBe<Record<string, any>>();

// Test for `Jsonify` support for nested objects with _only_ a name property.
// See https://github.com/sindresorhus/type-fest/issues/657
declare const nestedObjectWithNameProperty: {
	first: {
		name: string;
	};
};
declare const jsonifiedNestedObjectWithNameProperty: Jsonify<
	typeof nestedObjectWithNameProperty
>;

expectTypeOf(
	jsonifiedNestedObjectWithNameProperty,
).toBe<typeof nestedObjectWithNameProperty>();

// Regression test for https://github.com/sindresorhus/type-fest/issues/629
declare const readonlyTuple: Jsonify<readonly [1, 2, 3]>;
expectTypeOf(readonlyTuple).toBe<[1, 2, 3]>();

// `unknown` values
declare const unknownValue: Jsonify<unknown>;
declare const unknownArray: Jsonify<unknown[]>;
declare const unknownTuple: Jsonify<[unknown, unknown]>;
declare const objectWithUnknownValue: Jsonify<{key: unknown}>;
expectTypeOf(unknownValue).toBe<JsonValue>();
expectTypeOf<'foo'>().toBeAssignableTo<Jsonify<unknown>>();
['foo'] satisfies Jsonify<unknown>;
expectTypeOf(new Date()).not.toBeAssignableTo<Jsonify<unknown>>();
expectTypeOf(unknownArray).toBe<JsonValue[]>();
['foo'] satisfies Jsonify<unknown[]>;
expectTypeOf([new Date()]).not.toBeAssignableTo<Jsonify<unknown[]>>();
expectTypeOf(unknownTuple).toBe<[JsonValue, JsonValue]>();
['foo', 'foo'] satisfies Jsonify<[unknown, unknown]>;
expectTypeOf([new Date(), new Date()]).not.toBeAssignableTo<Jsonify<[unknown, unknown]>>();
expectTypeOf(objectWithUnknownValue).toBe<{key: JsonValue}>();
({key: []}) satisfies Jsonify<{key: unknown}>;
expectTypeOf({key: new Date()}).not.toBeAssignableTo<Jsonify<{key: unknown}>>();

expectTypeOf<{a: string}>().toBeAssignableTo<JsonObject>();
expectTypeOf<{a: string | undefined}>().not.toBeAssignableTo<JsonObject>();
expectTypeOf<{a?: string}>().toBeAssignableTo<JsonObject>();
expectTypeOf<{a?: string | undefined}>().not.toBeAssignableTo<JsonObject>(); // Requires `exactOptionalPropertyTypes` to be enabled

// Known limitation: TypeScript does not check symbol keys against a string index signature. `JSON.stringify` ignores symbol keys, so this is safe. Adding `[key: symbol]: never` to `JsonObject` would block them, but an interface with only a string index signature would then no longer be assignable.
expectTypeOf<{[key: symbol]: number; a: string}>().toBeAssignableTo<JsonObject>();
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface StringIndexInterface {
	[key: string]: JsonValue;
}
expectTypeOf<StringIndexInterface>().toBeAssignableTo<JsonObject>();

// `JSON.stringify` always passes the property key to `toJSON`, so `toJSON` may declare parameters.
declare const toJSONWithKey: Jsonify<{toJSON(key: string): string}>;
expectTypeOf(toJSONWithKey).toBe<string>();

declare const nestedToJSONWithKey: Jsonify<{nested: {toJSON(key: string): number}}>;
expectTypeOf(nestedToJSONWithKey).toBe<{nested: number}>();

declare const toJSONWithoutKey: Jsonify<{toJSON(): string}>;
expectTypeOf(toJSONWithoutKey).toBe<string>();

// `Map`, `Set`, and `RegExp` all stringify to `{}`, because their properties are not enumerable.
declare const regexpValue: Jsonify<RegExp>;
expectTypeOf(regexpValue).toBe<EmptyObject>();

declare const nestedEmptyValues: Jsonify<{a: RegExp; b: SharedArrayBuffer}>;
expectTypeOf(nestedEmptyValues).toBe<{a: EmptyObject; b: EmptyObject}>();

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so it is still walked.
expectTypeOf<Jsonify<{name: string; message: string; code: number}>>().toBe<{name: string; message: string; code: number}>();

// The `Function` interface is a function, so it is not written.
expectTypeOf<Jsonify<Function>>().toBe<never>();
expectTypeOf<Jsonify<Function[]>>().toBe<null[]>();

declare const mapValue: Jsonify<Map<string, number>>;
expectTypeOf(mapValue).toBe<EmptyObject>();

// `ArrayBuffer` and `DataView` also stringify to `{}`, like the other non-enumerable built-ins.
declare const arrayBufferValue: Jsonify<ArrayBuffer>;
expectTypeOf(arrayBufferValue).toBe<EmptyObject>();

declare const dataViewValue: Jsonify<DataView>;
expectTypeOf(dataViewValue).toBe<EmptyObject>();

declare const nestedArrayBuffer: Jsonify<{a: ArrayBuffer}>;
expectTypeOf(nestedArrayBuffer).toBe<{a: EmptyObject}>();

// A class is a function at runtime, so `JSON.stringify` drops a value holding one the same way it drops a value holding a plain function. A construct signature is not assignable to a call signature, so a class was not in the list of values that are not JSON-able.
type Class_ = new () => {a: number};
type AbstractClass = abstract new () => {a: number};

declare const plainClass: Jsonify<Class_>;
expectTypeOf(plainClass).toBe<never>();

declare const plainAbstractClass: Jsonify<AbstractClass>;
expectTypeOf(plainAbstractClass).toBe<never>();

declare const arrayMemberClass: Jsonify<Class_[]>;
expectTypeOf(arrayMemberClass).toBe<null[]>();

declare const objectValueClass: Jsonify<{keep: string; class: Class_}>;
expectTypeOf(objectValueClass).toBe<{keep: string}>();

// An enum is a subtype of `string` or `number`, so it passes through where a primitive would, and TypeScript cannot tell an enum from a union of the same literals. A plain string is not assignable to the result, even though that is what `JSON.parse` gives back. `LiteralToPrimitiveDeep` unwraps it.
enum Status {
	Open = 'open',
	Closed = 'closed',
}

declare const enumMember: Jsonify<{status: Status}>;
expectTypeOf(enumMember).toBe<{status: Status}>();

declare const enumMemberUnwrapped: LiteralToPrimitiveDeep<{status: Status}>;
expectTypeOf(enumMemberUnwrapped).toBe<{status: string}>();

// Optional tuple positions still have fixed indices and a finite maximum length after serialization.
expectTypeOf<Jsonify<[1, Date?]>>().toBe<[1] | [1, string | null]>();
expectTypeOf<Jsonify<readonly [1, Date?, boolean?]>>().toBe<[1] | [1, string | null] | [1, string | null, boolean | null]>();

expectTypeOf<Jsonify<[Date?]>>().toBe<[] | [string | null]>();
expectTypeOf<Jsonify<readonly [Date?, boolean?, number?]>>().toBe<[] | [string | null] | [string | null, boolean | null] | [string | null, boolean | null, number | null]>();
expectTypeOf<Jsonify<[1, (Date | undefined)?]>>().toBe<[1] | [1, string | null]>();
expectTypeOf<Jsonify<[symbol?, (() => void)?]>>().toBe<[] | [null] | [null, null]>();
expectTypeOf<Jsonify<[unknown?]>>().toBe<[] | [JsonValue]>();
expectTypeOf<Jsonify<[Date?, ...boolean[]]>>().toBe<[] | [string | null, ...boolean[]]>();
expectTypeOf<Jsonify<[Date?, boolean?, ...symbol[]]>>().toBe<[] | [string | null] | [string | null, boolean | null, ...null[]]>();
expectTypeOf<Jsonify<[1, Date?] | [2, boolean?]>>().toBe<[1] | [1, string | null] | [2] | [2, boolean | null]>();
expectTypeOf<Jsonify<{values: readonly [Date?]}>>().toBe<{values: [] | [string | null]}>();
expectTypeOf<Jsonify<[Date?, boolean?]>>().toBeAssignableTo<JsonValue>();
expectTypeOf<[string, boolean, number]>().not.toBeAssignableTo<Jsonify<[Date?, boolean?]>>();

// A missing optional position before a present one is a hole that serializes to null.
// eslint-disable-next-line no-sparse-arrays
const sparseOptionalTuple: [1, Date?, boolean?] = [1, , true];
expectTypeOf<[1, null, true]>().toBeAssignableTo<Jsonify<typeof sparseOptionalTuple>>();

// A property's toJSON result can cause that property to be omitted.
expectTypeOf<Jsonify<{keep: 1; value: {toJSON(): undefined}}>>().toBe<{keep: 1}>();
expectTypeOf<Jsonify<{keep: 1; value: {toJSON(): string | undefined}}>>().toBe<{keep: 1; value?: string}>();
expectTypeOf<Jsonify<{readonly value: {toJSON(key: string): string | undefined}}>>().toBe<{readonly value?: string}>();
expectTypeOf<Jsonify<{value?: {toJSON(): string | undefined}}>>().toBe<{value?: string}>();
expectTypeOf<Jsonify<{value: {toJSON(): null | undefined}}>>().toBe<{value?: null}>();
expectTypeOf<Jsonify<{value: {toJSON(): {id: string} | undefined}}>>().toBe<{value?: {id: string}}>();
expectTypeOf<Jsonify<{outer: {keep: 1; value: {toJSON(): undefined}}}>>().toBe<{outer: {keep: 1}}>();

// Ordinary toJSON results stay required, and unrelated fields retain their modifiers.
expectTypeOf<Jsonify<{readonly keep: 1; optional?: boolean; value: {toJSON(): string}}>>().toBe<{readonly keep: 1; optional?: boolean; value: string}>();
expectTypeOf<Jsonify<{value: Date}>>().toBe<{value: string}>();
expectTypeOf<Jsonify<{value: {toJSON(): null}}>>().toBe<{value: null}>();
expectTypeOf<Jsonify<{value: string | {toJSON(): undefined}}>>().toBe<{value?: string}>();
expectTypeOf<Jsonify<{value?: {toJSON(): undefined}}>>().toBe<{}>();
expectTypeOf<Jsonify<{value: {toJSON(): symbol}}>>().toBe<{}>();
expectTypeOf<Jsonify<{value: {toJSON(): () => void}}>>().toBe<{}>();
expectTypeOf<Jsonify<{toJSON(): undefined}>>().toBe<never>();
expectTypeOf<Jsonify<Array<{toJSON(): undefined}>>>().toBe<null[]>();
expectTypeOf<Jsonify<{value: {toJSON(): string | undefined}}>>().toBeAssignableTo<JsonValue>();

// Optional and nullable name-only records are data, rather than functions.
expectTypeOf<Jsonify<{value?: {name: string}}>>().toBe<{value?: {name: string}}>();
expectTypeOf<Jsonify<{value: {name: string} | null}>>().toBe<{value: {name: string} | null}>();
expectTypeOf<Jsonify<{value: [] | {name: string}}>>().toBe<{value: [] | {name: string}}>();
expectTypeOf<Jsonify<{value: {toJSON(): {name: string} | undefined}}>>().toBe<{value?: {name: string}}>();

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface NamedRecord {
	name: string;
}
expectTypeOf<{value: NamedRecord}>().not.toBeAssignableTo<JsonValue>(); // A nested interface also needs `Jsonify`
expectTypeOf<Jsonify<{value: NamedRecord}>>().toBe<{value: {name: string}}>();
expectTypeOf<Jsonify<{value?: NamedRecord}>>().toBe<{value?: {name: string}}>();

class NamedClass {
	name = 'record';
}
expectTypeOf<Jsonify<{value: NamedClass}>>().toBe<{value: {name: string}}>();
expectTypeOf<Jsonify<{value?: NamedClass | null}>>().toBe<{value?: {name: string} | null}>();
expectTypeOf<Jsonify<{readonly value?: NamedRecord}>>().toBe<{readonly value?: {name: string}}>();
expectTypeOf<Jsonify<{value: NamedRecord | null | undefined}>>().toBe<{value?: {name: string} | null}>();
expectTypeOf<Jsonify<{value: {toJSON(): NamedRecord | undefined}}>>().toBe<{value?: {name: string}}>();
expectTypeOf<Jsonify<{value?: string | (() => void)}>>().toBe<{}>();
expectTypeOf<Jsonify<{value?: NamedRecord}>>().toBeAssignableTo<JsonValue>();

// An array's toJSON result is classified before non-JSON values become null.
expectTypeOf<Jsonify<Array<{toJSON(): string | undefined}>>>().toBe<Array<string | null>>();
expectTypeOf<Jsonify<readonly [1, {toJSON(): string | undefined}]>>().toBe<[1, string | null]>();
expectTypeOf<Jsonify<Array<{toJSON(key: string): number | undefined}>>>().toBe<Array<number | null>>();
expectTypeOf<Jsonify<Array<{toJSON(): string | symbol}>>>().toBe<Array<string | null>>();
expectTypeOf<Jsonify<Array<{toJSON(): string | (() => void)}>>>().toBe<Array<string | null>>();
expectTypeOf<Jsonify<{values: Array<{toJSON(): string | undefined}>}>>().toBe<{values: Array<string | null>}>();

// Always-present results stay unchanged, and always-absent results become null.
expectTypeOf<Jsonify<Array<{toJSON(): string}>>>().toBe<string[]>();
expectTypeOf<Jsonify<Array<{toJSON(): undefined}>>>().toBe<null[]>();
expectTypeOf<Jsonify<[{toJSON(): undefined}, {toJSON(): string}]>>().toBe<[null, string]>();
expectTypeOf<Jsonify<Array<{toJSON(): null | undefined}>>>().toBe<null[]>();
expectTypeOf<Jsonify<Array<{toJSON(): {name: string} | undefined}>>>().toBe<Array<null | {name: string}>>();
expectTypeOf<Jsonify<Array<{toJSON(): NamedRecord | undefined}>>>().toBe<Array<null | {name: string}>>();
expectTypeOf<Jsonify<[1, {toJSON(): string | undefined}?]>>().toBe<[1] | [1, string | null]>();
expectTypeOf<Jsonify<Array<Date | {toJSON(): undefined}>>>().toBe<Array<string | null>>();
expectTypeOf<Jsonify<Array<Array<{toJSON(): string | undefined}>>>>().toBe<Array<Array<string | null>>>();
expectTypeOf<Jsonify<Array<{toJSON(): string | undefined}>>>().toBeAssignableTo<JsonValue>();

// The JSON types are already JSON, so they stay unchanged. Their arrays contain `JsonValue` itself, which used to recurse forever.
expectTypeOf<Jsonify<JsonValue>>().toBe<JsonValue>();
expectTypeOf<Jsonify<JsonObject>>().toBe<JsonObject>();
expectTypeOf<Jsonify<JsonArray>>().toBe<JsonArray>();
expectTypeOf<Jsonify<{value: JsonValue; date: Date}>>().toBe<{value: JsonValue; date: string}>();
expectTypeOf<Jsonify<Array<JsonValue | Date>>>().toBe<Array<JsonValue | string>>();

// An array that contains itself stays unchanged when it is already JSON, as it would otherwise recurse forever.
type SelfJson = string | number | boolean | null | SelfJson[] | {[key: string]: SelfJson};
expectTypeOf<Jsonify<SelfJson>>().toBe<SelfJson>();
expectTypeOf<Jsonify<SelfJson[]>>().toBe<SelfJson[]>();
expectTypeOf<Jsonify<SelfJson[][]>>().toBe<SelfJson[][]>();
expectTypeOf<Jsonify<{data: SelfJson; date: Date}>>().toBe<{data: SelfJson; date: string}>();
expectTypeOf<Jsonify<[SelfJson, Date]>>().toBe<[SelfJson, string]>();
expectTypeOf<Jsonify<SelfJson | undefined>>().toBe<SelfJson>();

type ReadonlySelfJson = string | readonly ReadonlySelfJson[];
expectTypeOf<Jsonify<ReadonlySelfJson>>().toBe<ReadonlySelfJson>();

// An interface that extends `Array`, like Prisma's `JsonArray`.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InterfaceJsonArray extends Array<InterfaceJsonValue> {}
type InterfaceJsonValue = string | InterfaceJsonArray;
expectTypeOf<Jsonify<InterfaceJsonValue>>().toBe<InterfaceJsonValue>();
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface NestedArray extends Array<NestedArray> {}
expectTypeOf<Jsonify<NestedArray>>().toBe<NestedArray>();

// An array that contains itself and is not already JSON becomes `JsonValue[]`. The other members are still transformed.
type DateTree = Date | DateTree[];
expectTypeOf<Jsonify<DateTree>>().toBe<string | JsonValue[]>();
type ReadonlyDateTree = Date | readonly ReadonlyDateTree[];
expectTypeOf<Jsonify<ReadonlyDateTree>>().toBe<string | JsonValue[]>();
type OptionalTree = number | undefined | OptionalTree[];
expectTypeOf<Jsonify<OptionalTree>>().toBe<number | JsonValue[]>();
type MixedTree = string | MixedTree[] | {date: Date};
expectTypeOf<Jsonify<MixedTree>>().toBe<string | JsonValue[] | {date: string}>();

// Like the type that Supabase generates. The `undefined` makes it not JSON.
type SupabaseJson = string | number | boolean | null | SupabaseJson[] | {[key: string]: SupabaseJson | undefined};
expectTypeOf<Jsonify<SupabaseJson>>().toBeAssignableTo<JsonValue>();
expectTypeOf<Extract<Jsonify<SupabaseJson>, unknown[]>>().toBe<JsonValue[]>();

// An array whose item type is a wider array or `any` does not contain itself, so it is transformed as usual.
expectTypeOf<Jsonify<unknown[][]>>().toBe<JsonValue[][]>();
expectTypeOf<Jsonify<Array<readonly unknown[]>>>().toBe<JsonValue[][]>();
expectTypeOf<Jsonify<any[]>>().toBe<any[]>();

// An array of an object that contains the array is not an array that contains itself, so it is transformed as usual.
type Tree = {created: Date; children: Tree[]};
expectTypeOf<Jsonify<Tree>['children'][number]['children'][number]['created']>().toBe<string>();

// A long tuple does not hit the recursion limit.
expectTypeOf<Jsonify<TupleOf<200, Date>>>().toBe<TupleOf<200, string>>();
expectTypeOf<Jsonify<[...TupleOf<200, Date>, ...Date[]]>>().toBe<[...TupleOf<200, string>, ...string[]]>();
