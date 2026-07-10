import {expectType} from 'tsd';
import type {UnwrapBrand} from '../../source/internal/object.d.ts';

type Brand = {readonly __brand: unique symbol};
declare const symbolLiteral: unique symbol;

// Non-literal primitives
expectType<string>({} as UnwrapBrand<string & Brand>);
expectType<number>({} as UnwrapBrand<number & Brand>);
expectType<bigint>({} as UnwrapBrand<bigint & Brand>);
expectType<symbol>({} as UnwrapBrand<symbol & Brand>);
expectType<boolean>({} as UnwrapBrand<boolean & Brand>);

// Literal primitives
expectType<'foo'>({} as UnwrapBrand<'foo' & Brand>);
expectType<1>({} as UnwrapBrand<1 & Brand>);
expectType<100n>({} as UnwrapBrand<100n & Brand>);
expectType<typeof symbolLiteral>({} as UnwrapBrand<typeof symbolLiteral & Brand>);
expectType<true>({} as UnwrapBrand<true & Brand>);
expectType<false>({} as UnwrapBrand<false & Brand>);

// Unions
// All non-literals
expectType<PropertyKey>({} as UnwrapBrand<PropertyKey & Brand>);
expectType<number | bigint>({} as UnwrapBrand<(number | bigint) & Brand>);
expectType<string | number | bigint | symbol | boolean>(
	{} as UnwrapBrand<(string | number | bigint | symbol | boolean) & Brand>,
);

// All literals
expectType<'a' | 'b'>({} as UnwrapBrand<('a' | 'b') & Brand>);
expectType<1 | 2 | 3 | 4 | 5>({} as UnwrapBrand<(1 | 2 | 3 | 4 | 5) & Brand>);
expectType<('foo' | 1 | 100n | typeof symbolLiteral | true)>(
	{} as UnwrapBrand<('foo' | 1 | 100n | typeof symbolLiteral | true) & Brand>,
);

// Mix of non-literals and literals
expectType<Uppercase<string> | 'foo' | 'bar'>({} as UnwrapBrand<(Uppercase<string> | 'foo' | 'bar') & Brand>);
expectType<100 | 200 | 300 | bigint>({} as UnwrapBrand<(100 | 200 | 300 | bigint) & Brand>);
expectType<(string | number | 5000n | typeof symbolLiteral)>(
	{} as UnwrapBrand<(string | number | 5000n | typeof symbolLiteral) & Brand>,
);
expectType<('foo' | 0.5 | bigint | symbol | boolean)>(
	{} as UnwrapBrand<('foo' | 0.5 | bigint | symbol | boolean) & Brand>,
);

// Edge cases
expectType<any>({} as UnwrapBrand<any>);
expectType<never>({} as UnwrapBrand<never>);
