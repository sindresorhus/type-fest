/* eslint-disable @typescript-eslint/consistent-type-definitions -- Tests that interfaces are accepted. */
import {expectTypeOf} from 'nz';
import type {
	Flavor,
	JsonArray,
	JsonObject,
	JsonValue,
	Jsonifiable,
	JsonifiableArray,
	JsonifiableObject,
	JsonifiableValue,
	Jsonify,
	ReadonlyDate,
	Tagged,
} from '../index.d.ts';

declare function accept<Value>(value: JsonifiableValue<Value>): void;
declare function identity<Value>(value: JsonifiableValue<Value>): Value;

// The issue's example values.
type Test1 = {
	value: string;
};
interface Test2 {
	value: string;
}

const v1: Test1 = {value: 'test'};
const v2: Test2 = {value: 'test'};

accept(v1);
accept(v2);
accept({value: 'test'});
accept<Test2>(v2);

// @ts-expect-error A `Map` is not JSON-able.
accept({value: new Map()});
// @ts-expect-error An explicit type argument does not turn the check off.
accept<{value: Map<string, number>}>({value: new Map()});

// An explicit type argument does not widen the checked type.
declare const stringValue: {value: string};
declare const numberValue: {value: number};
accept<{value: string}>(stringValue);
// @ts-expect-error The argument still has to match the explicit type.
accept<{value: string}>(numberValue);

// The documentation example.
interface User {
	name: string;
	createdAt: Date;
}

function saveUser<Value>(value: JsonifiableValue<Value>) {
	return JSON.stringify(value);
}

const user: User = {name: 'Alice', createdAt: new Date()};
saveUser(user);
// @ts-expect-error A `Set` is not JSON-able.
saveUser({name: 'Alice', tags: new Set()});

// Known limitation: a union member that is assignable to a valid member is accepted through that member, and every non-nullish value is assignable to `{}`. Assignability ignores extra properties, so TypeScript cannot reject them without an exact object type.
type Narrow = {
	value: string;
};
type Widened = {
	value: string;
	map: Map<string, number>;
};
declare const narrowOrWidened: Narrow | Widened;
declare const mapOrEmpty: Map<string, number> | {};
accept(narrowOrWidened);
accept(mapOrEmpty);
// A union member is rejected when it is not assignable to a valid member.
declare const narrowOrMap: Narrow | Map<string, number>;
// @ts-expect-error
accept(narrowOrMap);
// A typed union property is checked member by member.
declare const mapOrStringProperty: {value: Map<string, number> | string};
// @ts-expect-error
accept(mapOrStringProperty);
// Valid unions are accepted member by member.
declare const unionWithDate: Test1 | Date;
declare const unionWithNull: Test1 | null;
accept(unionWithDate);
accept(unionWithNull);

// Primitive values and literals.
accept('text');
accept(42);
accept(true);
accept(null);
accept('literal' as const);
accept(NaN);
accept(Infinity);
declare const templateLiteral: `id-${number}`;
accept(templateLiteral);

// A type alias, an interface, a nested interface, and a recursive interface.
interface Inner {
	value: string;
}
interface Outer {
	inner: Inner;
}
interface TreeNode {
	value: string;
	children: TreeNode[];
}
interface MutualA {
	b?: MutualB;
}
interface MutualB {
	a?: MutualA;
}
type Tree = {
	value: string;
	children: Tree[];
};
interface ExtendsJsonObject extends JsonObject {
	value: string;
	optional?: string;
}
interface ExtendsIndexSignature {
	[key: string]: Jsonifiable | undefined;
}
interface ExtendsRecord extends Record<string, Jsonifiable | undefined> {
	date: Date;
}

declare const interfaceValue: Test2;
declare const outer: Outer;
declare const treeNode: TreeNode;
declare const tree: Tree;
declare const mutualA: MutualA;
declare const extendsJsonObject: ExtendsJsonObject;
declare const extendsIndexSignature: ExtendsIndexSignature;
declare const extendsRecord: ExtendsRecord;

