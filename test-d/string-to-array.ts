import {expectTypeOf} from 'nz';
import type {StringToArray, StringToArrayOptions} from '../source/string-to-array.d.ts';
import type {StringRepeat} from '../source/string-repeat.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';
import type {Tagged} from '../source/tagged.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';

type NonStrictStringToArray<S extends string> = StringToArray<S, {strict: false}>;

// Empty string
expectTypeOf<StringToArray<''>>().toBe<[]>();
expectTypeOf<NonStrictStringToArray<''>>().toBe<[]>();

// Literals
expectTypeOf<StringToArray<'a'>>().toBe<['a']>();
expectTypeOf<StringToArray<'abcde'>>().toBe<['a', 'b', 'c', 'd', 'e']>();
expectTypeOf<StringToArray<'012'>>().toBe<['0', '1', '2']>();
expectTypeOf<NonStrictStringToArray<'foobar'>>().toBe<['f', 'o', 'o', 'b', 'a', 'r']>();

// Non-literals
expectTypeOf<StringToArray<string>>().toBe<string[]>();
expectTypeOf<StringToArray<Lowercase<string>>>().toBe<string[]>();
expectTypeOf<StringToArray<Uppercase<string>>>().toBe<string[]>();

expectTypeOf<StringToArray<`${string}abc`>>().toBe<[...string[], 'a', 'b', 'c']>();
expectTypeOf<StringToArray<`abc${string}`>>().toBe<['a', 'b', 'c', ...string[]]>();
expectTypeOf<StringToArray<`abc${string}def`>>().toBe<['a', 'b', 'c', ...string[], 'd', 'e', 'f']>();

expectTypeOf<StringToArray<`abc${string}def${string}`>>().toBe<['a', 'b', 'c', ...string[]]>();
expectTypeOf<StringToArray<`a${string}b${string}c`>>().toBe<['a', ...string[], 'c']>();
expectTypeOf<StringToArray<`a${Capitalize<string>}b${Uppercase<string>}c`>>().toBe<['a', ...string[], 'c']>();
expectTypeOf<StringToArray<`ab${Capitalize<string>}cd${Uppercase<string>}`>>().toBe<['a', 'b', ...string[]]>();

// --- `strict: false` ---
expectTypeOf<NonStrictStringToArray<string>>().toBe<[string]>();
expectTypeOf<NonStrictStringToArray<Lowercase<string>>>().toBe<[Lowercase<string>]>();
expectTypeOf<NonStrictStringToArray<Uppercase<string>>>().toBe<[Uppercase<string>]>();

expectTypeOf<NonStrictStringToArray<`${string}abc`>>().toBe<[string, 'a', 'b', 'c']>();
expectTypeOf<NonStrictStringToArray<`abc${string}`>>().toBe<['a', 'b', 'c', string]>();
expectTypeOf<NonStrictStringToArray<`abc${string}def`>>().toBe<['a', 'b', 'c', string, 'd', 'e', 'f']>();

expectTypeOf<NonStrictStringToArray<`abc${string}def${string}`>>().toBe<['a', 'b', 'c', string, 'd', 'e', 'f', string]>();
expectTypeOf<NonStrictStringToArray<`a${string}b${string}c`>>().toBe<['a', string, 'b', string, 'c']>();
expectTypeOf<NonStrictStringToArray<`a${Capitalize<string>}b${Uppercase<string>}c`>>().toBe<['a', Capitalize<string>, 'b', Uppercase<string>, 'c']>();
expectTypeOf<NonStrictStringToArray<`ab${Capitalize<string>}cd${Uppercase<string>}`>>().toBe<['a', 'b', Capitalize<string>, 'c', 'd', Uppercase<string>]>();

// Unions
expectTypeOf<StringToArray<'abc' | 'def'>>().toBe<['a', 'b', 'c'] | ['d', 'e', 'f']>();
expectTypeOf<StringToArray<'abc' | Uppercase<string>>>().toBe<['a', 'b', 'c'] | string[]>();
expectTypeOf<StringToArray<`ab${string}` | `${number}`>>().toBe<['a', 'b', ...string[]] | string[]>();

