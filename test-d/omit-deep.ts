import {expectTypeOf} from 'nz';
import type {DigitCharacter, LiteralUnion, OmitDeep, Opaque, Paths, Tagged} from '../index.d.ts';

declare class ClassA {
	a: string;
}

type BaseType = {
	string: string;
	optionalString?: string;
	array: number[];
	readonlyArray: readonly number[];
	tuples: ['foo', 'bar'];
	objectArray: Array<{a: 1; b: 2}>;
	leadingSpreadArray: [...Array<{a: 1}>, {b: 2}];
	tailingSpreadArray: [{a: 1}, {b: {c: 2; other: 2}}, ...Array<{d: 3}>];
	objectTuple: [{a: 1}];
	number: number;
	boolean: boolean;
	date: Date;
	Class: typeof ClassA;
	instance: ClassA;
	0: number;
	1?: number;
	optionalObject?: {
		optionalString?: string;
	};
};

type Testing = {
	object: BaseType;
};

declare const normal: OmitDeep<Testing, 'object'>;
expectTypeOf(normal).toBe<Omit<Testing, 'object'>>();

declare const normal2: OmitDeep<Testing, 'object.string'>;
expectTypeOf(normal2).toBe<{object: Omit<BaseType, 'string'>}>();

declare const omitNotExistProperty: OmitDeep<Testing, 'not_in_Testing'>;
expectTypeOf(omitNotExistProperty).toBe<Testing>();

declare const omitNotExistProperties: OmitDeep<Testing, 'not_in_Testing' | 'not_in_Testing2'>;
expectTypeOf(omitNotExistProperties).toBe<Testing>();

declare const omitNotExistProperty2: OmitDeep<Testing, 'object.not_in_object'>;
expectTypeOf(omitNotExistProperty2).toBe<Testing>();

declare const omitNotExistArrayProperty2: OmitDeep<[1, 2, 3], 'not_in_array'>;
expectTypeOf(omitNotExistArrayProperty2).toBe<[1, 2, 3]>();

declare const number: OmitDeep<Testing, 'object.number'>;
expectTypeOf(number).toBe<{object: Omit<BaseType, 'number'>}>();

declare const boolean: OmitDeep<Testing, 'object.boolean'>;
expectTypeOf(boolean).toBe<{object: Omit<BaseType, 'boolean'>}>();

declare const date: OmitDeep<Testing, 'object.date'>;
expectTypeOf(date).toBe<{object: Omit<BaseType, 'date'>}>();

declare const class_: OmitDeep<Testing, 'object.Class'>;
expectTypeOf(class_).toBe<{object: Omit<BaseType, 'Class'>}>();

declare const instance: OmitDeep<Testing, 'object.instance'>;
expectTypeOf(instance).toBe<{object: Omit<BaseType, 'instance'>}>();

declare const array: OmitDeep<Testing, 'object.array'>;
expectTypeOf(array).toBe<{object: Omit<BaseType, 'array'>}>();

declare const numberKey: OmitDeep<Testing, 'object.1'>;
expectTypeOf(numberKey).toBe<{object: Omit<BaseType, 1>}>();

declare const numberKey2: OmitDeep<Testing, 'object.0'>;
expectTypeOf(numberKey2).toBe<{object: Omit<BaseType, 0>}>();

type DeepType = {
	nested: {
		deep: {
			deeper: {
				value: string;
				value2: string;
			};
		};
	};
	foo: string;
};
declare const deep: OmitDeep<DeepType, 'nested.deep.deeper.value'>;
expectTypeOf(deep).toBe<{
	nested: {
		deep: {
			deeper: {
				value2: string;
			};
		};
	};
	foo: string;
}>();

declare const union: OmitDeep<DeepType, 'nested.deep.deeper.value' | 'nested.deep.deeper.value2'>;
expectTypeOf(union).toBe<{
	nested: {
		deep: {
			deeper: {};
		};
	};
	foo: string;
}>();

type Optional = {
	foo?: {
		bar?: {
			baz: string;
		};
	};
};

declare const optional: OmitDeep<Optional, 'foo.bar.baz'>;
expectTypeOf(optional).toBe<{foo?: {bar?: {}}}>();

