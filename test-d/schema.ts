import {expectNotAssignable, expectType} from 'tsd';
import type {Schema} from '../index';

const foo = {
	baz: 'fred',
	bar: {
		function: (_: string): void => undefined,
		object: {key: 'value'},
		string: 'waldo',
		number: 1,
		boolean: false,
		symbol: Symbol('test'),
		map: new Map<string, string>(),
		set: new Set<string>(),
		array: ['foo'],
		tuple: ['foo'] as ['foo'],
		readonlyMap: new Map<string, string>() as ReadonlyMap<string, string>,
		readonlySet: new Set<string>() as ReadonlySet<string>,
		readonlyArray: ['foo'] as readonly string[],
		readonlyTuple: ['foo'] as const,
		regExp: /.*/g,
	},
};

type FooOption = 'A' | 'B';
type FooSchema = Schema<typeof foo, FooOption>;

const fooSchema: FooSchema = {
	baz: 'A',
	bar: {
		function: 'A',
		object: {key: 'A'},
		string: 'A',
		number: 'A',
		boolean: 'A',
		symbol: 'A',
		map: 'A',
		set: 'A',
		array: 'A',
		tuple: 'A',
		readonlyMap: 'A',
		readonlySet: 'A',
		readonlyArray: 'A',
		readonlyTuple: 'A',
		regExp: 'A',
	},
};

expectNotAssignable<FooSchema>(foo);
expectNotAssignable<FooSchema>({key: 'value'});
expectNotAssignable<FooSchema>(new Date());
expectType<FooOption>(fooSchema.baz);

const barSchema = fooSchema.bar as Schema<typeof foo['bar'], FooOption>;
expectType<FooOption>(barSchema.function);
expectType<FooOption | {key: FooOption}>(barSchema.object);
expectType<FooOption>(barSchema.string);
expectType<FooOption>(barSchema.number);
expectType<FooOption>(barSchema.boolean);
expectType<FooOption>(barSchema.symbol);
expectType<FooOption>(barSchema.map);
expectType<FooOption>(barSchema.set);
expectType<FooOption>(barSchema.array);
expectType<FooOption>(barSchema.tuple);
expectType<FooOption>(barSchema.readonlyMap);
expectType<FooOption>(barSchema.readonlySet);
expectType<FooOption>(barSchema.readonlyArray);
expectType<FooOption>(barSchema.readonlyTuple);
expectType<FooOption>(barSchema.regExp);

type ComplexOption = {
	type: 'readonly' | 'required' | 'optional';
	validation(value: unknown): boolean;
};
type ComplexSchema = Schema<typeof foo, ComplexOption>;

const createComplexOption = (type: ComplexOption['type']): ComplexOption => ({
	type,
	validation(value) {
		return value !== undefined;
	},
});

const complexFoo: ComplexSchema = {
	baz: createComplexOption('optional'),
	bar: {
		function: createComplexOption('required'),
		object: createComplexOption('readonly'),
		string: createComplexOption('readonly'),
		number: createComplexOption('readonly'),
		boolean: createComplexOption('readonly'),
		symbol: createComplexOption('readonly'),
		map: createComplexOption('readonly'),
		set: createComplexOption('readonly'),
		array: createComplexOption('readonly'),
		tuple: createComplexOption('readonly'),
		readonlyMap: createComplexOption('readonly'),
		readonlySet: createComplexOption('readonly'),
		readonlyArray: createComplexOption('readonly'),
		readonlyTuple: createComplexOption('readonly'),
		regExp: createComplexOption('readonly'),
	},
};

expectNotAssignable<ComplexSchema>(foo);
expectType<ComplexOption>(complexFoo.baz);

const complexBarSchema = complexFoo.bar as Schema<typeof foo['bar'], ComplexOption>;
expectType<ComplexOption>(complexBarSchema.function);
expectType<ComplexOption | {key: ComplexOption}>(complexBarSchema.object);
expectType<ComplexOption>(complexBarSchema.string);
expectType<ComplexOption>(complexBarSchema.number);
expectType<ComplexOption>(complexBarSchema.boolean);
expectType<ComplexOption>(complexBarSchema.symbol);
expectType<ComplexOption>(complexBarSchema.map);
expectType<ComplexOption>(complexBarSchema.set);
expectType<ComplexOption>(complexBarSchema.array);
expectType<ComplexOption>(complexBarSchema.tuple);
expectType<ComplexOption>(complexBarSchema.readonlyMap);
expectType<ComplexOption>(complexBarSchema.readonlySet);
expectType<ComplexOption>(complexBarSchema.readonlyArray);
expectType<ComplexOption>(complexBarSchema.readonlyTuple);
expectType<ComplexOption>(complexBarSchema.regExp);
