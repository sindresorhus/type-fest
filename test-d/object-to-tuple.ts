import {expectTypeOf} from 'nz';
import type {ObjectToTuple, TupleToObject, TupleOf} from '../index.d.ts';

// Keys determine order, regardless of declaration order or spelling.
expectTypeOf<ObjectToTuple<{}>>().toBe<[]>();
expectTypeOf<ObjectToTuple<{0: string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{2: boolean; 0: string; 1: number}>>().toBe<[string, number, boolean]>();
expectTypeOf<ObjectToTuple<{'1': number; '0': string}>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<{0: string; '1': number; 2: boolean}>>().toBe<[string, number, boolean]>();
expectTypeOf<ObjectToTuple<{0: 'same'; 1: 'same'}>>().toBe<['same', 'same']>();

// Values are preserved without distribution or recursive conversion.
expectTypeOf<ObjectToTuple<{0: string | number; 1: undefined; 2: null}>>().toBe<[string | number, undefined, null]>();
expectTypeOf<ObjectToTuple<{0: never; 1: any; 2: unknown}>>().toBe<[never, any, unknown]>();
expectTypeOf<ObjectToTuple<{0: {0: string}; 1: readonly [number]; 2: (value: string) => boolean}>>().toBe<[{0: string}, readonly [number], (value: string) => boolean]>();
expectTypeOf<ObjectToTuple<{readonly 0: string; 1: number}>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<{readonly '0': string; readonly '1': boolean}>>().toBe<[string, boolean]>();

type ParameterObject = {
	1: number;
	0: string;
};

expectTypeOf<ObjectToTuple<ParameterObject>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<{0: string} & {1: number}>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<{0: string} & {'0': string; 1: number}>>().toBe<[string, number]>();

// Unions retain the correlation between positions and the length of each member.
expectTypeOf<ObjectToTuple<{0: 'text'; 1: string} | {0: 'count'; 1: number}>>().toBe<['text', string] | ['count', number]>();
expectTypeOf<ObjectToTuple<{0: string} | {0: number; 1: boolean}>>().toBe<[string] | [number, boolean]>();
expectTypeOf<ObjectToTuple<{} | {0: string}>>().toBe<[] | [string]>();
expectTypeOf<ObjectToTuple<{0: string} | {1: number}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<Record<number, number> | {0: string}>>().toBe<[string]>();

// Recover finite required tuples, including a realistic mapped schema.
expectTypeOf<ObjectToTuple<TupleToObject<[string, number, boolean]>>>().toBe<[string, number, boolean]>();
expectTypeOf<ObjectToTuple<TupleToObject<readonly [string, number]>>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<TupleToObject<[]>>>().toBe<[]>();
type ParameterSchema = {0: {type: string}; 1: {type: number}};
type ParameterTypes = {[Key in keyof ParameterSchema]: ParameterSchema[Key]['type']};
expectTypeOf<ObjectToTuple<ParameterTypes>>().toBe<[string, number]>();

// Numeric ordering continues beyond single-digit indices; normal schema sizes remain usable.
type OrderedPositions = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
expectTypeOf<ObjectToTuple<TupleToObject<OrderedPositions>>>().toBe<OrderedPositions>();
expectTypeOf<ObjectToTuple<TupleToObject<TupleOf<50, 'value'>>>>().toBe<TupleOf<50, 'value'>>();

// Missing positions must not silently truncate or shift the result.
expectTypeOf<ObjectToTuple<{1: string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; 2: boolean}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; 1: number; 10: boolean}>>().toBe<never>();

// Optional properties are unsupported, including optional `never`.
expectTypeOf<ObjectToTuple<{0?: string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; 1?: number}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0?: string; 1: number}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; 1?: never}>>().toBe<never>();

// Extra keys are rejected, rather than being ignored.
declare const metadata: unique symbol;
expectTypeOf<ObjectToTuple<{name: string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; name: number}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; length: 1}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; [metadata]: true}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; '-1': number}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{'00': string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; '01': number}>>().toBe<never>();

