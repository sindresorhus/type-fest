import {expectType} from 'tsd';
import {Trim} from '../ts41';

declare function trim<S extends string>(value: S): Trim<S>;

expectType<'foo'>(trim(' foo'));
expectType<'bar'>(trim('bar '));
expectType<'baz'>(trim(' baz '));
expectType<'waldo'>(trim('  waldo  '));
expectType<'fr ed'>(trim(' fr ed '));
