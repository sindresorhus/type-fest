import {expectTypeOf} from 'nz';
import type {SetNonNullable, SetRequired, SetRequiredNonNullable, Simplify, LiteralUnion, Opaque, Tagged} from '../index.d.ts';

// =================
// Removing optionality and nullish values
// =================

// Removes the optional modifier and `null` and `undefined` from the value type of the given key.
declare const variation1: SetRequiredNonNullable<{a?: number | null; b: string}, 'a'>;
expectTypeOf(variation1.a).toBe<number>();
expectTypeOf(variation1.b).toBe<string>();

// A key that is required but nullable loses only `null`.
declare const variation2: SetRequiredNonNullable<{a: string | null}, 'a'>;
expectTypeOf(variation2.a).toBe<string>();

// A key that is optional but not nullable loses only the optional modifier.
declare const variation3: SetRequiredNonNullable<{a?: string}, 'a'>;
expectTypeOf(variation3.a).toBe<string>();

// A required key with `undefined` in its value type loses `undefined` too, unlike `SetRequired`.
declare const requiredWithUndefined: SetRequiredNonNullable<{a: string | undefined}, 'a'>;
expectTypeOf(requiredWithUndefined.a).toBe<string>();
expectTypeOf<SetRequired<{a: string | undefined}, 'a'>>().toBe<{a: string | undefined}>();

// A value that is only `null` or only `undefined` becomes `never`.
declare const nullOnly: SetRequiredNonNullable<{a?: null}, 'a'>;
expectTypeOf(nullOnly.a).toBe<never>();
declare const undefinedOnly: SetRequiredNonNullable<{a?: undefined}, 'a'>;
expectTypeOf(undefinedOnly.a).toBe<never>();

// Updates several keys at once, and leaves the keys that are not given as is.
declare const variation4: SetRequiredNonNullable<{a?: number | null; b?: string | null; c: boolean}, 'a' | 'b'>;
expectTypeOf(variation4.a).toBe<number>();
expectTypeOf(variation4.b).toBe<string>();
expectTypeOf(variation4.c).toBe<boolean>();
expectTypeOf(variation4).toBeAssignableTo<{a: number; b: string; c: boolean}>();

// `never` keys change nothing.
declare const variation5: SetRequiredNonNullable<{a?: string | null}, never>;
expectTypeOf(variation5.a).toBe<string | null | undefined>();

// Every key can be selected at once.
declare const allKeys: SetRequiredNonNullable<{a?: string | null; b?: number | undefined}, 'a' | 'b'>;
expectTypeOf(allKeys.a).toBe<string>();
expectTypeOf(allKeys.b).toBe<number>();

declare const allKeysByName: SetRequiredNonNullable<{a?: string | null; b?: number | undefined}, keyof {a?: string | null; b?: number | undefined}>;
expectTypeOf(allKeysByName.a).toBe<string>();
expectTypeOf(allKeysByName.b).toBe<number>();

// The keys of the type do not change.
expectTypeOf<keyof SetRequiredNonNullable<{a?: string | null; b: number}, 'a'>>().toBe<'a' | 'b'>();

// A key that is not given keeps its optionality and its nullable value type.
declare const remainingOptional: SetRequiredNonNullable<{a?: string | null; b?: number}, 'a'>;
expectTypeOf(remainingOptional.b).toBe<number | undefined>();
declare const remainingNullable: SetRequiredNonNullable<{a?: string | null; b: string | null}, 'a'>;
expectTypeOf(remainingNullable.b).toBe<string | null>();

// =================
// Modifiers and special keys
// =================

// Keeps `readonly` on the given key.
declare const variation6: SetRequiredNonNullable<{readonly a?: string | null; b: number}, 'a'>;
expectTypeOf(variation6.a).toBe<string>();
expectTypeOf(variation6).toBeAssignableTo<{readonly a: string; b: number}>();
// @ts-expect-error - The `readonly` modifier is kept.
variation6.a = 'unicorn';