/**
Test for arrays
*/
declare const recurseIntoArray: OmitDeep<{array: BaseType['objectArray']}, `array.${number}.a`>;
expectTypeOf(recurseIntoArray).toBe<{array: Array<{b: 2}>}>();

declare const recurseIntoArray2: OmitDeep<{array: BaseType['objectArray']}, 'array.0.a'>;
expectTypeOf(recurseIntoArray2).toBe<{array: [{b: 2}, ...Array<{a: 1; b: 2}>]}>();

declare const recurseIntoArray3: OmitDeep<{array: BaseType['objectArray']}, 'array.3.a'>;
expectTypeOf(recurseIntoArray3).toBe<{array: [
	{a: 1; b: 2}, // 0
	{a: 1; b: 2}, // 1
	{a: 1; b: 2}, // 2
	{b: 2}, // 3
	...Array<{a: 1; b: 2}>,
];}>();

declare const tuple: OmitDeep<{array: BaseType['tuples']}, 'array.0'>;
expectTypeOf(tuple).toBe<{array: [unknown, 'bar']}>();

declare const arrayWithMultiplePaths: OmitDeep<{array: Array<{a: string; b: number; c: string}>}, `array.${number}.a` | `array.${number}.b`>;
expectTypeOf(arrayWithMultiplePaths).toBe<{array: Array<{c: string}>}>();

declare const tupleWithMultiplePaths: OmitDeep<{tuple: [{a: string; b: number; c: string}]}, 'tuple.0.a' | 'tuple.0.b'>;
expectTypeOf(tupleWithMultiplePaths).toBe<{tuple: [{c: string}]}>();

// Omitting an element of a tuple with optional elements keeps the rest of the tuple.
declare const omitFromOptionalTuple: OmitDeep<[string?, number?], '0'>;
expectTypeOf(omitFromOptionalTuple).toBe<[unknown, number?]>();

// Omitting every index already empties the array, so a path that continues into one of those indices cannot change the result and must not turn the array into `never[]`.
declare const redundantDeeperPath: OmitDeep<Array<{a: 1}>, `${number}` | `${number}.a`>;
expectTypeOf(redundantDeeperPath).toBe<[]>();

declare const deeperPathIntoEmptyTuple: OmitDeep<{a: []}, 'a.0.b'>;
expectTypeOf(deeperPathIntoEmptyTuple).toBe<{a: []}>();

// `Paths` emits a `${string}` path for a string index signature, so the path type accepts one and the omit has to be applied to the signature's value type, the way `PickDeep` applies a pick to it. The walk compared the path key with the mapped key, which never matches a signature, so the path was silently ignored and the input came back unchanged.
declare const throughStringIndexSignature: OmitDeep<{a: Record<string, {b: 1; c: 2}>}, 'a.x.b'>;
expectTypeOf(throughStringIndexSignature).toBe<{a: {[x: string]: {c: 2}}}>();

declare const throughNumberIndexSignature: OmitDeep<{a: Record<number, {b: 1; c: 2}>}, 'a.0.b'>;
expectTypeOf(throughNumberIndexSignature).toBe<{a: {[x: number]: {c: 2}}}>();

declare const nestedThroughIndexSignature: OmitDeep<{a: Record<string, {b: {c: 1; d: 2}}>}, 'a.x.b.c'>;
expectTypeOf(nestedThroughIndexSignature).toBe<{a: {[x: string]: {b: {d: 2}}}}>();

// A named key is still matched by name rather than by the signature rule, which only applies where the key really is a signature.
declare const namedKeyBesideSignature: OmitDeep<{a: string; b: {c: 1; d: 2}}, 'b.c'>;
expectTypeOf(namedKeyBesideSignature).toBe<{a: string; b: {d: 2}}>();

// A path that names a member leaves the signature beside it alone, the way `PickDeep` does.
declare const memberBesideSignature: OmitDeep<{[k: string]: {b: 1; c: 2}; x: {b: 1; c: 2}}, 'x.b'>;
expectTypeOf(memberBesideSignature.x).toBe<{c: 2}>();
expectTypeOf<(typeof memberBesideSignature)[string]>().toBe<{b: 1; c: 2}>();

