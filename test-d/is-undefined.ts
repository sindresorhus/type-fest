import {expectTypeOf} from 'nz';
import type {If, IsUndefined} from '../index.d.ts';

expectTypeOf<IsUndefined<undefined>>().toBe<true>();
expectTypeOf<IsUndefined<any>>().toBe<false>();
// `never` is not `undefined`, and `IsOptional<never>` is `false` for the same reason, so the two must agree here too.
expectTypeOf<IsUndefined<never>>().toBe<false>();
expectTypeOf<IsUndefined<string & undefined>>().toBe<false>();
expectTypeOf<IsUndefined<null>>().toBe<false>(); // Depends on `strictNullChecks`
expectTypeOf<IsUndefined<unknown>>().toBe<false>();
expectTypeOf<IsUndefined<void>>().toBe<false>();
expectTypeOf<IsUndefined<{}>>().toBe<false>();

// A union that also contains other types is not `undefined`.
expectTypeOf<IsUndefined<string | undefined>>().toBe<false>();
expectTypeOf<IsUndefined<null | undefined>>().toBe<false>();

// Normalization preserves `undefined` but cannot turn `any` into a definite match.
expectTypeOf<IsUndefined<undefined | never>>().toBe<true>();
expectTypeOf<IsUndefined<undefined & unknown>>().toBe<true>();
expectTypeOf<IsUndefined<undefined | any>>().toBe<false>();
expectTypeOf<IsUndefined<undefined & any>>().toBe<false>();
expectTypeOf<If<IsUndefined<any>, 'undefined', 'other'>>().toBe<'other'>();

function _readUndefinedResult<Value>(result: IsUndefined<Value>): boolean {
	return result;
}
