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