expectTypeOf<NonStrictStringToArray<'abc' | 'def'>>().toBe<['a', 'b', 'c'] | ['d', 'e', 'f']>();
expectTypeOf<NonStrictStringToArray<'abc' | Uppercase<string>>>().toBe<['a', 'b', 'c'] | [Uppercase<string>]>();
expectTypeOf<NonStrictStringToArray<`ab${string}` | `${number}`>>().toBe<['a', 'b', string] | [`${number}`]>();

// Long strings
expectTypeOf<StringToArray<StringRepeat<'a', 200>>>().toBe<TupleOf<200, 'a'>>();
expectTypeOf<StringToArray<StringRepeat<'a', 900>>>().toBe<TupleOf<900, 'a'>>();

// Boundary cases
expectTypeOf<StringToArray<never>>().toBe<never>();
expectTypeOf<StringToArray<any>>().toBe<unknown[]>();
expectTypeOf<NonStrictStringToArray<never>>().toBe<never>();
expectTypeOf<NonStrictStringToArray<any>>().toBe<unknown[]>();

// Branding the input does not brand the individual characters produced by conversion.
expectTypeOf<StringToArray<Tagged<'abc', 'Text'>>>().toBe<['a', 'b', 'c']>();
expectTypeOf<NonStrictStringToArray<Tagged<'abc', 'Text'>>>().toBe<['a', 'b', 'c']>();
expectTypeOf<StringToArray<Tagged<'', 'Text'>>>().toBe<[]>();
expectTypeOf<NonStrictStringToArray<Tagged<'', 'Text'>>>().toBe<[]>();
expectTypeOf<StringToArray<Tagged<'ab' | 'cd', 'Text'>>>().toBe<['a', 'b'] | ['c', 'd']>();
expectTypeOf<StringToArray<'xy' & {readonly brand: unique symbol}>>().toBe<['x', 'y']>();

// Unknown branded strings retain the same open-ended character sequence as their base types.
expectTypeOf<StringToArray<Tagged<string, 'Text'>>>().toBe<string[]>();
expectTypeOf<NonStrictStringToArray<Tagged<string, 'Text'>>>().toBe<[string]>();
expectTypeOf<StringToArray<Tagged<`ab${string}cd`, 'Text'>>>().toBe<['a', 'b', ...string[], 'c', 'd']>();
expectTypeOf<NonStrictStringToArray<Tagged<`ab${string}cd`, 'Text'>>>().toBe<['a', 'b', string, 'c', 'd']>();
expectTypeOf<StringToArray<Tagged<Uppercase<string>, 'Text'>>>().toBe<string[]>();

// Multiple tags describe the complete input, just like a single tag.
type ValidatedText = Tagged<Tagged<'ab', 'Text'>, 'Validated'>;
expectTypeOf<StringToArray<ValidatedText>>().toBe<['a', 'b']>();
expectTypeOf<NonStrictStringToArray<ValidatedText>>().toBe<['a', 'b']>();
expectTypeOf<StringToArray<Tagged<Tagged<string, 'Text'>, 'Validated'>>>().toBe<string[]>();
expectTypeOf<StringToArray<Tagged<Tagged<`ab${string}cd`, 'Text'>, 'Validated'>>>().toBe<['a', 'b', ...string[], 'c', 'd']>();

// A non-literal part describes a whole substring, not each individual character in it.