// Works with a numeric key on an object.
declare const numericKey: SetRequiredNonNullable<{0?: string | null; 1: number}, 0>;
expectTypeOf(numericKey[0]).toBe<string>();
expectTypeOf(numericKey[1]).toBe<number>();

// Works with a symbol key.
declare const symbolKey: SetRequiredNonNullable<{[Symbol.iterator]?: () => Iterator<number>; a?: string}, typeof Symbol.iterator>;
expectTypeOf(symbolKey[Symbol.iterator]).toBe<() => Iterator<number>>();
expectTypeOf(symbolKey.a).toBe<string | undefined>();

// Works with an optional method.
type WithMethod = {
	method?(): string | undefined;
	other?: string;
};

declare const withMethod: SetRequiredNonNullable<WithMethod, 'method'>;
expectTypeOf(withMethod.method).toBe<() => string | undefined>();
expectTypeOf(withMethod.method()).toBe<string | undefined>();

// Works with a getter.
type WithGetter = {
	get value(): string | null;
	other?: string;
};

declare const withGetter: SetRequiredNonNullable<WithGetter, 'value'>;
expectTypeOf(withGetter.value).toBe<string>();

// Keeps the call signature of a callable type.
type Callable = {
	(argument: string): number;
	property?: string | null;
};

declare const callable: SetRequiredNonNullable<Callable, 'property'>;
expectTypeOf(callable('unicorn')).toBe<number>();
expectTypeOf(callable.property).toBe<string>();
expectTypeOf(callable).toBeAssignableTo<Callable>();

// =================
// Index signatures
// =================

// `noUncheckedIndexedAccess` adds `undefined` to every index read in this repo, so the flattened type is checked instead.
declare const variation7: SetRequiredNonNullable<{[key: string]: string | undefined}, string>;
expectTypeOf<Simplify<typeof variation7>>().toBe<{[key: string]: string}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{[key: number]: string | null}, number>>>().toBe<{[key: number]: string}>();

// A literal key that an index signature covers becomes a regular property.
declare const indexSignatureKey: SetRequiredNonNullable<{[key: string]: string | null}, 'name'>;
expectTypeOf(indexSignatureKey.name).toBe<string>();

// Works with `Record`.
expectTypeOf<Simplify<SetRequiredNonNullable<Record<string, string | null>, string>>>().toBe<Record<string, string>>();

// =================
// Arrays and tuples
// =================

// Works with a tuple index.
declare const variation8: SetRequiredNonNullable<[string | null, number], 0>;
expectTypeOf(variation8[0]).toBe<string>();
expectTypeOf(variation8[1]).toBe<number>();

// The index can be a string too.
declare const stringTupleIndex: SetRequiredNonNullable<[string | null, number], '0'>;
expectTypeOf(stringTupleIndex[0]).toBe<string>();

// An index after an optional element is supported, unlike `SetRequired`, because the tuple keeps its shape.
declare const variation9: SetRequiredNonNullable<[string?, number?], 1>;
expectTypeOf(variation9[1]).toBe<number>();
expectTypeOf<SetRequired<[string?, number?], 1>>().toBe<[string?, number?]>();

// The required element is also required in a value.
const completeTuple: SetRequiredNonNullable<[string?, number?], 1> = ['unicorn', 1];
// @ts-expect-error - The second element is required.
const incompleteTuple: SetRequiredNonNullable<[string?, number?], 1> = ['unicorn'];

// Keeps `readonly` on a tuple.
declare const variation10: SetRequiredNonNullable<readonly [string | null], 0>;
expectTypeOf(variation10[0]).toBe<string>();
expectTypeOf(variation10).toBeAssignableTo<readonly [string | null]>();
// @ts-expect-error - The tuple stays readonly.
variation10[0] = 'unicorn';

// A `number` key reaches the element type of an array, also when the array is readonly.
expectTypeOf<SetRequiredNonNullable<Array<string | undefined>, number>[number]>().toBe<string>();
expectTypeOf<SetRequiredNonNullable<ReadonlyArray<string | null>, number>[number]>().toBe<string>();

