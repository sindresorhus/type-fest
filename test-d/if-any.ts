import {expectTypeOf} from 'nz';
import type {IfAny} from '../index.d.ts';

declare const _any: any;

// `IfAny` should return `true`/`false` if only `T` is specified
expectTypeOf<IfAny<any>>().toBe<true>();
expectTypeOf<IfAny<string>>().toBe<false>();
expectTypeOf<IfAny<any, 'T', 'F'>>().toBe<'T'>();
expectTypeOf<IfAny<string, 'T', 'F'>>().toBe<'F'>();

// Missing generic parameter
// @ts-expect-error
type A = IfAny;
