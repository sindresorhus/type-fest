import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {RequiredDeep} from '../index.d.ts';

type Foo = {
	baz?: string | undefined;
	bar?: {
		function?: ((...arguments_: any[]) => void) | undefined;
		functionFixedArity?: ((argument1: unknown, argument2: unknown) => void);
		functionWithOverload?: {
			(argument: number): string;
			(argument1: string, argument2: number): number;
		};
		namespace?: {
			(argument: number): string;
			key: string | undefined;
		};
		namespaceWithOverload: {
			(argument: number): string;
			(argument1: string, argument2: number): number;
			key: string | undefined;
		};
		object?: {key?: 'value'} | undefined;
		string?: string | undefined;
		number?: number | undefined;
		boolean?: false | undefined;
		date?: Date | undefined;
		regexp?: RegExp | undefined;
		symbol?: Symbol | undefined;
		null?: null | undefined;
		undefined?: undefined;
		map?: Map<string | undefined, string | undefined>;
		set?: Set<string | undefined>;
		array?: Array<string | undefined>;
		tuple?: ['foo' | undefined] | undefined;
		readonlyMap?: ReadonlyMap<string | undefined, string | undefined>;
		readonlySet?: ReadonlySet<string | undefined>;
		readonlyArray?: ReadonlyArray<string | undefined>;
		readonlyTuple?: readonly ['foo' | undefined] | undefined;
		weakMap?: WeakMap<{key: string | undefined}, string | undefined>;
		weakSet?: WeakSet<{key: string | undefined}>;
		promise?: Promise<string | undefined>;
	};
};

type FooRequired = {
	baz: string;
	bar: {
		function: (...arguments_: any[]) => void;
		functionFixedArity: (argument1: unknown, argument2: unknown) => void;
		functionWithOverload: {
			(argument: number): string;
			(argument1: string, argument2: number): number;
		};
		namespace: {
			(argument: number): string;
			key: string;
		};
		namespaceWithOverload: {
			(argument: number): string;
			(argument1: string, argument2: number): number;
			key: string;
		};
		object: {key: 'value'};
		string: string;
		number: number;
		boolean: false;
		date: Date;
		regexp: RegExp;
		symbol: Symbol;
		null: null;
		undefined: never;
		map: Map<string, string>;
		set: Set<string>;
		array: string[];
		tuple: ['foo'];
		readonlyMap: ReadonlyMap<string, string>;
		readonlySet: ReadonlySet<string>;
		readonlyArray: readonly string[];
		readonlyTuple: readonly ['foo'];
		weakMap: WeakMap<{key: string}, string>;
		weakSet: WeakSet<{key: string}>;
		promise: Promise<string>;
	};
};

type FooBar = Exclude<Foo['bar'], undefined>;
type FooRequiredBar = FooRequired['bar'];

// TODO: Fix this case: https://github.com/mmkal/expect-type/issues/34
// @ts-expect-error
expectTypeOf<RequiredDeep<Foo>>().toEqualTypeOf<FooRequired>();
expectTypeOf<RequiredDeep<FooBar['function']>>().toEqualTypeOf<FooRequiredBar['function']>();
expectTypeOf<RequiredDeep<FooBar['functionFixedArity']>>().toEqualTypeOf<FooRequiredBar['functionFixedArity']>();
expectTypeOf<RequiredDeep<FooBar['object']>>().toEqualTypeOf<FooRequiredBar['object']>();
expectTypeOf<RequiredDeep<FooBar['string']>>().toEqualTypeOf<FooRequiredBar['string']>();
expectTypeOf<RequiredDeep<FooBar['number']>>().toEqualTypeOf<FooRequiredBar['number']>();
expectTypeOf<RequiredDeep<FooBar['boolean']>>().toEqualTypeOf<FooRequiredBar['boolean']>();
expectTypeOf<RequiredDeep<FooBar['date']>>().toEqualTypeOf<FooRequiredBar['date']>();
expectTypeOf<RequiredDeep<FooBar['regexp']>>().toEqualTypeOf<FooRequiredBar['regexp']>();
expectTypeOf<RequiredDeep<FooBar['map']>>().toEqualTypeOf<FooRequiredBar['map']>();
expectTypeOf<RequiredDeep<FooBar['set']>>().toEqualTypeOf<FooRequiredBar['set']>();
expectTypeOf<RequiredDeep<FooBar['array']>>().toEqualTypeOf<FooRequiredBar['array']>();
expectTypeOf<RequiredDeep<FooBar['tuple']>>().toEqualTypeOf<FooRequiredBar['tuple']>();
expectTypeOf<RequiredDeep<FooBar['readonlyMap']>>().toEqualTypeOf<FooRequiredBar['readonlyMap']>();
expectTypeOf<RequiredDeep<FooBar['readonlySet']>>().toEqualTypeOf<FooRequiredBar['readonlySet']>();
expectTypeOf<RequiredDeep<FooBar['readonlyArray']>>().toEqualTypeOf<FooRequiredBar['readonlyArray']>();
expectTypeOf<RequiredDeep<FooBar['readonlyTuple']>>().toEqualTypeOf<FooRequiredBar['readonlyTuple']>();
expectTypeOf<RequiredDeep<FooBar['weakMap']>>().toEqualTypeOf<FooRequiredBar['weakMap']>();
expectTypeOf<RequiredDeep<FooBar['weakSet']>>().toEqualTypeOf<FooRequiredBar['weakSet']>();
expectTypeOf<RequiredDeep<FooBar['promise']>>().toEqualTypeOf<FooRequiredBar['promise']>();

// TODO: Fix this case: https://github.com/mmkal/expect-type/issues/34
// @ts-expect-error
expectTypeOf<RequiredDeep<FooBar['namespace']>>().toEqualTypeOf<FooRequiredBar['namespace']>();

expectTypeOf<RequiredDeep<FooBar['undefined']>>().toBeNever();
expectTypeOf<RequiredDeep<FooBar['null']>>().toEqualTypeOf<FooRequiredBar['null']>();

// These currently need to be left alone due to TypeScript limitations.
// @see https://github.com/microsoft/TypeScript/issues/29732
expectType<string>(({} as unknown as RequiredDeep<FooBar['functionWithOverload']>)(0));
expectType<number>(({} as unknown as RequiredDeep<FooBar['functionWithOverload']>)('foo', 0));
expectType<string>(({} as unknown as RequiredDeep<FooBar['namespaceWithOverload']>)(0));
expectType<number>(({} as unknown as RequiredDeep<FooBar['namespaceWithOverload']>)('foo', 0));