accept(outer);
accept(treeNode);
accept(tree);
accept(mutualA);
accept(extendsJsonObject);
accept(extendsIndexSignature);
accept(extendsRecord);

// A nested invalid value is rejected through an interface, an array, and an object property.
interface BadNested {
	inner: Map<string, number>;
}
declare const badNested: BadNested;
// @ts-expect-error
accept(badNested);
// @ts-expect-error
accept([badNested]);
// @ts-expect-error
accept({item: badNested});

// Values with `toJSON`, including return types that `Jsonifiable` rejects. `Jsonify` turns `Date` into `string`, so a `Date` value is not assignable to `Jsonify<Date>`.
interface WithToJSON {
	toJSON(): string;
}
interface WithToJSONKey {
	toJSON(key: string): string;
}
interface WithToJSONParameters {
	toJSON(key: string, index: number): string;
}
interface WithToJSONRest {
	toJSON(...arguments_: any[]): string;
}
interface ToJSONReturningInterface {
	toJSON(): Inner;
}
interface ToJSONReturningMap {
	toJSON(): Map<string, number>;
}
interface ToJSONReturningObject {
	toJSON(): object;
}
interface ToJSONReturningUndefined {
	toJSON(): undefined;
}
interface ToJSONReturningVoid {
	toJSON(): void;
}
interface ToJSONReturningFunction {
	toJSON(): () => void;
}
interface ToJSONReturningStringOrUndefined {
	toJSON(): string | undefined;
}
interface ToJSONReturningNestedMap {
	toJSON(): {nested: Map<string, number>};
}
interface WithToJSONAndMap {
	value: Map<string, number>;
	toJSON(): string;
}
interface WithToJSONAndMethod {
	method(): void;
	toJSON(): {ok: true};
}
class BaseWithToJSON {
	toJSON() {
		return 'base';
	}
}
class DerivedWithToJSON extends BaseWithToJSON {
	value = 1;
}

declare const readonlyDate: ReadonlyDate;
declare const withToJSON: WithToJSON;
declare const withToJSONKey: WithToJSONKey;
declare const withToJSONParameters: WithToJSONParameters;
declare const withToJSONRest: WithToJSONRest;
declare const toJSONReturningInterface: ToJSONReturningInterface;
declare const toJSONReturningMap: ToJSONReturningMap;
declare const toJSONReturningObject: ToJSONReturningObject;
declare const toJSONReturningUndefined: ToJSONReturningUndefined;
declare const toJSONReturningVoid: ToJSONReturningVoid;
declare const toJSONReturningFunction: ToJSONReturningFunction;
declare const toJSONReturningStringOrUndefined: ToJSONReturningStringOrUndefined;
declare const toJSONReturningNestedMap: ToJSONReturningNestedMap;
declare const toJSONReturningUnion: {toJSON(): string | Map<string, number>};
declare const withToJSONAndMap: WithToJSONAndMap;
declare const withToJSONAndMethod: WithToJSONAndMethod;
declare const derivedWithToJSON: DerivedWithToJSON;

accept(new Date());
accept(readonlyDate);
accept(withToJSON);
accept(withToJSONKey);
accept(withToJSONParameters);
accept(withToJSONRest);
// `Jsonifiable` accepts this too, but the returned `Date` is serialized as `{}`, because `JSON.stringify` does not call `toJSON` on the returned value.
accept({toJSON: () => new Date()});
accept({toJSON: () => ({value: 'test'})});
accept({toJSON: () => null});
accept({toJSON: () => 1});
declare const toJSONJsonValue: {toJSON(): JsonValue};
declare const toJSONJsonifiable: {toJSON(): Jsonifiable};
declare const nonCallableToJSON: {toJSON: 'not a function'};
accept(toJSONJsonValue);
accept(toJSONJsonifiable);
accept(nonCallableToJSON);
// An array with a `toJSON` that returns a non-JSON value falls through to the element check, like `Jsonifiable`.
declare const arrayWithBadToJSON: string[] & {toJSON(): Map<string, number>};
accept(arrayWithBadToJSON);
accept(withToJSONAndMap);
accept(withToJSONAndMethod);
accept(derivedWithToJSON);
// @ts-expect-error `toJSON` must return a value assignable to `Jsonifiable`, as with `Jsonifiable`.
accept(toJSONReturningInterface);
// @ts-expect-error
accept(toJSONReturningMap);
// @ts-expect-error
accept(toJSONReturningObject);
// @ts-expect-error
accept(toJSONReturningUndefined);
// @ts-expect-error
accept(toJSONReturningVoid);
// @ts-expect-error
accept(toJSONReturningFunction);
// @ts-expect-error
accept(toJSONReturningStringOrUndefined);
// @ts-expect-error
accept(toJSONReturningNestedMap);
// @ts-expect-error A union return is not reduced to its valid member.
accept(toJSONReturningUnion);

