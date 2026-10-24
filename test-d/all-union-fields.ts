import {expectTypeOf} from 'nz';
import type {AllUnionFields, Simplify, ValueOf} from '../index.d.ts';
import type {NonRecursiveType} from '../source/internal/index.d.ts';

type TestingType = {
	function: () => void;
	record: Record<
		string,
		{
			propertyA: string;
		}
	>;
	object: {
		subObject: {
			subSubObject: {
				propertyA: string;
			};
		};
	};
	string: string;
	union: 'test1' | 'test2';
	number: number;
	boolean: boolean;
	date: Date;
	regexp: RegExp;
	symbol: symbol;
	null: null;
	undefined: undefined;
	optional?: boolean | undefined;
	readonly propertyWithKeyword: boolean;
	map: Map<string, {propertyA: string; propertyB: string}>;
	set: Set<string>;
	objectSet: Set<{propertyA: string; propertyB: string}>;
};

declare const normal: AllUnionFields<
TestingType | {string: string; number: number; foo: any}
>;
expectTypeOf(normal).toBe<Simplify<
	{
		string: string;
		number: number;
		foo?: any;
	} & Partial<Omit<TestingType, 'string' | 'number'>>
>>();

declare const unMatched: AllUnionFields<TestingType | {foo: any}>;
expectTypeOf(unMatched).toBe<Simplify<
	{
		foo?: any;
	} & Partial<TestingType>
>>();

declare const number: AllUnionFields<TestingType | {number: number; foo: any}>;
expectTypeOf(number).toBe<Simplify<{
	number: number;
	foo?: any;
} & Partial<Omit<TestingType, 'number'>>
>>();

declare const string: AllUnionFields<TestingType | {string: string; foo: any}>;
expectTypeOf(string).toBe<Simplify<{
	string: string;
	foo?: any;
} & Partial<Omit<TestingType, 'string'>>
>>();

declare const boolean: AllUnionFields<TestingType | {boolean: boolean; foo: any}>;
expectTypeOf(boolean).toBe<Simplify<{
	boolean: boolean;
	foo?: any;
} & Partial<Omit<TestingType, 'boolean'>>
>>();

declare const date: AllUnionFields<TestingType | {date: Date; foo: any}>;
expectTypeOf(date).toBe<Simplify<{
	date: Date;
	foo?: any;
} & Partial<Omit<TestingType, 'date'>>
>>();

declare const regexp: AllUnionFields<TestingType | {regexp: RegExp; foo: any}>;
expectTypeOf(regexp).toBe<Simplify<{
	regexp: RegExp;
	foo?: any;
} & Partial<Omit<TestingType, 'regexp'>>
>>();

declare const symbol: AllUnionFields<TestingType | {symbol: symbol; foo: any}>;
expectTypeOf(symbol).toBe<Simplify<{
	symbol: symbol;
	foo?: any;
} & Partial<Omit<TestingType, 'symbol'>>
>>();

declare const null_: AllUnionFields<TestingType | {null: null; foo: any}>;
expectTypeOf(null_).toBe<Simplify<{
	null: null;
	foo?: any;
} & Partial<Omit<TestingType, 'null'>>
>>();

declare const undefined_: AllUnionFields<TestingType | {undefined: undefined; foo: any}>;
expectTypeOf(undefined_).toBe<Simplify<{
	undefined: undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'undefined'>>
>>();

declare const optional: AllUnionFields<TestingType | {optional: string; foo: any}>;
expectTypeOf(optional).toBe<Simplify<{
	optional?: string | boolean | undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'optional'>>
>>();

declare const propertyWithKeyword: AllUnionFields<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectTypeOf(propertyWithKeyword).toBe<Simplify<{
	readonly propertyWithKeyword: boolean | string;
	foo?: any;
} & Partial<Omit<TestingType, 'propertyWithKeyword'>>
>>();

declare const map: AllUnionFields<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectTypeOf(map).toBe<Simplify<{
	map: TestingType['map'] | Map<string, {propertyA: string}>;
	foo?: any;
} & Partial<Omit<TestingType, 'map'>>
>>();

declare const set: AllUnionFields<TestingType | {set: Set<number>; foo: any}>;
expectTypeOf(set).toBe<Simplify<{
	set: TestingType['set'] | Set<number>;
	foo?: any;
} & Partial<Omit<TestingType, 'set'>>
>>();

declare const moreUnion: AllUnionFields<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectTypeOf(moreUnion).toBe<Simplify<{
	string: string;
	foo?: any;
	bar?: any;
} & Partial<Omit<TestingType, 'string'>>
>>();

declare const union: AllUnionFields<TestingType | {union: {a: number}}>;
expectTypeOf(union).toBe<Simplify<{
	union: 'test1' | 'test2' | {a: number};
} & Partial<Omit<TestingType, 'union'>>
>>();

declare const unionWithOptional: AllUnionFields<{a?: string; foo: number} | {a: string; bar: string}>;
expectTypeOf(unionWithOptional).toBe<{
	a?: string;
	foo?: number;
	bar?: string;
}>();

declare const mixedKeywords: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string}>;
expectTypeOf(mixedKeywords).toBe<{
	readonly a: string;
	readonly b: string | number;
}>();

declare const mixedKeywords2: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string} | {readonly c: number}>;
expectTypeOf(mixedKeywords2).toBe<{
	readonly a?: string;
	readonly b?: string | number;
	readonly c?: number;
}>();

