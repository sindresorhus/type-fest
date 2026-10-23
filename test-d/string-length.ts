import {expectTypeOf} from 'nz';
import type {StringLength} from '../source/string-length.d.ts';
import type {StringRepeat} from '../source/string-repeat.d.ts';
import type {StringToArray} from '../source/string-to-array.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

// Empty string
expectTypeOf<StringLength<''>>().toBe<0>();

// Literals
expectTypeOf<StringLength<'a'>>().toBe<1>();
expectTypeOf<StringLength<'abcde'>>().toBe<5>();
expectTypeOf<StringLength<'012'>>().toBe<3>();

// Non-literals
expectTypeOf<StringLength<string>>().toBe<number>();
expectTypeOf<StringLength<Uppercase<string>>>().toBe<number>();
expectTypeOf<StringLength<`${string}abc`>>().toBe<number>();
expectTypeOf<StringLength<`abc${string}`>>().toBe<number>();
expectTypeOf<StringLength<`abc${string}def`>>().toBe<number>();
expectTypeOf<StringLength<`abc${string}def${string}ij`>>().toBe<number>();

// Unions
expectTypeOf<StringLength<'abcde' | 'fgh'>>().toBe<3 | 5>();
expectTypeOf<StringLength<'abc' | Uppercase<string>>>().toBe<number>();
expectTypeOf<StringLength<`ab${string}` | `${number}`>>().toBe<number>();

// Long strings
expectTypeOf<StringLength<StringRepeat<'a', 200>>>().toBe<200>();
expectTypeOf<StringLength<StringRepeat<'a', 900>>>().toBe<900>();

// Boundary cases
expectTypeOf<StringLength<never>>().toBe<never>();
expectTypeOf<StringLength<any>>().toBe<number>();

// String brands do not change the number of characters in the input.
expectTypeOf<StringLength<Tagged<'abc', 'Text'>>>().toBe<3>();
expectTypeOf<StringLength<Tagged<'', 'Text'>>>().toBe<0>();
expectTypeOf<StringLength<Tagged<'a' | 'abc', 'Text'>>>().toBe<1 | 3>();
expectTypeOf<StringLength<Tagged<string, 'Text'>>>().toBe<number>();
expectTypeOf<StringLength<Tagged<`abc${string}`, 'Text'>>>().toBe<number>();

// Repeated tags retain the length of their primitive string base.
expectTypeOf<StringLength<Tagged<Tagged<'abc', 'Text'>, 'Validated'>>>().toBe<3>();
expectTypeOf<StringLength<Tagged<Tagged<'', 'Text'>, 'Validated'>>>().toBe<0>();
expectTypeOf<StringLength<Tagged<Tagged<'a' | 'abc', 'Text'>, 'Validated'>>>().toBe<1 | 3>();
expectTypeOf<StringLength<Tagged<Tagged<string, 'Text'>, 'Validated'>>>().toBe<number>();

// Non-literal placeholders may contain multiple UTF-16 code units.
expectTypeOf<StringLength<`${number}`>>().toBe<number>();
expectTypeOf<StringLength<`id:${bigint}`>>().toBe<number>();
expectTypeOf<StringLength<`${number}:${bigint}`>>().toBe<number>();
expectTypeOf<StringLength<Lowercase<string>>>().toBe<number>();
expectTypeOf<StringLength<Capitalize<string>>>().toBe<number>();
expectTypeOf<StringLength<Uncapitalize<string>>>().toBe<number>();
expectTypeOf<StringLength<`prefix${Uppercase<string>}suffix`>>().toBe<number>();
expectTypeOf<StringLength<`prefix${Lowercase<string>}suffix`>>().toBe<number>();
expectTypeOf<StringLength<`${boolean}`>>().toBe<4 | 5>();
expectTypeOf<StringLength<`${1 | 22 | -333}`>>().toBe<1 | 2 | 4>();
expectTypeOf<StringLength<`item-${1n | 22n}`>>().toBe<6 | 7>();

// Preserve the existing compiler-inferred decomposition of surrogate pairs.
expectTypeOf<StringLength<'😀'>>().toBe<StringToArray<'😀'>['length']>();
expectTypeOf<StringLength<'a😀b'>>().toBe<StringToArray<'a😀b'>['length']>();
expectTypeOf<StringLength<'e\u{301}'>>().toBe<2>();
expectTypeOf<StringLength<'é'>>().toBe<1>();
expectTypeOf<StringLength<'\u{D800}'>>().toBe<1>();
expectTypeOf<StringLength<'\u{DC00}'>>().toBe<1>();
expectTypeOf<StringLength<'👨‍👩‍👧‍👦'>>().toBe<StringToArray<'👨‍👩‍👧‍👦'>['length']>();
expectTypeOf<StringLength<'\r\n\t'>>().toBe<3>();
expectTypeOf<StringLength<'\0x'>>().toBe<2>();

// Every original union member contributes its own length.
expectTypeOf<StringLength<'' | 'ab' | 'cde'>>().toBe<0 | 2 | 3>();
expectTypeOf<StringLength<'abc' | Tagged<'x', 'Text'>>>().toBe<1 | 3>();
expectTypeOf<StringLength<'abc' | Tagged<string, 'Text'>>>().toBe<number>();
expectTypeOf<StringLength<LiteralUnion<'abc', string>>>().toBe<number>();
expectTypeOf<StringLength<'a' | never>>().toBe<1>();

// Enum strings and opaque or custom brands retain their primitive content.
enum LengthText {
	Empty = '',
	Short = 'ab',
	Long = 'abcde',
}
expectTypeOf<StringLength<LengthText.Empty>>().toBe<0>();
expectTypeOf<StringLength<LengthText>>().toBe<0 | 2 | 5>();
expectTypeOf<StringLength<Opaque<'abc', 'Text'>>>().toBe<3>();
expectTypeOf<StringLength<Opaque<`${number}px`, 'Text'>>>().toBe<number>();
expectTypeOf<StringLength<'abc' & {readonly brand: unique symbol}>>().toBe<3>();
expectTypeOf<StringLength<Tagged<Opaque<'abc', 'Text'>, 'Validated'>>>().toBe<3>();
expectTypeOf<StringLength<Tagged<Tagged<`${bigint}`, 'Text'>, 'Validated'>>>().toBe<number>();
expectTypeOf<StringLength<'' & {}>>().toBe<0>();
expectTypeOf<StringLength<string & {}>>().toBe<number>();

// Keep the existing supported recursion boundary.
expectTypeOf<StringLength<StringRepeat<'a', 999>>>().toBe<999>();

// The public result stays usable as a number when its input is generic.
function _genericLength<Value extends string>(value: StringLength<Value>): number {
	return value;
}

declare function lengthOf<Value extends string>(value: Value): StringLength<Value>;
expectTypeOf(lengthOf('unicorn')).toBe<7>();
declare const dynamicText: string;
expectTypeOf(lengthOf(dynamicText)).toBe<number>();

// @ts-expect-error A non-string input is rejected.
type UnknownLength = StringLength<unknown>;
// @ts-expect-error Numbers must first be converted to strings.
type NumericLength = StringLength<123>;