// Classes.
class DataClass {
	value = 1;
}
class EmptyClass {}
class OnlyPrivateFields {
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members -- The private field shows that it is not checked.
	private readonly secret = new Map<string, number>();
}
class PrivateMapClass {
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members -- The private field shows that it is not checked.
	private readonly secret = new Map<string, number>();

	value = 1;
}
class OnlyHashPrivateMethod {
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members -- The private method shows that it is not checked.
	#method() {
		return new Map<string, number>();
	}
}
class OnlyPrivateMethod {
	// eslint-disable-next-line @typescript-eslint/no-unused-private-class-members -- The private method shows that it is not checked.
	private method() {
		return new Map<string, number>();
	}
}
class StaticClass {
	static readonly cache = new Map<string, number>();
	value = 1;
}
class MethodClass {
	value = 1;

	method() {
		return 1;
	}
}
class BaseMethodClass {
	method() {
		return 1;
	}
}
class DerivedMethodClass extends BaseMethodClass {
	value = 1;
}
class ToJSONClass {
	value = 1;

	toJSON() {
		return {value: this.value};
	}
}
class ToJSONAndMapClass {
	map = new Map<string, number>();

	toJSON() {
		return {ok: true};
	}
}
class WithGetter {
	get value() {
		return new Map<string, number>();
	}
}
class WithStringGetter {
	get value() {
		return 'a';
	}
}
class WithArrowFunctionField {
	fn = () => 1;
}
class ExtendsDate extends Date {}
class DateWithMap extends Date {
	map = new Map<string, number>();
}
class IterableClass {
	value = 'a';

	* [Symbol.iterator]() {
		yield this.value;
	}
}
declare const dataClass: DataClass;
declare const emptyClass: EmptyClass;
declare const onlyPrivateFields: OnlyPrivateFields;
declare const privateMapClass: PrivateMapClass;
declare const onlyHashPrivateMethod: OnlyHashPrivateMethod;
declare const onlyPrivateMethod: OnlyPrivateMethod;
declare const staticClass: StaticClass;
declare const methodClass: MethodClass;
declare const derivedMethodClass: DerivedMethodClass;
declare const toJSONClass: ToJSONClass;
declare const toJSONAndMapClass: ToJSONAndMapClass;
declare const withGetter: WithGetter;
declare const withStringGetter: WithStringGetter;
declare const withArrowFunctionField: WithArrowFunctionField;
declare const extendsDate: ExtendsDate;
declare const dateWithMap: DateWithMap;
declare const iterableClass: IterableClass;

// A class instance with only data fields is structurally the same as an interface.
accept(dataClass);
accept(emptyClass);
accept(staticClass);
accept(toJSONClass);
accept(toJSONAndMapClass);
// A class getter is checked like a property, but `JSON.stringify` does not serialize it.
accept(withStringGetter);
accept(extendsDate);
// `toJSON` short-circuits the other fields, so the `Map` field is not checked.
accept(dateWithMap);
accept(iterableClass);
// Private fields and methods are not in `keyof`, so they are not checked. A TypeScript `private` field is still serialized, but a `#private` field is not.
accept(onlyPrivateFields);
accept(privateMapClass);
accept(onlyHashPrivateMethod);
accept(onlyPrivateMethod);
// @ts-expect-error A method is a function-valued property, which `JSON.stringify` drops.
accept(methodClass);
// @ts-expect-error An inherited method is still a function-valued property.
accept(derivedMethodClass);
// @ts-expect-error A getter is checked like a property, so a non-JSON getter is rejected even though `JSON.stringify` omits a class getter.
accept(withGetter);
// @ts-expect-error A function-valued field is rejected, like a method.
accept(withArrowFunctionField);