// The array methods keep the element type of the given type, so a nullable element is still accepted.
declare const arrayMethods: SetRequiredNonNullable<Array<string | null>, number>;
arrayMethods.push(null);

// A `number` key does not change a tuple element read, because TypeScript reads a tuple element through its own index.
declare const tupleNumberKey: SetRequiredNonNullable<[string | null, number | undefined], number>;
expectTypeOf(tupleNumberKey[0]).toBe<string | null>();
expectTypeOf(tupleNumberKey[1]).toBe<number | undefined>();
// A value with a `null` element is still rejected.
// @ts-expect-error - The `number` index signature requires a non-null value.
const nullElement: SetRequiredNonNullable<[string | null], number> = [null];

// Works when an optional element comes after the key too.
declare const lateTuple: SetRequiredNonNullable<[string?, number?, boolean?], 2>;
expectTypeOf(lateTuple[2]).toBe<boolean>();
const completeLateTuple: SetRequiredNonNullable<[string?, number?, boolean?], 2> = ['unicorn', 1, true];
// @ts-expect-error - The third element is required.
const shortLateTuple: SetRequiredNonNullable<[string?, number?, boolean?], 2> = ['unicorn', 1];

// Works with a rest element.
declare const tupleWithRest: SetRequiredNonNullable<[string | null, ...number[]], 0>;
expectTypeOf(tupleWithRest[0]).toBe<string>();

// =================
// Unions
// =================

// Works with a union of object types. Each member keeps its own value type for reads and writes after narrowing.
type UnionA = {kind: 'a'; value?: string | null};
type UnionB = {kind: 'b'; value?: number};
declare const variation11: SetRequiredNonNullable<UnionA | UnionB, 'value'>;
expectTypeOf(variation11.value).toBe<string | number>();

if (variation11.kind === 'a') {
	expectTypeOf(variation11.value).toBe<string>();
} else if (variation11.kind === 'b') {
	expectTypeOf(variation11.value).toBe<number>();
	// @ts-expect-error - This member keeps its own value type.
	variation11.value = 'unicorn';
}

// Works with a union of tuples.
declare const tupleUnion: SetRequiredNonNullable<[string | null, number] | [number | null, string], 0>;
expectTypeOf(tupleUnion[0]).toBe<string | number>();

// A key that only some members of a union have is rejected, because `keyof` of a union is only the keys that every member has.
// @ts-expect-error
type InvalidUnionKeys = SetRequiredNonNullable<{a?: string | null} | {b?: number}, 'a'>;

// `SetRequired` and `SetNonNullable` accept such a key instead, as explained in the docs.
expectTypeOf<SetRequired<{a?: string | null} | {b?: number}, 'a'>>().toBe<{a: string | null} | {b?: number}>();
expectTypeOf<SetNonNullable<{a?: string | null} | {b?: number}, 'a'>>().toBe<{a?: string} | {b?: number}>();

// A key that the type does not have is rejected.
// @ts-expect-error
type InvalidKey = SetRequiredNonNullable<{a?: string}, 'b'>;

// =================
// `any`, `never`, `unknown`
// =================

// Keeps `any` and `never` in the value type.
declare const variation12: SetRequiredNonNullable<{a?: any}, 'a'>;
expectTypeOf(variation12.a).toBe<any>();
declare const variation13: SetRequiredNonNullable<{a?: never}, 'a'>;
expectTypeOf(variation13.a).toBe<never>();

// `unknown` becomes `{}`, the same as with `SetNonNullable`, because `NonNullable<unknown>` is `{}`.
declare const variation14: SetRequiredNonNullable<{a?: unknown}, 'a'>;
expectTypeOf(variation14.a).toBe<{}>();

// `any` as the given type stays `any`.
declare const variation15: SetRequiredNonNullable<any, string>;
expectTypeOf(variation15).toBe<any>();

// `never` as the given type stays `never`.
declare const variation16: SetRequiredNonNullable<never, never>;
expectTypeOf(variation16).toBe<never>();

