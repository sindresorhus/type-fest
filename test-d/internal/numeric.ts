import {expectTypeOf} from 'nz';
import type {IsEqual} from '../../index.d.ts';
import type {IsNumberLike} from '../../source/internal/index.d.ts';

expectTypeOf<IsEqual<IsNumberLike<'1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'-1.1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'5e-20'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<1>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'a'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<''>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<true>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<any>, boolean>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<never>, false>>().toBe<true>();

// The result follows TypeScript's own notion of a numeric string, which is lenient about surrounding whitespace, a leading `+`, and a hexadecimal form.
expectTypeOf<IsEqual<IsNumberLike<' 1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'+1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'0x10'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'1_0'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'Infinity'>, false>>().toBe<true>();
