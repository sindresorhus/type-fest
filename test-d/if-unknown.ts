import {expectTypeOf} from 'nz';
import type {IfUnknown} from '../index.d.ts';

// `IfUnknown` should return `true`/`false` if only `T` is specified
expectTypeOf<IfUnknown<unknown>>().toBe<true>();
expectTypeOf<IfUnknown<string>>().toBe<false>();
expectTypeOf<IfUnknown<unknown, 'T', 'F'>>().toBe<'T'>();
expectTypeOf<IfUnknown<string, 'T', 'F'>>().toBe<'F'>();

// Missing generic parameter
// @ts-expect-error
type A = IfUnknown;
