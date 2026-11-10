import {expectTypeOf} from 'nz';
import type {ArrayReverse, Join, LiteralUnion, Opaque, StringRepeat, StringReverse, StringToArray, Tagged} from '../index.d.ts';

// Literals retain every character, including leading zeros and whitespace.
expectTypeOf<StringReverse<''>>().toBe<''>();
expectTypeOf<StringReverse<'a'>>().toBe<'a'>();
expectTypeOf<StringReverse<'ab'>>().toBe<'ba'>();
expectTypeOf<StringReverse<'hello'>>().toBe<'olleh'>();
expectTypeOf<StringReverse<'stressed'>>().toBe<'desserts'>();
expectTypeOf<StringReverse<'racecar'>>().toBe<'racecar'>();
expectTypeOf<StringReverse<'AaBb'>>().toBe<'bBaA'>();
expectTypeOf<StringReverse<'00120'>>().toBe<'02100'>();
expectTypeOf<StringReverse<'-12.50'>>().toBe<'05.21-'>();
expectTypeOf<StringReverse<'a/b.json'>>().toBe<'nosj.b/a'>();
expectTypeOf<StringReverse<' hello '>>().toBe<' olleh '>();
expectTypeOf<StringReverse<'a\t\nb'>>().toBe<'b\n\ta'>();
expectTypeOf<StringReverse<'a\r\nb'>>().toBe<'b\n\ra'>();
expectTypeOf<StringReverse<'a\0b'>>().toBe<'b\0a'>();
expectTypeOf<StringReverse<' '>>().toBe<' '>();
expectTypeOf<StringReverse<'  a'>>().toBe<'a  '>();
expectTypeOf<StringReverse<'aab'>>().toBe<'baa'>();
expectTypeOf<StringReverse<'Hello, World!'>>().toBe<'!dlroW ,olleH'>();
expectTypeOf<StringReverse<'foo-bar_baz'>>().toBe<'zab_rab-oof'>();
expectTypeOf<StringReverse<'fooBar'>>().toBe<'raBoof'>();
expectTypeOf<StringReverse<'()[]{}<>'>>().toBe<'><}{][)('>();
expectTypeOf<StringReverse<'a\\b'>>().toBe<'b\\a'>();
expectTypeOf<StringReverse<'a`b'>>().toBe<'b`a'>();
expectTypeOf<StringReverse<'"\''>>().toBe<'\'"'>();
expectTypeOf<StringReverse<'a\u{A0}b'>>().toBe<'b\u{A0}a'>();
expectTypeOf<StringReverse<'0123456789'>>().toBe<'9876543210'>();
expectTypeOf<StringReverse<'1e+21'>>().toBe<'12+e1'>();
expectTypeOf<StringReverse<'abcdefghijklmnopqrstuvwxyz'>>().toBe<'zyxwvutsrqponmlkjihgfedcba'>();

// Text that looks like template literal syntax is ordinary characters.
/* eslint-disable no-template-curly-in-string -- The placeholder syntax is intentionally plain text. */
expectTypeOf<StringReverse<'${string}'>>().toBe<'}gnirts{$'>();
expectTypeOf<StringReverse<'${number}px'>>().toBe<'xp}rebmun{$'>();
/* eslint-enable no-template-curly-in-string */

// Literal types interpolated into a template literal are reversed as their string form.
type Stringify<Value extends string | number | bigint | boolean | null | undefined> = `${Value}`;
expectTypeOf<StringReverse<Stringify<null>>>().toBe<'llun'>();
expectTypeOf<StringReverse<Stringify<-0>>>().toBe<'0'>();
expectTypeOf<StringReverse<Stringify<1e-7>>>().toBe<'7-e1'>();

