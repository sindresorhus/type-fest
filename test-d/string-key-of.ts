import {expectTypeOf} from 'expect-type';
import type {StringKeyOf} from '../index';

declare const foo: StringKeyOf<{
	1: number;
	stringKey: string;
}>;

expectTypeOf(foo).toEqualTypeOf<'1' | 'stringKey'>();