// `undefined` is allowed in object properties, but not at the top level or in an array.
interface OptionalField {
	value?: string;
}
interface RequiredUndefinedField {
	value: string | undefined;
}
interface UndefinedField {
	value: undefined;
}
interface OptionalMap {
	value?: Map<string, number>;
}
interface OptionalFunction {
	value?: () => void;
}
interface OptionalMethod {
	value: string;

	method?(): void;
}
interface OptionalToJSON {
	value: string;

	toJSON?: () => string;
}
interface ObjectMethod {
	value(): number;
}
declare const optionalField: OptionalField;
declare const requiredUndefinedField: RequiredUndefinedField;
declare const undefinedField: UndefinedField;
declare const optionalMap: OptionalMap;
declare const optionalFunction: OptionalFunction;
declare const optionalMethod: OptionalMethod;
declare const optionalToJSON: OptionalToJSON;
declare const objectMethod: ObjectMethod;
declare const functionOrUndefinedField: {value: (() => void) | undefined};

accept(optionalField);
accept(requiredUndefinedField);
accept(undefinedField);
accept({value: undefined});
// @ts-expect-error A non-JSON value is still rejected when the property is optional.
accept(optionalMap);
// @ts-expect-error
accept(optionalFunction);
// @ts-expect-error
accept(optionalMethod);
// @ts-expect-error
accept(optionalToJSON);
// @ts-expect-error A method is a function-valued property.
accept(objectMethod);
// @ts-expect-error A function member is rejected even when the property also allows `undefined`.
accept(functionOrUndefinedField);

declare const undefinedValue: undefined;
declare const undefinedArray: Array<string | undefined>;
declare const undefinedTuple: [string, undefined?];
declare const undefinedNestedArray: {value: Array<string | undefined>};
declare const undefinedRecord: {[key: string]: string | undefined};
// @ts-expect-error
accept(undefinedValue);
// @ts-expect-error
accept(undefinedArray);
// @ts-expect-error
accept(undefinedTuple);
// @ts-expect-error
accept(undefinedNestedArray);
accept(undefinedRecord);

// Arrays, tuples, and records.
declare const numberArray: number[];
declare const readonlyNumberArray: readonly number[];
declare const dateArray: Date[];
declare const nestedNumberArray: number[][];
declare const tuple: [string, Date];
declare const readonlyTuple: readonly [string, Date];
declare const optionalTuple: [string, number?];
declare const restTuple: [string, ...number[]];
declare const restTupleLast: [...Date[], number];
declare const badTuple: [string, () => void];
declare const badReadonlyTuple: readonly [string, Map<string, number>];
declare const badRestTuple: [string, ...Array<Map<string, number>>];
declare const record: Record<string, number>;
declare const dateRecord: Record<string, Date>;
declare const numericRecord: Record<number, string>;
declare const nestedRecord: Record<string, {value: string}>;
declare const optionalRecord: Record<string, string | undefined>;
declare const emptyRecord: Record<string, never>;
declare const recordOfUnknown: Record<string, unknown>;
declare const recordOfObject: Record<string, object>;
declare const recordOfMap: Record<string, Map<string, number>>;