// Intrinsic string types applied to literals stay literal.
expectTypeOf<StringReverse<Uppercase<'abc'>>>().toBe<'CBA'>();
expectTypeOf<StringReverse<Lowercase<'ABC'>>>().toBe<'cba'>();
expectTypeOf<StringReverse<Capitalize<'abc'>>>().toBe<'cbA'>();
expectTypeOf<StringReverse<Uncapitalize<'ABC'>>>().toBe<'CBa'>();
expectTypeOf<Uppercase<StringReverse<'abc'>>>().toBe<'CBA'>();
expectTypeOf<Capitalize<StringReverse<'abc'>>>().toBe<'Cba'>();

// Unions distribute without mixing characters between members.
expectTypeOf<StringReverse<'ab' | 'cd'>>().toBe<'ba' | 'dc'>();
expectTypeOf<StringReverse<'' | 'abc'>>().toBe<'' | 'cba'>();
expectTypeOf<StringReverse<`file.${'js' | 'ts'}`>>().toBe<'sj.elif' | 'st.elif'>();
expectTypeOf<StringReverse<`${'a' | 'b'}${1 | 2}`>>().toBe<'1a' | '2a' | '1b' | '2b'>();
expectTypeOf<StringReverse<`${boolean}`>>().toBe<'eurt' | 'eslaf'>();
expectTypeOf<StringReverse<'abc' | never>>().toBe<'cba'>();
expectTypeOf<StringReverse<'ab' | 'ba'>>().toBe<'ab' | 'ba'>();
expectTypeOf<StringReverse<'aba' | 'abc'>>().toBe<'aba' | 'cba'>();
expectTypeOf<StringReverse<'a' | 'b' | 'c'>>().toBe<'a' | 'b' | 'c'>();
expectTypeOf<StringReverse<`${'get' | 'set'}${'A' | 'B'}`>>().toBe<'Ateg' | 'Bteg' | 'Ates' | 'Btes'>();
expectTypeOf<StringReverse<`${0 | 1}${0 | 1}`>>().toBe<'00' | '01' | '10' | '11'>();
expectTypeOf<StringReverse<Exclude<'ab' | 'cd' | 'ef', 'cd'>>>().toBe<'ba' | 'fe'>();
expectTypeOf<StringReverse<keyof {foo: 1; bar: 2}>>().toBe<'oof' | 'rab'>();
expectTypeOf<StringReverse<Extract<keyof {foo: 1; 0: 2}, string>>>().toBe<'oof'>();

// Unknown text cannot be reversed exactly and must not become an empty string.
expectTypeOf<StringReverse<string>>().toBe<string>();
expectTypeOf<StringReverse<any>>().toBe<string>();
expectTypeOf<StringReverse<`a${any}`>>().toBe<string>();
expectTypeOf<StringReverse<'a' | any>>().toBe<string>();
expectTypeOf<StringReverse<never>>().toBe<never>();
expectTypeOf<StringReverse<Tagged<never, 'Text'>>>().toBe<never>();
expectTypeOf<StringReverse<Uppercase<string>>>().toBe<string>();
expectTypeOf<StringReverse<Lowercase<string>>>().toBe<string>();
expectTypeOf<StringReverse<Capitalize<string>>>().toBe<string>();
expectTypeOf<StringReverse<Uncapitalize<string>>>().toBe<string>();
expectTypeOf<StringReverse<`${number}`>>().toBe<string>();
expectTypeOf<StringReverse<`${bigint}`>>().toBe<string>();
expectTypeOf<StringReverse<`prefix${string}`>>().toBe<string>();
expectTypeOf<StringReverse<`${string}suffix`>>().toBe<string>();
expectTypeOf<StringReverse<`prefix${string}suffix`>>().toBe<string>();
expectTypeOf<StringReverse<`id-${number}`>>().toBe<string>();
expectTypeOf<StringReverse<`id-${bigint}-end`>>().toBe<string>();
expectTypeOf<StringReverse<`a${string}b${string}c`>>().toBe<string>();
expectTypeOf<StringReverse<'abc' | `id-${number}`>>().toBe<string>();
expectTypeOf<StringReverse<LiteralUnion<'abc', string>>>().toBe<string>();
expectTypeOf<StringReverse<`${boolean}-${string}`>>().toBe<string>();
expectTypeOf<StringReverse<`${string}${string}`>>().toBe<string>();
expectTypeOf<StringReverse<`${Uppercase<string>}!`>>().toBe<string>();
expectTypeOf<StringReverse<`a${Lowercase<string>}`>>().toBe<string>();
expectTypeOf<StringReverse<Uppercase<`id-${number}`>>>().toBe<string>();
expectTypeOf<StringReverse<`${'a' | 'b'}${string}`>>().toBe<string>();
expectTypeOf<StringReverse<string & {}>>().toBe<string>();
expectTypeOf<StringReverse<StringReverse<string>>>().toBe<string>();

