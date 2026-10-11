import {expectTypeOf} from 'nz';
import type {Trim} from '../index.d.ts';

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