declare const throughTemplateSignature: OmitDeep<{a: {[k: `v${string}`]: {b: 1; c: 2}}}, 'a.vx.b'>;
expectTypeOf(throughTemplateSignature).toBe<{a: {[x: `v${string}`]: {c: 2}}}>();

// Returns the original type unchanged if the specified path does not exist.
type TupleInObject = {obj: {a: [0, 1]; b: {bb: {bbb: 10}}; c: boolean}};
expectTypeOf<OmitDeep<TupleInObject, 'obj.b.bb.zzz' | 'obj.a.2' | 'c.c'>>().toBe<TupleInObject>();

type ObjectInTuple = {obj: {a: [0, 1, {bb: {bbb: 10}}]; c: [0, 1, ['20', '22']]}};
expectTypeOf<OmitDeep<ObjectInTuple, 'obj.a.3.3' | 'obj.c.2.9'>>().toBe<ObjectInTuple>();

declare const tupleNegativeIndex: OmitDeep<{tuple: ['a', 'b']}, 'tuple.-1'>;
expectTypeOf(tupleNegativeIndex).toBe<{tuple: ['a', 'b']}>();

declare const tupleNegativeNestedIndex: OmitDeep<{tuple: [{x: 1}]}, 'tuple.-1.x'>;
expectTypeOf(tupleNegativeNestedIndex).toBe<{tuple: [{x: 1}]}>();

declare const tupleMixedValidAndNegativeIndex: OmitDeep<{tuple: [{x: 1; y: 2}]}, 'tuple.0.x' | 'tuple.-1.y'>;
expectTypeOf(tupleMixedValidAndNegativeIndex).toBe<{tuple: [{y: 2}]}>();

declare const readonlyTupleOutOfBounds: OmitDeep<{tuple: readonly [1, 2]}, 'tuple.2'>;
expectTypeOf(readonlyTupleOutOfBounds).toBe<{tuple: readonly [1, 2]}>();

// Each tuple in a union is checked against its own length.
declare const tupleUnionOutOfBounds: OmitDeep<{tuple: [1] | [1, 2]}, 'tuple.1'>;
expectTypeOf(tupleUnionOutOfBounds).toBe<{tuple: [1] | [1, unknown]}>();

expectTypeOf<OmitDeep<[1, 2], '5'>>().toBe<[1, 2]>();

// A path segment that is not how JavaScript writes an index, such as `01` or `-0`, names a key the array does not have, so it is not treated as the wide `${number}` index.
expectTypeOf<OmitDeep<{tuple: [1, 2]}, 'tuple.01'>>().toBe<{tuple: [1, 2]}>();
expectTypeOf<OmitDeep<{tuple: [1, 2]}, 'tuple.-0'>>().toBe<{tuple: [1, 2]}>();
expectTypeOf<OmitDeep<{tuple: [1, 2]}, 'tuple.1e1'>>().toBe<{tuple: [1, 2]}>();
expectTypeOf<OmitDeep<{tuple: [{x: 1}]}, 'tuple.01.x'>>().toBe<{tuple: [{x: 1}]}>();
expectTypeOf<OmitDeep<{array: number[]}, 'array.01'>>().toBe<{array: number[]}>();

// An array never has a negative index.
expectTypeOf<OmitDeep<{array: number[]}, 'array.-1'>>().toBe<{array: number[]}>();
expectTypeOf<OmitDeep<{array: Array<{x: 1}>}, 'array.-1.x'>>().toBe<{array: Array<{x: 1}>}>();
expectTypeOf<OmitDeep<{tuple: [1, ...string[]]}, 'tuple.-1'>>().toBe<{tuple: [1, ...string[]]}>();

// Known limitation: A path into a tuple intersected with an object type loses the object type and some or all of the tuple elements, because TypeScript cannot read the tuple out of the intersection.
expectTypeOf<OmitDeep<{tuple: [1, 2] & {foo: 1}}, 'tuple.1'>>().toBe<{tuple: unknown[]}>();

