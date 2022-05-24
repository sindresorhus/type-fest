import {expectType} from 'tsd';
import type {RemoveIndexSignature} from '../index';

interface ExampleInterface {
	// These index signatures will be removed.
	[x: string]: any;
	[x: number]: any;

	// Symbol and template string pattern index signatures are only available
	// starting with TypeScript 4.4.
	// https://devblogs.microsoft.com/typescript/announcing-typescript-4-4-beta/#symbol-template-signatures
	/*
	[x: symbol]: any;
	[x: `head-${string}`]: string;
	[x: `${string}-tail`]: string;
	[x: `head-${string}-tail`]: string;
	[x: `${bigint}`]: string;
	[x: `embedded-${number}`]: string;
	*/

	// These explicitly defined keys will remain.
	foo: 'bar';
	qux?: 'baz';
}

type MappedType<ObjectType> = {
	[Key in keyof ObjectType]: {
		key: Key;
		value: Exclude<ObjectType[Key], undefined>;
	};
};

declare const exampleInterfaceKnownKeys: RemoveIndexSignature<ExampleInterface>;
expectType<{
	foo: 'bar';
	qux?: 'baz';
}>(exampleInterfaceKnownKeys);

declare const exampleMappedTypeKnownKeys: RemoveIndexSignature<
	MappedType<ExampleInterface>
>;
expectType<{
	foo: {key: 'foo'; value: 'bar'};
	qux?: {key: 'qux'; value: 'baz'};
}>(exampleMappedTypeKnownKeys);
