import {expectType} from 'tsd';
import type {IsLowercase} from '../index.d.ts';

expectType<IsLowercase<'abc'>>(true);
expectType<IsLowercase<''>>(true);
expectType<IsLowercase<'Abc'>>(false);
expectType<IsLowercase<Lowercase<`ON${string}`>>>(true);
expectType<IsLowercase<`On${string}`>>(false);
expectType<IsLowercase<`on${string}`>>({} as boolean);
expectType<IsLowercase<string>>({} as boolean);
expectType<IsLowercase<'abc' | 'Abc'>>({} as boolean);
