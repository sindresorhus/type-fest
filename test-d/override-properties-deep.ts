import {expectTypeOf} from 'nz';
import type {MergeDeepOptions, OverridePropertiesDeep} from '../index.d.ts';

type Foo = {
	foo: string;
	bar: {
		baz: number;
	};
};

const fixture: OverridePropertiesDeep<Foo, {bar: {baz: string}}> = {
	foo: 'foo',
	bar: {baz: 'baz'},
};
expectTypeOf(fixture).toBe<{foo: string; bar: {baz: string}}>();

// The value type can change, which is the point of an override.
expectTypeOf<OverridePropertiesDeep<Foo, {foo: number}>>().toBe<{foo: number; bar: {baz: number}}>();
expectTypeOf<OverridePropertiesDeep<Foo, {bar: {baz: string}}>>().toBe<{foo: string; bar: {baz: string}}>();

// An empty override keeps the original type.
expectTypeOf<OverridePropertiesDeep<Foo, {}>>().toBe<Foo>();

// A top-level key that does not exist errors.
// @ts-expect-error `baz` is not a property of `Foo`.
type InvalidTopLevel = OverridePropertiesDeep<Foo, {baz: string}>;

// A nested key that does not exist errors.
// @ts-expect-error `foo` is not a property of `Foo['bar']`.
type InvalidNested = OverridePropertiesDeep<Foo, {bar: {foo: number}}>;

// A mix of valid and invalid keys still errors.
// @ts-expect-error `nope` is not a property of `Foo['bar']`.
type InvalidMixed = OverridePropertiesDeep<Foo, {bar: {baz: string; nope: boolean}}>;

// A deeper nested key is checked.
type Deep = {
	a: {
		b: {
			c: number;
		};
	};
};

expectTypeOf<OverridePropertiesDeep<Deep, {a: {b: {c: string}}}>>().toBe<{a: {b: {c: string}}}>();
// @ts-expect-error `d` is not a property of `Deep['a']['b']`.
type InvalidDeeper = OverridePropertiesDeep<Deep, {a: {b: {d: string}}}>;

// Optional properties are checked, but the `undefined` part is not an object.
expectTypeOf<OverridePropertiesDeep<{bar?: {baz: number}}, {bar?: {baz: string}}>>().toBe<{bar?: {baz: string}}>();
// @ts-expect-error `nope` is not a property of the optional `bar`.
type InvalidOptionalNested = OverridePropertiesDeep<{bar?: {baz: number}}, {bar?: {nope: string}}>;
expectTypeOf<OverridePropertiesDeep<Foo, {bar: {baz: string} | undefined}>>().toBe<{foo: string; bar: {baz: string} | undefined}>();

// `any` and `never` follow `MergeDeep`: `any` on either side gives `any`, and `never` gives `never`.
expectTypeOf<OverridePropertiesDeep<Foo, any>>().toBe<any>();
expectTypeOf<OverridePropertiesDeep<any, {whatever: string}>>().toBe<any>();
expectTypeOf<OverridePropertiesDeep<Foo, never>>().toBe<never>();
expectTypeOf<OverridePropertiesDeep<never, {0: number}>>().toBe<never>();

// @ts-expect-error An `unknown` override is not an object with keys.
type UnknownOverride = OverridePropertiesDeep<Foo, unknown>;
// @ts-expect-error A non-empty override of `unknown` does not establish keys.
type UnknownOriginal = OverridePropertiesDeep<unknown, {whatever: string}>;
expectTypeOf<OverridePropertiesDeep<unknown, {}>>().toBe<never>();

// An original without declared keys rejects every key.
// @ts-expect-error `a` is not a property of `{}`.
type EmptyOriginal = OverridePropertiesDeep<{}, {a: number}>;
// @ts-expect-error `a` is not a property of `object`.
type ObjectOriginal = OverridePropertiesDeep<object, {a: number}>;

// Modifiers are kept by `MergeDeep`.
expectTypeOf<OverridePropertiesDeep<{readonly a: {readonly b: number}}, {readonly a: {readonly b: string}}>>()
	.toBe<{readonly a: {readonly b: string}}>();

// A canonical numeric spelling names the same property.
expectTypeOf<OverridePropertiesDeep<{0: {a: number}}, {'0': {a: string}}>>().toBe<{'0': {a: string}}>();
// @ts-expect-error `b` is not a property of the numeric key's value.
type InvalidNumericNested = OverridePropertiesDeep<{0: {a: number}}, {'0': {b: string}}>;
expectTypeOf<OverridePropertiesDeep<{'1.5': {a: number}}, {1.5: {a: string}}>>().toBe<{1.5: {a: string}}>();

// A noncanonical numeric string is a different property.
// @ts-expect-error `01` does not name numeric key 1.
type PaddedKey = OverridePropertiesDeep<Record<number, string>, {'01': 'changed'}>;
// @ts-expect-error Exponent notation is not a numeric spelling.
type ExponentKey = OverridePropertiesDeep<Record<number, string>, {'1e0': 'changed'}>;

