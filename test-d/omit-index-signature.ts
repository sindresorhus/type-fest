import {expectTypeOf} from 'nz';
import type {OmitIndexSignature} from '../index.d.ts';

type ExampleInterface = {
	// These index signatures will be removed.
	[x: string]: any;
	[x: number]: any;
	[x: symbol]: any;
	[x: `head-${string}`]: string;
	[x: `${string}-tail`]: string;
	[x: `head-${string}-tail`]: string;
	[x: `${bigint}`]: string;
	[x: `embedded-${number}`]: string;

	// These explicitly defined keys will remain.
	foo: 'bar';
	qux?: 'baz';
};

type MappedType<ObjectType> = {
	[Key in keyof ObjectType]: {
		key: Key;
		value: Exclude<ObjectType[Key], undefined>;
	};
};

declare const exampleInterfaceKnownKeys: OmitIndexSignature<ExampleInterface>;
expectTypeOf(exampleInterfaceKnownKeys).toBe<{
	foo: 'bar';
	qux?: 'baz';
}>();

declare const exampleMappedTypeKnownKeys: OmitIndexSignature<
	MappedType<ExampleInterface>
>;
expectTypeOf(exampleMappedTypeKnownKeys).toBe<{
	foo: {key: 'foo'; value: 'bar'};
	qux?: {key: 'qux'; value: 'baz'};
}>();

// Explicit fields can have the same names as Object.prototype members.
type PrototypeFields = {
	[key: string]: unknown;
	readonly toString: string;
	valueOf: number;
	hasOwnProperty?: boolean;
	id: 'model';
};
declare const prototypeFields: OmitIndexSignature<PrototypeFields>;
expectTypeOf(prototypeFields.toString).toBe<string>();
expectTypeOf(prototypeFields.valueOf).toBe<number>();
expectTypeOf(prototypeFields.hasOwnProperty).toBe<boolean | undefined>();
expectTypeOf<typeof prototypeFields>().toBe<{readonly toString: string; valueOf: number; hasOwnProperty?: boolean; id: 'model'}>();
expectTypeOf<{id: 'model'}>().not.toBeAssignableTo<typeof prototypeFields>();

// Other prototype names and optional/readonly modifiers remain declared fields.
type OtherPrototypeFields = {readonly toLocaleString?: (() => string) | undefined; isPrototypeOf: boolean; constructor: number};
expectTypeOf<OmitIndexSignature<OtherPrototypeFields & Record<string, unknown>>>().toBe<OtherPrototypeFields>();
// @ts-expect-error The retained field is readonly even when its assigned value is valid.
prototypeFields.toString = 'model';
expectTypeOf<OmitIndexSignature<{toString: any; valueOf: never; hasOwnProperty: unknown}>>().toBe<{toString: any; valueOf: never; hasOwnProperty: unknown}>();
expectTypeOf<OmitIndexSignature<{toString: 'text'} | {valueOf: 1}>>().toBe<{toString: 'text'} | {valueOf: 1}>();
expectTypeOf<OmitIndexSignature<unknown>>().toBe<{}>();
expectTypeOf<OmitIndexSignature<never>>().toBe<never>();
expectTypeOf<keyof OmitIndexSignature<any>>().toBe<never>();

function _constructDeclaredFields<Value>(value: Value): OmitIndexSignature<Value> {
	return value;
}

function _readDeclaredField<Value>(value: OmitIndexSignature<{[name: string]: unknown; toString: Value}>): Value {
	return value.toString;
}

declare function declaredFields<const Value>(value: Value): OmitIndexSignature<Value>;
const inferredDeclaredFields = declaredFields({toString: 'model', id: 1});
expectTypeOf(inferredDeclaredFields).toBe<{readonly toString: 'model'; readonly id: 1}>();
// @ts-expect-error A retained const field preserves its literal value.
const wrongInferredField: typeof inferredDeclaredFields = {toString: 'different', id: 1};
