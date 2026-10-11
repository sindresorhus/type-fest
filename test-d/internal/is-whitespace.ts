import {expectTypeOf} from 'nz';
import type {IsWhitespace} from '../../source/internal/index.d.ts';

expectTypeOf<IsWhitespace<''>>().toBe<false>();
expectTypeOf<IsWhitespace<' '>>().toBe<true>();
expectTypeOf<IsWhitespace<'\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{9}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'a'>>().toBe<false>();
expectTypeOf<IsWhitespace<'a '>>().toBe<false>();
expectTypeOf<IsWhitespace<'   '>>().toBe<true>();
expectTypeOf<IsWhitespace<' \t '>>().toBe<true>();