accept(numberArray);
accept(readonlyNumberArray);
accept(dateArray);
accept(nestedNumberArray);
accept(tuple);
accept(readonlyTuple);
accept(restTuple);
accept(restTupleLast);
accept(record);
accept(dateRecord);
accept(numericRecord);
accept({1: 'a', 2: new Date()});
accept(nestedRecord);
accept(optionalRecord);
accept(emptyRecord);
accept([1, 'a', null, new Date()]);
accept([] as const);
accept([] as never[]);
accept([] as any[]);
// @ts-expect-error The optional element adds `undefined`, which `Jsonifiable` also rejects.
accept(optionalTuple);
// @ts-expect-error
accept(badTuple);
// @ts-expect-error
accept(badReadonlyTuple);
// @ts-expect-error
accept(badRestTuple);
// @ts-expect-error
accept(recordOfUnknown);
// @ts-expect-error
accept(recordOfObject);
// @ts-expect-error
accept(recordOfMap);
// @ts-expect-error
accept([] as unknown[]);
// @ts-expect-error
accept([] as object[]);
declare const mapInsideTupleArray: Array<[string, Map<string, number>]>;
// @ts-expect-error
accept(mapInsideTupleArray);

// Arrays of interfaces.
interface BadInner {
	value: Map<string, number>;
}
declare const innerArray: Inner[];
declare const badInnerArray: BadInner[];
accept(innerArray);
// @ts-expect-error
accept(badInnerArray);

// Interfaces with an index signature.
interface Dictionary {
	[key: string]: number;
}
interface NestedDictionary {
	[key: string]: {value: string};
}
interface BadNestedDictionary {
	[key: string]: {value: Map<string, number>};
}
interface StringOrNumberIndex {
	[key: string]: string | number;
}
interface BadNumberIndex {
	[key: number]: Map<string, number>;
}
interface DateNumberIndex {
	[key: number]: Date;
}
interface MixedIndexSignature {
	[key: string]: string | Date;
	[key: number]: Date;
}
interface ReadonlyStringIndex {
	readonly [key: string]: Date;
}
interface TemplateKeyIndex {
	[Key: `data-${string}`]: string;
}
interface TemplateKeyDateIndex {
	[Key: `data-${string}`]: Date;
}
interface BadTemplateKeyIndex {
	[Key: `data-${string}`]: Map<string, number>;
}
declare const dictionary: Dictionary;
declare const nestedDictionary: NestedDictionary;
declare const badNestedDictionary: BadNestedDictionary;
declare const stringOrNumberIndex: StringOrNumberIndex;
declare const badNumberIndex: BadNumberIndex;
declare const dateNumberIndex: DateNumberIndex;
declare const mixedIndexSignature: MixedIndexSignature;
declare const readonlyStringIndex: ReadonlyStringIndex;
declare const templateKeyIndex: TemplateKeyIndex;
declare const templateKeyDateIndex: TemplateKeyDateIndex;
declare const badTemplateKeyIndex: BadTemplateKeyIndex;

accept(dictionary);
accept(nestedDictionary);
accept(stringOrNumberIndex);
accept(dateNumberIndex);
accept(mixedIndexSignature);
accept(readonlyStringIndex);
accept(templateKeyIndex);
accept(templateKeyDateIndex);
// @ts-expect-error
accept(badNestedDictionary);
// @ts-expect-error
accept(badNumberIndex);
// @ts-expect-error
accept(badTemplateKeyIndex);

// Symbol keys are ignored, like `JSON.stringify` ignores them. A symbol value is still rejected.
interface SymbolKeyed {
	[key: symbol]: () => void;
	value: string;
}
interface SymbolIndex {
	[key: symbol]: Map<string, number>;
}
interface MixedSymbolIndex {
	[value: string]: string;
	[key: symbol]: Map<string, number>;
}
interface SymbolValueProperty {
	value: symbol;
}
declare const symbolKeyed: SymbolKeyed;
declare const symbolIndex: SymbolIndex;
declare const mixedSymbolIndex: MixedSymbolIndex;
declare const symbolValueProperty: SymbolValueProperty;
accept(symbolKeyed);
accept(symbolIndex);
accept(mixedSymbolIndex);
accept({[Symbol('key')]: new Map<string, number>(), value: 1});
// @ts-expect-error
accept(symbolValueProperty);