// Index signatures and array members do not define a finite set of positions.
expectTypeOf<ObjectToTuple<Record<number, string>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Record<string, string>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Record<symbol, string>>>().toBe<never>();
expectTypeOf<ObjectToTuple<{[key: number]: string; 0: 'first'}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{[key: string]: string; '0': 'first'}>>().toBe<never>();
expectTypeOf<ObjectToTuple<Record<`${number}`, string>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Record<`${bigint}`, string>>>().toBe<never>();
expectTypeOf<ObjectToTuple<[]>>().toBe<never>();
expectTypeOf<ObjectToTuple<readonly [string, number]>>().toBe<never>();
expectTypeOf<ObjectToTuple<string[]>>().toBe<never>();
expectTypeOf<ObjectToTuple<TupleToObject<[string, ...number[]]>>>().toBe<never>();

// Boundary inputs.
expectTypeOf<ObjectToTuple<any>>().toBe<any>();
expectTypeOf<ObjectToTuple<never>>().toBe<never>();
// @ts-expect-error The input must be an object.
type UnknownInput = ObjectToTuple<unknown>;
// @ts-expect-error The input must be an object.
type PrimitiveInput = ObjectToTuple<string>;
// @ts-expect-error The input must be an object.
type NullInput = ObjectToTuple<null>;
// @ts-expect-error The input must be an object.
type UndefinedInput = ObjectToTuple<undefined>;

// The resulting tuple can be used as a function's parameters.
declare const invoke: (...arguments_: ObjectToTuple<ParameterTypes>) => void;
invoke('example', 3);
// @ts-expect-error Positions must have their corresponding types.
invoke(3, 'example');
// @ts-expect-error Required arguments cannot be omitted.
invoke('example');
// @ts-expect-error Extra arguments are not allowed.
invoke('example', 3, true);

// Class instances include inherited positions, without requiring a string index signature.
declare class FirstPosition {
	readonly 0: string;
}

declare class InheritedPositions extends FirstPosition {
	'1': number;
	2: boolean;
}

declare class OptionalInheritedPosition extends FirstPosition {
	1?: number;
}

expectTypeOf<ObjectToTuple<FirstPosition>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<InheritedPositions>>().toBe<[string, number, boolean]>();
expectTypeOf<ObjectToTuple<OptionalInheritedPosition>>().toBe<never>();

// Mapped types retain the same rules for positions and property modifiers.
type Positions = {0: string; 1: number; 2: boolean};
expectTypeOf<ObjectToTuple<Readonly<Positions>>>().toBe<[string, number, boolean]>();
expectTypeOf<ObjectToTuple<Partial<Positions>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Required<Partial<Positions>>>>().toBe<[string, number, boolean]>();
expectTypeOf<ObjectToTuple<Pick<Positions, 0 | 1>>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<Pick<Positions, 0 | 2>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Omit<Positions, 2>>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<Omit<Positions, 1>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Omit<Positions, keyof Positions>>>().toBe<[]>();
expectTypeOf<ObjectToTuple<Record<0 | 1 | 2, 'value'>>>().toBe<['value', 'value', 'value']>();
expectTypeOf<ObjectToTuple<Record<'0' | '1' | '2', boolean>>>().toBe<[boolean, boolean, boolean]>();
expectTypeOf<ObjectToTuple<{[Key in keyof Positions]: {value: Positions[Key]}}>>().toBe<[{value: string}, {value: number}, {value: boolean}]>();
expectTypeOf<ObjectToTuple<{[Key in keyof Positions as `${Key}`]: Positions[Key]}>>().toBe<[string, number, boolean]>();

