import {expectTypeOf} from 'expect-type';
import type {LastArrayElement} from '../index';

declare function lastOf<V extends readonly unknown[]>(array: V): LastArrayElement<V>;
const array: ['foo', 2, 'bar'] = ['foo', 2, 'bar'];
const mixedArray: ['bar', 'foo', 2] = ['bar', 'foo', 2];

expectTypeOf(lastOf(array)).toEqualTypeOf<'bar'>();
expectTypeOf(lastOf(mixedArray)).toEqualTypeOf<2>();
expectTypeOf(lastOf(['a', 'b', 'c'])).toEqualTypeOf<string>();
expectTypeOf(lastOf(['a', 'b', 1])).toEqualTypeOf<string | number>();
expectTypeOf(lastOf(['a', 'b', 1] as const)).toEqualTypeOf<1>();