// A brand describes the original value, not its reversal.
expectTypeOf<StringReverse<Tagged<'hello', 'Text'>>>().toBe<'olleh'>();
expectTypeOf<StringReverse<Tagged<'', 'Text'>>>().toBe<''>();
expectTypeOf<StringReverse<Tagged<'ab' | 'cd', 'Text'>>>().toBe<'ba' | 'dc'>();
expectTypeOf<StringReverse<Tagged<string, 'Text'>>>().toBe<string>();
expectTypeOf<StringReverse<Tagged<`id-${number}`, 'Text'>>>().toBe<string>();
expectTypeOf<StringReverse<'hello' & {readonly brand: unique symbol}>>().toBe<'olleh'>();
expectTypeOf<StringReverse<Tagged<'hello', 'Text'>>>().not.toBeAssignableTo<Tagged<'olleh', 'Text'>>();
expectTypeOf<StringReverse<Opaque<'hello', 'Text'>>>().toBe<'olleh'>();
expectTypeOf<StringReverse<Opaque<string, 'Text'>>>().toBe<string>();
expectTypeOf<StringReverse<Tagged<Tagged<'hello', 'Text'>, 'Greeting'>>>().toBe<'olleh'>();
expectTypeOf<StringReverse<Tagged<'hello', 'Text', {language: 'en'}>>>().toBe<'olleh'>();
expectTypeOf<StringReverse<Tagged<'hello', 'Text'> | 'world'>>().toBe<'olleh' | 'dlrow'>();
expectTypeOf<StringReverse<Tagged<'hello', 'Text'> | Tagged<'world', 'Other'>>>().toBe<'olleh' | 'dlrow'>();
expectTypeOf<StringReverse<Tagged<'hello', 'Text'> | string>>().toBe<string>();
expectTypeOf<StringReverse<Tagged<`${'a' | 'b'}c`, 'Text'>>>().toBe<'ca' | 'cb'>();
expectTypeOf<StringReverse<Tagged<Uppercase<string>, 'Text'>>>().toBe<string>();
expectTypeOf<StringReverse<StringReverse<Tagged<'hello', 'Text'>>>>().toBe<'hello'>();

// Characters are split as the compiler splits them in template literal inference. For emoji, this differs between TypeScript versions.
expectTypeOf<StringReverse<'日本語'>>().toBe<'語本日'>();
expectTypeOf<StringReverse<'café'>>().toBe<'éfac'>();
expectTypeOf<StringReverse<'cafe\u{301}'>>().toBe<'\u{301}efac'>();
type ReversedEmoji = '😀' extends `${infer First}${infer Rest}` ? `${Rest}${First}` : never;
expectTypeOf<StringReverse<'a😀b'>>().toBe<`b${ReversedEmoji}a`>();
expectTypeOf<StringReverse<'\u{D800}a'>>().toBe<'a\u{D800}'>();
expectTypeOf<StringReverse<'ñandú'>>().toBe<'údnañ'>();
expectTypeOf<StringReverse<'Привет'>>().toBe<'тевирП'>();
expectTypeOf<StringReverse<'שלום'>>().toBe<'םולש'>();
expectTypeOf<StringReverse<'αβγ'>>().toBe<'γβα'>();
expectTypeOf<StringReverse<'a\u{200D}b'>>().toBe<'b\u{200D}a'>();
expectTypeOf<StringReverse<'a\u{FEFF}'>>().toBe<'\u{FEFF}a'>();
expectTypeOf<StringReverse<'€£¥'>>().toBe<'¥£€'>();
expectTypeOf<StringReverse<StringReverse<'a😀b'>>>().toBe<'a😀b'>();
expectTypeOf<StringReverse<StringReverse<'cafe\u{301}'>>>().toBe<'cafe\u{301}'>();

