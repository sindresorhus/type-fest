import {expectTypeOf} from 'nz';
import type {IsLowercase} from '../index.d.ts';

// Literals
expectTypeOf<IsLowercase<'abc'>>().toBe<true>();
expectTypeOf<IsLowercase<''>>().toBe<true>();
expectTypeOf<IsLowercase<'123'>>().toBe<true>();
expectTypeOf<IsLowercase<'!@#'>>().toBe<true>();

expectTypeOf<IsLowercase<'Abc'>>().toBe<false>();
expectTypeOf<IsLowercase<'ABC'>>().toBe<false>();

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