// `unknown` as the given type is an intersection with it, which is `{}`.
expectTypeOf<SetRequiredNonNullable<unknown, never>>().toBe<{}>();

// An empty object type stays `{}`.
expectTypeOf<SetRequiredNonNullable<{}, never>>().toBe<{}>();

// `any` as `Keys` selects every key, the same as with `SetRequired`.
type AnyKeysOptions = SetRequiredNonNullable<{a?: string | null; b: number}, any>;
declare const anyKeys: AnyKeysOptions;
expectTypeOf(anyKeys.a).toBe<string>();
expectTypeOf(anyKeys.b).toBe<number>();

const allAnyKeys: AnyKeysOptions = {a: 'unicorn', b: 1};
// @ts-expect-error - The keys are required.
const missingAnyKeys: AnyKeysOptions = {b: 1};
// @ts-expect-error - `null` is not allowed.
const nullAnyKeys: AnyKeysOptions = {a: null, b: 1};
// @ts-expect-error - No index signature is added.
const extraAnyKeys: AnyKeysOptions = {a: 'unicorn', b: 1, z: true};

// It selects the elements of a tuple too.
declare const anyKeysTupleRead: SetRequiredNonNullable<[string | null, number | undefined], any>;
expectTypeOf(anyKeysTupleRead[0]).toBe<string>();
expectTypeOf(anyKeysTupleRead[1]).toBe<number>();
const anyKeysTuple: SetRequiredNonNullable<[string?, number?], any> = ['unicorn', 1];
// @ts-expect-error - Every element is required.
const shortAnyKeysTuple: SetRequiredNonNullable<[string?, number?], any> = ['unicorn'];

// =================
// Nesting
// =================

// Only the given key changes, not the keys of its value type.
declare const nested: SetRequiredNonNullable<{a?: {b?: string | null} | null}, 'a'>;
expectTypeOf(nested.a).toBe<{b?: string | null}>();
expectTypeOf(nested.a.b).toBe<string | null | undefined>();

// =================
// Other base types
// =================

// Works with an `interface` as the given type.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface Config {
	host?: string | null;
	port: number;
}

declare const variation17: SetRequiredNonNullable<Config, 'host'>;
expectTypeOf(variation17.host).toBe<string>();
expectTypeOf(variation17).toBeAssignableTo<Config>();

// Works with an interface that extends another interface.
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface ServerConfig extends Config {
	name: string;
}

declare const serverConfig: SetRequiredNonNullable<ServerConfig, 'host'>;
expectTypeOf(serverConfig.host).toBe<string>();
expectTypeOf(serverConfig.name).toBe<string>();

// Works with `Readonly`.
declare const readonlyObject: SetRequiredNonNullable<Readonly<{a?: string | null; b: number}>, 'a'>;
expectTypeOf(readonlyObject.a).toBe<string>();
// @ts-expect-error - The type stays readonly.
readonlyObject.a = 'unicorn';

// Works with `Partial`.
declare const partialObject: SetRequiredNonNullable<Partial<{a: string; b: number | null}>, 'a' | 'b'>;
expectTypeOf(partialObject.a).toBe<string>();
expectTypeOf(partialObject.b).toBe<number>();

// Works with an intersection as the given type.
declare const intersectionObject: SetRequiredNonNullable<{a?: string | null} & {b: number}, 'a'>;
expectTypeOf(intersectionObject.a).toBe<string>();
expectTypeOf(intersectionObject.b).toBe<number>();

// Keeps a branded value type.
type Brand = string & {readonly brand: 'Brand'};

declare const branded: SetRequiredNonNullable<{a?: Brand | null}, 'a'>;
expectTypeOf(branded.a).toBe<Brand>();

// Keeps the type assignable to a class that has non-public members, because the result is an intersection with it.
class Store {
	private readonly secret: number;

	name?: string | null;

	constructor(secret: number) {
		this.secret = secret;
	}

	get secretValue(): number {
		return this.secret;
	}
}

declare const variation18: SetRequiredNonNullable<Store, 'name'>;
expectTypeOf(variation18.name).toBe<string>();
expectTypeOf(variation18).toBeAssignableTo<Store>();

