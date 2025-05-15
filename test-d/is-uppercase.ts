import {expectType} from 'tsd';
import type {IsUppercase} from '../index.d.ts';

expectType<IsUppercase<'ABC'>>(true);
expectType<IsUppercase<''>>(true);
expectType<IsUppercase<'Abc'>>(false);
expectType<IsUppercase<Uppercase<`on${string}`>>>(true);
expectType<IsUppercase<`On${string}`>>(false);
expectType<IsUppercase<`ON${string}`>>({} as boolean);
expectType<IsUppercase<string>>({} as boolean);
expectType<IsUppercase<'ABC' | 'Abc'>>({} as boolean);