// `Paths<T>` is a valid path for a generic `T`, even though autocomplete only lists paths up to `a.b.c`.
type OmitDeepAllPaths<T> = OmitDeep<T, Paths<T>>;
expectTypeOf<OmitDeepAllPaths<{a: {b: 1}}>>().toBe<{}>();

// A number path reads the same key or index as its string form, also for a generic `Index`. A number that is not a path is ignored, like a string that is not a path. A wide `number` matches every index, like `${number}`.
type OmitDeepIndex<T, Index extends number> = OmitDeep<T, Index>;
expectTypeOf<OmitDeepIndex<[1, 2], 1>>().toBe<[1, unknown]>();
expectTypeOf<OmitDeep<{a: 1}, 5>>().toBe<{a: 1}>();
expectTypeOf<OmitDeep<[1, 2], -1 | 1.5>>().toBe<[1, 2]>();
expectTypeOf<OmitDeep<[1, 2], '0' | 1>>().toBe<[unknown, unknown]>();
expectTypeOf<OmitDeep<[1] | {a: 1; 0: 2}, 0>>().toBe<[unknown] | {a: 1}>();
expectTypeOf<OmitDeepIndex<string[], number>>().toBe<[]>();

// Autocomplete only lists paths up to `a.b.c`, so a type with very many deeper paths does not make the union of paths too complex to represent.
type Level<Value> = Record<DigitCharacter, Value>;
type ManyPaths = Level<Level<Level<Level<Level<Level<1>>>>>>;
expectTypeOf<OmitDeep<ManyPaths, '0.0.0.0.0.0'>['0']['0']['0']['0']['0']['1']>().toBe<1>();

// Parse the string value of a branded path before removing its property.
expectTypeOf<OmitDeep<{user: {name: string; age: number}}, Tagged<'user.name', 'Path'>>>().toBe<{user: {age: number}}>();

expectTypeOf<OmitDeep<{user: {name: string; age: number}}, Opaque<'user.name', 'Path'>>>().toBe<{user: {age: number}}>();
expectTypeOf<OmitDeep<{user: {name: string; age: number}}, Tagged<Tagged<'user.name', 'Path'>, 'Validated'>>>().toBe<{user: {age: number}}>();
expectTypeOf<OmitDeep<{user: {name: string; age: number}}, 'user.name' & {readonly __brand: unique symbol}>>().toBe<{user: {age: number}}>();
expectTypeOf<OmitDeep<{readonly user?: {name: string; readonly age?: number}}, Tagged<'user.name', 'Path'>>>().toBe<{readonly user?: {readonly age?: number}}>();
expectTypeOf<OmitDeep<{user: {name: string; age: number; active: boolean}}, Tagged<'user.name' | 'user.age', 'Path'>>>().toBe<{user: {active: boolean}}>();
expectTypeOf<OmitDeep<{user: {name: string; age: number; active: boolean}}, Tagged<'user.name', 'Path'> | 'user.age'>>().toBe<{user: {active: boolean}}>();
expectTypeOf<OmitDeep<{user: {name: string; age: number}} | {user: {name: number; active: true}}, Tagged<'user.name', 'Path'>>>().toBe<{user: {age: number}} | {user: {active: true}}>();
expectTypeOf<OmitDeep<readonly [1, 2], Tagged<1, 'Index'>>>().toBe<readonly [1, unknown]>();
expectTypeOf<OmitDeep<{users: [{name: string; age: number}]}, Tagged<'users.0.name', 'Path'>>>().toBe<{users: [{age: number}]}>();
expectTypeOf<OmitDeep<{readonly '1.5'?: string; other: number}, Tagged<1.5, 'Key'>>>().toBe<{other: number}>();
expectTypeOf<OmitDeep<{value: string; keep: Tagged<string, 'Value'>}, Tagged<'value', 'Path'>>>().toBe<{keep: Tagged<string, 'Value'>}>();
expectTypeOf<OmitDeep<{value: any; keep: number}, Tagged<'value', 'Path'>>>().toBe<{keep: number}>();
expectTypeOf<OmitDeep<{value: never; keep: number}, Tagged<'value', 'Path'>>>().toBe<{keep: number}>();
expectTypeOf<OmitDeep<{value: unknown; keep: number}, Tagged<'value', 'Path'>>>().toBe<{keep: number}>();
expectTypeOf<OmitDeep<{value: string}, Tagged<'missing', 'Path'>>>().toBe<{value: string}>();
expectTypeOf<OmitDeep<never, Tagged<'value', 'Path'>>>().toBe<never>();
expectTypeOf<OmitDeep<unknown, Tagged<'value', 'Path'>>>().toBe<unknown>();

