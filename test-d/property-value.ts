import {expectTypeOf} from 'nz';
import type {
	AllUnionFields,
	ExactKey,
	Except,
	Get,
	KeysOfUnion,
	LiteralUnion,
	Merge,
	PartialDeep,
	PropertyValue,
	ReadonlyDeep,
	SetOptional,
	SetRequired,
	SharedUnionFields,
	Simplify,
	Tagged,
	ValueOf,
	Writable,
} from '../index.d.ts';

declare const symbolKey: unique symbol;
declare const otherSymbolKey: unique symbol;

type ObjectT = {
	string: string;
	0: number;
	'1': boolean;
};

// Plain keys, and numeric keys in both their number and string form.
expectTypeOf<PropertyValue<ObjectT, 'string'>>().toBe<string>();
expectTypeOf<PropertyValue<ObjectT, 0>>().toBe<number>();
expectTypeOf<PropertyValue<ObjectT, '0'>>().toBe<number>();
expectTypeOf<PropertyValue<ObjectT, 1>>().toBe<boolean>();
expectTypeOf<PropertyValue<ObjectT, '1'>>().toBe<boolean>();

// A missing key is `never`.
expectTypeOf<PropertyValue<ObjectT, 'missing'>>().toBe<never>();
expectTypeOf<PropertyValue<ObjectT, 2>>().toBe<never>();
expectTypeOf<PropertyValue<ObjectT, '2'>>().toBe<never>();
expectTypeOf<PropertyValue<ObjectT, typeof symbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<{}, 'toString' | 'constructor' | '__proto__'>>().toBe<never>();
expectTypeOf<PropertyValue<object, 'name'>>().toBe<never>();

// A key that is wider than the declared keys does not match.
expectTypeOf<PropertyValue<ObjectT, string>>().toBe<never>();
expectTypeOf<PropertyValue<ObjectT, number>>().toBe<never>();
expectTypeOf<PropertyValue<ObjectT, `${number}`>>().toBe<never>();
expectTypeOf<PropertyValue<ObjectT, PropertyKey>>().toBe<never>();

// Key unions are read separately, and the missing keys are dropped.
expectTypeOf<PropertyValue<ObjectT, 'string' | '0'>>().toBe<string | number>();
expectTypeOf<PropertyValue<ObjectT, 'string' | 'missing'>>().toBe<string>();
expectTypeOf<PropertyValue<ObjectT, 0 | '0' | 1 | '1'>>().toBe<number | boolean>();
expectTypeOf<PropertyValue<ObjectT, keyof ObjectT>>().toBe<ObjectT[keyof ObjectT]>();
expectTypeOf<PropertyValue<ObjectT, 'missing' | 2>>().toBe<never>();
expectTypeOf<PropertyValue<ObjectT, never>>().toBe<never>();

// Modifiers do not affect matching. An optional property includes `undefined`.
type Properties = {readonly name?: string; readonly id: number; missingValue: never; dynamic: any; unspecified: unknown; '': undefined; nullable: string | null};
expectTypeOf<PropertyValue<Properties, 'name'>>().toBe<string | undefined>();
expectTypeOf<PropertyValue<Properties, 'id'>>().toBe<number>();
expectTypeOf<PropertyValue<Properties, 'missingValue'>>().toBe<never>();
expectTypeOf<PropertyValue<Properties, 'dynamic'>>().toBe<any>();
expectTypeOf<PropertyValue<Properties, 'unspecified'>>().toBe<unknown>();
expectTypeOf<PropertyValue<Properties, ''>>().toBe<undefined>();
expectTypeOf<PropertyValue<Properties, 'nullable'>>().toBe<string | null>();
expectTypeOf<PropertyValue<{readonly 2?: string}, '2'>>().toBe<string | undefined>();
expectTypeOf<PropertyValue<{readonly '2'?: string}, 2>>().toBe<string | undefined>();

// Methods, getters, and nested objects are returned as they are.
expectTypeOf<PropertyValue<{run(): void}, 'run'>>().toBe<() => void>();
expectTypeOf<PropertyValue<{get value(): string}, 'value'>>().toBe<string>();
expectTypeOf<PropertyValue<{nested: {deep: 1}}, 'nested'>>().toBe<{deep: 1}>();
// A key path is not a key.
expectTypeOf<PropertyValue<{nested: {deep: 1}}, 'nested.deep'>>().toBe<never>();
expectTypeOf<PropertyValue<{'nested.deep': 2; nested: {deep: 1}}, 'nested.deep'>>().toBe<2>();

// Only the canonical spelling of a number names a numeric key.
type Canonical = {1: 'one'; 100: 'hundred'; 31: 'thirty-one'; 1.5: 'float'; [-1]: 'negative'; 0: 'zero'};
expectTypeOf<PropertyValue<Canonical, '1'>>().toBe<'one'>();
expectTypeOf<PropertyValue<Canonical, '1.5'>>().toBe<'float'>();
expectTypeOf<PropertyValue<Canonical, '-1'>>().toBe<'negative'>();
expectTypeOf<PropertyValue<Canonical, -1>>().toBe<'negative'>();
expectTypeOf<PropertyValue<Canonical, 1e2>>().toBe<'hundred'>();
expectTypeOf<PropertyValue<Canonical, 0x1F>>().toBe<'thirty-one'>();
expectTypeOf<PropertyValue<Canonical, -0>>().toBe<'zero'>();
expectTypeOf<PropertyValue<Canonical, '01' | '1.0' | '1.50' | '+1' | ' 1' | '1 ' | '1e2' | '0x1F' | '-0' | '1_0'>>().toBe<never>();

// A `number` index signature also only covers canonical numeric strings.
type NumberRecord = Record<number, 'item'>;
expectTypeOf<PropertyValue<NumberRecord, 0>>().toBe<'item'>();
expectTypeOf<PropertyValue<NumberRecord, '0'>>().toBe<'item'>();
expectTypeOf<PropertyValue<NumberRecord, '16' | '-2' | '1.5'>>().toBe<'item'>();
expectTypeOf<PropertyValue<NumberRecord, number>>().toBe<'item'>();
expectTypeOf<PropertyValue<NumberRecord, `${number}`>>().toBe<'item'>();
expectTypeOf<PropertyValue<NumberRecord, '00'>>().toBe<never>();
expectTypeOf<PropertyValue<NumberRecord, '0x10'>>().toBe<never>();
expectTypeOf<PropertyValue<NumberRecord, '1e3' | '-0' | '+1' | ' 1' | '1.50' | '1e21'>>().toBe<never>();
expectTypeOf<PropertyValue<NumberRecord, '' | 'Infinity' | 'NaN' | 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<NumberRecord, string>>().toBe<never>();
expectTypeOf<PropertyValue<NumberRecord, typeof symbolKey>>().toBe<never>();
// A declared key with a non-canonical spelling is still read by that spelling.
expectTypeOf<PropertyValue<NumberRecord & {'00': 'padded'}, '00'>>().toBe<'padded'>();

// Other index signatures.
expectTypeOf<PropertyValue<Record<string, 'item'>, 'name'>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<string, 'item'>, '00'>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<string, 'item'>, 0>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<string, 'item'>, string>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<string, 'item'>, typeof symbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<Record<symbol, 'item'>, typeof symbolKey>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<symbol, 'item'>, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<Record<PropertyKey, 'item'>, 'name' | 0 | typeof symbolKey>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<`on${string}`, 'handler'>, 'onClick'>>().toBe<'handler'>();
expectTypeOf<PropertyValue<Record<`on${string}`, 'handler'>, 'click'>>().toBe<never>();
expectTypeOf<PropertyValue<Record<`data-${number}`, 'data'>, 'data-1'>>().toBe<'data'>();
// A declared key is more precise than the index signature that also covers it.
expectTypeOf<PropertyValue<{[key: string]: unknown; name: 'declared'}, 'name'>>().toBe<'declared'>();
expectTypeOf<PropertyValue<{[key: string]: unknown; name: 'declared'}, 'other'>>().toBe<unknown>();
expectTypeOf<PropertyValue<{[key: number]: string; 0: 'first'}, '0'>>().toBe<'first'>();
expectTypeOf<PropertyValue<{[key: number]: string; 0: 'first'}, '1'>>().toBe<string>();

