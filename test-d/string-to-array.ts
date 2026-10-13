import {expectTypeOf} from 'nz';
import type {StringToArray} from '../source/string-to-array.d.ts';
import type {StringRepeat} from '../source/string-repeat.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';
import type {Tagged} from '../source/tagged.d.ts';

type StringToArrayElementNonLiterals<S extends string> = StringToArray<S, {mapNonLiteralsDirectly: true}>;

// Empty string
expectTypeOf<StringToArray<''>>().toBe<[]>();
expectTypeOf<StringToArrayElementNonLiterals<''>>().toBe<[]>();

// Literals
expectTypeOf<StringToArray<'a'>>().toBe<['a']>();
expectTypeOf<StringToArray<'abcde'>>().toBe<['a', 'b', 'c', 'd', 'e']>();
expectTypeOf<StringToArray<'012'>>().toBe<['0', '1', '2']>();
expectTypeOf<StringToArrayElementNonLiterals<'foobar'>>().toBe<['f', 'o', 'o', 'b', 'a', 'r']>();

// Non-literals
expectTypeOf<StringToArray<string>>().toBe<string[]>();
expectTypeOf<StringToArray<Lowercase<string>>>().toBe<Array<Lowercase<string>>>();
expectTypeOf<StringToArray<Uppercase<string>>>().toBe<Array<Uppercase<string>>>();

expectTypeOf<StringToArray<`${string}abc`>>().toBe<[...string[], 'a', 'b', 'c']>();
expectTypeOf<StringToArray<`abc${string}`>>().toBe<['a', 'b', 'c', ...string[]]>();
expectTypeOf<StringToArray<`abc${string}def`>>().toBe<['a', 'b', 'c', ...string[], 'd', 'e', 'f']>();

expectTypeOf<StringToArray<`abc${string}def${string}`>>().toBe<['a', 'b', 'c', ...string[]]>();
expectTypeOf<StringToArray<`a${string}b${string}c`>>().toBe<['a', ...string[], 'c']>();
expectTypeOf<StringToArray<`a${Capitalize<string>}b${Uppercase<string>}c`>>().toBe<['a', ...Array<Capitalize<string> | 'b' | Uppercase<string>>, 'c']>();
expectTypeOf<StringToArray<`ab${Capitalize<string>}cd${Uppercase<string>}`>>().toBe<['a', 'b', ...Array<Capitalize<string> | 'c' | 'd' | Uppercase<string>>]>();

// --- `mapNonLiteralsDirectly: true` ---
expectTypeOf<StringToArrayElementNonLiterals<string>>().toBe<[string]>();
expectTypeOf<StringToArrayElementNonLiterals<Lowercase<string>>>().toBe<[Lowercase<string>]>();
expectTypeOf<StringToArrayElementNonLiterals<Uppercase<string>>>().toBe<[Uppercase<string>]>();

expectTypeOf<StringToArrayElementNonLiterals<`${string}abc`>>().toBe<[string, 'a', 'b', 'c']>();
expectTypeOf<StringToArrayElementNonLiterals<`abc${string}`>>().toBe<['a', 'b', 'c', string]>();
expectTypeOf<StringToArrayElementNonLiterals<`abc${string}def`>>().toBe<['a', 'b', 'c', string, 'd', 'e', 'f']>();

expectTypeOf<StringToArrayElementNonLiterals<`abc${string}def${string}`>>().toBe<['a', 'b', 'c', string, 'd', 'e', 'f', string]>();
expectTypeOf<StringToArrayElementNonLiterals<`a${string}b${string}c`>>().toBe<['a', string, 'b', string, 'c']>();
expectTypeOf<StringToArrayElementNonLiterals<`a${Capitalize<string>}b${Uppercase<string>}c`>>().toBe<['a', Capitalize<string>, 'b', Uppercase<string>, 'c']>();
expectTypeOf<StringToArrayElementNonLiterals<`ab${Capitalize<string>}cd${Uppercase<string>}`>>().toBe<['a', 'b', Capitalize<string>, 'c', 'd', Uppercase<string>]>();

// Unions
expectTypeOf<StringToArray<'abc' | 'def'>>().toBe<['a', 'b', 'c'] | ['d', 'e', 'f']>();
expectTypeOf<StringToArray<'abc' | Uppercase<string>>>().toBe<['a', 'b', 'c'] | Array<Uppercase<string>>>();
expectTypeOf<StringToArray<`ab${string}` | `${number}`>>().toBe<['a', 'b', ...string[]] | Array<`${number}`>>();

expectTypeOf<StringToArrayElementNonLiterals<'abc' | 'def'>>().toBe<['a', 'b', 'c'] | ['d', 'e', 'f']>();
expectTypeOf<StringToArrayElementNonLiterals<'abc' | Uppercase<string>>>().toBe<['a', 'b', 'c'] | [Uppercase<string>]>();
expectTypeOf<StringToArrayElementNonLiterals<`ab${string}` | `${number}`>>().toBe<['a', 'b', string] | [`${number}`]>();

// Long strings
expectTypeOf<StringToArray<StringRepeat<'a', 200>>>().toBe<TupleOf<200, 'a'>>();
expectTypeOf<StringToArray<StringRepeat<'a', 900>>>().toBe<TupleOf<900, 'a'>>();

// Boundary cases
expectTypeOf<StringToArray<never>>().toBe<never>();
expectTypeOf<StringToArray<any>>().toBe<unknown[]>();
expectTypeOf<StringToArrayElementNonLiterals<never>>().toBe<never>();
expectTypeOf<StringToArrayElementNonLiterals<any>>().toBe<unknown[]>();

// Branding the input does not brand the individual characters produced by conversion.
expectTypeOf<StringToArray<Tagged<'abc', 'Text'>>>().toBe<['a', 'b', 'c']>();
expectTypeOf<StringToArrayElementNonLiterals<Tagged<'abc', 'Text'>>>().toBe<['a', 'b', 'c']>();
expectTypeOf<StringToArray<Tagged<'', 'Text'>>>().toBe<[]>();
expectTypeOf<StringToArrayElementNonLiterals<Tagged<'', 'Text'>>>().toBe<[]>();
expectTypeOf<StringToArray<Tagged<'ab' | 'cd', 'Text'>>>().toBe<['a', 'b'] | ['c', 'd']>();
expectTypeOf<StringToArray<'xy' & {readonly brand: unique symbol}>>().toBe<['x', 'y']>();

// Unknown branded strings retain the same open-ended character sequence as their base types.
expectTypeOf<StringToArray<Tagged<string, 'Text'>>>().toBe<string[]>();
expectTypeOf<StringToArrayElementNonLiterals<Tagged<string, 'Text'>>>().toBe<[string]>();
expectTypeOf<StringToArray<Tagged<`ab${string}cd`, 'Text'>>>().toBe<['a', 'b', ...string[], 'c', 'd']>();
expectTypeOf<StringToArrayElementNonLiterals<Tagged<`ab${string}cd`, 'Text'>>>().toBe<['a', 'b', string, 'c', 'd']>();
expectTypeOf<StringToArray<Tagged<Uppercase<string>, 'Text'>>>().toBe<Array<Uppercase<string>>>();
