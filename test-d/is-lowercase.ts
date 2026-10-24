import {expectTypeOf} from 'nz';
import type {IsLowercase, StringRepeat, Tagged} from '../index.d.ts';

// Literals
expectTypeOf<IsLowercase<'abc'>>().toBe<true>();
expectTypeOf<IsLowercase<''>>().toBe<true>();
expectTypeOf<IsLowercase<'123'>>().toBe<true>();
expectTypeOf<IsLowercase<'!@#'>>().toBe<true>();

expectTypeOf<IsLowercase<'Abc'>>().toBe<false>();
expectTypeOf<IsLowercase<'ABC'>>().toBe<false>();

// Unicode casing can expand into multiple code points, while emoji have no case.
expectTypeOf<IsLowercase<'ß'>>().toBe<true>();
expectTypeOf<IsLowercase<'İ'>>().toBe<false>();
expectTypeOf<IsLowercase<'🦄'>>().toBe<true>();

// Non-literals
expectTypeOf<IsLowercase<Lowercase<string>>>().toBe<true>();
expectTypeOf<IsLowercase<Lowercase<`on${string}`>>>().toBe<true>();

expectTypeOf<IsLowercase<Uppercase<string>>>().toBe<false>();
expectTypeOf<IsLowercase<Capitalize<`on${string}`>>>().toBe<false>();
expectTypeOf<IsLowercase<`on${Capitalize<string>}`>>().toBe<false>();
expectTypeOf<IsLowercase<Capitalize<`${string}end`>>>().toBe<false>();

expectTypeOf<boolean>().toBe<IsLowercase<string>>();
expectTypeOf<boolean>().toBe<IsLowercase<`on${string}`>>();
expectTypeOf<boolean>().toBe<IsLowercase<Uncapitalize<string>>>();
expectTypeOf<boolean>().toBe<IsLowercase<Uncapitalize<`on${string}`>>>();
expectTypeOf<boolean>().toBe<IsLowercase<`on${Uncapitalize<string>}`>>();
expectTypeOf<boolean>().toBe<IsLowercase<`${number}`>>();

expectTypeOf<IsLowercase<`Start${string}`>>().toBe<false>();
expectTypeOf<IsLowercase<`${string}End`>>().toBe<false>();
expectTypeOf<IsLowercase<`${string}Mid${string}`>>().toBe<false>();

// Complex non-literals
expectTypeOf<IsLowercase<`${Lowercase<string>}${Lowercase<string>}`>>().toBe<true>();

expectTypeOf<IsLowercase<`${Uppercase<string>}${Lowercase<string>}`>>().toBe<false>();
expectTypeOf<IsLowercase<`${Lowercase<string>}${Uppercase<string>}`>>().toBe<false>();
expectTypeOf<IsLowercase<`${Lowercase<string>}${Uppercase<string>}${Lowercase<string>}`>>().toBe<false>();
expectTypeOf<IsLowercase<`${Capitalize<string>}${Lowercase<string>}`>>().toBe<false>();
expectTypeOf<IsLowercase<`${Lowercase<string>}${Capitalize<string>}`>>().toBe<false>();
expectTypeOf<IsLowercase<`${string}${Capitalize<string>}`>>().toBe<false>();
expectTypeOf<IsLowercase<`${number}${Capitalize<string>}`>>().toBe<false>();

expectTypeOf<boolean>().toBe<IsLowercase<`${string}${Lowercase<string>}`>>();
expectTypeOf<boolean>().toBe<IsLowercase<`${string}${string}`>>();
expectTypeOf<boolean>().toBe<IsLowercase<`${Lowercase<string>}${Lowercase<string>}${string}`>>();
expectTypeOf<boolean>().toBe<IsLowercase<`${string}${Uncapitalize<string>}`>>();
expectTypeOf<boolean>().toBe<IsLowercase<`${number}/${number}`>>();
expectTypeOf<boolean>().toBe<IsLowercase<`${string}${number}`>>();

// Unions
expectTypeOf<IsLowercase<'abc' | 'xyz'>>().toBe<true>(); // Both `true`
expectTypeOf<IsLowercase<'abC' | 'xYz'>>().toBe<false>(); // Both `false`
expectTypeOf<boolean>().toBe<IsLowercase<'abc' | 'Abc'>>(); // One `true`, one `false`
expectTypeOf<boolean>().toBe<IsLowercase<'abc' | `${Uncapitalize<string>}end`>>(); // One `true`, one `boolean`
expectTypeOf<boolean>().toBe<IsLowercase<'xYz' | `abc${string}`>>(); // One `false`, one `boolean`

// A character with no case is neither changed by lowercasing nor by uppercasing, so it counts as lowercase and, in the sibling type, as uppercase too. That is what the compiler says as well.
expectTypeOf<IsLowercase<'a1_b'>>().toBe<true>();
expectTypeOf<IsLowercase<'A1_B'>>().toBe<false>();
expectTypeOf<IsLowercase<'123'>>().toBe<true>();
expectTypeOf<IsLowercase<'_-.'>>().toBe<true>();

// A character that lowercasing changes is not lowercase, even though none of the uppercase-shaped patterns name it: a titlecase digraph such as `ǅ` lowercases to `ǆ`, so it answers `false` rather than the undecided `boolean`.
expectTypeOf<IsLowercase<'ǅ'>>().toBe<false>();
expectTypeOf<IsLowercase<'ǈ'>>().toBe<false>();
expectTypeOf<IsLowercase<'ǋ'>>().toBe<false>();
expectTypeOf<IsLowercase<'ǲ'>>().toBe<false>();
expectTypeOf<IsLowercase<'ᾈ'>>().toBe<false>();

// Whole string literals do not need a character-by-character traversal.
expectTypeOf<IsLowercase<StringRepeat<'a', 1500>>>().toBe<true>();
expectTypeOf<IsLowercase<`${StringRepeat<'a', 1500>}A`>>().toBe<false>();
expectTypeOf<IsLowercase<StringRepeat<'A', 1500>>>().toBe<false>();
expectTypeOf<IsLowercase<StringRepeat<'a', 1500> | 'A'>>().toBe<boolean>();
expectTypeOf<IsLowercase<Tagged<'aa', 'Text'>>>().toBe<true>();
expectTypeOf<IsLowercase<Tagged<'aA', 'Text'>>>().toBe<false>();
expectTypeOf<IsLowercase<Tagged<Tagged<'aa', 'Text'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsLowercase<any>>().toBe<boolean>();
expectTypeOf<IsLowercase<never>>().toBe<false>();
// @ts-expect-error - Only strings have letter casing.
type UnknownCase = IsLowercase<unknown>;

// String enum members are checked by their values.
enum LowercaseText {
	Lower = 'abc',
	Mixed = 'aBc',
	Empty = '',
}

expectTypeOf<IsLowercase<LowercaseText.Lower>>().toBe<true>();
expectTypeOf<IsLowercase<LowercaseText.Mixed>>().toBe<false>();
expectTypeOf<IsLowercase<LowercaseText.Empty>>().toBe<true>();
expectTypeOf<IsLowercase<LowercaseText>>().toBe<boolean>();
expectTypeOf<IsLowercase<Tagged<LowercaseText.Lower, 'Text'>>>().toBe<true>();
