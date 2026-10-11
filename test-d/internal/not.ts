import {expectTypeOf} from 'nz';
import type {Not} from '../../source/internal/index.d.ts';

expectTypeOf<Not<true>>().toBe<false>();
expectTypeOf<Not<false>>().toBe<true>();
expectTypeOf<boolean>().toBe<Not<boolean>>();
