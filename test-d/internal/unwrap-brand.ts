import {expectTypeOf} from 'nz';
import type {UnwrapBrand} from '../../source/internal/object.d.ts';
import type {Opaque, Tagged} from '../../source/tagged.d.ts';

type Brand = {readonly __brand: unique symbol};
declare const symbolLiteral: unique symbol;

// Non-literals
expectTypeOf<UnwrapBrand<string & Brand>>().toBe<string>();
expectTypeOf<UnwrapBrand<number & Brand>>().toBe<number>();
expectTypeOf<UnwrapBrand<bigint & Brand>>().toBe<bigint>();
expectTypeOf<UnwrapBrand<symbol & Brand>>().toBe<symbol>();
expectTypeOf<UnwrapBrand<boolean & Brand>>().toBe<boolean>();
expectTypeOf<UnwrapBrand<`on${string}` & Brand>>().toBe<`on${string}`>();
expectTypeOf<UnwrapBrand<`on${string}` & {}>>().toBe<`on${string}`>();

// Literals
expectTypeOf<UnwrapBrand<'foo' & Brand>>().toBe<'foo'>();
expectTypeOf<UnwrapBrand<1 & Brand>>().toBe<1>();
expectTypeOf<UnwrapBrand<100n & Brand>>().toBe<100n>();
expectTypeOf<UnwrapBrand<typeof symbolLiteral & Brand>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrand<true & Brand>>().toBe<true>();
expectTypeOf<UnwrapBrand<false & Brand>>().toBe<false>();

// Non-branded types
expectTypeOf<UnwrapBrand<string>>().toBe<string>();
expectTypeOf<UnwrapBrand<number>>().toBe<number>();
expectTypeOf<UnwrapBrand<bigint>>().toBe<bigint>();
expectTypeOf<UnwrapBrand<symbol>>().toBe<symbol>();
expectTypeOf<UnwrapBrand<boolean>>().toBe<boolean>();

expectTypeOf<UnwrapBrand<'foo'>>().toBe<'foo'>();
expectTypeOf<UnwrapBrand<1>>().toBe<1>();
expectTypeOf<UnwrapBrand<100n>>().toBe<100n>();
expectTypeOf<UnwrapBrand<typeof symbolLiteral>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrand<true>>().toBe<true>();
expectTypeOf<UnwrapBrand<false>>().toBe<false>();

// Non-primitives, `null` & `undefined`
expectTypeOf<UnwrapBrand<object>>().toBe<object>();
expectTypeOf<UnwrapBrand<{foo: string}>>().toBe<{foo: string}>();
expectTypeOf<UnwrapBrand<(() => string) & Brand>>().toBe<(() => string) & Brand>();
expectTypeOf({} as any as UnwrapBrand<null>).toBe<null>();
expectTypeOf({} as any as UnwrapBrand<undefined>).toBe<undefined>();

// Unions
// All non-literals
expectTypeOf<UnwrapBrand<PropertyKey & Brand>>().toBe<PropertyKey>();
expectTypeOf<UnwrapBrand<(number | bigint) & Brand>>().toBe<number | bigint>();
expectTypeOf<UnwrapBrand<(string | number | bigint | symbol | boolean) & Brand>>().toBe<string | number | bigint | symbol | boolean>();

// All literals
expectTypeOf<UnwrapBrand<('a' | 'b') & Brand>>().toBe<'a' | 'b'>();
expectTypeOf<UnwrapBrand<(1 | 2 | 3 | 4 | 5) & Brand>>().toBe<1 | 2 | 3 | 4 | 5>();
expectTypeOf<UnwrapBrand<('foo' | 1 | 100n | typeof symbolLiteral | true) & Brand>>().toBe<('foo' | 1 | 100n | typeof symbolLiteral | true)>();

// Mix of non-literals and literals
expectTypeOf<UnwrapBrand<(Uppercase<string> | 'foo' | 'bar') & Brand>>().toBe<Uppercase<string> | 'foo' | 'bar'>();
expectTypeOf<UnwrapBrand<(100 | 200 | 300 | bigint) & Brand>>().toBe<100 | 200 | 300 | bigint>();
expectTypeOf<UnwrapBrand<(string | number | 5000n | typeof symbolLiteral) & Brand>>().toBe<(string | number | 5000n | typeof symbolLiteral)>();
expectTypeOf<UnwrapBrand<('foo' | 0.5 | bigint | symbol | boolean) & Brand>>().toBe<('foo' | 0.5 | bigint | symbol | boolean)>();

// Mix of non-literals, literals, and non-primitives
expectTypeOf<UnwrapBrand<(string | number | {foo: string}) & Brand>>().toBe<(string | number | ({foo: string} & Brand))>();
expectTypeOf<UnwrapBrand<('foo' | number | 100n | typeof symbolLiteral | boolean | {foo: string}) & Brand>>().toBe<('foo' | number | 100n | typeof symbolLiteral | boolean | ({foo: string} & Brand))>();