// Numeric and string aliases describe one position, including in intersections.
expectTypeOf<ObjectToTuple<{0?: string} & {'0': string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{0: string} & {'0'?: string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{readonly 0?: string} & {'0': string; 1: number}>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<{0: string | number} & {'0': string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{0: string} & {'0': number}>>().toBe<[never]>();
expectTypeOf<ObjectToTuple<{0: string; 1: number | boolean} & {'1': number}>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<{'0': string; 1?: number} & {'1': number}>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<{0?: string} & {'0'?: string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string} & {1: number} & {'2': boolean}>>().toBe<[string, number, boolean]>();
expectTypeOf<ObjectToTuple<Positions & {metadata: never}>>().toBe<never>();

// Required positions with unusual values must not be treated as optional or missing.
expectTypeOf<ObjectToTuple<{0: undefined}>>().toBe<[undefined]>();
expectTypeOf<ObjectToTuple<{0: null}>>().toBe<[null]>();
expectTypeOf<ObjectToTuple<{0: void}>>().toBe<[void]>();
expectTypeOf<ObjectToTuple<{0: never}>>().toBe<[never]>();
expectTypeOf<ObjectToTuple<{0: any}>>().toBe<[any]>();
expectTypeOf<ObjectToTuple<{0: unknown}>>().toBe<[unknown]>();
expectTypeOf<ObjectToTuple<{0: string | undefined; 1: number | null}>>().toBe<[string | undefined, number | null]>();
expectTypeOf<ObjectToTuple<Required<{0?: string | undefined; 1?: number}>>>().toBe<[string | undefined, number]>();
expectTypeOf<ObjectToTuple<{0: false; 1: 0; 2: ''; 3: 0n}>>().toBe<[false, 0, '', 0n]>();
expectTypeOf<ObjectToTuple<{0: symbol; 1: typeof metadata}>>().toBe<[symbol, typeof metadata]>();

// Nested values keep their own modifiers, unions, and signatures.
type RecursiveValue = {readonly next?: RecursiveValue};
type OverloadedFunction = {
	(value: string): number;
	(value: number): string;
};
type GenericFunction = <Value>(value: Value) => Value;
type Constructor = new (name: string) => {name: string};
type BrandedString = string & {readonly brand: unique symbol};
expectTypeOf<ObjectToTuple<{0: RecursiveValue}>>().toBe<[RecursiveValue]>();
expectTypeOf<ObjectToTuple<{0: OverloadedFunction; 1: GenericFunction; 2: Constructor}>>().toBe<[OverloadedFunction, GenericFunction, Constructor]>();
expectTypeOf<ObjectToTuple<{0: BrandedString}>>().toBe<[BrandedString]>();
expectTypeOf<ObjectToTuple<{0: {readonly name?: string}; 1: readonly number[]}>>().toBe<[{readonly name?: string}, readonly number[]]>();
expectTypeOf<ObjectToTuple<{0: {status: 'ok'; value: string} | {status: 'error'; error: Error}}>>().toBe<[{status: 'ok'; value: string} | {status: 'error'; error: Error}]>();
expectTypeOf<ObjectToTuple<{0: [string, number?]; 1: [boolean, ...number[]]}>>().toBe<[[string, number?], [boolean, ...number[]]]>();
expectTypeOf<ObjectToTuple<{0: Promise<string>; 1: Map<string, number>; 2: Set<boolean>}>>().toBe<[Promise<string>, Map<string, number>, Set<boolean>]>();
expectTypeOf<ObjectToTuple<{0: Record<number, string>; 1: Record<string, unknown>}>>().toBe<[Record<number, string>, Record<string, unknown>]>();

// Generic value types work through the public type without widening.
type Pair<Value> = ObjectToTuple<{readonly '0': Value; 1: Value[]}>;
expectTypeOf<Pair<'literal'>>().toBe<['literal', Array<'literal'>]>();
expectTypeOf<Pair<string | number>>().toBe<[string | number, Array<string | number>]>();
expectTypeOf<Pair<never>>().toBe<[never, never[]]>();
expectTypeOf<Pair<any>>().toBe<[any, any[]]>();
expectTypeOf<Pair<unknown>>().toBe<[unknown, unknown[]]>();

// Unions distribute over objects, but not independently over their values.
expectTypeOf<ObjectToTuple<{0: 'left' | 'right'; 1: 1 | 2}>>().toBe<['left' | 'right', 1 | 2]>();
expectTypeOf<ObjectToTuple<{0: 'left'; 1: 1} | {'0': 'right'; '1': 2}>>().toBe<['left', 1] | ['right', 2]>();
expectTypeOf<ObjectToTuple<{0: 'only'} | {'0': 'pair'; 1: number} | {0: 'triple'; 1: boolean; '2': Date}>>().toBe<['only'] | ['pair', number] | ['triple', boolean, Date]>();
expectTypeOf<ObjectToTuple<{0: string} | {0: number; 1?: boolean}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{0: string} | {0: number; 2: boolean}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{0: string} | {0: number; extra: boolean}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{0: string} | {0: number; [metadata]: true}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<readonly [number] | {0: string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<Record<`${number}`, number> | {0: string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<Record<symbol, number> | {0: string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<{1: string} | {0?: number} | {extra: boolean}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{} | {0?: string}>>().toBe<[]>();
expectTypeOf<ObjectToTuple<{0: never} | {0: string; 1: number}>>().toBe<[never] | [string, number]>();
expectTypeOf<ObjectToTuple<({0: 'text'} | {0: 'count'}) & {1: boolean}>>().toBe<['text', boolean] | ['count', boolean]>();
expectTypeOf<ObjectToTuple<never | {0: string}>>().toBe<[string]>();
expectTypeOf<ObjectToTuple<any | {0: string}>>().toBe<any>();

// Optional modifiers are rejected regardless of the property's value type or spelling.
expectTypeOf<ObjectToTuple<{'0'?: string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{readonly 0?: string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0?: undefined}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0?: any}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0?: unknown}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; '1'?: number | undefined}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; readonly 1?: unknown}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; 1: number; 2?: boolean}>>().toBe<never>();

// A valid prefix does not make extra named, optional, or symbol properties valid.
expectTypeOf<ObjectToTuple<{[metadata]: string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; extra?: never}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; [metadata]?: never}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; 1: number; length: 2}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; toString(): string}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; constructor: Function}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; __proto__: object}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{0: string; '': number}>>().toBe<never>();