expectTypeOf<['-', '1', '.', '2']>().toBeAssignableTo<StringToArray<`${number}`>>();
expectTypeOf<['F', 'o', 'o']>().toBeAssignableTo<StringToArray<Capitalize<string>>>();
expectTypeOf<['f', 'O', 'O']>().toBeAssignableTo<StringToArray<Uncapitalize<string>>>();
expectTypeOf<['x', '-', '1', 'p', 'x']>().toBeAssignableTo<StringToArray<`x${number}px`>>();
expectTypeOf<['-', '4', '2']>().toBeAssignableTo<StringToArray<`${bigint}`>>();
expectTypeOf<StringToArray<`${number}`>>().toBe<string[]>();
expectTypeOf<StringToArray<`x${number}px`>>().toBe<['x', ...string[], 'p', 'x']>();
expectTypeOf<StringToArray<Capitalize<string>>>().toBe<string[]>();
expectTypeOf<StringToArray<Uncapitalize<string>>>().toBe<string[]>();
expectTypeOf<StringToArray<`hello${Capitalize<string>}world`>>().toBe<['h', 'e', 'l', 'l', 'o', ...string[], 'w', 'o', 'r', 'l', 'd']>();
expectTypeOf<StringToArray<`x${number}`, {strict: false}>>().toBe<['x', `${number}`]>();
expectTypeOf<StringToArray<`${bigint}`>>().toBe<string[]>();
expectTypeOf<StringToArray<`id${bigint}:${number}px`>>().toBe<['i', 'd', ...string[], 'p', 'x']>();
expectTypeOf<StringToArray<Tagged<`x${number}px`, 'Text'>>>().toBe<['x', ...string[], 'p', 'x']>();
expectTypeOf<StringToArray<`${number}`, {strict: false}>>().toBe<[`${number}`]>();
expectTypeOf<StringToArray<Capitalize<string>, {strict: false}>>().toBe<[Capitalize<string>]>();
// @ts-expect-error - Only strings can be converted to characters.
type UnknownString = StringToArray<unknown>;

// Empty intersections used for autocomplete keep the same character sequence as their primitive base.
expectTypeOf<StringToArray<string & {}>>().toBe<string[]>();
expectTypeOf<NonStrictStringToArray<string & {}>>().toBe<[string]>();
expectTypeOf<string[]>().toBeAssignableTo<StringToArray<LiteralUnion<'abc', string>>>();
expectTypeOf<[]>().toBeAssignableTo<StringToArray<LiteralUnion<'abc', string>>>();
expectTypeOf<[string]>().toBeAssignableTo<NonStrictStringToArray<LiteralUnion<'abc', string>>>();
expectTypeOf<NonStrictStringToArray<LiteralUnion<'abc', string>>>().toBeAssignableTo<[string] | ['a', 'b', 'c']>();
expectTypeOf<['a', 'b']>().not.toBeAssignableTo<NonStrictStringToArray<LiteralUnion<'abc', string>>>();
expectTypeOf<StringToArray<'xy' | Tagged<'ab', 'Text'>>>().toBe<['x', 'y'] | ['a', 'b']>();

declare function textCharacters<Text extends string>(text: Text): StringToArray<Text>;
expectTypeOf(textCharacters('a-b')).toBe<['a', '-', 'b']>();
expectTypeOf(textCharacters('a-b' as Tagged<'a-b', 'Text'>)).toBe<['a', '-', 'b']>();

// A long literal retains every character on both sides of a distinct marker.
type LongCharacterText = `${StringRepeat<'a', 600>}X${StringRepeat<'b', 600>}`;
expectTypeOf<StringToArray<LongCharacterText>>().toBe<[...TupleOf<600, 'a'>, 'X', ...TupleOf<600, 'b'>]>();
expectTypeOf<NonStrictStringToArray<LongCharacterText>>().toBe<[...TupleOf<600, 'a'>, 'X', ...TupleOf<600, 'b'>]>();

