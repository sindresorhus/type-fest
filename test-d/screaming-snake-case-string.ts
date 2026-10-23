import {expectTypeOf} from 'nz';
import type {ScreamingSnakeCaseString, Tagged} from '../index.d.ts';

// A valid value is kept as is
expectTypeOf<ScreamingSnakeCaseString<'FOO_BAR'>>().toBe<'FOO_BAR'>();
expectTypeOf<ScreamingSnakeCaseString<'FOO'>>().toBe<'FOO'>();
expectTypeOf<ScreamingSnakeCaseString<'FOO_BAR_BAZ_123'>>().toBe<'FOO_BAR_BAZ_123'>();
expectTypeOf<ScreamingSnakeCaseString<'FÖÖ_BÄR'>>().toBe<'FÖÖ_BÄR'>();

// A string with no letters has no case, so every casing accepts it
expectTypeOf<ScreamingSnakeCaseString<'123'>>().toBe<'123'>();

// Numbers are not split by default, so a numeric run stays inside its word
expectTypeOf<ScreamingSnakeCaseString<'FOO_1_BAR'>>().toBe<'FOO_1_BAR'>();
expectTypeOf<ScreamingSnakeCaseString<'P2P_NETWORK'>>().toBe<'P2P_NETWORK'>();
expectTypeOf<ScreamingSnakeCaseString<'P2P_NETWORK', {splitOnNumbers: true}>>().toBe<never>();

// Anything the transformer would change is rejected
expectTypeOf<ScreamingSnakeCaseString<'foo_bar'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FooBar'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'fooBar'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'foo'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO-BAR'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO BAR'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO__BAR'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'_FOO'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO_'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'_'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO\tBAR'>>().toBe<never>();

// An empty string is rejected, even though the transformer keeps it
expectTypeOf<ScreamingSnakeCaseString<''>>().toBe<never>();

// Punctuation is not part of any case, even when the transformer keeps it
expectTypeOf<ScreamingSnakeCaseString<'FOO.BAR'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO+BAR'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO/BAR'>>().toBe<never>();

// A union is kept only when every member is valid
expectTypeOf<ScreamingSnakeCaseString<'FOO_BAR' | 'BAZ_QUX'>>().toBe<'FOO_BAR' | 'BAZ_QUX'>();
expectTypeOf<ScreamingSnakeCaseString<'FOO_BAR' | 'BAZ_QUX' | 'baz'>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<'FOO_BAR' | ''>>().toBe<never>();

// A type that is not a single literal is rejected
expectTypeOf<ScreamingSnakeCaseString<string>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<Uppercase<string>>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<`FOO_${string}`>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<any>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<never>>().toBe<never>();

// @ts-expect-error `unknown` is not a string.
type UnknownValue = ScreamingSnakeCaseString<unknown>;

// A valid branded string keeps its brand
expectTypeOf<ScreamingSnakeCaseString<Tagged<'FOO_BAR', 'VariableName'>>>().toBe<Tagged<'FOO_BAR', 'VariableName'>>();
expectTypeOf<ScreamingSnakeCaseString<Tagged<'foo_bar', 'VariableName'>>>().toBe<never>();
expectTypeOf<ScreamingSnakeCaseString<Tagged<'', 'VariableName'>>>().toBe<never>();

// A generic parameter is the only place where the type can check a value
declare function defineVariable<Name extends string>(variable: {name: ScreamingSnakeCaseString<Name>; value: string}): Name;

const variableName = defineVariable({name: 'LOG_LEVEL', value: 'debug'});
expectTypeOf(variableName).toBe<'LOG_LEVEL'>();

// @ts-expect-error Not screaming snake case.
defineVariable({name: 'logLevel', value: 'debug'});

declare const wide: string;

// @ts-expect-error A wide string cannot be proven to be screaming snake case.
defineVariable({name: wide, value: 'debug'});