// Index signatures stay invalid even after several declared positions are consumed.
expectTypeOf<ObjectToTuple<Positions & Record<number, unknown>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Positions & Record<string, unknown>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Positions & Record<symbol, unknown>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Positions & Record<`${number}`, unknown>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Positions & Record<`${bigint}`, unknown>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Positions & Record<`data-${string}`, unknown>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Readonly<Record<number, string>>>>().toBe<never>();
expectTypeOf<ObjectToTuple<Partial<Record<number, string>>>>().toBe<never>();
expectTypeOf<ObjectToTuple<{[key: number]: string; '0': 'first'; '1': 'second'}>>().toBe<never>();
expectTypeOf<ObjectToTuple<{[key: string]: unknown; 0: string; 1: number}>>().toBe<never>();

// Arrays are not numeric records, including empty, optional, and variadic tuples.
expectTypeOf<ObjectToTuple<readonly []>>().toBe<never>();
expectTypeOf<ObjectToTuple<[string]>>().toBe<never>();
expectTypeOf<ObjectToTuple<[string?]>>().toBe<never>();
expectTypeOf<ObjectToTuple<[string, ...number[]]>>().toBe<never>();
expectTypeOf<ObjectToTuple<[...string[], number]>>().toBe<never>();
expectTypeOf<ObjectToTuple<readonly number[]>>().toBe<never>();
expectTypeOf<ObjectToTuple<never[]>>().toBe<never>();
expectTypeOf<ObjectToTuple<any[]>>().toBe<never>();
expectTypeOf<ObjectToTuple<unknown[]>>().toBe<never>();
expectTypeOf<ObjectToTuple<[] & {0: string}>>().toBe<never>();