// `SetRequired` rebuilds the type, so it loses the non-public members and is not assignable to the class.
expectTypeOf<SetRequired<Store, 'name'>>().not.toBeAssignableTo<Store>();

// =================
// Relationship to other types
// =================

// The result is an intersection with the given type, so it is assignable to it. That is what a type predicate needs.
expectTypeOf(variation1).toBeAssignableTo<{a?: number | null; b: string}>();
expectTypeOf(variation1).not.toBeAssignableTo<{a: string; b: number}>();

// A value that already has the given keys required and non-nullable is assignable to the result.
expectTypeOf<{a: number; b: string}>().toBeAssignableTo<SetRequiredNonNullable<{a?: number | null; b: string}, 'a'>>();

// It is not equal to the type from `SetRequired`, which keeps `null` and `undefined` in the value.
expectTypeOf<SetRequired<{a?: string | null}, 'a'>>().toBe<{a: string | null}>();
expectTypeOf<SetRequiredNonNullable<{a?: string | null}, 'a'>>().not.toBe<{a: string | null}>();

// It is not equal to the type from `SetNonNullable`, which keeps the optional modifier.
expectTypeOf<SetNonNullable<{a?: string | null}, 'a'>>().toBe<{a?: string}>();
expectTypeOf<SetRequiredNonNullable<{a?: string | null}, 'a'>>().not.toBe<{a?: string}>();

// `Simplify` turns the result into a single flat object type.
expectTypeOf<Simplify<SetRequiredNonNullable<{a?: number | null; b: string}, 'a'>>>().toBe<{a: number; b: string}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{readonly a?: string | null; b: number}, 'a'>>>().toBe<{readonly a: string; b: number}>();

// =================
// Assignability
// =================

type NamedOptions = SetRequiredNonNullable<{name?: string | null; verbose: boolean}, 'name'>;

const namedOptions: NamedOptions = {name: 'unicorn', verbose: true};
// @ts-expect-error - The key is required.
const missingName: NamedOptions = {verbose: true};
// @ts-expect-error - `null` is not allowed.
const nullName: NamedOptions = {name: null, verbose: true};
// @ts-expect-error - `undefined` is not allowed, also with `exactOptionalPropertyTypes`.
const undefinedName: NamedOptions = {name: undefined, verbose: true};

// Works in a generic wrapper that takes the key as a type parameter.
const readRequiredKey = <ObjectType extends object, Key extends keyof ObjectType>(
	value: SetRequiredNonNullable<ObjectType, Key>,
	key: Key,
): ObjectType[Key] => value[key];

const requiredName: string = readRequiredKey({name: 'unicorn'}, 'name');

// =================
// Type predicate
// =================

// The main use case: the type of a type predicate for a check that a key is present and not `null` or `undefined`.
const hasOwnNonNullish = <ObjectType extends object, Key extends keyof ObjectType>(
	value: ObjectType | null | undefined | void,
	key: Key,
): value is SetRequiredNonNullable<ObjectType, Key> =>
	value !== null
	&& value !== undefined
	&& Object.hasOwn(value, key)
	&& value[key] !== null
	&& value[key] !== undefined;

type Options = {
	name?: string | null;
	retries?: number;
};

declare const options: Options | null | undefined;

if (hasOwnNonNullish(options, 'name')) {
	expectTypeOf(options.name).toBe<string>();
	expectTypeOf(options.retries).toBe<number | undefined>();
	expectTypeOf(options).toBeAssignableTo<Options>();
}

if (hasOwnNonNullish(options, 'retries')) {
	expectTypeOf(options.retries).toBe<number>();
	expectTypeOf(options.name).toBe<string | null | undefined>();
}

// The narrowed value keeps the class members that `SetRequired` would drop.
declare const store: Store | null;
if (hasOwnNonNullish(store, 'name')) {
	expectTypeOf(store.name).toBe<string>();
	expectTypeOf(store).toBeAssignableTo<Store>();
}