// Index signatures cover keys, including numeric ones.
expectTypeOf<OverridePropertiesDeep<Record<number, string>, {'0': 'changed'}>>().toBe<{[key: number]: string; '0': 'changed'}>();
expectTypeOf<OverridePropertiesDeep<Record<string, string>, {0: 'changed'}>>().toBe<{[key: string]: string; 0: 'changed'}>();
// @ts-expect-error An index signature in the override needs a matching index signature in the original.
type BroadOverride = OverridePropertiesDeep<{a: string}, Record<string, number>>;

// Nested values below an index signature are checked too.
type NestedIndex = OverridePropertiesDeep<Record<string, {a: number}>, {foo: {a: string}}>;
expectTypeOf<NestedIndex['foo']>().toBe<{a: string}>();
expectTypeOf<NestedIndex['other']>().toBe<{a: number}>();
// @ts-expect-error `b` is not a property of the index signature's value.
type InvalidIndexNested = OverridePropertiesDeep<Record<string, {a: number}>, {foo: {b: string}}>;

// A string enum key must be overridden using the enum member.
enum EnumKey {
	Name = 'name',
}

// @ts-expect-error A plain string does not name the declared enum key.
type PlainStringEnumKey = OverridePropertiesDeep<{[EnumKey.Name]: {a: number}}, {'name': {a: string}}>;
expectTypeOf<OverridePropertiesDeep<{[EnumKey.Name]: {a: number}}, {[EnumKey.Name]: {a: string}}>>().toBe<{[EnumKey.Name]: {a: string}}>();
// @ts-expect-error `b` is not a property of the enum key's value.
type InvalidEnumNested = OverridePropertiesDeep<{[EnumKey.Name]: {a: number}}, {[EnumKey.Name]: {b: string}}>;
// @ts-expect-error A different name does not override the enum key.
type MissingEnumKey = OverridePropertiesDeep<{[EnumKey.Name]: {a: number}}, {other: {a: string}}>;

// Numeric enum members match their value and the numeric string spelling.
enum NumericEnumKey {
	Zero,
	One,
}

expectTypeOf<OverridePropertiesDeep<{[NumericEnumKey.Zero]: {a: number}}, {0: {a: string}}>>().toBe<{0: {a: string}}>();
expectTypeOf<OverridePropertiesDeep<{[NumericEnumKey.Zero]: {a: number}}, {'0': {a: string}}>>().toBe<{'0': {a: string}}>();
expectTypeOf<OverridePropertiesDeep<{[NumericEnumKey.Zero]: {a: number}}, {[NumericEnumKey.Zero]: {a: string}}>>().toBe<{0: {a: string}}>();
// @ts-expect-error `b` is not a property of the numeric enum key's value.
type InvalidNumericEnumNested = OverridePropertiesDeep<{[NumericEnumKey.Zero]: {a: number}}, {'0': {b: string}}>;

// Symbol keys stay distinct and their values are checked.
declare const symbolKey: unique symbol;
declare const otherSymbolKey: unique symbol;
expectTypeOf<OverridePropertiesDeep<{[symbolKey]: {a: number}}, {[symbolKey]: {a: string}}>>().toBe<{[symbolKey]: {a: string}}>();
// @ts-expect-error `b` is not a property of the symbol key's value.
type InvalidSymbolNested = OverridePropertiesDeep<{[symbolKey]: {a: number}}, {[symbolKey]: {b: string}}>;
// @ts-expect-error A different symbol does not name the original property.
type MissingSymbolKey = OverridePropertiesDeep<{[symbolKey]: {a: number}}, {[otherSymbolKey]: {a: string}}>;

// A symbol index signature covers symbol keys, including their nested values.
type SymbolIndex = OverridePropertiesDeep<{[key: symbol]: {a: number}}, {[symbolKey]: {a: string}}>;
expectTypeOf<SymbolIndex[typeof symbolKey]>().toBe<{a: string}>();
expectTypeOf<SymbolIndex[symbol]>().toBe<{a: number}>();
// @ts-expect-error `b` is not a property of the symbol index signature's value.
type InvalidSymbolIndexNested = OverridePropertiesDeep<{[key: symbol]: {a: number}}, {[symbolKey]: {b: string}}>;