// A wide autocomplete alternative does not erase a known path that must still be omitted.
expectTypeOf<OmitDeep<{a: {b: string | null; c?: number}; d?: string}, LiteralUnion<'a.b', string>>>().toBe<{a: {c?: number}; d?: string}>();
expectTypeOf<OmitDeep<{0?: string; 1: number | null}, LiteralUnion<0, number>>>().toBe<{1: number | null}>();

// Paths use the literal spelling of enum keys, including the last segment that is removed.
enum UserField {
	Profile = 'profile',
	Name = 'name',
}

type EnumKeyUser = {readonly [UserField.Profile]?: {[UserField.Name]: string; active: boolean}; id: number};
expectTypeOf<OmitDeep<EnumKeyUser, 'profile'>>().toBe<{id: number}>();
expectTypeOf<OmitDeep<EnumKeyUser, 'profile.name'>>().toBe<{readonly [UserField.Profile]?: {active: boolean}; id: number}>();
expectTypeOf<OmitDeep<{rows: Array<{[UserField.Name]: string; active: boolean}>}, `rows.${number}.name`>>().toBe<{rows: Array<{active: boolean}>}>();

// Removing an enum member preserves unrelated modifiers, values and declared key identities.
declare const omittedSymbol: unique symbol;
type EnumOmitInput = {readonly [UserField.Profile]?: {name: string} | null | undefined; readonly keep?: Tagged<string, 'Value'>; [omittedSymbol]: number};
expectTypeOf<OmitDeep<EnumOmitInput, 'profile'>>().toBe<{readonly keep?: Tagged<string, 'Value'>; [omittedSymbol]: number}>();
expectTypeOf<keyof OmitDeep<EnumKeyUser, 'profile'>>().toBe<'id'>();
expectTypeOf<Pick<OmitDeep<EnumKeyUser, 'profile.name'>, UserField.Profile>>().toBe<{readonly [UserField.Profile]?: {active: boolean}}>();
expectTypeOf<OmitDeep<EnumKeyUser, UserField.Profile>>().toBe<{id: number}>();
expectTypeOf<OmitDeep<EnumKeyUser, Tagged<'profile', 'Path'>>>().toBe<{id: number}>();
expectTypeOf<OmitDeep<EnumKeyUser, 'profile' | 'id'>>().toBe<{}>();
expectTypeOf<OmitDeep<EnumKeyUser | {error: string}, 'profile'>>().toBe<{id: number} | {error: string}>();
expectTypeOf<OmitDeep<EnumKeyUser, 'missing'>>().toBe<EnumKeyUser>();
expectTypeOf<OmitDeep<{[UserField.Name]: any; keep: unknown}, 'name'>>().toBe<{keep: unknown}>();
expectTypeOf<OmitDeep<{[UserField.Name]: never; keep: number}, 'name'>>().toBe<{keep: number}>();
expectTypeOf<OmitDeep<{[UserField.Name]: unknown; keep: number}, 'name'>>().toBe<{keep: number}>();
expectTypeOf<OmitDeep<any, 'name'>>().toBe<any>();
expectTypeOf<OmitDeep<never, 'name'>>().toBe<never>();
expectTypeOf<OmitDeep<unknown, 'name'>>().toBe<unknown>();
expectTypeOf<OmitDeep<readonly [{[UserField.Name]: string; active: true}], '0.name'>>().toBe<readonly [{active: true}]>();

enum NumericOmitKey {
	Zero = 0,
}