// Tail recursion handles long inputs, up to the documented limit of 998 characters.
expectTypeOf<StringReverse<StringRepeat<'ab', 100>>>().toBe<StringRepeat<'ba', 100>>();
type LongText = `${StringRepeat<'a', 400>}X${StringRepeat<'b', 400>}`;
type ReversedLongText = `${StringRepeat<'b', 400>}X${StringRepeat<'a', 400>}`;
expectTypeOf<StringReverse<LongText>>().toBe<ReversedLongText>();
expectTypeOf<StringReverse<LongText | 'abc'>>().toBe<ReversedLongText | 'cba'>();
expectTypeOf<StringReverse<StringReverse<LongText>>>().toBe<LongText>();
expectTypeOf<StringReverse<`x${StringRepeat<'a', 997>}`>>().toBe<`${StringRepeat<'a', 997>}x`>();

// Reversing twice returns the original literal.
expectTypeOf<StringReverse<StringReverse<''>>>().toBe<''>();
expectTypeOf<StringReverse<StringReverse<'hello'>>>().toBe<'hello'>();
expectTypeOf<StringReverse<StringReverse<'ab' | 'cd'>>>().toBe<'ab' | 'cd'>();

// The result agrees with reversing the characters as a tuple.
expectTypeOf<StringReverse<'hello'>>().toBe<Join<ArrayReverse<StringToArray<'hello'>>, ''>>();
expectTypeOf<StringToArray<StringReverse<'abc'>>>().toBe<['c', 'b', 'a']>();
expectTypeOf<StringReverse<Join<['a', 'b', 'c'], '-'>>>().toBe<'c-b-a'>();

// Concatenation reverses the order of the parts.
type Concatenate<First extends string, Second extends string> = `${First}${Second}`;
expectTypeOf<StringReverse<Concatenate<'abc', 'def'>>>().toBe<Concatenate<StringReverse<'def'>, StringReverse<'abc'>>>();
expectTypeOf<StringReverse<Concatenate<'ab' | 'cd', 'x'>>>().toBe<Concatenate<'x', StringReverse<'ab' | 'cd'>>>();
expectTypeOf<`${StringReverse<'abc'>}${string}`>().toBe<`cba${string}`>();

// Usable as a building block for other string types.
type IsPalindrome<Text extends string> = Text extends StringReverse<Text> ? true : false;
expectTypeOf<IsPalindrome<'racecar'>>().toBe<true>();
expectTypeOf<IsPalindrome<'level'>>().toBe<true>();
expectTypeOf<IsPalindrome<''>>().toBe<true>();
expectTypeOf<IsPalindrome<'hello'>>().toBe<false>();
expectTypeOf<IsPalindrome<'Racecar'>>().toBe<false>();
type RemoveSuffixViaReverse<Text extends string, Suffix extends string> = StringReverse<Text> extends `${StringReverse<Suffix>}${infer Rest}` ? StringReverse<Rest> : Text;
expectTypeOf<RemoveSuffixViaReverse<'index.d.ts', '.ts'>>().toBe<'index.d'>();
expectTypeOf<RemoveSuffixViaReverse<'index.d.ts', '.js'>>().toBe<'index.d.ts'>();

