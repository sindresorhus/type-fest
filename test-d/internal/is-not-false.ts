/* eslint-disable @typescript-eslint/no-duplicate-type-constituents -- Tests unions that contain duplicate members. */
import {expectTypeOf} from 'nz';
import type {IsNotFalse} from '../../source/internal/index.d.ts';

expectTypeOf<IsNotFalse<true>>().toBe<true>();
expectTypeOf<IsNotFalse<boolean>>().toBe<true>();
expectTypeOf<IsNotFalse<true | false>>().toBe<true>();
expectTypeOf<IsNotFalse<true | false | false | false>>().toBe<true>();
expectTypeOf<IsNotFalse<false>>().toBe<false>();
expectTypeOf<IsNotFalse<false | false>>().toBe<false>();
expectTypeOf<IsNotFalse<false | false | false | false>>().toBe<false>();