// Symbol keys.
expectTypeOf<PropertyValue<{[symbolKey]: 'symbol'}, typeof symbolKey>>().toBe<'symbol'>();
expectTypeOf<PropertyValue<{[symbolKey]: 'symbol'}, typeof otherSymbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<{[symbolKey]: 'symbol'}, symbol>>().toBe<never>();
expectTypeOf<PropertyValue<{[symbolKey]: 'symbol'; name: 'string'}, typeof symbolKey | 'name'>>().toBe<'symbol' | 'string'>();
expectTypeOf<PropertyValue<string[], typeof Symbol.iterator>>().toBe<() => ArrayIterator<string>>();

// Enum keys. A plain string does not select a string enum key, but a number selects a numeric enum key.
enum Color {
	Red = 'red',
	Green = 1,
}
type Colors = {[Color.Red]: 'r'; [Color.Green]: 'g'};
expectTypeOf<PropertyValue<Colors, Color.Red>>().toBe<'r'>();
expectTypeOf<PropertyValue<Colors, Color.Green>>().toBe<'g'>();
expectTypeOf<PropertyValue<Colors, Color>>().toBe<'r' | 'g'>();
expectTypeOf<PropertyValue<Colors, 1>>().toBe<'g'>();
expectTypeOf<PropertyValue<Colors, '1'>>().toBe<'g'>();
expectTypeOf<PropertyValue<Colors, 'red'>>().toBe<never>();
// An enum member selects the key with its runtime value.
expectTypeOf<PropertyValue<{red: 'r'; 1: 'g'}, Color.Red>>().toBe<'r'>();
expectTypeOf<PropertyValue<{red: 'r'; 1: 'g'}, Color.Green>>().toBe<'g'>();
expectTypeOf<PropertyValue<{red: 'r'; '1': 'g'}, Color.Green>>().toBe<'g'>();

// A tagged key matches the index signature it is assignable to.
expectTypeOf<PropertyValue<NumberRecord, Tagged<1, 'Index'>>>().toBe<'item'>();

// Arrays.
expectTypeOf<PropertyValue<string[], 0>>().toBe<string>();
expectTypeOf<PropertyValue<string[], '0'>>().toBe<string>();
expectTypeOf<PropertyValue<string[], number>>().toBe<string>();
expectTypeOf<PropertyValue<readonly string[], 1>>().toBe<string>();
expectTypeOf<PropertyValue<string[], 'length'>>().toBe<number>();
expectTypeOf<PropertyValue<string[], '01' | '0x1' | '1e2' | 'missing'>>().toBe<never>();

// Tuples.
type Tuple = [first: 'a', second: 'b', third?: 'c'];
expectTypeOf<PropertyValue<Tuple, 0>>().toBe<'a'>();
expectTypeOf<PropertyValue<Tuple, '1'>>().toBe<'b'>();
expectTypeOf<PropertyValue<Tuple, 2>>().toBe<'c' | undefined>();
expectTypeOf<PropertyValue<Tuple, '2'>>().toBe<'c' | undefined>();
expectTypeOf<PropertyValue<Tuple, 0 | '1'>>().toBe<'a' | 'b'>();
expectTypeOf<PropertyValue<Tuple, number>>().toBe<'a' | 'b' | 'c' | undefined>();
expectTypeOf<PropertyValue<Tuple, 'length'>>().toBe<2 | 3>();
expectTypeOf<PropertyValue<Tuple, '00' | '01'>>().toBe<never>();
expectTypeOf<PropertyValue<readonly ['a', 'b'], 1>>().toBe<'b'>();
expectTypeOf<PropertyValue<[], 'length'>>().toBe<0>();
expectTypeOf<PropertyValue<['a', ...number[]], 0>>().toBe<'a'>();
expectTypeOf<PropertyValue<['a', ...number[]], 5>>().toBe<number>();
expectTypeOf<PropertyValue<['a', ...number[]], '5'>>().toBe<number>();
expectTypeOf<PropertyValue<[...number[], 'z'], 0>>().toBe<number | 'z'>();
// Tuple indices are not bounds-checked.
expectTypeOf<PropertyValue<['a', 'b'], 5>>().toBe<undefined>();
expectTypeOf<PropertyValue<['a', 'b'], '5'>>().toBe<undefined>();

// Primitives are read through their wrapper types.
expectTypeOf<PropertyValue<string, 'length'>>().toBe<number>();
expectTypeOf<PropertyValue<string, 0>>().toBe<string>();
expectTypeOf<PropertyValue<string, '0'>>().toBe<string>();
expectTypeOf<PropertyValue<'literal', 'length'>>().toBe<number>();
expectTypeOf<PropertyValue<number, 'toFixed'>>().toBe<(fractionDigits?: number) => string>();
expectTypeOf<PropertyValue<bigint, 'toString'>>().toBe<(radix?: number) => string>();
expectTypeOf<PropertyValue<symbol, 'description'>>().toBe<string | undefined>();
expectTypeOf<PropertyValue<boolean, 'valueOf'>>().toBe<() => boolean>();
expectTypeOf<PropertyValue<string, 'missing'>>().toBe<never>();
expectTypeOf<PropertyValue<number, 'length'>>().toBe<never>();
expectTypeOf<PropertyValue<Tagged<string, 'Id'>, 'length'>>().toBe<number>();

// Functions, classes, and built-in objects.
declare class User {
	static count: number;
	private readonly secret: number; // eslint-disable-line @typescript-eslint/no-unused-private-class-members
	readonly name: 'user';
	greet(): string;
}
expectTypeOf<PropertyValue<User, 'name'>>().toBe<'user'>();
expectTypeOf<PropertyValue<User, 'greet'>>().toBe<() => string>();
// A private member is not a key.
expectTypeOf<PropertyValue<User, 'secret'>>().toBe<never>();
expectTypeOf<PropertyValue<User, 'count'>>().toBe<never>();
expectTypeOf<PropertyValue<typeof User, 'count'>>().toBe<number>();
expectTypeOf<PropertyValue<typeof User, 'prototype'>>().toBe<User>();
// A function type does not have the members of `Function` as keys.
expectTypeOf<PropertyValue<() => void, 'length'>>().toBe<never>();
expectTypeOf<PropertyValue<Function, 'length'>>().toBe<number>();
expectTypeOf<PropertyValue<{(): void; description: string}, 'description'>>().toBe<string>();
expectTypeOf<PropertyValue<Map<string, number>, 'size'>>().toBe<number>();
expectTypeOf<PropertyValue<Map<string, number>, 'key'>>().toBe<never>();
expectTypeOf<PropertyValue<Date, 'getTime'>>().toBe<() => number>();
expectTypeOf<PropertyValue<Error, 'message'>>().toBe<string>();
expectTypeOf<PropertyValue<Error, 'code'>>().toBe<never>();

// Interfaces, including merged and extended ones.
interface Base { // eslint-disable-line @typescript-eslint/consistent-type-definitions
	id: number;
}
interface Derived extends Base { // eslint-disable-line @typescript-eslint/consistent-type-definitions
	0: 'zero';
}
expectTypeOf<PropertyValue<Derived, 'id'>>().toBe<number>();
expectTypeOf<PropertyValue<Derived, '0'>>().toBe<'zero'>();
expectTypeOf<PropertyValue<Derived, 'missing'>>().toBe<never>();

interface Merged { // eslint-disable-line @typescript-eslint/consistent-type-definitions
	id: number;
}
interface Merged { // eslint-disable-line @typescript-eslint/consistent-type-definitions
	name: 'merged';
}
expectTypeOf<PropertyValue<Merged, 'id'>>().toBe<number>();
expectTypeOf<PropertyValue<Merged, 'name'>>().toBe<'merged'>();

// An intersection has the keys of all its parts, and a shared key has the intersection of the values.
expectTypeOf<PropertyValue<{a: 1} & {b: 2}, 'a' | 'b'>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<{a: string} & {a: 'x'}, 'a'>>().toBe<'x'>();
// The `0` and `'0'` keys name the same property.
expectTypeOf<PropertyValue<{0: string} & {'0': 'x'}, 0>>().toBe<'x'>();
expectTypeOf<PropertyValue<{0: string} & {'0': 'x'}, '0'>>().toBe<'x'>();

// For a union of base types, the key must exist in every member with the same spelling.
expectTypeOf<PropertyValue<{a: 1} | {a: 2; b: 3}, 'a'>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<{a: 1} | {a: 2; b: 3}, 'b'>>().toBe<never>();
expectTypeOf<PropertyValue<{a: 1} | {b: 3}, 'a'>>().toBe<never>();
expectTypeOf<PropertyValue<{a: 1} | undefined, 'a'>>().toBe<never>();
expectTypeOf<PropertyValue<{a: 1} | null, 'a'>>().toBe<never>();
expectTypeOf<PropertyValue<{0: 'n'} | {0: 'm'}, '0'>>().toBe<'n' | 'm'>();
expectTypeOf<PropertyValue<string[] | [1, 2], 0>>().toBe<string | 1>();
expectTypeOf<PropertyValue<string | string[], 'length'>>().toBe<number>();
// A key that the members spell differently does not match, because `keyof` a union only has the keys with the same spelling.
expectTypeOf<PropertyValue<{0: 'n'} | {'0': 's'}, 0>>().toBe<never>();

