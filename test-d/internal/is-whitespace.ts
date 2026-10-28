import {expectTypeOf} from 'nz';
import type {IsWhitespace, Whitespace} from '../../source/internal/index.d.ts';

expectTypeOf<IsWhitespace<''>>().toBe<false>();
expectTypeOf<IsWhitespace<' '>>().toBe<true>();
expectTypeOf<IsWhitespace<'\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<'\u{9}'>>().toBe<true>();
expectTypeOf<IsWhitespace<'a'>>().toBe<false>();
expectTypeOf<IsWhitespace<'a '>>().toBe<false>();
expectTypeOf<IsWhitespace<'   '>>().toBe<true>();
expectTypeOf<IsWhitespace<' \t '>>().toBe<true>();

// Every supported whitespace character can be combined without changing the classification.
expectTypeOf<IsWhitespace<`${Whitespace}${Whitespace}`>>().toBe<true>();
expectTypeOf<IsWhitespace<'\t\u{A0}\u{3000}\r\n'>>().toBe<true>();
expectTypeOf<IsWhitespace<' \u{85} '>>().toBe<false>();
expectTypeOf<IsWhitespace<' \u{200B} '>>().toBe<false>();
expectTypeOf<IsWhitespace<' \t' | 'ready'>>().toBe<boolean>();
expectTypeOf<IsWhitespace<string>>().toBe<false>();
expectTypeOf<IsWhitespace<any>>().toBe<boolean>();
expectTypeOf<IsWhitespace<never>>().toBe<never>();
// @ts-expect-error Whitespace classification requires a string.
type UnknownWhitespace = IsWhitespace<unknown>;

function _readWhitespaceResult<Value extends string>(value: IsWhitespace<Value>): boolean {
	return value;
}
