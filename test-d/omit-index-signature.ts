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