type IndexedEnumOmit = {[index: number]: {name: string; keep: boolean}; [NumericOmitKey.Zero]: {name: string; keep: true}};
expectTypeOf<OmitDeep<IndexedEnumOmit, number>>().toBe<Omit<IndexedEnumOmit, number>>();
expectTypeOf<OmitDeep<IndexedEnumOmit, `${number}`>>().toBe<Omit<IndexedEnumOmit, number>>();
expectTypeOf<OmitDeep<{0: string; '01': number; keep: boolean}, '0'>>().toBe<{'01': number; keep: boolean}>();
expectTypeOf<OmitDeep<{0: string; '01': number; keep: boolean}, '01'>>().toBe<{0: string; keep: boolean}>();
expectTypeOf<OmitDeep<{[key: `row-${string}`]: {name: string; keep: boolean}}, 'row-first.name'>>().toBe<{[key: `row-${string}`]: {keep: boolean}}>();

function readOmittedEnum<Extra>(value: OmitDeep<{[UserField.Name]: string; keep: {id: number; extra: Extra}}, 'name'>): number {
	return value.keep.id;
}

declare function omitEnumName<const Input>(input: Input): OmitDeep<Input, 'name'>;
const inferredEnumOmit = omitEnumName({[UserField.Name]: 'private', keep: {active: true}});
expectTypeOf(inferredEnumOmit).toBe<{readonly keep: {readonly active: true}}>();
declare function requiresEnumName(value: {[UserField.Name]: unknown}): void;
// @ts-expect-error The removed member is absent from the inferred result.
requiresEnumName(inferredEnumOmit);
// @ts-expect-error An allowed replacement still cannot overwrite the readonly field.
inferredEnumOmit.keep = {active: true};

// A numeric path uses the same property spelling as its string form, including string enums.
enum StringNumericOmitKey {
	Zero = '0',
}

expectTypeOf<OmitDeep<{[StringNumericOmitKey.Zero]: string; keep: number}, 0>>().toBe<{keep: number}>();

// Aliases in an intersection describe one runtime property and must be removed together.
expectTypeOf<OmitDeep<{[UserField.Name]: string} & {name: string; keep: number}, 'name'>>().toBe<{keep: number}>();

// Omitting numeric indices must keep a distinct noncanonical string property.
type NonCanonicalIndexedOmit = {[index: number]: string; '01': number; keep: boolean};
expectTypeOf<OmitDeep<NonCanonicalIndexedOmit, number>>().toBe<{'01': number; keep: boolean}>();
expectTypeOf<OmitDeep<NonCanonicalIndexedOmit, `${number}`>>().toBe<{'01': number; keep: boolean}>();

// Removing a declared field must keep unrelated fields covered by an index signature.
type IndexedOmitUser = {[key: string]: unknown; secret: string; readonly id: string; note?: string};
type PublicIndexedUser = OmitDeep<IndexedOmitUser, 'secret'>;
expectTypeOf<{}>().not.toBeAssignableTo<PublicIndexedUser>();
expectTypeOf<{id: number}>().not.toBeAssignableTo<PublicIndexedUser>();
declare const publicIndexedUser: PublicIndexedUser;
expectTypeOf(publicIndexedUser.id).toBe<string>();
expectTypeOf(publicIndexedUser.note).toBe<string | undefined>();
expectTypeOf<OmitDeep<{user: IndexedOmitUser}, 'user.secret'>['user']['id']>().toBe<string>();
expectTypeOf<OmitDeep<{users: IndexedOmitUser[]}, `users.${number}.secret`>['users'][number]['id']>().toBe<string>();

// Retained declarations preserve readonly and exact optional values beside dynamic keys.
// @ts-expect-error A valid string still cannot replace the retained readonly field.
publicIndexedUser.id = 'changed';
expectTypeOf<{id: string; note: undefined}>().not.toBeAssignableTo<PublicIndexedUser>();
expectTypeOf(publicIndexedUser['dynamic']).toBe<unknown>();
expectTypeOf<OmitDeep<{[key: string]: unknown; secret: string; note?: string | undefined}, 'secret'>>().toBe<{[key: string]: unknown; note?: string | undefined}>();