// It also narrows a `void` value.
declare const maybeOptions: Options | void;

if (hasOwnNonNullish(maybeOptions, 'name')) {
	expectTypeOf(maybeOptions.name).toBe<string>();
}

// It also narrows a key of an object type that has an index signature, such as an untrusted JSON value.
declare const json: Record<string, unknown> | null;

if (hasOwnNonNullish(json, 'name')) {
	expectTypeOf(json.name).toBe<{}>();
	expectTypeOf(json['other']).toBe<unknown>();
}

// Branded selectors narrow reads and require the selected property to be present.
declare const selectedBrandedKey: SetRequiredNonNullable<{value?: string | null; other: 1}, Tagged<'value', 'Key'>>;
expectTypeOf(selectedBrandedKey.value).toBe<string>();
expectTypeOf<{other: 1}>().not.toBeAssignableTo<SetRequiredNonNullable<{value?: string | null; other: 1}, Tagged<'value', 'Key'>>>();

expectTypeOf<Simplify<SetRequiredNonNullable<{readonly id?: Tagged<string, 'Value'> | null; other?: number}, Opaque<'id', 'Key'>>>>()
	.toBe<{readonly id: Tagged<string, 'Value'>; other?: number}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{id?: string | null; name?: number; other?: boolean}, Tagged<'id' | 'name', 'Key'>>>>()
	.toBe<{id: string; name: number; other?: boolean}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{id?: string | null}, Tagged<Tagged<'id', 'Inner'>, 'Outer'>>>>().toBe<{id: string}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{id?: string | null}, 'id' & {readonly brand: true}>>>().toBe<{id: string}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{kind: 'left'; id?: string | null} | {kind: 'right'; id?: number}, Tagged<'id', 'Key'>>>>()
	.toBe<{kind: 'left'; id: string} | {kind: 'right'; id: number}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{any?: any; unknown?: unknown; impossible?: never}, Tagged<'any' | 'unknown' | 'impossible', 'Key'>>>>()
	.toBe<{any: any; unknown: {}; impossible: never}>();

// A literal tuple index narrows its read without changing the tuple representation.
expectTypeOf<SetRequiredNonNullable<readonly [string | null, number?], Tagged<0, 'Key'>>[0]>().toBe<string>();
expectTypeOf<SetRequiredNonNullable<[string?, number?], Opaque<'1', 'Key'>>[1]>().toBe<number>();
expectTypeOf<SetRequiredNonNullable<[string | null, ...number[]], Tagged<0, 'Key'>>[0]>().toBe<string>();
// Broad number selectors retain the documented tuple-read limitation.
expectTypeOf<SetRequiredNonNullable<[string | null, number | undefined], Tagged<number, 'Key'>>[0]>().toBe<string | null>();
expectTypeOf<SetRequiredNonNullable<Array<string | null>, Tagged<number, 'Key'>>[number]>().toBe<string>();

declare const nonNullishSymbol: unique symbol;
expectTypeOf<Simplify<SetRequiredNonNullable<{readonly [nonNullishSymbol]?: string | null; other?: number}, Tagged<typeof nonNullishSymbol, 'Key'>>>>()
	.toBe<{readonly [nonNullishSymbol]: string; other?: number}>();
enum NonNullishField {
	Id = 'id',
}
expectTypeOf<SetRequiredNonNullable<{[NonNullishField.Id]?: string | null}, NonNullishField.Id>[NonNullishField.Id]>().toBe<string>();
expectTypeOf<Simplify<SetRequiredNonNullable<{id?: string | null}, 'id' & {}>>>().toBe<{id: string}>();
type NonNullishIndex = {[key: string]: string | null};
expectTypeOf<SetRequiredNonNullable<NonNullishIndex, LiteralUnion<'id', string>>>().toBeAssignableTo<{id: string}>();
expectTypeOf<SetRequiredNonNullable<NonNullishIndex, Tagged<string, 'Key'>>>().toBe<SetRequiredNonNullable<NonNullishIndex, string>>();