// `any`, `never`, `unknown`, and nullish base types.
expectTypeOf<PropertyValue<any, 'name'>>().toBe<any>();
expectTypeOf<PropertyValue<any, 0 | typeof symbolKey>>().toBe<any>();
expectTypeOf<PropertyValue<never, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<unknown, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<null, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<undefined, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<void, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<any, never>>().toBe<never>();

// An `any` key follows TypeScript's indexed-access behavior.
expectTypeOf<PropertyValue<ObjectT, any>>().toBe<any>();

// The key must be a property key.
// @ts-expect-error Booleans are not property keys.
type InvalidBooleanKey = PropertyValue<{true: 1}, true>;
// @ts-expect-error Bigints are not property keys.
type InvalidBigintKey = PropertyValue<{1: 1}, 1n>;
// @ts-expect-error Unknown is not a property key.
type InvalidUnknownKey = PropertyValue<ObjectT, unknown>;
// @ts-expect-error The key is required.
type MissingKey = PropertyValue<ObjectT>;

// It agrees with `ExactKey` for object types, and a missing key is `never` on both sides.
type ViaExactKey<ObjectType extends object, Key extends PropertyKey> =
	Key extends unknown
		? [ExactKey<ObjectType, Key>] extends [never]
			? never
			: ObjectType[ExactKey<ObjectType, Key>]
		: never;
type AgreementKeys = 'string' | 0 | '0' | 1 | '1' | '00' | 'missing' | typeof symbolKey;
expectTypeOf<PropertyValue<ObjectT, AgreementKeys>>().toBe<ViaExactKey<ObjectT, AgreementKeys>>();
expectTypeOf<PropertyValue<NumberRecord, AgreementKeys>>().toBe<ViaExactKey<NumberRecord, AgreementKeys>>();
expectTypeOf<PropertyValue<Tuple, AgreementKeys | 2 | 5>>().toBe<ViaExactKey<Tuple, AgreementKeys | 2 | 5>>();

// It works in a generic type without a constraint on the base type.
type ErrorCode<ErrorType> = PropertyValue<ErrorType, 'code'>;
expectTypeOf<ErrorCode<{code: 'ENOENT'; message: string}>>().toBe<'ENOENT'>();
expectTypeOf<ErrorCode<Error>>().toBe<never>();
expectTypeOf<ErrorCode<string>>().toBe<never>();
expectTypeOf<ErrorCode<unknown>>().toBe<never>();

type ValuesAt<BaseType, Keys extends readonly PropertyKey[]> = {[Index in keyof Keys]: PropertyValue<BaseType, Keys[Index]>};
expectTypeOf<ValuesAt<ObjectT, ['string', '0', 1, 'missing']>>().toBe<[string, number, boolean, never]>();

// A mapped type can read the matching property of another type, whatever its keys are.
type Overlay<Target, Source> = {[Key in keyof Target]: [PropertyValue<Source, Key>] extends [never] ? Target[Key] : PropertyValue<Source, Key>};
expectTypeOf<Overlay<{a: string; 0: string; b: string}, {a: 1; '0': 2}>>().toBe<{a: 1; 0: 2; b: string}>();

// A generic value is assignable when the base type is only generic in its values.
function _readLiteralIndex<Value>(value: {0: Value}): PropertyValue<{0: Value}, '0'> {
	return value[0];
}

// The examples in the documentation.
type StatusMessages = {200: 'OK'; '404': 'Not found'};
expectTypeOf<PropertyValue<StatusMessages, '200'>>().toBe<'OK'>();
expectTypeOf<PropertyValue<StatusMessages, 404 | 500>>().toBe<'Not found'>();

// Optional properties preserve the difference between an absent value and a required `never` value.
expectTypeOf<PropertyValue<{value?: never}, 'value'>>().toBe<undefined>();
expectTypeOf<PropertyValue<{value?: undefined}, 'value'>>().toBe<undefined>();
expectTypeOf<PropertyValue<{value?: null}, 'value'>>().toBe<null | undefined>();
expectTypeOf<PropertyValue<{value?: unknown}, 'value'>>().toBe<unknown>();
expectTypeOf<PropertyValue<{value?: any}, 'value'>>().toBe<any>();
expectTypeOf<PropertyValue<{readonly 0?: never}, '0'>>().toBe<undefined>();
expectTypeOf<PropertyValue<{readonly '0'?: never}, 0>>().toBe<undefined>();
expectTypeOf<PropertyValue<{readonly [symbolKey]?: 'symbol'}, typeof symbolKey>>().toBe<'symbol' | undefined>();
expectTypeOf<PropertyValue<{[symbolKey]?: never}, typeof symbolKey>>().toBe<undefined>();

// Values keep their own structure and modifiers rather than being flattened or made writable.
type RecursiveNode = {readonly value: string; next?: RecursiveNode};
type GenericIdentity = <Value>(value: Value) => Value;
type Overloaded = {(value: string): number; (value: number): string};
expectTypeOf<PropertyValue<{node: RecursiveNode}, 'node'>>().toBe<RecursiveNode>();
expectTypeOf<PropertyValue<{node?: RecursiveNode}, 'node'>>().toBe<RecursiveNode | undefined>();
expectTypeOf<PropertyValue<{identity: GenericIdentity}, 'identity'>>().toBe<GenericIdentity>();
expectTypeOf<PropertyValue<{convert: Overloaded}, 'convert'>>().toBe<Overloaded>();
expectTypeOf<PropertyValue<{callback(this: {id: number}, value: string): boolean}, 'callback'>>().toBe<(this: {id: number}, value: string) => boolean>();
expectTypeOf<PropertyValue<{items: readonly [first: string, second?: number]}, 'items'>>().toBe<readonly [first: string, second?: number]>();
expectTypeOf<PropertyValue<{data: ReadonlyMap<string, readonly number[]>}, 'data'>>().toBe<ReadonlyMap<string, readonly number[]>>();
expectTypeOf<PropertyValue<{result: Promise<{id: number}>}, 'result'>>().toBe<Promise<{id: number}>>();
expectTypeOf<PropertyValue<{id: Tagged<string, 'Id'>}, 'id'>>().toBe<Tagged<string, 'Id'>>();
expectTypeOf<PropertyValue<{create: new (name: string) => User}, 'create'>>().toBe<new (name: string) => User>();

// Arbitrary property names are read literally, including names resembling paths or object internals.
type LiteralNames = {'': 'empty'; 'a.b': 'dot'; 'a[0]': 'bracket'; 'a/b': 'slash'; 'a b': 'space'; '日本語': 'unicode'; __proto__: 'prototype'; constructor: 'constructor'; toString: 'method-name'};
expectTypeOf<PropertyValue<LiteralNames, ''>>().toBe<'empty'>();
expectTypeOf<PropertyValue<LiteralNames, 'a.b'>>().toBe<'dot'>();
expectTypeOf<PropertyValue<LiteralNames, 'a[0]'>>().toBe<'bracket'>();
expectTypeOf<PropertyValue<LiteralNames, 'a/b'>>().toBe<'slash'>();
expectTypeOf<PropertyValue<LiteralNames, 'a b'>>().toBe<'space'>();
expectTypeOf<PropertyValue<LiteralNames, '日本語'>>().toBe<'unicode'>();
expectTypeOf<PropertyValue<LiteralNames, '__proto__'>>().toBe<'prototype'>();
expectTypeOf<PropertyValue<LiteralNames, 'constructor'>>().toBe<'constructor'>();
expectTypeOf<PropertyValue<LiteralNames, 'toString'>>().toBe<'method-name'>();
expectTypeOf<PropertyValue<LiteralNames, 'a' | 'b' | '0'>>().toBe<never>();

