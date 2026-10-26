import {expectTypeOf} from 'nz';
import type {Opaque, StringRepeat, Tagged, Trim} from '../index.d.ts';
import type {Whitespace} from '../source/internal/index.d.ts';

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

// Every supported whitespace character is removed at either boundary, but preserved inside a string.
expectTypeOf<Trim<`${Whitespace}value${Whitespace}`>>().toBe<'value'>();
expectTypeOf<Trim<`${Whitespace}${Whitespace}`>>().toBe<''>();
expectTypeOf<Trim<`first${Whitespace}last`>>().toBe<`first${Whitespace}last`>();
expectTypeOf<Trim<'\t\u{A0}\u{FEFF} value \u{3000}\r\n'>>().toBe<'value'>();
expectTypeOf<Trim<' \u{200B} value \u{200B} '>>().toBe<'\u{200B} value \u{200B}'>();
expectTypeOf<Trim<'  😀  '>>().toBe<'😀'>();
expectTypeOf<Trim<'   ' | '\tready\n' | 'done'>>().toBe<'' | 'ready' | 'done'>();

// Known boundary whitespace is removed without narrowing an unknown interpolation.
expectTypeOf<Trim<` \t${number} \n`>>().toBe<`${number}`>();
expectTypeOf<Trim<` \t${bigint} \n`>>().toBe<`${bigint}`>();
expectTypeOf<Trim<` \t${string} \n`>>().toBe<string>();
expectTypeOf<Trim<` \titem-${string} \n`>>().toBe<`item-${string}`>();
expectTypeOf<Trim<` \t${string}-item \n`>>().toBe<`${string}-item`>();
expectTypeOf<Trim<` \t${number} items \n`>>().toBe<`${number} items`>();
expectTypeOf<Trim<Uppercase<string>>>().toBe<Uppercase<string>>();

function _trimGenericLiteral<Text extends ' first ' | '\tsecond\n'>(value: Text): 'first' | 'second' {
	return trim(value);
}

// Removing surrounding indentation does not remove whitespace between lines or words.
expectTypeOf<Trim<'\n\tfirst line\n\tsecond line\n'>>().toBe<'first line\n\tsecond line'>();
expectTypeOf<Trim<` ${'enabled' | 'disabled'}: ${boolean} `>>().toBe<'enabled: true' | 'enabled: false' | 'disabled: true' | 'disabled: false'>();
expectTypeOf<Trim<' \u{85}\t value \t\u{85} '>>().toBe<'\u{85}\t value \t\u{85}'>();