// Every chunk and its remainder preserve character order.
expectTypeOf<StringToArray<'abcdefghi'>>().toBe<['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']>();
expectTypeOf<StringToArray<'abcdefghij'>>().toBe<['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']>();
expectTypeOf<StringToArray<'abcdefghijk'>>().toBe<['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']>();
expectTypeOf<StringToArray<`${StringRepeat<'a', 9>}X${StringRepeat<'b', 9>}`>>().toBe<[...TupleOf<9, 'a'>, 'X', ...TupleOf<9, 'b'>]>();
expectTypeOf<StringToArray<`${StringRepeat<'a', 9>}X${StringRepeat<'b', 10>}`>>().toBe<[...TupleOf<9, 'a'>, 'X', ...TupleOf<10, 'b'>]>();
expectTypeOf<StringToArray<`${StringRepeat<'a', 9>}X${StringRepeat<'b', 11>}`>>().toBe<[...TupleOf<9, 'a'>, 'X', ...TupleOf<11, 'b'>]>();

// Surrogate and combining sequences retain the original decomposition across a chunk boundary.
expectTypeOf<StringToArray<'abcdefghi😀z'>>().toBe<[...StringToArray<'abcdefghi'>, ...StringToArray<'😀'>, 'z']>();
expectTypeOf<StringToArray<'abcdefghiéz'>>().toBe<[...StringToArray<'abcdefghi'>, ...StringToArray<'é'>, 'z']>();

type LongCharacterParts = [...TupleOf<600, 'a'>, 'X', ...TupleOf<600, 'b'>];
type PartialCharacterText = `prefix${string}`;
expectTypeOf<StringToArray<LongCharacterText | PartialCharacterText>>().toBe<LongCharacterParts | ['p', 'r', 'e', 'f', 'i', 'x', ...string[]]>();
expectTypeOf<NonStrictStringToArray<LongCharacterText | PartialCharacterText>>().toBe<LongCharacterParts | ['p', 'r', 'e', 'f', 'i', 'x', string]>();
expectTypeOf<StringToArray<Tagged<LongCharacterText, 'Text'>>>().toBe<LongCharacterParts>();
expectTypeOf<StringToArray<LongCharacterText, {strict: boolean}>>().toBe<LongCharacterParts>();

declare const longCharacterInput: LongCharacterText;
const longCharacters = textCharacters(longCharacterInput);
expectTypeOf(longCharacters.length).toBe<1201>();
expectTypeOf(longCharacters[600]).toBe<'X'>();
// @ts-expect-error The marker remains an exact character after conversion.
longCharacters[600] = 'a';

function _constructLiteralCharacters<Options extends StringToArrayOptions>(value: ['a', 'b']): StringToArray<'ab', Options> {
	return value;
}

function _readLiteralCharacters<Options extends StringToArrayOptions>(value: StringToArray<'ab', Options>): ['a', 'b'] {
	return value;
}

function _readAutocompleteCharacters(value: NonStrictStringToArray<LiteralUnion<'abc', string>>): [string] {
	return value;
}

// Direct mapping preserves each placeholder and the characters between them.
expectTypeOf<StringToArray<`_${number}a${bigint}_`, {strict: false}>>()
	.toBe<['_', `${number}`, 'a', `${bigint}`, '_']>();
expectTypeOf<StringToArray<`_${number}a${bigint}_`>>().toBe<['_', ...string[], '_']>();

function _readCharacterParts<Input extends string, Options extends StringToArrayOptions>(value: StringToArray<Input, Options>): unknown[] {
	return value;
}

// Literal checks after normalization preserve enum contents and inferred field modifiers.
enum CharacterSource {
	Ready = 'ready',
	Set = 'set',
}
expectTypeOf<StringToArray<CharacterSource>>().toBe<['r', 'e', 'a', 'd', 'y'] | ['s', 'e', 't']>();
expectTypeOf<StringToArray<Tagged<CharacterSource, 'Text'>>>().toBe<['r', 'e', 'a', 'd', 'y'] | ['s', 'e', 't']>();

declare function fieldCharacters<const Fields extends Record<string, string>>(fields: Fields): {[Key in keyof Fields]: StringToArray<Fields[Key]>};
const charactersByField = fieldCharacters({status: 'ok', marker: '-'});
expectTypeOf(charactersByField).toBe<{readonly status: ['o', 'k']; readonly marker: ['-']}>();