// Types built using `Opaque`
expectTypeOf<UnwrapBrand<Opaque<string | number | bigint | symbol | boolean, 'Tag'>>>().toBe<string | number | bigint | symbol | boolean>();
expectTypeOf<UnwrapBrand<Opaque<'foo' | 1 | 100n | typeof symbolLiteral | true, 'Tag'>>>().toBe<'foo' | 1 | 100n | typeof symbolLiteral | true>();

// Types built using `Tagged`
expectTypeOf<UnwrapBrand<Tagged<string | number | bigint | symbol | boolean, 'Tag'>>>().toBe<string | number | bigint | symbol | boolean>();
expectTypeOf<UnwrapBrand<Tagged<'foo' | 1 | 100n | typeof symbolLiteral | true, 'Tag'>>>().toBe<'foo' | 1 | 100n | typeof symbolLiteral | true>();

// Mix
expectTypeOf<UnwrapBrand<
		| ((string | number) & Brand)
		| Tagged<900n | typeof symbolLiteral, 'Tag'>
		| Opaque<true, 'Tag'>
		| {foo: string}
>>().toBe<string | number | 900n | typeof symbolLiteral | true | {foo: string}>();

// Edge cases
expectTypeOf<UnwrapBrand<any>>().toBe<any>();
expectTypeOf<UnwrapBrand<never>>().toBe<never>();

// Repeated tags must not prevent recovering the primitive base type.
expectTypeOf<UnwrapBrand<Tagged<Tagged<'ab', 'Text'>, 'Validated'>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<number, 'Value'>, 'Validated'>>>().toBe<number>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<100n, 'Value'>, 'Validated'>>>().toBe<100n>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<typeof symbolLiteral, 'Value'>, 'Validated'>>>().toBe<typeof symbolLiteral>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<true, 'Value'>, 'Validated'>>>().toBe<true>();

// Library tags can be combined with another primitive brand.
expectTypeOf<UnwrapBrand<Tagged<Tagged<'ab' & Brand, 'Text'>, 'Validated'>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<'ab', 'Text'>, 'Validated'> & Brand>>().toBe<'ab'>();

// Multi-key layers, metadata, and repeated tags all recover the same base.
expectTypeOf<UnwrapBrand<Tagged<Tagged<'ab', 'Text', {encoding: 'utf8'}>, 'Validated' | 'Stored', Date>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<'ab', 'Text'>, 'Text'>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<string, 'Text'>, 'Validated'>>>().toBe<string>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<boolean, 'Flag'>, 'Validated'>>>().toBe<boolean>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<Uppercase<string>, 'Text'>, 'Validated'>>>().toBe<Uppercase<string>>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<`prefix${string}`, 'Text'>, 'Validated'>>>().toBe<`prefix${string}`>();

// Unwrapping distributes over base unions and independently tagged union members.
expectTypeOf<UnwrapBrand<Tagged<Tagged<'ab' | 1 | 100n | typeof symbolLiteral | true, 'Value'>, 'Validated'>>>().toBe<'ab' | 1 | 100n | typeof symbolLiteral | true>();
expectTypeOf<UnwrapBrand<Tagged<Tagged<'ab', 'Text'>, 'Validated'> | Tagged<Tagged<1, 'Number'>, 'Stored'> | undefined>>().toBe<'ab' | 1 | undefined>();
expectTypeOf<UnwrapBrand<Opaque<Tagged<'ab', 'Text'>, {Validated: true}>>>().toBe<'ab'>();
expectTypeOf<UnwrapBrand<Tagged<Opaque<'ab', {Text: true}>, 'Validated'>>>().toBe<'ab'>();

// Only primitive brands are removed; structured values keep their original tags.
type TaggedObject = Tagged<Tagged<{readonly value: string; optional?: number}, 'Value'>, 'Validated'>;
type TaggedFunction = Tagged<Tagged<() => string, 'Value'>, 'Validated'>;
expectTypeOf<UnwrapBrand<TaggedObject>>().toBe<TaggedObject>();
expectTypeOf<UnwrapBrand<TaggedFunction>>().toBe<TaggedFunction>();
expectTypeOf<UnwrapBrand<unknown>>().toBe<unknown>();

// A value can pass through many independently tagged stages.
type ManyTags = Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<Tagged<'ab', 'A'>, 'B'>, 'C'>, 'D'>, 'E'>, 'F'>, 'G'>, 'H'>, 'I'>, 'J'>, 'K'>, 'L'>;
expectTypeOf<UnwrapBrand<ManyTags>>().toBe<'ab'>();