declare const numericIndexedRemainder: OmitDeep<{[key: number]: unknown; 0: string; readonly 1: number; 2?: boolean}, 0>;
expectTypeOf(numericIndexedRemainder[1]).toBe<number>();
expectTypeOf(numericIndexedRemainder[2]).toBe<boolean | undefined>();
// @ts-expect-error Removing another field does not make the numeric field writable.
numericIndexedRemainder[1] = 1;
declare const patternIndexedRemainder: OmitDeep<{[key: `field-${string}`]: unknown; readonly 'field-id': string; 'field-secret': number}, 'field-secret'>;
expectTypeOf(patternIndexedRemainder['field-id']).toBe<string>();
declare const symbolIndexedRemainder: OmitDeep<{[key: symbol]: unknown; readonly [omittedSymbol]: string; secret: string}, 'secret'>;
expectTypeOf(symbolIndexedRemainder[omittedSymbol]).toBe<string>();
expectTypeOf<OmitDeep<readonly IndexedOmitUser[], `${number}.secret`>[number]['id']>().toBe<string>();

function readIndexedRemainder<Extra>(value: OmitDeep<{[key: string]: unknown; secret: string; keep: {id: number; extra: Extra}}, 'secret'>): number {
	return value.keep.id;
}

declare function redactIndexedUser<const Input extends {secret: string}>(input: Input): OmitDeep<Input, 'secret'>;
const inferredIndexedUser = redactIndexedUser({secret: 'private', id: 'request'} as {secret: string; readonly id: 'request'; [key: string]: unknown});
expectTypeOf(inferredIndexedUser.id).toBe<'request'>();
expectTypeOf<OmitDeep<{[key: string]: unknown; secret: any; keep: never}, 'secret'>['keep']>().toBe<never>();
expectTypeOf<OmitDeep<{[key: string]: unknown; secret: never; keep: unknown}, 'secret'>['keep']>().toBe<unknown>();
expectTypeOf<OmitDeep<{[key: string]: unknown; secret: unknown; keep: any}, 'secret'>['keep']>().toBe<any>();

// Each indexed union member retains the discriminant and payload that belong together.
type IndexedPrivateUnion =
	| {[key: string]: unknown; kind: 'count'; secret: string; count: number}
	| {[key: string]: unknown; kind: 'label'; secret: string; label: string};
function readPublicIndexedPayload(value: OmitDeep<IndexedPrivateUnion, 'secret'>): string | number {
	return value.kind === 'count' ? value.count : value.label;
}

// A nonexistent numeric property must not remove the entire numeric index signature.
expectTypeOf<OmitDeep<Record<number, {name: string}>, '00'>>().toBe<Record<number, {name: string}>>();

// A nonexistent nested numeric spelling must not transform every signature value.
expectTypeOf<OmitDeep<Record<number, {name: string; id: number}>, '00.name'>>().toBe<Record<number, {name: string; id: number}>>();

// Resolve each signature separately: a string key can exist without being a numeric key.
type OverlappingOmitSignatures = {
	[key: string]: {name: string; id: number};
	[key: number]: {name: string; id: number; numeric: true};
};
type NoncanonicalSignatureOmit = OmitDeep<OverlappingOmitSignatures, '00.name'>;
expectTypeOf<NoncanonicalSignatureOmit[string]>().toBe<{id: number}>();
expectTypeOf<NoncanonicalSignatureOmit[number]>().toBe<{name: string; id: number; numeric: true}>();
expectTypeOf<OmitDeep<OverlappingOmitSignatures, '0.name'>[number]>().toBe<{id: number; numeric: true}>();
expectTypeOf<OmitDeep<Record<number, {name: string}>, '0x10.name'>>().toBe<Record<number, {name: string}>>();
expectTypeOf<OmitDeep<Record<number, {name: string}> & {'00': {name: string; own: true}}, '00.name'>['00']>().toBe<{own: true}>();
expectTypeOf<OmitDeep<Record<`row-${string}`, {name: string; id: number}>, 'row-first.name'>[string & `row-${string}`]>().toBe<{id: number}>();

// Omitting a missing descendant does not invent required array positions.
const missingArrayDescendant: OmitDeep<Array<{id: string}>, '1.missing'> = [];
expectTypeOf(missingArrayDescendant).toBe<Array<{id: string}>>();
const missingReadonlyArrayDescendant: OmitDeep<ReadonlyArray<{id: string}>, '1.missing'> = [];
expectTypeOf(missingReadonlyArrayDescendant).toBe<ReadonlyArray<{id: string}>>();
expectTypeOf<OmitDeep<{rows: Array<{id: string}>}, 'rows.2.missing'>>().toBe<{rows: Array<{id: string}>}>();

