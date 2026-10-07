import {expectType} from 'tsd';
import type {Trim} from '../index.d.ts';

declare function trim<S extends string>(value: S): Trim<S>;

expectType<'foo'>(trim(' foo'));
expectType<'bar'>(trim('bar '));
expectType<'baz'>(trim(' baz '));
expectType<'waldo'>(trim('  waldo  '));
expectType<'fr ed'>(trim(' fr ed '));
expectType<'foo'>(trim(' foo\n'));
expectType<'foo'>(trim(' foo\n\t '));

// `U+0085` (NEL) is a control character that `String.prototype.trim()` keeps, so it must not be trimmed here either. The rest of `Whitespace` is the exact set that ECMAScript trims.
expectType<'\u{85}foo\u{85}'>({} as Trim<'\u{85}foo\u{85}'>);
expectType<'\u{85}foo\u{85}bar'>({} as Trim<'\u{85}foo\u{85}bar'>);
