import {expectTypeOf} from 'expect-type';
import type {Trim} from '../index';

declare function trim<S extends string>(value: S): Trim<S>;

expectTypeOf(trim(' foo')).toEqualTypeOf<'foo'>();
expectTypeOf(trim('bar ')).toEqualTypeOf<'bar'>();
expectTypeOf(trim(' baz ')).toEqualTypeOf<'baz'>();
expectTypeOf(trim('  waldo  ')).toEqualTypeOf<'waldo'>();
expectTypeOf(trim(' fr ed ')).toEqualTypeOf<'fr ed'>();