// Missing descendants preserve named objects and do not materialize later positions after a valid omission.
type NamedOmitRow = {
	id: string;
	details: {active: boolean};
};
expectTypeOf<OmitDeep<NamedOmitRow[], '1.details.missing'>>().toBe<NamedOmitRow[]>();
expectTypeOf<OmitDeep<NamedOmitRow[], '0.details.active' | '1.details.missing'>>().toBe<[{id: string; details: {}}, ...NamedOmitRow[]]>();
expectTypeOf<OmitDeep<readonly NamedOmitRow[], '1.missing'>>().toBe<readonly NamedOmitRow[]>();

function readOmittedConstrainedRow<Row extends {name: string; id: number}>(value: OmitDeep<Row[], '1.name'>): number {
	return value[1].id;
}

declare function omitMissingArrayPath<const Input>(input: Input): OmitDeep<Input, 'rows.1.missing'>;
const inferredMissingArrayPath = omitMissingArrayPath({rows: [] as NamedOmitRow[], mode: 'edit'});
expectTypeOf(inferredMissingArrayPath).toBe<{readonly rows: NamedOmitRow[]; readonly mode: 'edit'}>();
const emptyMissingArrayPath: typeof inferredMissingArrayPath = {rows: [], mode: 'edit'};
// @ts-expect-error Retaining the array does not widen its required row fields.
emptyMissingArrayPath.rows.push({details: {active: true}});

declare const omittedExistingArrayField: OmitDeep<Array<{id: number; secret: string}>, '0.secret'>;
// @ts-expect-error An existing selected field is still removed.
expectTypeOf(omittedExistingArrayField[0].secret).toBe<string>();

// A missing descendant selected across every array element preserves its nullable values.
type NullableWideOmitRows = ReadonlyArray<{id: string} | null>;
const nullableWideOmitRows: OmitDeep<NullableWideOmitRows, `${number}.missing`> = [null];
expectTypeOf(nullableWideOmitRows).toBe<NullableWideOmitRows>();
const undefinedWideOmitRows: OmitDeep<Array<{id: string} | undefined>, `${number}.missing`> = [undefined];
expectTypeOf(undefinedWideOmitRows).toBe<Array<{id: string} | undefined>>();
expectTypeOf<OmitDeep<{rows: NullableWideOmitRows}, `rows.${number}.missing`>>().toBe<{rows: NullableWideOmitRows}>();

// Deeper missing descendants preserve nullable elements and inferred tuple positions too.
type DetailedWideOmitRows = ReadonlyArray<{details: {active: boolean}} | null>;
expectTypeOf<OmitDeep<DetailedWideOmitRows, `${number}.details.missing`>>().toBe<DetailedWideOmitRows>();

function _constructNullableMissing<Value>(value: Value): OmitDeep<Array<{id: Value} | null>, `${number}.missing`> {
	return [null, {id: value}];
}

function _readNullableMissing<Value>(value: OmitDeep<Array<{id: Value} | null>, `${number}.missing`>): Value | undefined {
	return value[0]?.id;
}

declare function omitWideMissing<const Input>(input: Input): OmitDeep<Input, `rows.${number}.details.missing`>;
const inferredWideMissing = omitWideMissing({rows: [{id: 'row', details: {active: true}}, null]});
expectTypeOf(inferredWideMissing.rows).toBe<readonly [{readonly id: 'row'; readonly details: {readonly active: true}}, null]>();
// @ts-expect-error A no-op omission retains readonly even when the assigned value is valid.
inferredWideMissing.rows[0].details.active = true;

declare const omittedWideExistingField: OmitDeep<Array<{id: string; secret: number} | null>, `${number}.secret`>;
expectTypeOf(omittedWideExistingField[0]?.id).toBe<string | undefined>();
// @ts-expect-error An existing field is still omitted across every element.
expectTypeOf(omittedWideExistingField[0]?.secret).toBe<number | undefined>();
