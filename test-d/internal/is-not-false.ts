/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
import {expectType} from 'tsd';
import type {IsNotFalse} from '../../source/internal/index.d.ts';

expectType<IsNotFalse<true>>(true);
expectType<IsNotFalse<boolean>>(true);
expectType<IsNotFalse<true | false>>(true);
expectType<IsNotFalse<true | false | false | false>>(true);
expectType<IsNotFalse<false>>(false);
expectType<IsNotFalse<false | false>>(false);
expectType<IsNotFalse<false | false | false | false>>(false);