// String, number, and symbol index domains retain their respective values.
type MixedIndexes = {[key: string]: 'string' | 'number'; [key: number]: 'number'; [key: symbol]: 'symbol'};
expectTypeOf<PropertyValue<MixedIndexes, 'name'>>().toBe<'string' | 'number'>();
expectTypeOf<PropertyValue<MixedIndexes, string>>().toBe<'string' | 'number'>();
expectTypeOf<PropertyValue<MixedIndexes, 0>>().toBe<'number'>();
expectTypeOf<PropertyValue<MixedIndexes, '0'>>().toBe<'number'>();
expectTypeOf<PropertyValue<MixedIndexes, number>>().toBe<'number'>();
expectTypeOf<PropertyValue<MixedIndexes, symbol>>().toBe<'symbol'>();
expectTypeOf<PropertyValue<MixedIndexes, typeof symbolKey>>().toBe<'symbol'>();
expectTypeOf<PropertyValue<MixedIndexes, PropertyKey>>().toBe<'string' | 'number' | 'symbol'>();
expectTypeOf<PropertyValue<{[key: symbol]: unknown; [symbolKey]: 'declared'}, typeof symbolKey>>().toBe<'declared'>();
expectTypeOf<PropertyValue<{[key: symbol]: unknown; [symbolKey]: 'declared'}, typeof otherSymbolKey>>().toBe<unknown>();
expectTypeOf<PropertyValue<Partial<Record<number, 'item'>>, '0'>>().toBe<'item' | undefined>();
expectTypeOf<PropertyValue<Partial<Record<symbol, 'item'>>, typeof symbolKey>>().toBe<'item' | undefined>();

// Template index signatures accept only keys assignable to their pattern.
type EventHandlers = Record<`on${string}`, () => void> & {onReady: () => 'ready'};
expectTypeOf<PropertyValue<EventHandlers, 'onReady'>>().toBe<() => 'ready'>();
expectTypeOf<PropertyValue<EventHandlers, 'onOther'>>().toBe<() => void>();
expectTypeOf<PropertyValue<EventHandlers, `on${string}`>>().toBe<() => void>();
expectTypeOf<PropertyValue<EventHandlers, string>>().toBe<never>();
expectTypeOf<PropertyValue<EventHandlers, 'onReady' | 'missing'>>().toBe<() => 'ready'>();
expectTypeOf<PropertyValue<Record<`${number}`, 'numeric'>, 0>>().toBe<'numeric'>();
expectTypeOf<PropertyValue<Record<`${number}`, 'numeric'>, number>>().toBe<'numeric'>();
expectTypeOf<PropertyValue<Record<`${number}`, 'numeric'>, `${number}`>>().toBe<'numeric'>();
expectTypeOf<PropertyValue<Record<`${number}`, 'numeric'>, string>>().toBe<never>();
expectTypeOf<PropertyValue<Record<`data-${string}`, 1> & Record<`on${string}`, 2>, 'data-id' | 'onClick'>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<Record<`data-${string}`, 1> & Record<`on${string}`, 2>, 'other'>>().toBe<never>();
expectTypeOf<PropertyValue<Record<`data-${string}`, 1>, `data-${number}`>>().toBe<1>();

// Common union properties include optional values, but member-exclusive properties remain inaccessible.
type UnionProperties = {readonly shared?: 'first'; first: 1} | {shared: 'second'; second: 2};
expectTypeOf<PropertyValue<UnionProperties, 'shared'>>().toBe<'first' | 'second' | undefined>();
expectTypeOf<PropertyValue<UnionProperties, 'shared' | 'first' | 'second'>>().toBe<'first' | 'second' | undefined>();
expectTypeOf<PropertyValue<UnionProperties, 'first' | 'second'>>().toBe<never>();
expectTypeOf<PropertyValue<{value: never} | {value: 'present'}, 'value'>>().toBe<'present'>();
expectTypeOf<PropertyValue<{value?: never} | {value: 'present'}, 'value'>>().toBe<'present' | undefined>();
expectTypeOf<PropertyValue<{[symbolKey]: 1} | {readonly [symbolKey]?: 2}, typeof symbolKey>>().toBe<1 | 2 | undefined>();
expectTypeOf<PropertyValue<{[symbolKey]: 1} | {[otherSymbolKey]: 2}, typeof symbolKey | typeof otherSymbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<{0: 'numeric'} | {'0': 'string'}, '0'>>().toBe<never>();
expectTypeOf<PropertyValue<{0: 'numeric'} | {'0': 'string'}, 0 | '0'>>().toBe<never>();
expectTypeOf<PropertyValue<{'0': 1} | {'0'?: 2}, 0>>().toBe<1 | 2 | undefined>();
expectTypeOf<PropertyValue<{0: 1} | {0?: 2}, '0'>>().toBe<1 | 2 | undefined>();
expectTypeOf<PropertyValue<Record<string, number> | {value: string}, 'value'>>().toBe<string | number>();
expectTypeOf<PropertyValue<Record<string, number> | {value: string}, 'other'>>().toBe<never>();
expectTypeOf<PropertyValue<Record<number, 'indexed'> | {0: 'declared'}, '0'>>().toBe<'indexed' | 'declared'>();
expectTypeOf<PropertyValue<Record<number, 'indexed'> | {0: 'declared'}, 0>>().toBe<'indexed' | 'declared'>();
expectTypeOf<PropertyValue<Record<number, 'indexed'> | {0: 'declared'}, number>>().toBe<never>();
expectTypeOf<PropertyValue<Record<number, 'indexed'> | {0: 'declared'}, '1'>>().toBe<never>();
expectTypeOf<PropertyValue<Record<number, 'first'> | Record<number, 'second'>, number>>().toBe<'first' | 'second'>();
expectTypeOf<PropertyValue<Record<number, 'first'> | Record<number, 'second'>, `${number}`>>().toBe<'first' | 'second'>();
expectTypeOf<PropertyValue<Record<symbol, 'indexed'> | {[symbolKey]: 'declared'}, typeof symbolKey>>().toBe<'indexed' | 'declared'>();
expectTypeOf<PropertyValue<Record<symbol, 'indexed'> | {[symbolKey]: 'declared'}, symbol>>().toBe<never>();
expectTypeOf<PropertyValue<Record<symbol, 'indexed'> | {[symbolKey]: 'declared'}, typeof symbolKey | typeof otherSymbolKey>>().toBe<'indexed' | 'declared'>();
expectTypeOf<PropertyValue<Record<symbol, 'indexed'> | {[symbolKey]: 'declared'}, typeof otherSymbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<Record<symbol, 'first'> | Record<symbol, 'second'>, symbol>>().toBe<'first' | 'second'>();
expectTypeOf<PropertyValue<Record<symbol, 'indexed'> | {[symbolKey]?: 'declared'}, typeof symbolKey>>().toBe<'indexed' | 'declared' | undefined>();
expectTypeOf<PropertyValue<{value: 1} | {}, 'value'>>().toBe<never>();
expectTypeOf<PropertyValue<unknown | {value: 1}, 'value'>>().toBe<never>();
expectTypeOf<PropertyValue<any | {value: 1}, 'value'>>().toBe<any>();
expectTypeOf<PropertyValue<never | {value: 1}, 'value'>>().toBe<1>();
expectTypeOf<PropertyValue<void | {value: 1}, 'value'>>().toBe<never>();

// Readonly arrays omit mutating methods, and tuple element reads preserve their declared values.
expectTypeOf<PropertyValue<readonly string[], 'push'>>().toBe<never>();
expectTypeOf<PropertyValue<string[], 'push'>>().toBe<(...items: string[]) => number>();
expectTypeOf<PropertyValue<readonly string[], typeof Symbol.iterator>>().toBe<() => ArrayIterator<string>>();
expectTypeOf<PropertyValue<string[] & {label: 'items'}, 'label'>>().toBe<'items'>();
expectTypeOf<PropertyValue<[], 0>>().toBe<undefined>();
expectTypeOf<PropertyValue<readonly [], '0'>>().toBe<undefined>();
expectTypeOf<PropertyValue<[], number>>().toBe<never>();
expectTypeOf<PropertyValue<[value?: 'optional'], '0'>>().toBe<'optional' | undefined>();
expectTypeOf<PropertyValue<[value?: 'optional'], 'length'>>().toBe<0 | 1>();
expectTypeOf<PropertyValue<[first?: 'head', ...rest: number[]], '0'>>().toBe<'head' | undefined>();
expectTypeOf<PropertyValue<[first?: 'head', ...rest: number[]], '1'>>().toBe<number>();
expectTypeOf<PropertyValue<[first?: 'head', ...rest: number[]], number>>().toBe<'head' | number | undefined>();
expectTypeOf<PropertyValue<readonly [first: 'head', ...rest: number[]], '3'>>().toBe<number>();
expectTypeOf<PropertyValue<[never], 0>>().toBe<never>();
expectTypeOf<PropertyValue<[any], '0'>>().toBe<any>();
expectTypeOf<PropertyValue<[unknown], 0>>().toBe<unknown>();
expectTypeOf<PropertyValue<['first'] | readonly ['second', 2], '0'>>().toBe<'first' | 'second'>();
expectTypeOf<PropertyValue<['first'] | readonly ['second', 2], '1'>>().toBe<2 | undefined>();
expectTypeOf<PropertyValue<['first'] | readonly ['second', 2], 'length'>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<readonly string[] | number[], 'push'>>().toBe<never>();