// Optional and readonly modifiers are kept.
type ReadonlyOptional = JsonifiableValue<{readonly value?: string}>;
declare const readonlyOptional: ReadonlyOptional;
expectTypeOf(readonlyOptional.value).toBe<string | undefined>();
// @ts-expect-error The property stays readonly.
readonlyOptional.value = 'test';
declare const readonlyValue: JsonifiableValue<{readonly value: string}>;
// @ts-expect-error The property stays readonly.
readonlyValue.value = 'test';

// Utility types keep or remove the checked properties.
type Source = {
	a: string;
	b: Map<string, number>;
	c: Date;
};
declare const partialValid: Partial<{a: string; c: Date}>;
declare const partialInvalid: Partial<Source>;
declare const partialMap: Partial<{value: Map<string, number>}>;
declare const pickedValid: Pick<Source, 'a' | 'c'>;
declare const pickedInvalid: Pick<Source, 'a' | 'b'>;
declare const omitted: Omit<Source, 'b'>;
declare const intersectionValid: {a: string} & {b: Date};
declare const intersectionInvalid: {a: string} & {b: Map<string, number>};
accept(partialValid);
accept(pickedValid);
accept(omitted);
accept(intersectionValid);
// @ts-expect-error
accept(partialInvalid);
// @ts-expect-error
accept(partialMap);
// @ts-expect-error
accept(pickedInvalid);
// @ts-expect-error
accept(intersectionInvalid);

// The JSON types accepted by `Jsonifiable` are accepted too.
declare const jsonValue: JsonValue;
declare const jsonObject: JsonObject;
declare const jsonArray: JsonArray;
declare const jsonifiable: Jsonifiable;
declare const jsonifiableObject: JsonifiableObject;
declare const jsonifiableArray: JsonifiableArray;

accept(jsonValue);
accept(jsonObject);
accept(jsonArray);
accept(jsonifiable);
accept(jsonifiableObject);
accept(jsonifiableArray);
expectTypeOf<Jsonifiable>().toBeAssignableTo<JsonifiableValue<Jsonifiable>>();
expectTypeOf<JsonValue>().toBeAssignableTo<JsonifiableValue<JsonValue>>();

// Tagged and flavored values, plus enums.
declare const taggedPrimitive: Tagged<number, 'TaggedPrimitive'>;
declare const taggedObject: Tagged<{value: string}, 'TaggedObject'>;
declare const taggedDate: Tagged<Date, 'TaggedDate'>;
declare const taggedUnion: Tagged<string | number, 'TaggedUnion'>;
declare const taggedMap: Tagged<Map<string, number>, 'TaggedMap'>;
declare const flavoredNumber: Flavor<number, 'FlavoredNumber'>;
enum NumericEnum {
	A,
	B,
}
enum StringEnum {
	A = 'a',
	B = 'b',
}
declare const numericEnum: NumericEnum;
declare const stringEnum: StringEnum;
declare const enumProperty: {status: NumericEnum.A};

accept(taggedPrimitive);
accept(taggedObject);
accept(taggedDate);
accept(taggedUnion);
accept(flavoredNumber);
accept(numericEnum);
accept(stringEnum);
accept(enumProperty);
// @ts-expect-error
accept(taggedMap);

// Generic interfaces.
interface Box<Value> {
	value: Value;
}
declare const stringBox: Box<string>;
declare const mapBox: Box<Map<string, number>>;
accept(stringBox);
// @ts-expect-error
accept(mapBox);

// Empty objects and the wide `object` type.
declare const emptyObject: {};
declare const emptyInterface: EmptyInterface;
interface EmptyInterface {}
declare const objectValue: object;
declare const objectField: {value: object};
declare const emptyObjectRecord: Record<string, {}>;
declare const anyField: {value: any};
declare const unknownField: {value: unknown};
declare const neverField: {value: never};

accept(emptyObject);
accept(emptyInterface);
accept({});
accept({value: {}});
accept(emptyObjectRecord);
accept(anyField);
accept(neverField);
// @ts-expect-error `object` can be a `Map`, so it is not JSON-able.
accept(objectValue);
// @ts-expect-error
accept(objectField);
// @ts-expect-error
accept(unknownField);