// Discriminated union
declare const discriminatedUnion: AllUnionFields<{id: number; type: 'Email'; email: string} | {id: number; type: 'Phone'; phone: string}>;
expectTypeOf(discriminatedUnion).toBe<{
	id: number;
	type: 'Email' | 'Phone';
	email?: string;
	phone?: string;
}>();

// A non-shared key with different types in different members gets the union of the types, not `never`.
declare const nonSharedKeyWithDifferentTypes: AllUnionFields<{kind: 'a'; extra: string} | {kind: 'b'; other: number} | {kind: 'c'; extra: number}>;
expectTypeOf(nonSharedKeyWithDifferentTypes).toBe<{
	kind: 'a' | 'b' | 'c';
	extra?: string | number;
	other?: number;
}>();

// Each shared key gets the union of its types on its own, so values from different members can be mixed.
type IdAndSerial = AllUnionFields<{id: number; serial: number} | {id: string; serial: string}>;
expectTypeOf<IdAndSerial>().toBe<{id: number | string; serial: number | string}>();
expectTypeOf({id: 3, serial: 'j'}).toBeAssignableTo<IdAndSerial>();
expectTypeOf({id: 3, serial: 'j'}).not.toBeAssignableTo<{id: number; serial: number} | {id: string; serial: string}>();

// A key that is optional in only one member does not make the other shared keys accept `undefined`.
expectTypeOf<AllUnionFields<{a: string; b: number} | {a: string; b?: number}>>().toBe<{a: string; b?: number}>();

// A key that is optional in every member stays optional.
expectTypeOf<AllUnionFields<{a?: string} | {a?: number}>>().toBe<{a?: string | number}>();

// A shared key with an `undefined` value stays required.
expectTypeOf<AllUnionFields<{a: string; b: number} | {a: string; b: undefined}>>().toBe<{a: string; b: number | undefined}>();

// An empty object member makes every key optional.
expectTypeOf<AllUnionFields<{a: string; b: number} | {}>>().toBe<{a?: string; b?: number}>();

// `never` and `unknown` values are absorbed like in any other union.
expectTypeOf<AllUnionFields<{a: string} | {a: never}>>().toBe<{a: string}>();
expectTypeOf<AllUnionFields<{a: string} | {a: unknown}>>().toBe<{a: unknown}>();

// Index signature member
expectTypeOf<AllUnionFields<Record<string, number> | {a: string}>>().toBe<Simplify<{a: string | number} & {[key: string]: number | undefined}>>();

// Merge the values of an object with `ValueOf`
type Retry = () => void;
type Steps = {
	'install-app': {title: string; onRetry: Retry};
	'generate-uat': {title: string; desc: string; onRetry: Retry};
	'storing-locally': {title: string; onRetry: Retry};
};
expectTypeOf<AllUnionFields<ValueOf<Steps>>>().toBe<{title: string; onRetry: Retry; desc?: string}>();

// Only the values of the given keys are merged.
expectTypeOf<AllUnionFields<ValueOf<Steps, 'install-app' | 'storing-locally'>>>().toBe<{title: string; onRetry: Retry}>();

