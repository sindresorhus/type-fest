import {expectTypeOf} from 'nz';
import type {IfNever} from '../index.d.ts';

// `IfNever` should return `true`/`false` if only `T` is specified
expectTypeOf<IfNever<never>>().toBe<true>();
expectTypeOf<IfNever<string>>().toBe<false>();
expectTypeOf<IfNever<never, 'T', 'F'>>().toBe<'T'>();
expectTypeOf<IfNever<string, 'T', 'F'>>().toBe<'F'>();

// Missing generic parameter
// @ts-expect-error
type A = IfNever;