// A function type, including a construct signature, is rejected even when it is assignable to `Jsonifiable` through an index signature, because `JSON.stringify` writes nothing for a function. A function type with a `toJSON` method is accepted.
type CallableRecord = ((...arguments_: any[]) => any) & Record<string, Jsonifiable>;
declare const callableRecord: CallableRecord;
declare const callableWithToJSON: ((...arguments_: any[]) => any) & {toJSON(): string};
declare const constructorValue: new () => object;
declare const abstractConstructorValue: abstract new () => object;
declare const functionType: Function;

expectTypeOf(callableRecord).toBeAssignableTo<Jsonifiable>();
// @ts-expect-error
accept(callableRecord);
accept(callableWithToJSON);
// @ts-expect-error
accept(constructorValue);
// @ts-expect-error
accept(abstractConstructorValue);
// @ts-expect-error
accept(functionType);

// Values that `Jsonifiable` rejects. Some, like boxed primitives and typed arrays, serialize to a value, but they are rejected because their prototype methods are function-valued.
declare const mapValue: Map<string, number>;
declare const setValue: Set<string>;
declare const weakMapValue: WeakMap<object, string>;
declare const weakSetValue: WeakSet<object>;
declare const weakRefValue: WeakRef<object>;
declare const readonlyMapValue: ReadonlyMap<string, string>;
declare const readonlySetValue: ReadonlySet<string>;
declare const regexpValue: RegExp;
declare const promiseValue: Promise<string>;
declare const arrayBufferValue: ArrayBuffer;
declare const dataViewValue: DataView;
declare const typedArrayValue: Uint8Array;
declare const errorValue: Error;
declare const functionValue: () => void;
declare const bigintValue: bigint;
declare const symbolValue: symbol;
declare const boxedNumber: Number;
declare const boxedString: String;
declare const boxedBoolean: Boolean;
declare const boxedBigInt: BigInt;
declare const boxedSymbol: Symbol;
declare const unionWithMap: Test1 | {map: Map<string, number>};
declare const unionWithUndefined: Test1 | undefined;

// @ts-expect-error
accept(mapValue);
// @ts-expect-error
accept(setValue);
// @ts-expect-error
accept(weakMapValue);
// @ts-expect-error
accept(weakSetValue);
// @ts-expect-error
accept(weakRefValue);
// @ts-expect-error
accept(readonlyMapValue);
// @ts-expect-error
accept(readonlySetValue);
// @ts-expect-error
accept(regexpValue);
// @ts-expect-error
accept(promiseValue);
// @ts-expect-error
accept(arrayBufferValue);
// @ts-expect-error
accept(dataViewValue);
// @ts-expect-error
accept(typedArrayValue);
// @ts-expect-error `Error.cause` is `unknown`.
accept(errorValue);
// @ts-expect-error
accept(functionValue);
// @ts-expect-error
accept(bigintValue);
// @ts-expect-error
accept(symbolValue);
// @ts-expect-error
accept(boxedNumber);
// @ts-expect-error
accept(boxedString);
// @ts-expect-error
accept(boxedBoolean);
// @ts-expect-error
accept(boxedBigInt);
// @ts-expect-error
accept(boxedSymbol);
// @ts-expect-error
accept(unionWithMap);
// @ts-expect-error Top-level `undefined` is not allowed.
accept(unionWithUndefined);

// Nested invalid values are rejected.
declare const mapArray: Array<Map<string, number>>;
declare const mapTuple: [string, Map<string, number>];
declare const optionalMapArray: {value?: Array<Map<string, number>>};
// @ts-expect-error
accept(mapArray);
// @ts-expect-error
accept(mapTuple);
// @ts-expect-error
accept(optionalMapArray);

// `any` passes. `unknown`, `void`, and unique symbols become `never`. A union drops its non-JSON members.
declare const unknownValue: unknown;
declare const voidValue: void;
declare const uniqueSymbolValue: unique symbol;
declare const stringOrUndefined: string | undefined;
// @ts-expect-error
accept(unknownValue);
// @ts-expect-error
accept(voidValue);
// @ts-expect-error
accept(uniqueSymbolValue);
// @ts-expect-error
accept(stringOrUndefined);