// Round trips preserve values and positions, while dropping tuple labels and readonly.
expectTypeOf<ObjectToTuple<TupleToObject<readonly []>>>().toBe<[]>();
expectTypeOf<ObjectToTuple<TupleToObject<[name: string, count: number]>>>().toBe<[string, number]>();
expectTypeOf<ObjectToTuple<TupleToObject<[undefined, never, any, unknown]>>>().toBe<[undefined, never, any, unknown]>();
expectTypeOf<TupleToObject<ObjectToTuple<{'0': string; readonly '1': boolean}>>>().toBe<{0: string; 1: boolean}>();
expectTypeOf<ObjectToTuple<TupleToObject<[string?]>>>().toBe<never>();
expectTypeOf<ObjectToTuple<TupleToObject<[string, number?]>>>().toBe<never>();
expectTypeOf<ObjectToTuple<TupleToObject<readonly [string, number?]>>>().toBe<never>();
expectTypeOf<ObjectToTuple<TupleToObject<string[]>>>().toBe<never>();
expectTypeOf<ObjectToTuple<TupleToObject<[...string[], number]>>>().toBe<never>();
expectTypeOf<ObjectToTuple<TupleToObject<[string, ...number[], boolean]>>>().toBe<never>();

// The conversion uses known keys, rather than testing the runtime shape of an object.
expectTypeOf<ObjectToTuple<object>>().toBe<[]>();
expectTypeOf<ObjectToTuple<Record<never, unknown>>>().toBe<[]>();
expectTypeOf<ObjectToTuple<() => void>>().toBe<[]>();
expectTypeOf<ObjectToTuple<new () => object>>().toBe<[]>();

// All non-object primitive types fail the public constraint.
// @ts-expect-error The input must be an object.
type NumberInput = ObjectToTuple<number>;
// @ts-expect-error The input must be an object.
type BooleanInput = ObjectToTuple<boolean>;
// @ts-expect-error The input must be an object.
type BigIntInput = ObjectToTuple<bigint>;
// @ts-expect-error The input must be an object.
type SymbolInput = ObjectToTuple<symbol>;
// @ts-expect-error Every union member must satisfy the object constraint.
type MixedPrimitiveInput = ObjectToTuple<number | {0: string}>;

// A readonly source gives a mutable tuple with exact values and bounds.
const source = {0: 'first', 1: 2} as const;
type Converted = ObjectToTuple<typeof source>;
expectTypeOf<Converted>().toBe<['first', 2]>();
const converted: Converted = ['first', 2];
converted[0] = 'first';
converted[1] = 2;
expectTypeOf(converted[0]).toBe<'first'>();
expectTypeOf(converted[1]).toBe<2>();
expectTypeOf(converted.length).toBe<2>();
// @ts-expect-error Each position keeps its literal type.
converted[0] = 'other';
// @ts-expect-error The converted tuple has no third position.
expectTypeOf(converted[2]).toBe<undefined>();
expectTypeOf<readonly ['first', 2]>().not.toBeAssignableTo<Converted>();
expectTypeOf<[2, 'first']>().not.toBeAssignableTo<Converted>();
expectTypeOf<['first']>().not.toBeAssignableTo<Converted>();
expectTypeOf<['first', 2, true]>().not.toBeAssignableTo<Converted>();

// A required undefined value still requires an argument at that position.
declare const invokeUndefined: (...arguments_: ObjectToTuple<{0: undefined; 1: string}>) => void;
invokeUndefined(undefined, 'value');
// @ts-expect-error The first position cannot be skipped.
invokeUndefined('value');
// @ts-expect-error The second position is required.
invokeUndefined(undefined);

// Call sites preserve correlation between converted union members.
declare const invokeUnion: (...arguments_: ObjectToTuple<{0: 'text'; 1: string} | {0: 'count'; 1: number}>) => void;
invokeUnion('text', 'value');
invokeUnion('count', 1);
// @ts-expect-error The text variant requires a string value.
invokeUnion('text', 1);
// @ts-expect-error The count variant requires a number value.
invokeUnion('count', 'value');

// The remaining documentation examples compile with their stated output types.
type ReadonlyProperties = ObjectToTuple<{readonly '0': string; readonly '1': boolean}>;
type MissingPosition = ObjectToTuple<{0: string; 2: boolean}>;
expectTypeOf<ReadonlyProperties>().toBe<[string, boolean]>();
expectTypeOf<MissingPosition>().toBe<never>();