// Special base types and empty keys remain safe across every property-key domain.
expectTypeOf<PropertyValue<any, string>>().toBe<any>();
expectTypeOf<PropertyValue<any, number>>().toBe<any>();
expectTypeOf<PropertyValue<any, symbol>>().toBe<any>();
expectTypeOf<PropertyValue<any, any>>().toBe<any>();
expectTypeOf<PropertyValue<never, number | symbol>>().toBe<never>();
expectTypeOf<PropertyValue<never, any>>().toBe<never>();
expectTypeOf<PropertyValue<unknown, PropertyKey>>().toBe<never>();
expectTypeOf<PropertyValue<unknown, any>>().toBe<never>();
expectTypeOf<PropertyValue<unknown, never>>().toBe<never>();
expectTypeOf<PropertyValue<null, PropertyKey>>().toBe<never>();
expectTypeOf<PropertyValue<undefined, PropertyKey>>().toBe<never>();
expectTypeOf<PropertyValue<void, PropertyKey>>().toBe<never>();
expectTypeOf<PropertyValue<{}, any>>().toBe<never>();
expectTypeOf<PropertyValue<{}, PropertyKey>>().toBe<never>();
expectTypeOf<PropertyValue<Record<number, 'item'>, any>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<symbol, 'item'>, any>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<string, 'item'>, never>>().toBe<never>();
expectTypeOf<PropertyValue<Record<number, 'item'>, never>>().toBe<never>();
expectTypeOf<PropertyValue<Record<symbol, 'item'>, never>>().toBe<never>();
// @ts-expect-error A union containing a non-property key is invalid.
type InvalidUnionKey = PropertyValue<ObjectT, 'string' | null>;
// @ts-expect-error Objects cannot be used as property keys.
type InvalidObjectKey = PropertyValue<ObjectT, {key: 'string'}>;
// @ts-expect-error No base type or key was provided.
type MissingArguments = PropertyValue;

// Only public inherited members are available through `keyof`.
declare class BaseClass {
	readonly inherited: 'base';
	protected hidden: 'protected';
}
declare class DerivedClass extends BaseClass {
	own: 'derived';
}
expectTypeOf<PropertyValue<DerivedClass, 'inherited'>>().toBe<'base'>();
expectTypeOf<PropertyValue<DerivedClass, 'own'>>().toBe<'derived'>();
expectTypeOf<PropertyValue<DerivedClass, 'hidden'>>().toBe<never>();
expectTypeOf<PropertyValue<DerivedClass, 'inherited' | 'own' | 'hidden'>>().toBe<'base' | 'derived'>();

// A broad symbol key must not fall through to a numeric index signature.
expectTypeOf<PropertyValue<string, symbol>>().toBe<never>();
expectTypeOf<PropertyValue<string[], symbol>>().toBe<never>();
expectTypeOf<PropertyValue<readonly string[], symbol>>().toBe<never>();
expectTypeOf<PropertyValue<['a', 'b'], symbol>>().toBe<never>();
expectTypeOf<PropertyValue<NumberRecord, symbol>>().toBe<never>();
expectTypeOf<PropertyValue<string, typeof symbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<['a', 'b'], typeof symbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<Record<string, 'item'>, symbol>>().toBe<never>();

// Looking up values does not make them assignable to unrelated property types.
expectTypeOf<string>().not.toBeAssignableTo<PropertyValue<ObjectT, 0>>();
expectTypeOf<undefined>().not.toBeAssignableTo<PropertyValue<{value: string}, 'value'>>();
expectTypeOf<'missing'>().not.toBeAssignableTo<PropertyValue<{status: 'ready' | 'done'}, 'status'>>();

// The union example in the documentation distinguishes whole-union and per-member access.
type ApiResponse = {status: 'ok'; data: string[]} | {status: 'error'; message: string};
expectTypeOf<PropertyValue<ApiResponse, 'status'>>().toBe<'ok' | 'error'>();
expectTypeOf<PropertyValue<ApiResponse, 'data'>>().toBe<never>();
expectTypeOf<ValueOf<ApiResponse, 'data'>>().toBe<string[]>();

// A generic function can return the value for a key that is inferred from the argument.
declare function getProperty<BaseType, const Key extends PropertyKey>(object: BaseType, key: Key): PropertyValue<BaseType, Key>;
expectTypeOf(getProperty({a: 1, 0: 'x'} as const, '0')).toBe<'x'>();
expectTypeOf(getProperty([1, 'a'] as const, 1)).toBe<'a'>();
expectTypeOf(getProperty('text', 'length')).toBe<number>();
expectTypeOf(getProperty(new Map<string, number>(), 'size')).toBe<number>();
expectTypeOf(getProperty({a: 1}, 'missing')).toBe<never>();

declare function pluck<Item, const Key extends PropertyKey>(items: readonly Item[], key: Key): Array<PropertyValue<Item, Key>>;
expectTypeOf(pluck([{id: 1, name: 'a'}], 'name')).toBe<string[]>();
expectTypeOf(pluck([['a', 1], ['b', 2]] as Array<[string, number]>, '1')).toBe<number[]>();

// A callback parameter is typed from the key of an event map, in either numeric form.
type Listener<Events, Name extends PropertyKey> = (payload: PropertyValue<Events, Name>) => void;
declare function createEmitter<Events>(): {on<const Name extends PropertyKey>(name: Name, listener: Listener<Events, Name>): void};
const emitter = createEmitter<{click: {x: number}; 404: Error}>();
emitter.on('click', payload => {
	expectTypeOf(payload).toBe<{x: number}>();
});
emitter.on('404', payload => {
	expectTypeOf(payload).toBe<Error>();
});
emitter.on('missing', payload => {
	expectTypeOf(payload).toBe<never>();
});

// A method can read a property of the polymorphic `this` type.
declare class Model {
	readonly id: number;
	get<Key extends PropertyKey>(key: Key): PropertyValue<this, Key>;
}
declare class Account extends Model {
	readonly email: string;
}
declare const account: Account;
expectTypeOf(account.get('email')).toBe<string>();
expectTypeOf(account.get('id')).toBe<number>();
expectTypeOf(account.get('missing')).toBe<never>();

// Mapped types can read the same key from every element, rename keys, and build getters.
type Pluck<Items extends readonly unknown[], Key extends PropertyKey> = {[Index in keyof Items]: PropertyValue<Items[Index], Key>};
expectTypeOf<Pluck<[{id: 1}, {id: 'a'; name: 'x'}, {name: 'y'}], 'id'>>().toBe<[1, 'a', never]>();
expectTypeOf<Pluck<readonly [{id: 1}, ...Array<{id: 2}>], 'id'>>().toBe<readonly [1, ...Array<2>]>();

type RenameKeys<BaseType, Mapping extends Record<PropertyKey, PropertyKey>> = {[Key in keyof Mapping as Mapping[Key]]: PropertyValue<BaseType, Key>};
expectTypeOf<RenameKeys<{0: 'zero'; name: string; keep: boolean}, {'0': 'first'; name: 'label'; missing: 'gone'}>>().toBe<{first: 'zero'; label: string; gone: never}>();

type Getters<BaseType> = {[Key in keyof BaseType as Key extends string ? `get${Capitalize<Key>}` : never]: () => PropertyValue<BaseType, Key>};
expectTypeOf<Getters<{name: string; age?: number; 0: boolean}>>().toBe<{getName: () => string; getAge?: () => number | undefined}>();

type Select<BaseType, Keys extends PropertyKey> = {[Key in Keys]: PropertyValue<BaseType, Key>};
expectTypeOf<Select<{a: 1; 0: 2}, 'a' | '0' | 'missing'>>().toBe<{a: 1; '0': 2; missing: never}>();

