import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {IsLowercase} from '../index.d.ts';

expectType<IsLowercase<'abc'>>(true);
expectType<IsLowercase<'Abc'>>(false);
expectTypeOf<IsLowercase<string>>().toBeBoolean();
