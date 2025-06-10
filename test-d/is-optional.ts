import { expectType } from 'tsd';
import type { IsOptional } from '../source/is-optional.js';

expectType<IsOptional<undefined>>(true);
expectType<IsOptional<null | undefined>>(true);
expectType<IsOptional<string | undefined>>(true);
expectType<IsOptional<string | null | undefined>>(true);

expectType<IsOptional<string>>(false);
expectType<IsOptional<string | null>>(false);

expectType<IsOptional<void>>(false)
expectType<IsOptional<null>>(false);
expectType<IsOptional<never>>(false);
expectType<IsOptional<unknown>>(false);
expectType<IsOptional<() => void>>(false);
expectType<IsOptional<string & undefined>>(false);