// TypeScript does not merge separately written function types in a union, so the merged type is only mutually assignable, not identical.
type InlineSteps = {
	'install-app': {title: string; onRetry: () => void};
	'generate-uat': {title: string; desc: string; onRetry: () => void};
};
type StepProps = AllUnionFields<ValueOf<InlineSteps>>;
expectTypeOf<StepProps>().toBeAssignableTo<{title: string; onRetry: () => void; desc?: string}>();
expectTypeOf<{title: string; onRetry: () => void; desc?: string}>().toBeAssignableTo<StepProps>();
expectTypeOf<{title: string; onRetry: () => void}>().toBeAssignableTo<StepProps>();
expectTypeOf<{onRetry: () => void; desc: string}>().not.toBeAssignableTo<StepProps>();

// Values with different types for the same key
expectTypeOf<AllUnionFields<ValueOf<{a: {x: number; y: string}; b: {x: string; z: boolean}}>>>().toBe<{x: number | string; y?: string; z?: boolean}>();

// Optional and readonly keys in the values are kept.
expectTypeOf<AllUnionFields<ValueOf<{a: {readonly x: number; y?: string}; b: {x: number}}>>>().toBe<{readonly x: number; y?: string}>();

// Nested objects are not merged.
expectTypeOf<AllUnionFields<ValueOf<{a: {nested: {x: 1}}; b: {nested: {y: 2}}}>>>().toBe<{nested: {x: 1} | {y: 2}}>();

// A single value is returned as is.
expectTypeOf<AllUnionFields<ValueOf<{a: {x: 1; y?: 2}}>>>().toBe<{x: 1; y?: 2}>();

// Values of an index signature
expectTypeOf<AllUnionFields<ValueOf<Record<string, {a: number} | {b: string}>>>>().toBe<{a?: number; b?: string}>();

// Values that are not objects are kept as separate union members.
expectTypeOf<AllUnionFields<ValueOf<{a: {x: 1}; b: {x: 2; y: 3}; c: string}>>>().toBe<string | {x: 1 | 2; y?: 3}>();

// An object without values
expectTypeOf<AllUnionFields<ValueOf<{}>>>().toBe<never>();

// Non-recursive types
expectTypeOf<AllUnionFields<Set<string> | Map<string, string>>>().toBe<Set<string> | Map<string, string>>();
expectTypeOf<AllUnionFields<string[] | Set<string>>>().toBe<string[] | Set<string>>();
expectTypeOf<AllUnionFields<NonRecursiveType>>().toBe<NonRecursiveType>();

// Mix of non-recursive and recursive types
expectTypeOf<AllUnionFields<{a: string} | {a: number; b: true} | undefined>>().toBe<{a: string | number; b?: true} | undefined>();
expectTypeOf<AllUnionFields<RegExp | {test: string}>>().toBe<RegExp | {test: string}>();
expectTypeOf<AllUnionFields<RegExp | null | {test: string} | {test: number; foo: any}>>().toBe<RegExp | null | {test: string | number; foo?: any}>();

// Boundary types
expectTypeOf<AllUnionFields<any>>().toBe<any>();
expectTypeOf<AllUnionFields<never>>().toBe<never>();

// A `WeakMap` and a `WeakSet` are passed through like a `Map` and a `Set`, rather than having their members spread into an object.
declare const weakMapSkipped: AllUnionFields<WeakMap<object, string> | {a: 1}>;
expectTypeOf(weakMapSkipped).toBe<WeakMap<object, string> | {a: 1}>();

declare const weakSetSkipped: AllUnionFields<WeakSet<object> | {a: 1}>;
expectTypeOf(weakSetSkipped).toBe<WeakSet<object> | {a: 1}>();

// A numeric property and its string spelling identify the same required runtime field.
type NumericAliasFields = AllUnionFields<{0: 'left'} | {'0': 'right'}>;
expectTypeOf<{}>().not.toBeAssignableTo<NumericAliasFields>();
declare const numericAliasFields: NumericAliasFields;
expectTypeOf(numericAliasFields[0]).toBe<'left' | 'right'>();

type DiscriminatedAliasFields = AllUnionFields<{kind: 'left'; 0: string} | {kind: 'right'; '0': number}>;
declare const discriminatedAliasFields: DiscriminatedAliasFields;
expectTypeOf(discriminatedAliasFields[0]).toBe<string | number>();