expectTypeOf<JsonifiableValue<any>>().toBe<any>();
expectTypeOf<JsonifiableValue<unknown>>().toBe<never>();
expectTypeOf<JsonifiableValue<never>>().toBe<never>();
expectTypeOf<JsonifiableValue<object>>().toBe<never>();
expectTypeOf<JsonifiableValue<undefined>>().toBe<never>();
expectTypeOf<JsonifiableValue<void>>().toBe<never>();
expectTypeOf<JsonifiableValue<null | undefined>>().toBe<null>();
expectTypeOf<JsonifiableValue<string | undefined>>().toBe<string>();
expectTypeOf<JsonifiableValue<symbol>>().toBe<never>();
expectTypeOf<JsonifiableValue<typeof uniqueSymbolValue>>().toBe<never>();
expectTypeOf<JsonifiableValue<bigint>>().toBe<never>();
expectTypeOf<JsonifiableValue<Date>>().toBe<Date>();
expectTypeOf<JsonifiableValue<{}>>().toBe<{}>();

// The type can be used as an annotation.
const annotated: JsonifiableValue<Test2> = interfaceValue;
expectTypeOf(annotated.value).toBe<string>();
// @ts-expect-error A `Map` is not JSON-able.
const badAnnotated: JsonifiableValue<{value: Map<string, number>}> = {value: new Map()};

// Inference keeps the input type.
const identityPrimitive = identity('x');
expectTypeOf(identityPrimitive).toBe<'x'>();
const identityInterface = identity(interfaceValue);
expectTypeOf(identityInterface).toBe<Test2>();
const identityTuple = identity([1, 'a'] as [number, string]);
expectTypeOf(identityTuple).toBe<[number, string]>();
const identityConstTuple = identity([1, 2] as const);
expectTypeOf(identityConstTuple).toBe<readonly [1, 2]>();
const identityObject = identity({value: 'x'});
expectTypeOf(identityObject).toBe<{value: 'x'}>();
expectTypeOf(identity(user)).toBe<User>();
expectTypeOf(identity<Test2>(interfaceValue)).toBe<Test2>();

// `Jsonify` models the `JSON.parse` result, so it rejects some values that this type accepts.
declare function acceptJsonify<Value>(value: Jsonify<Value>): void;
declare const requiredUndefinedFieldValue: RequiredUndefinedField;
// @ts-expect-error `Jsonify<Date>` is `string`.
acceptJsonify<Date>(new Date());
// @ts-expect-error `Jsonify` makes the property optional, so the required `undefined` does not fit.
acceptJsonify<RequiredUndefinedField>(requiredUndefinedFieldValue);

// A moderately deep valid interface is accepted.
interface Level1 {
	value: number;
}
interface Level2 {
	next: Level1;
}
interface Level3 {
	next: Level2;
}
interface Level4 {
	next: Level3;
}
interface Level5 {
	next: Level4;
}
interface Level6 {
	next: Level5;
}
interface Level7 {
	next: Level6;
}
interface Level8 {
	next: Level7;
}
interface Level9 {
	next: Level8;
}
interface Level10 {
	next: Level9;
}
declare const deep: Level10;
accept(deep);

// A deeply nested invalid value is rejected.
interface BadLevel4 {
	value: Map<string, number>;
}
interface BadLevel3 {
	next: BadLevel4;
}
interface BadLevel2 {
	next: BadLevel3;
}
interface BadLevel1 {
	next: BadLevel2;
}
declare const badDeep: BadLevel1;
// @ts-expect-error The check recurses into the nested property.
accept(badDeep);

// It cannot be used as a type parameter constraint, because the constraint is circular.
// @ts-expect-error Type parameter 'Value' has a circular constraint.
declare function circularConstraint<Value extends JsonifiableValue<Value>>(value: Value): void;