// A conditional type can supply a fallback for a missing key. An optional property is present, so it keeps its `undefined`.
type WithDefault<BaseType, Key extends PropertyKey, Default> = [PropertyValue<BaseType, Key>] extends [never] ? Default : PropertyValue<BaseType, Key>;
expectTypeOf<WithDefault<{retries: 3}, 'retries', 0>>().toBe<3>();
expectTypeOf<WithDefault<{}, 'retries', 0>>().toBe<0>();
expectTypeOf<WithDefault<{retries?: 3}, 'retries', 0>>().toBe<3 | undefined>();
expectTypeOf<WithDefault<unknown, 'retries', 0>>().toBe<0>();

// A recursive type can walk a list of keys, and stops with `never` at the first missing or nullable step.
type DeepValue<BaseType, Path extends readonly PropertyKey[]> =
	Path extends readonly [infer Head extends PropertyKey, ...infer Rest extends readonly PropertyKey[]]
		? DeepValue<PropertyValue<BaseType, Head>, Rest>
		: BaseType;
expectTypeOf<DeepValue<{a: [{b: {0: 'x'}}]}, ['a', '0', 'b', 0]>>().toBe<'x'>();
expectTypeOf<DeepValue<{a: [{b: {0: 'x'}}]}, ['a', 'missing', 'b']>>().toBe<never>();
expectTypeOf<DeepValue<{a?: {b: 1}}, ['a', 'b']>>().toBe<never>();
expectTypeOf<PropertyValue<PropertyValue<PropertyValue<[[1, [2, 3]], 4], 0>, '1'>, 1>>().toBe<3>();
expectTypeOf<PropertyValue<PropertyValue<{a: {b: 1}}, 'a'>, 'b'>>().toBe<Get<{a: {b: 1}}, 'a.b'>>();

// The key can have a default or a `keyof` constraint.
type ValueAt<BaseType, Key extends PropertyKey = keyof BaseType> = PropertyValue<BaseType, Key>;
expectTypeOf<ValueAt<{a: 1; b: 2}>>().toBe<1 | 2>();
type Field<BaseType extends object, Key extends keyof BaseType> = PropertyValue<BaseType, Key>;
expectTypeOf<Field<{a: 1; b?: 2}, 'b'>>().toBe<2 | undefined>();

// A value with a generic key is assignable to the union of the possible values, and a generic array or tuple element can be returned.
function _useGenericKey<Key extends 'a' | 'b'>(value: PropertyValue<{a: 1; b: 2}, Key>): 1 | 2 {
	return value;
}

function _readGenericArray<Value>(value: Value[]): PropertyValue<Value[], number> {
	return value[0]!;
}

function _readGenericTuple<Value>(value: [Value, string]): PropertyValue<[Value, string], '0'> {
	return value[0];
}

// Discriminated unions expose the discriminant, and a narrowed member exposes its own properties.
type Shape = {kind: 'circle'; radius: number} | {kind: 'square'; size: number} | {kind: 'point'};
expectTypeOf<PropertyValue<Shape, 'kind'>>().toBe<'circle' | 'square' | 'point'>();
expectTypeOf<PropertyValue<Shape, KeysOfUnion<Shape>>>().toBe<'circle' | 'square' | 'point'>();
expectTypeOf<PropertyValue<Extract<Shape, {kind: 'circle'}>, 'radius'>>().toBe<number>();
expectTypeOf<PropertyValue<Extract<Shape, {kind: 'circle' | 'square'}>, 'radius' | 'size' | 'kind'>>().toBe<'circle' | 'square'>();
expectTypeOf<PropertyValue<{ok: true} | {ok: false}, 'ok'>>().toBe<boolean>();
expectTypeOf<PropertyValue<{a: 1} | {a: 2} | {a: 3; b: 4}, 'a'>>().toBe<1 | 2 | 3>();
// Removing the nullish or primitive members first makes the key readable.
expectTypeOf<PropertyValue<NonNullable<undefined | null | {a: 1}>, 'a'>>().toBe<1>();
expectTypeOf<PropertyValue<Exclude<string | {a: 1}, string>, 'a'>>().toBe<1>();
// Distributing over the union in a wrapper reads the key from only the members that have it.
type DistributedData<Union> = Union extends unknown ? PropertyValue<Union, 'data'> : never;
expectTypeOf<DistributedData<ApiResponse>>().toBe<string[]>();

// A tuple and an object share an index key in either spelling, because a tuple has both.
expectTypeOf<PropertyValue<[1] | {0: 2}, 0 | '0'>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<[1] | {'0': 2}, 0 | '0'>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<['a'] | ['b', 'c'] | [], 0>>().toBe<'a' | 'b' | undefined>();
expectTypeOf<PropertyValue<unknown[] | Record<number, 'x'>, 0>>().toBe<unknown>();

// A union of primitives is read through the members that all the wrapper types share.
expectTypeOf<PropertyValue<string | number, 'toString'>>().toBe<(() => string) | ((radix?: number) => string)>();
expectTypeOf<PropertyValue<string | number, 'toFixed' | 'length'>>().toBe<never>();
expectTypeOf<PropertyValue<'a' | 'b', 'length' | 0>>().toBe<number | string>();
expectTypeOf<PropertyValue<boolean | {valueOf: 'custom'}, 'valueOf'>>().toBe<'custom' | (() => boolean)>();
expectTypeOf<PropertyValue<1n, 'toString' | 'toFixed'>>().toBe<(radix?: number) => string>();
expectTypeOf<PropertyValue<`prefix-${string}`, 'length'>>().toBe<number>();
expectTypeOf<PropertyValue<string, typeof Symbol.iterator>>().toBe<() => StringIterator<string>>();
expectTypeOf<PropertyValue<string, number>>().toBe<string>();
// A branded primitive has the brand property and the members of its wrapper type.
expectTypeOf<PropertyValue<string & {readonly brand: 'UserId'}, 'brand'>>().toBe<'UserId'>();
expectTypeOf<PropertyValue<string & {readonly brand: 'UserId'}, 0>>().toBe<string>();

// Index signatures written as a literal type share number keys in a union, in both spellings.
expectTypeOf<PropertyValue<{[key: string]: 1} | {[key: number]: 2}, 0 | '0'>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<{[key: string]: 1} | {[key: number]: 2}, number>>().toBe<1 | 2>();
expectTypeOf<PropertyValue<{[key: string]: 1} | {[key: number]: 2}, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<Record<string, 1> | Record<string, 2>, 0 | 'a'>>().toBe<1 | 2>();

// An index signature intersected with declared keys.
expectTypeOf<PropertyValue<Record<string, number> & {name: 'x'}, 'name'>>().toBe<'x'>();
expectTypeOf<PropertyValue<Record<string, unknown> & {0: 'zero'}, '0'>>().toBe<'zero'>();
expectTypeOf<PropertyValue<Record<string, unknown> & {0: 'zero'}, '1'>>().toBe<unknown>();
expectTypeOf<PropertyValue<Record<number, 'n'> & Record<string, 'n' | 's'>, '0'>>().toBe<'n'>();
expectTypeOf<PropertyValue<Record<number, 'n'> & Record<string, 'n' | 's'>, 'a'>>().toBe<'n' | 's'>();
expectTypeOf<PropertyValue<{0: 1} & ({a: 2} | {b: 3}), '0' | 'a'>>().toBe<1>();

// A key union that contains a wide member collapses to the wide member before it is read.
expectTypeOf<PropertyValue<{a: 1}, 'a' | string>>().toBe<never>();
expectTypeOf<PropertyValue<Record<string, 2> & {a: 1}, 'a' | string>>().toBe<2>();
// `LiteralUnion` keeps its literal members, so they are still read.
expectTypeOf<PropertyValue<{a: 1; b: 2}, LiteralUnion<'a' | 'b', string>>>().toBe<1 | 2>();

// Composition with other types.
expectTypeOf<PropertyValue<Simplify<{a: 1} & {b: 2}>, 'b'>>().toBe<2>();
expectTypeOf<PropertyValue<Merge<{a: string; 0: number}, {a: number; '0': boolean}>, 'a' | 0>>().toBe<number | boolean>();
expectTypeOf<PropertyValue<SetOptional<{a: 1; b: 2}, 'a'>, 'a'>>().toBe<1 | undefined>();
expectTypeOf<PropertyValue<SetRequired<{a?: 1; b?: 2}, 'a'>, 'a' | 'b'>>().toBe<1 | 2 | undefined>();
expectTypeOf<PropertyValue<ReadonlyDeep<{a: {b: string[]}}>, 'a'>>().toBe<{readonly b: readonly string[]}>();
expectTypeOf<PropertyValue<PartialDeep<{a: {b: 1}}>, 'a'>>().toBe<{b?: 1} | undefined>();
expectTypeOf<PropertyValue<Tagged<{id: number}, 'User'>, 'id'>>().toBe<number>();
expectTypeOf<PropertyValue<Except<{a: 1; b: 2}, 'a'>, 'a' | 'b'>>().toBe<2>();
expectTypeOf<PropertyValue<Writable<readonly ['a', 'b']>, 'push'>>().toBe<(...items: Array<'a' | 'b'>) => number>();
expectTypeOf<PropertyValue<AllUnionFields<ApiResponse>, 'data'>>().toBe<string[] | undefined>();
expectTypeOf<PropertyValue<SharedUnionFields<ApiResponse>, 'status' | 'data'>>().toBe<'ok' | 'error'>();

