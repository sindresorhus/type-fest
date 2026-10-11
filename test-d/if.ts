import {expectTypeOf} from 'nz';
import type {If} from '../source/if.d.ts';

expectTypeOf<If<true, string, number>>().toBe<string>();
expectTypeOf<If<false, string, number>>().toBe<number>();
expectTypeOf<If<boolean, string, number>>().toBe<string | number>();
expectTypeOf<If<any, string, number>>().toBe<string | number>();
expectTypeOf<If<never, string, number>>().toBe<number>();
