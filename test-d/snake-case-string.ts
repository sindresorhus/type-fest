import {expectTypeOf} from 'nz';
import type {SnakeCaseString, Tagged} from '../index.d.ts';

// A valid value is kept as is
expectTypeOf<SnakeCaseString<'foo_bar'>>().toBe<'foo_bar'>();
expectTypeOf<SnakeCaseString<'foo'>>().toBe<'foo'>();
expectTypeOf<SnakeCaseString<'foo_bar_baz_123'>>().toBe<'foo_bar_baz_123'>();
expectTypeOf<SnakeCaseString<'föö_bär'>>().toBe<'föö_bär'>();

// A string with no letters has no case, so every casing accepts it
expectTypeOf<SnakeCaseString<'123'>>().toBe<'123'>();

// Numbers are not split by default, so a numeric run stays inside its word
expectTypeOf<SnakeCaseString<'foo_1_bar'>>().toBe<'foo_1_bar'>();
expectTypeOf<SnakeCaseString<'p2p_network'>>().toBe<'p2p_network'>();
expectTypeOf<SnakeCaseString<'p2p_network', {splitOnNumbers: true}>>().toBe<never>();

// Anything the transformer would change is rejected
expectTypeOf<SnakeCaseString<'fooBar'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'FooBar'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'FOO_BAR'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'FOO'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo-bar'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo bar'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo__bar'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'_foo'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo_'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'_'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo\tbar'>>().toBe<never>();

// An empty string is rejected, even though the transformer keeps it
expectTypeOf<SnakeCaseString<''>>().toBe<never>();

// Punctuation is not part of any case, even when the transformer keeps it
expectTypeOf<SnakeCaseString<'foo.bar'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo+bar'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo/bar'>>().toBe<never>();

// A union is kept only when every member is valid
expectTypeOf<SnakeCaseString<'foo_bar' | 'baz_qux'>>().toBe<'foo_bar' | 'baz_qux'>();
expectTypeOf<SnakeCaseString<'foo_bar' | 'bazQux'>>().toBe<never>();
expectTypeOf<SnakeCaseString<'foo_bar' | ''>>().toBe<never>();

// A type that is not a single literal is rejected
expectTypeOf<SnakeCaseString<string>>().toBe<never>();
expectTypeOf<SnakeCaseString<`${string}_${string}`>>().toBe<never>();
expectTypeOf<SnakeCaseString<Lowercase<string>>>().toBe<never>();
expectTypeOf<SnakeCaseString<any>>().toBe<never>();
expectTypeOf<SnakeCaseString<never>>().toBe<never>();

// @ts-expect-error `unknown` is not a string.
type UnknownValue = SnakeCaseString<unknown>;

// A valid branded string keeps its brand
expectTypeOf<SnakeCaseString<Tagged<'foo_bar', 'ColumnName'>>>().toBe<Tagged<'foo_bar', 'ColumnName'>>();
expectTypeOf<SnakeCaseString<Tagged<'foo-bar', 'ColumnName'>>>().toBe<never>();
expectTypeOf<SnakeCaseString<Tagged<'', 'ColumnName'>>>().toBe<never>();

// A generic parameter is the only place where the type can check a value
declare function defineColumn<Name extends string>(column: {name: SnakeCaseString<Name>; type: 'text' | 'integer'}): Name;

const columnName = defineColumn({name: 'full_name', type: 'text'});
expectTypeOf(columnName).toBe<'full_name'>();

// @ts-expect-error Not snake case.
defineColumn({name: 'fullName', type: 'text'});

declare const wide: string;

// @ts-expect-error A wide string cannot be proven to be snake case.
defineColumn({name: wide, type: 'text'});