// A tagged key matches the index signature or tuple that it is assignable to.
expectTypeOf<PropertyValue<['x'], Tagged<0, 'Index'>>>().toBe<'x'>();
expectTypeOf<PropertyValue<Record<string, 'item'>, Tagged<string, 'Id'>>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<Tagged<string, 'Id'>, 'item'>, Tagged<string, 'Id'>>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<Tagged<string, 'Id'>, 'item'>, 'plain'>>().toBe<never>();
// The string form of a tagged number is not a key.
expectTypeOf<PropertyValue<{'0': 'x'}, Tagged<0, 'Index'>>>().toBe<never>();

// Built-in mapped types and key remapping.
type Settings = {readonly theme: 'dark'; size?: 10; 0: 'zero'};
expectTypeOf<PropertyValue<Partial<Settings>, 'theme' | '0'>>().toBe<'dark' | 'zero' | undefined>();
expectTypeOf<PropertyValue<Required<Settings>, 'size'>>().toBe<10>();
expectTypeOf<PropertyValue<Readonly<Settings>, 'size'>>().toBe<10 | undefined>();
expectTypeOf<PropertyValue<Pick<Settings, 'theme'>, 'theme' | 'size'>>().toBe<'dark'>();
expectTypeOf<PropertyValue<Omit<Settings, 'theme'>, 'theme' | '0'>>().toBe<'zero'>();
expectTypeOf<PropertyValue<Pick<Settings, 0>, '0'>>().toBe<'zero'>();
expectTypeOf<PropertyValue<{-readonly [Key in keyof Settings]-?: Settings[Key]}, 'size'>>().toBe<10>();
expectTypeOf<PropertyValue<{[Key in 'a' | 'b' as `get${Capitalize<Key>}`]: () => Key}, 'getA' | 'a'>>().toBe<() => 'a'>();
// A key that a mapped type converts between the numeric forms is still read by the other form.
expectTypeOf<PropertyValue<{[Key in 0 | 1 as `${Key}`]: Key}, 0>>().toBe<0>();
expectTypeOf<PropertyValue<{[Key in '0' | '1' as Key extends `${infer Index extends number}` ? Index : never]: Key}, '1'>>().toBe<'1'>();
expectTypeOf<PropertyValue<{value?: string | undefined}, 'value'>>().toBe<string | undefined>();
expectTypeOf<PropertyValue<Record<never, 'item'>, 'name' | 0 | typeof symbolKey>>().toBe<never>();
expectTypeOf<PropertyValue<Record<never, 'item'>, PropertyKey>>().toBe<never>();
expectTypeOf<PropertyValue<Record<'a' | 0, 'item'>, '0' | 'a' | 'b'>>().toBe<'item'>();
expectTypeOf<PropertyValue<Partial<Record<'a' | 'b', number>>, 'a'>>().toBe<number | undefined>();

// Template literal keys are read one by one, and a pattern does not select declared keys.
type Grid = {[Key in `${'a' | 'b'}${1 | 2}`]: Key};
expectTypeOf<PropertyValue<Grid, `a${1 | 2}`>>().toBe<'a1' | 'a2'>();
expectTypeOf<PropertyValue<Grid, `${'a' | 'c'}1`>>().toBe<'a1'>();
expectTypeOf<PropertyValue<Grid, `a${number}`>>().toBe<never>();
expectTypeOf<PropertyValue<{getName: 1}, `get${string}`>>().toBe<never>();
expectTypeOf<PropertyValue<Record<`get${string}`, 1>, `get${Capitalize<string>}`>>().toBe<1>();
expectTypeOf<PropertyValue<{[key: Uppercase<string>]: 'upper'}, 'ABC'>>().toBe<'upper'>();
expectTypeOf<PropertyValue<{[key: Uppercase<string>]: 'upper'}, 'abc'>>().toBe<never>();
expectTypeOf<PropertyValue<Record<`${number}px`, 'pixels'>, '10px'>>().toBe<'pixels'>();
expectTypeOf<PropertyValue<Record<`${number}px`, 'pixels'>, '10' | 10>>().toBe<never>();
// A key union can cross the string, number, and symbol domains.
expectTypeOf<PropertyValue<{a: 1; 0: 2; [symbolKey]: 3}, 'a' | '0' | typeof symbolKey | 'missing' | 1 | typeof otherSymbolKey>>().toBe<1 | 2 | 3>();

// A `${number}` template index signature follows TypeScript's rule for numeric strings, which also accepts noncanonical spellings.
expectTypeOf<PropertyValue<Record<`${number}`, 'numeric'>, '01' | '1e3' | '1.5'>>().toBe<'numeric'>();
expectTypeOf<PropertyValue<Record<`${number}`, 'numeric'>, 'Infinity' | 'NaN'>>().toBe<never>();

// Numeric enums, const enums, and enums with negative or computed members.
enum Direction {
	Up,
	Down,
}
const enum Level {
	Low = 1,
	High = 'high',
}
enum Offset {
	Before = -1,
	After = 2,
}
expectTypeOf<PropertyValue<Record<Direction, 'item'>, Direction>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<Direction, 'item'>, 0 | '1'>>().toBe<'item'>();
expectTypeOf<PropertyValue<Record<Direction, 'item'>, 2>>().toBe<never>();
expectTypeOf<PropertyValue<{[Direction.Up]: 'up'; [Direction.Down]: 'down'}, Direction>>().toBe<'up' | 'down'>();
expectTypeOf<PropertyValue<{[Direction.Up]: 'up'}, Direction>>().toBe<'up'>();
expectTypeOf<PropertyValue<{[Direction.Up]: 'up'}, Direction.Down>>().toBe<never>();
expectTypeOf<PropertyValue<['up', 'down'], Direction.Down>>().toBe<'down'>();
expectTypeOf<PropertyValue<['up', 'down'], Direction>>().toBe<'up' | 'down'>();
expectTypeOf<PropertyValue<NumberRecord, Direction>>().toBe<'item'>();
expectTypeOf<PropertyValue<{[Level.Low]: 'low'; [Level.High]: 'high'}, Level>>().toBe<'low' | 'high'>();
expectTypeOf<PropertyValue<{[Level.Low]: 'low'; [Level.High]: 'high'}, '1' | 'high'>>().toBe<'low'>();
expectTypeOf<PropertyValue<{1: 'low'; high: 'high'}, Level>>().toBe<'low' | 'high'>();
expectTypeOf<PropertyValue<Record<string, 'item'>, Level.High>>().toBe<'item'>();
expectTypeOf<PropertyValue<{[Offset.Before]: 'before'; [Offset.After]: 'after'}, '-1' | 2>>().toBe<'before' | 'after'>();
expectTypeOf<PropertyValue<{'-1': 'before'; '2': 'after'}, Offset>>().toBe<'before' | 'after'>();
// An enum object has its member names as keys. The reverse mapping of a numeric enum is not a key.
expectTypeOf<PropertyValue<typeof Direction, 'Up'>>().toBe<Direction.Up>();
expectTypeOf<PropertyValue<typeof Direction, 0 | '0' | 'Left'>>().toBe<never>();

// Abstract classes, accessors, and class members.
declare abstract class AbstractShape {
	static create(): AbstractShape;
	abstract readonly sides: number;
	abstract area(): number;
}
expectTypeOf<PropertyValue<AbstractShape, 'sides' | 'area'>>().toBe<number | (() => number)>();
expectTypeOf<PropertyValue<typeof AbstractShape, 'create'>>().toBe<() => AbstractShape>();
expectTypeOf<PropertyValue<typeof AbstractShape, 'prototype'>>().toBe<AbstractShape>();
expectTypeOf<PropertyValue<abstract new () => AbstractShape, 'prototype'>>().toBe<never>();

