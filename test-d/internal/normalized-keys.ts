import {expectTypeOf} from 'nz';
import type {NormalizedKeys} from '../../source/internal/object.d.ts';

declare const sym: unique symbol;

expectTypeOf<NormalizedKeys<0 | '1'>>().toBe<0 | '0' | 1 | '1'>();
expectTypeOf<NormalizedKeys<-1 | '-1.5' | 'foo' | typeof sym>>().toBe<-1 | '-1' | '-1.5' | -1.5 | 'foo' | typeof sym>();
expectTypeOf<NormalizedKeys<string>>().toBe<string | number>();
expectTypeOf<NormalizedKeys<number>>().toBe<number | `${number}`>();
expectTypeOf<NormalizedKeys<`${number}`>>().toBe<number | `${number}`>();
expectTypeOf<NormalizedKeys<symbol>>().toBe<symbol>();

// Boundary cases
expectTypeOf<NormalizedKeys<any>>().toBe<any>();
expectTypeOf<NormalizedKeys<never>>().toBe<never>();

// Can only be `PropertyKey`
// @ts-expect-error
type T1 = NormalizedKeys<boolean>;
// @ts-expect-error
type T2 = NormalizedKeys<string[]>;
// @ts-expect-error
type T3 = NormalizedKeys<unknown>;