// Arrays and other non-record-like values are opaque, so their keys are not checked.
expectTypeOf<OverridePropertiesDeep<{a: Array<{b: number}>}, {a: Array<{c: string}>}>>().toBe<{a: Array<{c: string}>}>();
expectTypeOf<OverridePropertiesDeep<{a: Date}, {a: {c: string}}>>().toBe<{a: {c: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: Map<string, number>}, {a: {c: string}}>>().toBe<{a: {c: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: () => void}, {a: {c: string}}>>().toBe<{a: {c: string}}>();
// `object` does not declare keys, so its values are opaque too.
expectTypeOf<OverridePropertiesDeep<{a: object}, {a: {anything: string}}>>().toBe<{a: {anything: string}}>();

// `MergeDeep` options are passed through.
expectTypeOf<OverridePropertiesDeep<{a: Array<{b: number}>}, {a: Array<{b: string}>}, {recurseIntoArrays: true}>>().toBe<{a: Array<{b: string}>}>();
expectTypeOf<OverridePropertiesDeep<{a: Array<{b: number}>}, {a: Array<{b: string}>}, {arrayMergeMode: 'spread'}>>().toBe<{a: Array<{b: number} | {b: string}>}>();
// Array elements are not key-checked, so `recurseIntoArrays` can merge in keys the original lacks.
expectTypeOf<OverridePropertiesDeep<{a: Array<{b: number}>}, {a: Array<{c: string}>}, {recurseIntoArrays: true}>>()
	.toBe<{a: Array<{b: number; c: string}>}>();

// A union original only allows keys common to every member.
expectTypeOf<OverridePropertiesDeep<{a: {x: number; z: number}} | {a: {x: number; w: number}}, {a: {x: string}}>>()
	.toBe<{a: {x: string; z: number}} | {a: {x: string; w: number}}>();
// @ts-expect-error `a` is not common to every union member.
type UnionOriginal = OverridePropertiesDeep<{a: {b: number}} | {c: number}, {a: {b: string}}>;

// `never` and top-level originals.
expectTypeOf<OverridePropertiesDeep<never, {}>>().toBe<never>();
expectTypeOf<OverridePropertiesDeep<{}, {}>>().toBe<{}>();
expectTypeOf<OverridePropertiesDeep<object, {}>>().toBe<{}>();
expectTypeOf<OverridePropertiesDeep<any, {}>>().toBe<any>();

// A key whose value is `never` bypasses the key check.
expectTypeOf<OverridePropertiesDeep<{a: number}, {b: never}>>().toBe<{a: number; b: never}>();
expectTypeOf<OverridePropertiesDeep<{a: {c: number}}, {a: {b: never}}>>().toBe<{a: {c: number; b: never}}>();

// A root array or tuple is opaque, so its elements are not key-checked.
expectTypeOf<OverridePropertiesDeep<Array<{b: number}>, Array<{c: string}>>>().toBe<Array<{b: number} | {c: string}>>();
expectTypeOf<OverridePropertiesDeep<[{b: number}], [{c: string}]>>().toBe<Array<{b: number} | {c: string}>>();
expectTypeOf<OverridePropertiesDeep<ReadonlyArray<{b: number}>, ReadonlyArray<{c: string}>>>()
	.toBe<Array<{b: number} | {c: string}>>();
expectTypeOf<OverridePropertiesDeep<Array<{b: number}>, Array<{c: string}>, {recurseIntoArrays: true}>>()
	.toBe<Array<{b: number; c: string}>>();
// A mixed union containing an array is still checked.
// @ts-expect-error `b` is not a key of the union.
type ArrayUnionWithObject = OverridePropertiesDeep<string[] | {a: number}, {b: 1}>;
// A union of arrays is opaque, and a record override of a root array merges to `never`.
expectTypeOf<OverridePropertiesDeep<string[] | number[], {foo: 1}>>().toBe<never>();
expectTypeOf<OverridePropertiesDeep<string[], {foo: 1}>>().toBe<never>();

// A root `Map`, `Set`, or `Date` is not a record, so the merge is `never`.
expectTypeOf<OverridePropertiesDeep<Map<string, {a: number}>, Map<string, {a: string}>>>().toBe<never>();
expectTypeOf<OverridePropertiesDeep<Set<number>, Set<string>>>().toBe<never>();
expectTypeOf<OverridePropertiesDeep<Date, Date>>().toBe<never>();

// An `any` original value makes the nested value opaque.
expectTypeOf<OverridePropertiesDeep<{a: any}, {a: {b: {anything: string}}}>>().toBe<{a: {b: {anything: string}}}>();
// `object | undefined` is still an `object` value.
expectTypeOf<OverridePropertiesDeep<{a: object | undefined}, {a: {x: string}}>>().toBe<{a: {x: string}}>();
// An empty object value has no keys to override.
expectTypeOf<OverridePropertiesDeep<{a: {}}, {a: {}}>>().toBe<{a: {}}>();
// @ts-expect-error `{}` has no keys.
type EmptyObjectValue = OverridePropertiesDeep<{a: {}}, {a: {x: 1}}>;

// Other non-record-like original values are opaque.
expectTypeOf<OverridePropertiesDeep<{a: string}, {a: {x: string}}>>().toBe<{a: {x: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: null}, {a: {x: string}}>>().toBe<{a: {x: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: unknown}, {a: {x: string}}>>().toBe<{a: {x: string}}>();
// `MergeDeep` does not merge a `never` value, so the property keeps it.
expectTypeOf<OverridePropertiesDeep<{a: never}, {a: {x: string}}>>().toBe<{a: never}>();
expectTypeOf<OverridePropertiesDeep<{a: Set<number>}, {a: {x: string}}>>().toBe<{a: {x: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: Promise<{x: number}>}, {a: {y: string}}>>().toBe<{a: {y: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: WeakMap<object, {x: number}>}, {a: {y: string}}>>().toBe<{a: {y: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: (() => void) & {prop: number}}, {a: {x: string}}>>().toBe<{a: {x: string}}>();
// A callable whose own property conflicts with `Function` is still a function, so its keys are not checked. The underlying `MergeDeep` still merges its properties, dropping the call signature.
type CallableWithOwnBind = {(): void; bind: boolean};
expectTypeOf<OverridePropertiesDeep<{a: CallableWithOwnBind}, {a: {missing: string}}>>().toBe<{a: {bind: boolean; missing: string}}>();

// A class instance is a record-like object, so its keys are checked.
declare class Instance {
	a: number;
}

expectTypeOf<OverridePropertiesDeep<{x: Instance}, {x: {a: string}}>>().toBe<{x: {a: string}}>();
// @ts-expect-error `b` is not a property of the class instance.
type MissingInstanceKey = OverridePropertiesDeep<{x: Instance}, {x: {b: string}}>;

// Keys that the override does not mention keep their original value.
declare class Pair {
	a: number;
	b: number;
}

expectTypeOf<OverridePropertiesDeep<{x: Pair}, {x: {a: string}}>>().toBe<{x: {a: string; b: number}}>();

// The override value is checked member by member when it is a union.
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: {b: string} | null}>>().toBe<{a: {b: string} | null}>();
expectTypeOf<OverridePropertiesDeep<{a: {x: number}}, {a: string | {x: 1}}>>().toBe<{a: string | {x: 1}}>();
// @ts-expect-error The second member has a key the original does not have.
type InvalidUnionMember = OverridePropertiesDeep<{a: {x: number}}, {a: {x: 1} | {q: 1}}>;
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: {b: any}}>>().toBe<{a: {b: any}}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: {b: unknown}}>>().toBe<{a: {b: unknown}}>();
// An array override value is opaque and replaces the original value.
expectTypeOf<OverridePropertiesDeep<{a: {x: number}}, {a: number[]}>>().toBe<{a: number[]}>();

// The override supplies its own modifiers.
expectTypeOf<OverridePropertiesDeep<{readonly a: {readonly b: number}}, {a: {b: string}}>>().toBe<{a: {b: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {readonly a: {readonly b: string}}>>().toBe<{readonly a: {readonly b: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: {readonly b: string}}>>().toBe<{a: {readonly b: string}}>();

// Optionality can be added or removed.
expectTypeOf<OverridePropertiesDeep<{a?: {b: number}}, {a: {b: string}}>>().toBe<{a: {b: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a?: {b: string}}>>().toBe<{a?: {b: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: {b?: string}}>>().toBe<{a: {b?: string}}>();
expectTypeOf<OverridePropertiesDeep<{a: {b?: number}}, {a: {b: string}}>>().toBe<{a: {b: string}}>();

// Aliases keep the override's modifiers.
expectTypeOf<OverridePropertiesDeep<{readonly 0?: {a: number}}, {'0': {a: string}}>>().toBe<{'0': {a: string}}>();
expectTypeOf<OverridePropertiesDeep<{readonly [symbolKey]?: {a: number}}, {[symbolKey]: {a: string}}>>().toBe<{[symbolKey]: {a: string}}>();

// Modifiers and exact optionality are enforced at assignment.
type ReadonlyResult = OverridePropertiesDeep<{readonly a: {readonly b: number}}, {readonly a: {readonly b: string}}>;
declare const readonlyResult: ReadonlyResult;
// @ts-expect-error The overridden property stays readonly.
readonlyResult.a = {b: 'x'};
// @ts-expect-error The nested property stays readonly.
readonlyResult.a.b = 'x';

type OptionalResult = OverridePropertiesDeep<{a?: {b: number}}, {a?: {b: string}}>;
({}) satisfies OptionalResult;
// @ts-expect-error The override value type is enforced.
({a: {b: 1}}) satisfies OptionalResult;
// @ts-expect-error `exactOptionalPropertyTypes` forbids an explicit `undefined`.
({a: undefined}) satisfies OptionalResult;

// An override value replaces the original value, including `undefined` and `null`.
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: undefined}>>().toBe<{a: undefined}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: null}>>().toBe<{a: null}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: unknown}>>().toBe<{a: unknown}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: any}>>().toBe<{a: any}>();

// An empty nested override keeps the original value.
expectTypeOf<OverridePropertiesDeep<{a: {b: number}}, {a: {}}>>().toBe<{a: {b: number}}>();
expectTypeOf<OverridePropertiesDeep<{a: {b: {c: number}}}, {a: {b: {}}}>>().toBe<{a: {b: {c: number}}}>();
expectTypeOf<OverridePropertiesDeep<{a?: {b: number}}, {a?: {}}>>().toBe<{a?: {b: number}}>();

// Only the non-`undefined` part of an original value is checked.
expectTypeOf<OverridePropertiesDeep<{a: {b: number} | undefined}, {a: {b: string}}>>().toBe<{a: {b: string}}>();
expectTypeOf<OverridePropertiesDeep<{a?: undefined}, {a: {x: 1}}>>().toBe<{a: {x: 1}}>();

// Both directions of a numeric alias, including a fractional and a negative key.
expectTypeOf<OverridePropertiesDeep<{'1': {a: number}}, {1: {a: string}}>>().toBe<{1: {a: string}}>();
expectTypeOf<OverridePropertiesDeep<{[-2]: {a: number}}, {'-2': {a: string}}>>().toBe<{'-2': {a: string}}>();
expectTypeOf<OverridePropertiesDeep<{0: {a: number; b: number}}, {'0': {a: string}}>>().toBe<{'0': {a: string; b: number}}>();
// @ts-expect-error A trailing zero is not the canonical spelling of numeric key 1.
type TrailingZero = OverridePropertiesDeep<Record<number, string>, {'1.0': 'x'}>;
// @ts-expect-error A leading plus is not a numeric spelling.
type LeadingPlus = OverridePropertiesDeep<Record<number, string>, {'+1': 'x'}>;
// @ts-expect-error A leading space is not a numeric spelling.
type LeadingSpace = OverridePropertiesDeep<Record<number, string>, {' 1': 'x'}>;
expectTypeOf<OverridePropertiesDeep<Record<number, string>, {'-1': 'x'}>>().toBe<{[key: number]: string; '-1': 'x'}>();
// @ts-expect-error A number index signature does not cover a non-numeric key.
type NonNumericIndexKey = OverridePropertiesDeep<Record<number, string>, {name: 'x'}>;

// Enum members are accepted when they name a declared key.
expectTypeOf<OverridePropertiesDeep<{[EnumKey.Name]: {a: number}}, {[EnumKey.Name]: {a: string}}>>()
	.toBe<{[EnumKey.Name]: {a: string}}>();
expectTypeOf<OverridePropertiesDeep<{name: {a: number}}, {[EnumKey.Name]: {a: string}}>>()
	.toBe<{[EnumKey.Name]: {a: string}}>();

enum NumericStringEnum {
	Zero = '0',
	Padded = '01',
}

// @ts-expect-error A number does not name a declared string enum key.
type NumberAsStringEnum = OverridePropertiesDeep<{[NumericStringEnum.Zero]: {a: number}}, {0: {a: string}}>;
// @ts-expect-error A numeric string does not name a declared string enum key.
type NumericStringAsEnum = OverridePropertiesDeep<{[NumericStringEnum.Zero]: {a: number}}, {'0': {a: string}}>;
// @ts-expect-error A plain string does not name a declared string enum key.
type PaddedStringAsEnum = OverridePropertiesDeep<{[NumericStringEnum.Padded]: {a: number}}, {'01': {a: string}}>;
// @ts-expect-error `'01'` is not the canonical spelling of numeric key 1.
type PaddedEnumAsOne = OverridePropertiesDeep<{[NumericStringEnum.Padded]: {a: number}}, {1: {a: string}}>;
// @ts-expect-error A padded enum key does not name numeric key 1.
type OneAsPaddedEnum = OverridePropertiesDeep<{1: {a: number}}, {[NumericStringEnum.Padded]: {a: string}}>;

expectTypeOf<OverridePropertiesDeep<{1: {a: number}}, {[NumericEnumKey.One]: {a: string}}>>()
	.toBe<{[NumericEnumKey.One]: {a: string}}>();
// @ts-expect-error A different member does not name numeric key 1.
type WrongNumericEnum = OverridePropertiesDeep<{[NumericEnumKey.One]: {a: number}}, {[NumericEnumKey.Zero]: {a: string}}>;

type EnumOverIndex = OverridePropertiesDeep<Record<string, {a: number}>, {[EnumKey.Name]: {a: string}}>;
expectTypeOf<EnumOverIndex['name']>().toBe<{a: string}>();
expectTypeOf<EnumOverIndex['other']>().toBe<{a: number}>();

// A nested symbol index signature checks its values.
type NestedSymbolIndex = OverridePropertiesDeep<{a: {[k: symbol]: number}}, {a: {[symbolKey]: string}}>;
expectTypeOf<NestedSymbolIndex['a'][typeof symbolKey]>().toBe<string>();
expectTypeOf<NestedSymbolIndex['a'][symbol]>().toBe<number>();
// @ts-expect-error A broad symbol index key does not name a unique symbol key.
type SymbolNotBroad = OverridePropertiesDeep<{[symbolKey]: number}, {[k: symbol]: number}>;
// @ts-expect-error Nested values under a symbol index signature are checked.
type BadNestedSymbolIndex = OverridePropertiesDeep<{[k: string]: {[j: symbol]: {a: number}}}, {[k: string]: {[symbolKey]: {b: string}}}>;

// A number index signature keeps its own value while a declared key changes.
type NestedNumberIndex = OverridePropertiesDeep<Record<number, {a: number}>, {0: {a: string}}>;
expectTypeOf<NestedNumberIndex[0]>().toBe<{a: string}>();
expectTypeOf<NestedNumberIndex[number]>().toBe<{a: number}>();

// A declared key is merged while the covering index signature is unchanged.
type DeclaredAndIndex = OverridePropertiesDeep<{foo: {a: number; b: number}; [key: string]: {a: number}}, {foo: {a: string}}>;
expectTypeOf<DeclaredAndIndex['foo']>().toBe<{a: string; b: number}>();
expectTypeOf<DeclaredAndIndex[string]>().toBe<{a: number}>();
// `b` exists only on the declared value, so using the index value would reject it.
type DeclaredAndIndexOnlyOnDeclared = OverridePropertiesDeep<{foo: {a: number; b: number}; [key: string]: {a: number}}, {foo: {b: string}}>;
expectTypeOf<DeclaredAndIndexOnlyOnDeclared['foo']>().toBe<{a: number; b: string}>();

type IndexOnlyKey = OverridePropertiesDeep<{[key: string]: {a: number}}, {bar: {a: string}}>;
expectTypeOf<IndexOnlyKey['bar']>().toBe<{a: string}>();
expectTypeOf<IndexOnlyKey['other']>().toBe<{a: number}>();
// @ts-expect-error A broad index signature can include keys the original does not declare.
type IndexOverSpecific = OverridePropertiesDeep<{a: {b: number}}, {a: {[k: string]: string}}>;
// @ts-expect-error The same through `Record`.
type RecordOverSpecific = OverridePropertiesDeep<{a: {b: number}}, {a: Record<string, string>}>;

// A template literal index signature covers its matching keys only.
type TemplateIndex = OverridePropertiesDeep<{[key: `data-${string}`]: {a: number}}, {'data-x': {a: string}}>;
expectTypeOf<TemplateIndex['data-x']>().toBe<{a: string}>();
expectTypeOf<TemplateIndex[`data-${string}`]>().toBe<{a: number}>();
// @ts-expect-error A key outside the template pattern is not covered.
type OutsideTemplate = OverridePropertiesDeep<{[key: `data-${string}`]: {a: number}}, {other: {a: string}}>;
// @ts-expect-error Nested values under a template index signature are checked.
type BadTemplateNested = OverridePropertiesDeep<{[key: `data-${string}`]: {a: number}}, {'data-x': {b: string}}>;
type NumberTemplateIndex = OverridePropertiesDeep<{[key: `${number}`]: {a: number}}, {0: {a: string}}>;
expectTypeOf<NumberTemplateIndex[0]>().toBe<{a: string}>();

// An optional key under an index signature is checked and stays optional.
type OptionalUnderIndex = OverridePropertiesDeep<{[k: string]: {a: number}}, {bar?: {a: string}}>;
expectTypeOf<OptionalUnderIndex['bar']>().toBe<{a: string} | undefined>();
expectTypeOf<OptionalUnderIndex['other']>().toBe<{a: number}>();
// @ts-expect-error `b` is not a property of the index signature's value.
type InvalidOptionalUnderIndex = OverridePropertiesDeep<{[k: string]: {a: number}}, {bar?: {b: string}}>;

// A non-object union member makes the whole original key unusable. An empty override is accepted, and `MergeDeep` drops the non-object member.
// @ts-expect-error No key is common to every member.
type UnionWithPrimitive = OverridePropertiesDeep<string | {a: {x: number}}, {a: {x: string}}>;
expectTypeOf<OverridePropertiesDeep<string | {a: {x: number}}, {}>>().toBe<{a: {x: number}}>();

// A nested value union only allows the keys common to every member.
expectTypeOf<OverridePropertiesDeep<{a: {x: number}} | {a: {y: number; x: number}}, {a: {x: string}}>>()
	.toBe<{a: {x: string}} | {a: {x: string; y: number}}>();
// @ts-expect-error `x` is not on every member of the nested value union.
type NestedUnionMissingKey = OverridePropertiesDeep<{a: {x: number}} | {a: {y: number}}, {a: {x: string}}>;

// A union override distributes; a member can still pass through another member's check.
expectTypeOf<OverridePropertiesDeep<{a: {x: number}}, {a: {x: 1} | {x: 2}}>>().toBe<{a: {x: 1} | {x: 2}}>();
// @ts-expect-error `b` is not a key of the original.
type DisjointUnionOverride = OverridePropertiesDeep<{a: {x: number}}, {a: {x: 1}} | {b: 2}>;
// @ts-expect-error One union member has an invalid nested key.
type BadNestedUnionOverride = OverridePropertiesDeep<{a: {x: {y: number}}}, {a: {x: {y: 1}}} | {a: {x: {z: 1}}}>;
// The constraint is a union too, so an extra key can match another member's check.
expectTypeOf<OverridePropertiesDeep<{a: {x?: number}}, {a: {x?: 1}} | {a: {x?: 1; q?: 1}}>>()
	.toBe<{a: {x?: 1}} | {a: {x?: 1; q?: 1}}>();

// The merge options are passed through without disabling the key check.
expectTypeOf<OverridePropertiesDeep<{a: number[]}, {a: string[]}>>().toBe<{a: string[]}>();
expectTypeOf<OverridePropertiesDeep<{a: number[]}, {a: string[]}, {arrayMergeMode: 'replace'}>>().toBe<{a: string[]}>();
expectTypeOf<OverridePropertiesDeep<{a: number[]}, {a: string[]}, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>()
	.toBe<{a: string[]}>();
expectTypeOf<OverridePropertiesDeep<{a: number[]}, {a: string[]}, {arrayMergeMode?: 'spread'}>>().toBe<{a: string[]}>();
// @ts-expect-error `nope` is not a merge mode.
type InvalidMergeMode = OverridePropertiesDeep<{a: number[]}, {a: string[]}, {arrayMergeMode: 'nope'}>;
// @ts-expect-error Options do not disable the key check.
type InvalidKeyWithOptions = OverridePropertiesDeep<{a: {b: number}}, {a: {b: string; nope: boolean}}, {recurseIntoArrays: true}>;

// A generic `Options` does not make the result opaque.
type GenericOptionsResult<Options extends MergeDeepOptions> = OverridePropertiesDeep<
	{a: {b: number}; keep: string},
	{a: {b: string}},
	Options
>;
expectTypeOf<GenericOptionsResult<{}>>().toBe<{a: {b: string}; keep: string}>();
expectTypeOf<GenericOptionsResult<never>>().toBe<{a: {b: string}; keep: string}>();

// An empty override works with a generic original.
type GenericEmptyOverride<Original extends {a: {b: number}}> = OverridePropertiesDeep<Original, {}>;
expectTypeOf<GenericEmptyOverride<{a: {b: number}}>>().toBe<{a: {b: number}}>();
// A `never` value bypasses the check for a generic original too.
type GenericNeverValue<Original extends {a: {b: number}}> = OverridePropertiesDeep<Original, {c: never}>;
expectTypeOf<GenericNeverValue<{a: {b: number}}>>().toBe<{a: {b: number}; c: never}>();
// @ts-expect-error An unresolved generic `Original` cannot be checked.
type GenericNonEmptyOverride<Original extends {a: {b: number}}> = OverridePropertiesDeep<Original, {a: {b: string}}>;
// @ts-expect-error An unresolved generic `Override` cannot be checked.
type GenericOverrideValue<Override> = OverridePropertiesDeep<{a: {b: number}}, Override>;
// @ts-expect-error An unresolved generic object value at a known key cannot be checked.
type GenericNestedValue<Value extends object> = OverridePropertiesDeep<{a: {b: number}}, {a: Value}>;

// A primitive or `null` original has no keys.
// @ts-expect-error A primitive original has no keys.
type PrimitiveOriginal = OverridePropertiesDeep<string, {a: 1}>;
// @ts-expect-error `null` has no keys.
type NullOriginal = OverridePropertiesDeep<null, {a: 1}>;

// Recursive original types terminate.
type Node = {value: number; next: Node};
expectTypeOf<OverridePropertiesDeep<Node, {next: {value: string}}>>()
	.toBe<{value: number; next: {value: string; next: Node}}>();
type Tree = {value: number; children: Tree[]};
expectTypeOf<OverridePropertiesDeep<Tree, {value: string}>>().toBe<{value: string; children: Tree[]}>();

// A concrete fixture, including assignment-level enforcement.
type ApiResponse = {id: string; author: {name: string; email: string}};
type Corrected = OverridePropertiesDeep<ApiResponse, {id: number; author: {email: `${string}@${string}`}}>;
({id: 1, author: {name: 'Ada', email: 'ada@example.com'}}) satisfies Corrected;
expectTypeOf<Corrected>().toBeAssignableTo<{id: number; author: {name: string; email: string}}>();
expectTypeOf<ApiResponse>().not.toBeAssignableTo<Corrected>();
// @ts-expect-error The email must match the template literal type.
({id: 1, author: {name: 'Ada', email: 'nope'}}) satisfies Corrected;
// @ts-expect-error The sibling `name` is still required.
({id: 1, author: {email: 'a@b'}}) satisfies Corrected;
// @ts-expect-error The overridden `id` must be a number.
({id: '1', author: {name: 'Ada', email: 'a@b'}}) satisfies Corrected;

// Numeric aliases at several levels keep unmentioned siblings and the override's modifiers.
type NestedNumericOriginal = {readonly 0?: {readonly '1': {name: string; keep: boolean}; sibling: number}; untouched: Date};
type NestedNumericOverride = {'0': {1: {readonly name?: number}}};
expectTypeOf<OverridePropertiesDeep<NestedNumericOriginal, NestedNumericOverride>>()
	.toBe<{'0': {1: {readonly name?: number; keep: boolean}; sibling: number}; untouched: Date}>();
// @ts-expect-error The numeric alias must still read the original nested value.
type InvalidTwiceAliasedOverride = OverridePropertiesDeep<NestedNumericOriginal, {'0': {1: {missing: number}}}>;
// @ts-expect-error An optional aliased override is checked before its undefined part is ignored.
type InvalidOptionalTwiceAliasedOverride = OverridePropertiesDeep<NestedNumericOriginal, {'0'?: {1?: {missing: number}}}>;

// A declared numeric property's precise value wins over a covering index signature.
type PreciseNumberIndex = {[key: number]: {name: string}; 0: {name: string; detail: {code: number}}};
type ChangedPreciseNumberIndex = OverridePropertiesDeep<PreciseNumberIndex, {'0': {detail: {code: string}}}>;
expectTypeOf<ChangedPreciseNumberIndex['0']>().toBe<{name: string; detail: {code: string}}>();
expectTypeOf<ChangedPreciseNumberIndex[number]>().toBe<{name: string}>();
// @ts-expect-error A declared value cannot acquire a key just because it is under an index signature.
type InvalidPreciseNumberIndex = OverridePropertiesDeep<PreciseNumberIndex, {'0': {detail: {missing: string}}}>;

// Aliased keys inside a record union read only the shared nested keys.
type NumericUnionOriginal = {0: {1: {name: string; first: boolean}}} | {0: {1: {name: string; second: number}}};
expectTypeOf<OverridePropertiesDeep<NumericUnionOriginal, {'0': {'1': {name: Date}}}>>()
	.toBe<{'0': {'1': {name: Date; first: boolean}}} | {'0': {'1': {name: Date; second: number}}}>();
// @ts-expect-error The first member's exclusive nested key is not common to the union.
type InvalidAliasedUnionKey = OverridePropertiesDeep<NumericUnionOriginal, {'0': {'1': {first: string}}}>;

// A symbol property can contain numeric aliases, and optionality is preserved at each level.
type SymbolNumericOriginal = {readonly [symbolKey]?: {0?: {name: string; keep: number}}};
expectTypeOf<OverridePropertiesDeep<SymbolNumericOriginal, {[symbolKey]?: {'0'?: {name: boolean}}}>>()
	.toBe<{[symbolKey]?: {'0'?: {name: boolean; keep: number}}}>();
// @ts-expect-error Symbol lookup must not make the aliased numeric value opaque.
type InvalidSymbolNumericOverride = OverridePropertiesDeep<SymbolNumericOriginal, {[symbolKey]?: {'0'?: {missing: boolean}}}>;

// Numeric index values are checked again after a nested symbol lookup.
type NumberSymbolIndex = Record<number, {[symbolKey]: {name: string; keep: boolean}}>;
type ChangedNumberSymbolIndex = OverridePropertiesDeep<NumberSymbolIndex, {'0': {[symbolKey]: {name: number}}}>;
expectTypeOf<keyof ChangedNumberSymbolIndex['0']>().toBe<typeof symbolKey>();
expectTypeOf<ChangedNumberSymbolIndex['0'][typeof symbolKey]>().toBe<{name: number}>();
expectTypeOf<ChangedNumberSymbolIndex[number]>().toBe<{[symbolKey]: {name: string; keep: boolean}}>();
// @ts-expect-error Both the numeric alias and the symbol key must preserve recursive checking.
type InvalidNumberSymbolIndex = OverridePropertiesDeep<NumberSymbolIndex, {'0': {[symbolKey]: {missing: number}}}>;

// The alias works in both directions: the original may declare the string spelling and the override the numeric one.
type ReverseAlias = OverridePropertiesDeep<{'0': {name: string}}, {0: {name: number}}>;
expectTypeOf<ReverseAlias[0]>().toBe<{name: number}>();

// A declared unique symbol overrides a root symbol index signature.
type SymbolIndexAlias = OverridePropertiesDeep<{[key: symbol]: {name: string}}, {[symbolKey]: {name: 'Ada'}}>;
expectTypeOf<SymbolIndexAlias[typeof symbolKey]>().toBe<{name: 'Ada'}>();