// Usable in key remapping.
type ReverseKeys<ObjectType> = {[Key in keyof ObjectType as Key extends string ? StringReverse<Key> : Key]: ObjectType[Key]};
expectTypeOf<ReverseKeys<{foo: 1; bar?: 2; readonly baz: 3; 0: 4}>>().toBe<{oof: 1; rab?: 2; readonly zab: 3; 0: 4}>();
expectTypeOf<ReverseKeys<{aba: 1; abc: 2}>>().toBe<{aba: 1; cba: 2}>();
expectTypeOf<ReverseKeys<Record<string, number>>>().toBe<Record<string, number>>();
expectTypeOf<Record<StringReverse<'ab' | 'cd'>, number>>().toBe<{ba: number; dc: number}>();

// Generic calls preserve literal inference through the public export.
declare function reverseText<Text extends string>(text: Text): StringReverse<Text>;
expectTypeOf(reverseText('hello')).toBe<'olleh'>();
declare const input: 'hello' | 'world';
expectTypeOf(reverseText(input)).toBe<'olleh' | 'dlrow'>();
declare const dynamicInput: string;
expectTypeOf(reverseText(dynamicInput)).toBe<string>();
declare const taggedInput: Tagged<'hello', 'Text'>;
expectTypeOf(reverseText(taggedInput)).toBe<'olleh'>();
expectTypeOf<StringReverse<'hello'>>().not.toBeAssignableTo<'hello'>();
expectTypeOf<'hello'>().not.toBeAssignableTo<StringReverse<'hello'>>();
declare const patternInput: `id-${number}`;
expectTypeOf(reverseText(patternInput)).toBe<string>();
declare const anyInput: any;
expectTypeOf(reverseText(anyInput)).toBe<string>();
const tupleInput = ['ab', 'cd'] as const;
expectTypeOf(reverseText(tupleInput[0 as number]!)).toBe<'ba' | 'dc'>();

// The result of an unresolved generic input is still a string, so it composes inside generic code.
function reverseAndUppercase<const Text extends string>(text: Text): Uppercase<StringReverse<Text>> {
	const reversed: string = reverseText(text);
	return reversed.toUpperCase() as Uppercase<StringReverse<Text>>;
}

expectTypeOf(reverseAndUppercase('hello')).toBe<'OLLEH'>();

// String enum members can be reversed without retaining their nominal identity.
enum FileExtension {
	JavaScript = 'js',
	TypeScript = 'ts',
}
expectTypeOf<StringReverse<FileExtension.JavaScript>>().toBe<'sj'>();
expectTypeOf<StringReverse<FileExtension>>().toBe<'sj' | 'st'>();
expectTypeOf(reverseText(FileExtension.TypeScript)).toBe<'st'>();
expectTypeOf<StringReverse<`file.${FileExtension}`>>().toBe<'sj.elif' | 'st.elif'>();
expectTypeOf<StringReverse<FileExtension.JavaScript>>().not.toBeAssignableTo<FileExtension>();

// Non-string inputs are rejected rather than coerced.
// @ts-expect-error
type UnknownInput = StringReverse<unknown>;
// @ts-expect-error
type NumberInput = StringReverse<123>;
// @ts-expect-error
type NullInput = StringReverse<null>;
// @ts-expect-error
type UndefinedInput = StringReverse<undefined>;
// @ts-expect-error
type ObjectInput = StringReverse<{text: 'hello'}>;
// @ts-expect-error
type SymbolInput = StringReverse<symbol>;
// @ts-expect-error
type WrapperInput = StringReverse<String>;
// @ts-expect-error
type ArrayInput = StringReverse<string[]>;
// @ts-expect-error
type MixedUnionInput = StringReverse<'abc' | 123>;
// @ts-expect-error
type OptionalInput = StringReverse<'abc' | undefined>;
// @ts-expect-error
reverseText(123);
