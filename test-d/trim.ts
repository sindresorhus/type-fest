import {expectTypeOf} from 'nz';
import type {Opaque, StringRepeat, Tagged, Trim} from '../index.d.ts';

declare function trim<S extends string>(value: S): Trim<S>;

expectTypeOf(trim(' foo')).toBe<'foo'>();
expectTypeOf(trim('bar ')).toBe<'bar'>();
expectTypeOf(trim(' baz ')).toBe<'baz'>();
expectTypeOf(trim('  waldo  ')).toBe<'waldo'>();
expectTypeOf(trim(' fr ed ')).toBe<'fr ed'>();
expectTypeOf(trim(' foo\n')).toBe<'foo'>();
expectTypeOf(trim(' foo\n\t ')).toBe<'foo'>();

// `U+0085` (NEL) is a control character that `String.prototype.trim()` keeps, so it must not be trimmed here either. The rest of `Whitespace` is the exact set that ECMAScript trims.
expectTypeOf<Trim<'\u{85}foo\u{85}'>>().toBe<'\u{85}foo\u{85}'>();
expectTypeOf<Trim<'\u{85}foo\u{85}bar'>>().toBe<'\u{85}foo\u{85}bar'>();

// Trimming works on the primitive string beneath an input brand.
expectTypeOf<Trim<Tagged<' foo ', 'Text'>>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<'\n\t', 'Text'>>>().toBe<''>();

expectTypeOf<Trim<Opaque<' foo ', 'Text'>>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<Tagged<' foo ', 'First'>, 'Second'>>>().toBe<'foo'>();
expectTypeOf<Trim<' foo ' & {readonly __brand: unique symbol}>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<' foo' | 'bar ', 'Text'>>>().toBe<'foo' | 'bar'>();
expectTypeOf<Trim<Tagged<'foo', 'Text'>>>().toBe<'foo'>();
expectTypeOf<Trim<Tagged<'', 'Text'>>>().toBe<''>();
expectTypeOf<Trim<Tagged<' fo o ', 'Text'>>>().toBe<'fo o'>();
expectTypeOf<Trim<Tagged<'\u{85}foo ', 'Text'>>>().toBe<'\u{85}foo'>();
expectTypeOf<Trim<Tagged<` ${number} `, 'Text'>>>().toBe<`${number}`>();
expectTypeOf<Trim<Tagged<` ${string} `, 'Text'>>>().toBe<string>();
expectTypeOf<Trim<Tagged<string, 'Text'>>>().toBe<string>();
expectTypeOf<Trim<any>>().toBe<any>();
expectTypeOf<Trim<never>>().toBe<never>();
// @ts-expect-error
expectTypeOf<Trim<unknown>>();

// A constrained generic literal retains its known result without widening to string.
function _trimKnownLiteral<Text extends 'abc'>(value: Trim<Text>): 'abc' {
	return value;
}

// Both independent trimming directions retain their supported recursion budget.
expectTypeOf<Trim<`${StringRepeat<' ', 999>}x`>>().toBe<'x'>();
expectTypeOf<Trim<`x${StringRepeat<' ', 999>}`>>().toBe<'x'>();