declare class Temperature {
	readonly #kelvin: number; // eslint-disable-line @typescript-eslint/no-unused-private-class-members
	[key: `data-${string}`]: string;
	accessor unit: 'C' | 'F';
	get celsius(): number;
	set celsius(value: number | string);
	optionalMethod?(): void;
}
// An accessor is read with the type of its getter.
expectTypeOf<PropertyValue<Temperature, 'celsius'>>().toBe<number>();
expectTypeOf<PropertyValue<Temperature, 'unit'>>().toBe<'C' | 'F'>();
expectTypeOf<PropertyValue<Temperature, 'optionalMethod'>>().toBe<(() => void) | undefined>();
expectTypeOf<PropertyValue<Temperature, 'data-id'>>().toBe<string>();
expectTypeOf<PropertyValue<Temperature, '#kelvin' | 'kelvin'>>().toBe<never>();

declare class Box<Value> {
	value: Value;
}
expectTypeOf<PropertyValue<Box<string>, 'value'>>().toBe<string>();
expectTypeOf<PropertyValue<Box<Box<1>>, 'value'>>().toBe<Box<1>>();

// A type with call and construct signatures only has its declared properties as keys.
type Factory = {new (name: string): Date; (name: string): string; readonly version: 2};
expectTypeOf<PropertyValue<Factory, 'version'>>().toBe<2>();
expectTypeOf<PropertyValue<Factory, 'prototype' | 'name' | 'call'>>().toBe<never>();

// Namespaces and global objects.
declare namespace Configuration { // eslint-disable-line @typescript-eslint/no-namespace
	const version: '1.0';
	function load(): Promise<void>;
	namespace nested { // eslint-disable-line @typescript-eslint/no-namespace
		const depth: 1;
	}
}
expectTypeOf<PropertyValue<typeof Configuration, 'version'>>().toBe<'1.0'>();
expectTypeOf<PropertyValue<typeof Configuration, 'load'>>().toBe<() => Promise<void>>();
expectTypeOf<PropertyValue<PropertyValue<typeof Configuration, 'nested'>, 'depth'>>().toBe<1>();
expectTypeOf<PropertyValue<typeof Configuration, 'missing'>>().toBe<never>();
expectTypeOf<PropertyValue<typeof globalThis, 'NaN'>>().toBe<number>();
expectTypeOf<PropertyValue<typeof globalThis, 'undefined'>>().toBe<undefined>();
expectTypeOf<PropertyValue<typeof globalThis, 'notAGlobal'>>().toBe<never>();
expectTypeOf<PropertyValue<typeof Math, 'PI'>>().toBe<number>();
expectTypeOf<PropertyValue<typeof Symbol, 'iterator'>>().toBe<typeof Symbol.iterator>();

// `Object` and the wrapper object types have their own members, unlike `{}` and `object`.
expectTypeOf<PropertyValue<Object, 'toString'>>().toBe<() => string>();
expectTypeOf<PropertyValue<Object, 'constructor'>>().toBe<Function>();
expectTypeOf<PropertyValue<Object, 'name'>>().toBe<never>();
expectTypeOf<PropertyValue<object, 'toString' | 'constructor'>>().toBe<never>();
expectTypeOf<PropertyValue<String, 'length' | 0>>().toBe<number | string>();
expectTypeOf<PropertyValue<Number, 'toFixed'>>().toBe<(fractionDigits?: number) => string>();
expectTypeOf<PropertyValue<Boolean, 'valueOf'>>().toBe<() => boolean>();

// Array-like objects, typed arrays, and well-known symbols.
expectTypeOf<PropertyValue<ArrayLike<'item'>, 0 | '0' | 'length'>>().toBe<'item' | number>();
expectTypeOf<PropertyValue<ArrayLike<'item'>, 'push'>>().toBe<never>();
expectTypeOf<PropertyValue<Uint8Array, 0 | '0' | 'byteLength'>>().toBe<number>();
expectTypeOf<PropertyValue<BigInt64Array, 5>>().toBe<bigint>();
expectTypeOf<PropertyValue<IArguments, 0>>().toBe<any>();
expectTypeOf<PropertyValue<IArguments, 'callee' | 'length'>>().toBe<Function | number>();
expectTypeOf<PropertyValue<ReadonlySet<string>, 'size' | 'add'>>().toBe<number>();
expectTypeOf<PropertyValue<Map<string, 1> | Set<1>, 'size' | 'get'>>().toBe<number>();
expectTypeOf<PropertyValue<Promise<string>, typeof Symbol.toStringTag>>().toBe<string>();
expectTypeOf<PropertyValue<AsyncGenerator<number>, typeof Symbol.asyncIterator>>().toBe<() => AsyncGenerator<number>>();
expectTypeOf<PropertyValue<{[Symbol.iterator](): Iterator<1>}, typeof Symbol.iterator>>().toBe<() => Iterator<1>>();
expectTypeOf<PropertyValue<{[Symbol.iterator](): Iterator<1>}, typeof Symbol.asyncIterator>>().toBe<never>();

// Arrays with special element types.
expectTypeOf<PropertyValue<any[], 0>>().toBe<any>();
expectTypeOf<PropertyValue<never[], 0>>().toBe<never>();
expectTypeOf<PropertyValue<unknown[], '0'>>().toBe<unknown>();
expectTypeOf<PropertyValue<Array<string | undefined>, 0>>().toBe<string | undefined>();
expectTypeOf<PropertyValue<string[][], 0>>().toBe<string[]>();
// A negative or fractional index is covered by the `number` index signature of an array.

// Tuples with a rest element in the middle or at the start, and nested, optional, and intersected tuples.
type MiddleRest = [first: 'a', ...middle: number[], last: 'z'];
expectTypeOf<PropertyValue<MiddleRest, 0>>().toBe<'a'>();
expectTypeOf<PropertyValue<MiddleRest, 1 | '7'>>().toBe<number | 'z'>();
expectTypeOf<PropertyValue<MiddleRest, number>>().toBe<number | 'a' | 'z'>();
expectTypeOf<PropertyValue<MiddleRest, 'length'>>().toBe<number>();
expectTypeOf<PropertyValue<[...leading: boolean[], secondLast: 'y', last: 'z'], '0' | 1>>().toBe<boolean | 'y' | 'z'>();
expectTypeOf<PropertyValue<readonly [a: 1, b?: 2, ...rest: Array<3>], 1 | '2'>>().toBe<2 | 3 | undefined>();
expectTypeOf<PropertyValue<readonly [a: 1, b?: 2, ...rest: Array<3>], 'length'>>().toBe<number>();
expectTypeOf<PropertyValue<[[1, [2, 3]], 4], 0>>().toBe<[1, [2, 3]]>();
expectTypeOf<PropertyValue<[a?: 1, b?: 2], 0 | 1>>().toBe<1 | 2 | undefined>();
expectTypeOf<PropertyValue<[undefined, null], 0 | 1>>().toBe<undefined | null>();
expectTypeOf<PropertyValue<['a', 'b'] & {extra: true}, 'extra' | 0>>().toBe<true | 'a'>();
expectTypeOf<PropertyValue<['a', 'b'], '0' | 'length' | 'missing'>>().toBe<'a' | 2>();
expectTypeOf<PropertyValue<['a', 'b'], `${number}`>>().toBe<'a' | 'b'>();
expectTypeOf<PropertyValue<Parameters<(name: string, age?: number) => void>, 1>>().toBe<number | undefined>();
// A fractional or very large index is outside the bounds of the tuple.

// Recursive types.
type Json = string | number | boolean | null | Json[] | {[key: string]: Json};
expectTypeOf<PropertyValue<Extract<Json, Record<string, unknown>>, 'anything'>>().toBe<Json>();
expectTypeOf<PropertyValue<Json, 'anything'>>().toBe<never>();
type LinkedList<Value> = {value: Value; next: LinkedList<Value> | undefined};
expectTypeOf<PropertyValue<NonNullable<PropertyValue<LinkedList<1>, 'next'>>, 'value'>>().toBe<1>();

// The value can be used with `satisfies` and in assignments.
'ok' satisfies PropertyValue<ApiResponse, 'status'>;
// @ts-expect-error The value is not one of the statuses.
'pending' satisfies PropertyValue<ApiResponse, 'status'>;
const statusMessage: PropertyValue<StatusMessages, '200' | 404> = 'OK';
expectTypeOf(statusMessage).toBe<'OK'>();
// @ts-expect-error Nothing is assignable to the value of a missing key.
const missingStatusMessage: PropertyValue<StatusMessages, 500> = 'OK';
