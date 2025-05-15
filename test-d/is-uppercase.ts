import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {IsUppercase} from '../index.d.ts';

expectType<IsUppercase<'ABC'>>(true);
expectType<IsUppercase<'Abc'>>(false);
expectTypeOf<IsUppercase<string>>().toBeBoolean();
