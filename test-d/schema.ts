import {expectTypeOf} from 'expect-type';
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

expectTypeOf(foo).not.toMatchTypeOf<FooSchema>();
expectTypeOf<{key: 'value'}>().not.toMatchTypeOf<FooSchema>();
expectTypeOf(new Date()).not.toMatchTypeOf<FooSchema>();
expectTypeOf(fooSchema.baz).toEqualTypeOf<FooOption>();

const barSchema = fooSchema.bar as Schema<typeof foo['bar'], FooOption>;
expectTypeOf(barSchema.function).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.object).toEqualTypeOf<FooOption | {key: FooOption}>();
expectTypeOf(barSchema.string).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.number).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.boolean).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.symbol).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.map).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.set).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.array).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.tuple).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.readonlyMap).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.readonlySet).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.readonlyArray).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.readonlyTuple).toEqualTypeOf<FooOption>();
expectTypeOf(barSchema.regExp).toEqualTypeOf<FooOption>();

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

expectTypeOf(foo).not.toMatchTypeOf<ComplexSchema>();
expectTypeOf(complexFoo.baz).toEqualTypeOf<ComplexOption>();

const complexBarSchema = complexFoo.bar as Schema<typeof foo['bar'], ComplexOption>;
expectTypeOf(complexBarSchema.function).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.object).toEqualTypeOf<ComplexOption | {key: ComplexOption}>();
expectTypeOf(complexBarSchema.string).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.number).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.boolean).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.symbol).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.map).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.set).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.array).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.tuple).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.readonlyMap).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.readonlySet).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.readonlyArray).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.readonlyTuple).toEqualTypeOf<ComplexOption>();
expectTypeOf(complexBarSchema.regExp).toEqualTypeOf<ComplexOption>();