// Choosing the numeric spelling also preserves optionality, readonly fields, and declared undefined values.
expectTypeOf<AllUnionFields<{'0': 'right'} | {0: 'left'}>>().toBe<{0: 'left' | 'right'}>();
expectTypeOf<AllUnionFields<{0?: 'left'} | {'0': 'right'}>>().toBe<{0?: 'left' | 'right'}>();
expectTypeOf<AllUnionFields<{0?: 'left' | undefined} | {'0'?: 'right'}>>().toBe<{0?: 'left' | 'right' | undefined}>();
const optionalAliasUndefined: AllUnionFields<{0?: 'left' | undefined} | {'0'?: 'right'}> = {0: undefined};
expectTypeOf(optionalAliasUndefined[0]).toBe<'left' | 'right' | undefined>();
expectTypeOf<AllUnionFields<{readonly 0: 'left'} | {'0': 'right'}>>().toBe<{readonly 0: 'left' | 'right'}>();
expectTypeOf<AllUnionFields<{0: 'left' | undefined} | {'0': 'right'}>>().toBe<{0: 'left' | 'right' | undefined}>();
expectTypeOf<AllUnionFields<{[-1]: 'negative'} | {'-1': 1}>>().toBe<{[-1]: 'negative' | 1}>();
expectTypeOf<AllUnionFields<{1.5: 'fraction'} | {'1.5': 2}>>().toBe<{1.5: 'fraction' | 2}>();
declare const readonlyAliasFields: AllUnionFields<{readonly 0: string} | {'0': number}>;
// @ts-expect-error A readonly contributor keeps the merged field readonly.
readonlyAliasFields[0] = 'changed';

// Ordinary key spelling is kept when there is no numeric/string collision.
expectTypeOf<keyof AllUnionFields<{0: string} | {0: number}>>().toBe<0>();
expectTypeOf<keyof AllUnionFields<{'0': string} | {'0': number}>>().toBe<'0'>();
expectTypeOf<AllUnionFields<{1: string} | {'01': number}>>().toBe<{1?: string; '01'?: number}>();
expectTypeOf<AllUnionFields<{0: string} | {'-0': number}>>().toBe<{0?: string; '-0'?: number}>();
expectTypeOf<AllUnionFields<{1.5: string} | {'1.50': number}>>().toBe<{1.5?: string; '1.50'?: number}>();

// Index signatures retain their declared fields without interpreting noncanonical strings as numeric keys.
type NonCanonicalIndexFields = AllUnionFields<{[key: number]: string; '01': number} | {label: true}>;
declare const nonCanonicalIndexFields: NonCanonicalIndexFields;
expectTypeOf(nonCanonicalIndexFields['01']).toBe<number | undefined>();
expectTypeOf(nonCanonicalIndexFields[0]).toBe<string | undefined>();
expectTypeOf<keyof AllUnionFields<Record<string, number>>>().toBe<string>();
expectTypeOf<keyof AllUnionFields<Record<number, string>>>().toBe<number>();
declare const indexedAliasFields: AllUnionFields<{[key: string]: unknown; 0: 'left'} | {'0': 'right'}>;
expectTypeOf(indexedAliasFields['0']).toBe<'left' | 'right'>();

// A numeric template is a key domain, not an exact numeric spelling to normalize.
type NumericPatternFields = AllUnionFields<Record<`${number}`, string> | Record<number, number>>;
declare const numericPatternFields: NumericPatternFields;
const numericPatternKey: keyof NumericPatternFields = '01';
expectTypeOf(numericPatternFields[numericPatternKey]).toBeAssignableTo<string | number | undefined>();

// A consumer can read the common field after combining objects declared with either spelling.
declare function collectFields<Value extends object>(values: readonly Value[]): AllUnionFields<Value>;
declare const recordsWithAliases: ReadonlyArray<{0: 'left'} | {'0': 'right'}>;
const collectedAliasFields = collectFields(recordsWithAliases);
expectTypeOf(collectedAliasFields[0]).toBe<'left' | 'right'>();
declare function acceptCollectedKey(key: keyof typeof collectedAliasFields): void;
// @ts-expect-error Combining fields does not invent a missing property.
acceptCollectedKey('missing');

function _genericCommonField<Value>(value: AllUnionFields<{known: Value} | {known: Value; extra: 1}>): Value {
	return value.known;
}

expectTypeOf<AllUnionFields<unknown>>().toBe<{}>();

// The numeric spelling can be a declared enum member rather than a plain numeric literal.
enum NumericField {
	Item = 0,
}

