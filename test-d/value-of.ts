import {expectTypeOf} from 'expect-type';
import type {ValueOf} from '../index';

const value: ValueOf<{a: 1; b: 2; c: 3}> = 3;
const valueRestricted: ValueOf<{a: 1; b: 2; c: 3}, 'a'> = 1;

expectTypeOf(value).toMatchTypeOf<1 | 2 | 3>();
expectTypeOf(value).not.toMatchTypeOf<4>();

expectTypeOf(valueRestricted).toEqualTypeOf<1>();
expectTypeOf(valueRestricted).not.toMatchTypeOf<2>();
expectTypeOf(valueRestricted).not.toMatchTypeOf<4>();
