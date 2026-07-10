import {expectType} from 'tsd';
import type {UnwrapBrand} from '../../source/internal/object.d.ts';
import type {Opaque, Tagged} from '../../source/tagged.d.ts';

type Brand = {readonly __brand: unique symbol};
declare const symbolLiteral: unique symbol;

// Non-literals
expectType<string>({} as UnwrapBrand<string & Brand>);
expectType<number>({} as UnwrapBrand<number & Brand>);
expectType<bigint>({} as UnwrapBrand<bigint & Brand>);
expectType<symbol>({} as UnwrapBrand<symbol & Brand>);
expectType<boolean>({} as UnwrapBrand<boolean & Brand>);

// Literals
expectType<'foo'>({} as UnwrapBrand<'foo' & Brand>);
expectType<1>({} as UnwrapBrand<1 & Brand>);
expectType<100n>({} as UnwrapBrand<100n & Brand>);
expectType<typeof symbolLiteral>({} as UnwrapBrand<typeof symbolLiteral & Brand>);
expectType<true>({} as UnwrapBrand<true & Brand>);
expectType<false>({} as UnwrapBrand<false & Brand>);

// Non-branded types
expectType<string>({} as UnwrapBrand<string>);
expectType<number>({} as UnwrapBrand<number>);
expectType<bigint>({} as UnwrapBrand<bigint>);
expectType<symbol>({} as UnwrapBrand<symbol>);
expectType<boolean>({} as UnwrapBrand<boolean>);

expectType<'foo'>({} as UnwrapBrand<'foo'>);
expectType<1>({} as UnwrapBrand<1>);
expectType<100n>({} as UnwrapBrand<100n>);
expectType<typeof symbolLiteral>({} as UnwrapBrand<typeof symbolLiteral>);
expectType<true>({} as UnwrapBrand<true>);
expectType<false>({} as UnwrapBrand<false>);

// Non-primitives, `null` & `undefined`
expectType<object>({} as UnwrapBrand<object>);
expectType<{foo: string}>({} as UnwrapBrand<{foo: string}>);
expectType<(() => string) & Brand>({} as UnwrapBrand<(() => string) & Brand>);
expectType<null>({} as any as UnwrapBrand<null>);
expectType<undefined>({} as any as UnwrapBrand<undefined>);

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

// Mix of non-literals, literals, and non-primitives
expectType<(string | number | ({foo: string} & Brand))>(
	{} as UnwrapBrand<(string | number | {foo: string}) & Brand>,
);
expectType<('foo' | number | 100n | typeof symbolLiteral | boolean | ({foo: string} & Brand))>(
	{} as UnwrapBrand<('foo' | number | 100n | typeof symbolLiteral | boolean | {foo: string}) & Brand>,
);

// Types built using `Opaque`
expectType<string | number | bigint | symbol | boolean>(
	{} as UnwrapBrand<Opaque<string | number | bigint | symbol | boolean, 'Tag'>>,
);
expectType<'foo' | 1 | 100n | typeof symbolLiteral | true>(
	{} as UnwrapBrand<Opaque<'foo' | 1 | 100n | typeof symbolLiteral | true, 'Tag'>>,
);

// Types built using `Tagged`
expectType<string | number | bigint | symbol | boolean>(
	{} as UnwrapBrand<Tagged<string | number | bigint | symbol | boolean, 'Tag'>>,
);
expectType<'foo' | 1 | 100n | typeof symbolLiteral | true>(
	{} as UnwrapBrand<Tagged<'foo' | 1 | 100n | typeof symbolLiteral | true, 'Tag'>>,
);

// Mix
expectType<string | number | 900n | typeof symbolLiteral | true | {foo: string}>(
	{} as UnwrapBrand<
		| ((string | number) & Brand)
		| Tagged<900n | typeof symbolLiteral, 'Tag'>
		| Opaque<true, 'Tag'>
		| {foo: string}
	>);

// Edge cases
expectType<any>({} as UnwrapBrand<any>);
expectType<never>({} as UnwrapBrand<never>);