declare const selectedReadonlyBrand: SetRequiredNonNullable<{readonly id?: string | null}, Tagged<'id', 'Key'>>;
// @ts-expect-error The selected property stays readonly.
selectedReadonlyBrand.id = 'changed';

declare const brandedNameSelector: Tagged<'name', 'Key'>;
if (hasOwnNonNullish(options, brandedNameSelector)) {
	expectTypeOf(options.name).toBe<string>();
	expectTypeOf(options.retries).toBe<number | undefined>();
}

// Autocomplete selectors keep their known literal required alongside a broad index signature.
declare const autocompleteSelectedKey: SetRequiredNonNullable<Record<string, string | null>, LiteralUnion<'id', string>>;
expectTypeOf(autocompleteSelectedKey.id).toBe<string>();
expectTypeOf<{}>().not.toBeAssignableTo<SetRequiredNonNullable<Record<string, string | null>, LiteralUnion<'id', string>>>();
expectTypeOf<SetRequiredNonNullable<[string | null], LiteralUnion<0, number>>[0]>().toBe<string>();

// An enum selector narrows the ordinary field with its value's name too.
declare const nonNullishEnumSelection: SetRequiredNonNullable<{id?: string | null; other: number}, NonNullishField.Id>;
expectTypeOf(nonNullishEnumSelection.id).toBe<string>();
expectTypeOf<{other: number}>().not.toBeAssignableTo<typeof nonNullishEnumSelection>();

function _constructNonNullishEnum<Value extends string>(value: Value): SetRequiredNonNullable<{readonly id?: Value | null}, NonNullishField.Id> {
	return {id: value};
}

function _readNonNullishEnum<Value extends string>(value: SetRequiredNonNullable<{readonly id?: Value | null}, NonNullishField.Id>): Value {
	return value.id;
}

declare const readonlyEnumSource: SetRequiredNonNullable<{readonly [NonNullishField.Id]?: string | null}, Tagged<NonNullishField.Id, 'Key'>>;
expectTypeOf<keyof typeof readonlyEnumSource>().toBe<NonNullishField.Id>();
// @ts-expect-error The original constrained map retains readonly on a nominal source key.
readonlyEnumSource[NonNullishField.Id] = 'valid';

// An autocomplete selector over a template literal index signature keeps its literal member required.
declare const autocompleteTemplateKey: SetRequiredNonNullable<{[key: `on${string}`]: unknown; onClick?: (() => void) | null}, LiteralUnion<'onClick', `on${string}`>>;
expectTypeOf(autocompleteTemplateKey.onClick).toBe<() => void>();
expectTypeOf<{}>().not.toBeAssignableTo<typeof autocompleteTemplateKey>();

// A numeric enum selector selects the declared key with its value, but not a `number` index signature, even though `number` is assignable to a numeric enum.
enum NumericSelectorKey {
	Zero,
	One,
}
expectTypeOf<Simplify<SetRequiredNonNullable<{0?: string | null; 1?: number | null}, NumericSelectorKey.Zero>>>().toBe<{0: string; 1?: number | null}>();
expectTypeOf<SetRequiredNonNullable<{[key: number]: string | null; 1?: string | null}, NumericSelectorKey.One>[number]>().toBe<string | null>();
expectTypeOf<SetRequiredNonNullable<{[key: number]: string | null; 1?: string | null}, NumericSelectorKey.One>[1]>().toBe<string>();
expectTypeOf<Simplify<SetRequiredNonNullable<{[NumericSelectorKey.One]?: string | null; other?: number}, NumericSelectorKey.One>>>().toBe<{[NumericSelectorKey.One]: string; other?: number}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{[NumericSelectorKey.One]?: string | null; other?: number}, 1>>>().toBe<{[NumericSelectorKey.One]: string; other?: number}>();
expectTypeOf<Simplify<SetRequiredNonNullable<{[NumericSelectorKey.One]?: string | null; other?: number}, LiteralUnion<NumericSelectorKey.One, number>>>>()
	.toBe<{[NumericSelectorKey.One]: string; other?: number}>();
