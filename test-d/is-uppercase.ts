import {expectTypeOf} from 'nz';
import type {IsUppercase} from '../index.d.ts';

// Literals
expectTypeOf<IsUppercase<'ABC'>>().toBe<true>();
expectTypeOf<IsUppercase<''>>().toBe<true>();
expectTypeOf<IsUppercase<'123'>>().toBe<true>();
expectTypeOf<IsUppercase<'!@#'>>().toBe<true>();

expectTypeOf<IsUppercase<'Abc'>>().toBe<false>();
expectTypeOf<IsUppercase<'abc'>>().toBe<false>();

// Non-literals
expectTypeOf<IsUppercase<Uppercase<string>>>().toBe<true>();
expectTypeOf<IsUppercase<Uppercase<`on${string}`>>>().toBe<true>();

expectTypeOf<IsUppercase<Lowercase<string>>>().toBe<false>();
expectTypeOf<IsUppercase<Uncapitalize<`ON${string}`>>>().toBe<false>();
expectTypeOf<IsUppercase<`ON${Uncapitalize<string>}`>>().toBe<false>();
expectTypeOf<IsUppercase<Uncapitalize<`${string}END`>>>().toBe<false>();

expectTypeOf<boolean>().toBe<IsUppercase<string>>();
expectTypeOf<boolean>().toBe<IsUppercase<`ON${string}`>>();
expectTypeOf<boolean>().toBe<IsUppercase<Capitalize<string>>>();
expectTypeOf<boolean>().toBe<IsUppercase<Capitalize<`ON${string}`>>>();
expectTypeOf<boolean>().toBe<IsUppercase<`ON${Capitalize<string>}`>>();
expectTypeOf<boolean>().toBe<IsUppercase<`${number}`>>();

expectTypeOf<IsUppercase<`sTART${string}`>>().toBe<false>();
expectTypeOf<IsUppercase<`${string}eND`>>().toBe<false>();
expectTypeOf<IsUppercase<`${string}mID${string}`>>().toBe<false>();

// Complex non-literals
expectTypeOf<IsUppercase<`${Uppercase<string>}${Uppercase<string>}`>>().toBe<true>();

expectTypeOf<IsUppercase<`${Lowercase<string>}${Uppercase<string>}`>>().toBe<false>();
expectTypeOf<IsUppercase<`${Uppercase<string>}${Lowercase<string>}`>>().toBe<false>();
expectTypeOf<IsUppercase<`${Uppercase<string>}${Lowercase<string>}${Uppercase<string>}`>>().toBe<false>();
expectTypeOf<IsUppercase<`${Uncapitalize<string>}${Uppercase<string>}`>>().toBe<false>();
expectTypeOf<IsUppercase<`${Uppercase<string>}${Uncapitalize<string>}`>>().toBe<false>();
expectTypeOf<IsUppercase<`${string}${Uncapitalize<string>}`>>().toBe<false>();
expectTypeOf<IsUppercase<`${number}${Uncapitalize<string>}`>>().toBe<false>();

expectTypeOf<boolean>().toBe<IsUppercase<`${string}${Uppercase<string>}`>>();
expectTypeOf<boolean>().toBe<IsUppercase<`${string}${string}`>>();
expectTypeOf<boolean>().toBe<IsUppercase<`${Uppercase<string>}${Uppercase<string>}${string}`>>();
expectTypeOf<boolean>().toBe<IsUppercase<`${string}${Capitalize<string>}`>>();
expectTypeOf<boolean>().toBe<IsUppercase<`${number}/${number}`>>();
expectTypeOf<boolean>().toBe<IsUppercase<`${string}${number}`>>();

// Unions
expectTypeOf<IsUppercase<'ABC' | 'XYZ'>>().toBe<true>(); // Both `true`
expectTypeOf<IsUppercase<'ABc' | 'XyZ'>>().toBe<false>(); // Both `false`
expectTypeOf<boolean>().toBe<IsUppercase<'ABC' | 'aBC'>>(); // One `true`, one `false`
expectTypeOf<boolean>().toBe<IsUppercase<'ABC' | `${Capitalize<string>}END`>>(); // One `true`, one `boolean`
expectTypeOf<boolean>().toBe<IsUppercase<'XyZ' | `ABC${string}`>>(); // One `false`, one `boolean`

// A character with no case is not changed by uppercasing either, so it counts as uppercase, the same as it counts as lowercase in the sibling type.
expectTypeOf<IsUppercase<'A1_B'>>().toBe<true>();
expectTypeOf<IsUppercase<'a1_b'>>().toBe<false>();
expectTypeOf<IsUppercase<'123'>>().toBe<true>();
expectTypeOf<IsUppercase<'_-.'>>().toBe<true>();

// A character that uppercasing changes is not uppercase, even though none of the lowercase-shaped patterns name it: a titlecase digraph such as `ǅ` uppercases to `Ǆ`, so it answers `false` rather than the undecided `boolean`.
expectTypeOf<IsUppercase<'ǅ'>>().toBe<false>();
expectTypeOf<IsUppercase<'ǈ'>>().toBe<false>();
expectTypeOf<IsUppercase<'ǋ'>>().toBe<false>();
expectTypeOf<IsUppercase<'ǲ'>>().toBe<false>();
expectTypeOf<IsUppercase<'ᾈ'>>().toBe<false>();