type EnumAliasFields = AllUnionFields<{[NumericField.Item]: 'left'} | {'0': 'right'}>;
expectTypeOf<{}>().not.toBeAssignableTo<EnumAliasFields>();
declare const enumAliasFields: EnumAliasFields;
expectTypeOf(enumAliasFields[0]).toBe<'left' | 'right'>();
expectTypeOf<keyof EnumAliasFields>().toBe<NumericField.Item>();
expectTypeOf<AllUnionFields<{'0': 'right'} | {[NumericField.Item]: 'left'}>>().toBe<{[NumericField.Item]: 'left' | 'right'}>();
expectTypeOf<AllUnionFields<{[NumericField.Item]?: 'left' | undefined} | {'0'?: 'right'}>>().toBe<{[NumericField.Item]?: 'left' | 'right' | undefined}>();
declare const readonlyEnumAliasFields: AllUnionFields<{readonly [NumericField.Item]: 'left'} | {'0': 'right'}>;
expectTypeOf(readonlyEnumAliasFields[NumericField.Item]).toBe<'left' | 'right'>();
// @ts-expect-error A readonly enum contributor keeps the merged field readonly.
readonlyEnumAliasFields[NumericField.Item] = 'left';

enum SignedNumericField {
	Negative = -1,
	Fraction = 1.5,
}

expectTypeOf<AllUnionFields<{[SignedNumericField.Negative]: 'negative'} | {'-1': 1}>>().toBe<{[SignedNumericField.Negative]: 'negative' | 1}>();
expectTypeOf<AllUnionFields<{[SignedNumericField.Fraction]: 'fraction'} | {'1.5': 2}>>().toBe<{[SignedNumericField.Fraction]: 'fraction' | 2}>();

// An index signature must not hide fields declared in every union member.
type DeclaredIndexedFields =
	| {[key: string]: unknown; readonly kind: 'text'; id: string}
	| {[key: string]: unknown; readonly kind: 'number'; id: number};
declare const declaredIndexedFields: AllUnionFields<DeclaredIndexedFields>;
expectTypeOf(declaredIndexedFields.id).toBe<string | number>();
expectTypeOf<{}>().not.toBeAssignableTo<AllUnionFields<DeclaredIndexedFields>>();

// An explicitly optional common field remains optional, including declared undefined values.
type IndexedOptionalFields = {[key: string]: unknown; readonly label?: 'left' | undefined} | {[key: string]: unknown; label?: 'right'};
const optionalIndexedFields: AllUnionFields<IndexedOptionalFields> = {label: undefined};
expectTypeOf(optionalIndexedFields.label).toBe<'left' | 'right' | undefined>();
// @ts-expect-error A readonly contributor keeps the shared declaration readonly.
optionalIndexedFields.label = 'left';

declare const indexedSymbol: unique symbol;
declare const symbolIndexedFields: AllUnionFields<{[key: symbol]: unknown; [indexedSymbol]: string} | {[key: symbol]: unknown; [indexedSymbol]: number}>;
expectTypeOf(symbolIndexedFields[indexedSymbol]).toBe<string | number>();

// Inference retains required fields rather than only the permissive index signature.
declare const indexedAlternatives: readonly DeclaredIndexedFields[];
const collectedIndexedFields = collectFields(indexedAlternatives);
expectTypeOf(collectedIndexedFields.id).toBe<string | number>();
expectTypeOf<{kind: 'text'; id: boolean}>().not.toBeAssignableTo<typeof collectedIndexedFields>();

// A numeric template index signature covers a numeric key of another member, like a `number` index signature does.
type TemplateIndexedFields = AllUnionFields<{[key: `${number}`]: string; label: true} | {0: number}>;
expectTypeOf<TemplateIndexedFields[0]>().toBe<string | number>();
expectTypeOf<{label: true}>().not.toBeAssignableTo<TemplateIndexedFields>();

// A `number` index signature covers the canonical string spelling of a numeric key of another member.
type NumberIndexedFields = AllUnionFields<{[key: number]: string; label: true} | {'0': number}>;
expectTypeOf<NumberIndexedFields[0]>().toBe<string | number>();
expectTypeOf<{label: true}>().not.toBeAssignableTo<NumberIndexedFields>();
expectTypeOf<{0: 'zero'}>().toBeAssignableTo<NumberIndexedFields>();
