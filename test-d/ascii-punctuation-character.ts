import {expectTypeOf} from 'nz';
import type {Alphanumeric, AsciiPunctuationCharacter, StringLength, StringToArray, UnionToTuple, WhitespaceCharacter, Words} from '../index.d.ts';

// The four ASCII punctuation ranges, expressed as code points independently of the declaration.
type FirstRange = StringToArray<'\u{21}\u{22}\u{23}\u{24}\u{25}\u{26}\u{27}\u{28}\u{29}\u{2A}\u{2B}\u{2C}\u{2D}\u{2E}\u{2F}'>[number];
type SecondRange = StringToArray<'\u{3A}\u{3B}\u{3C}\u{3D}\u{3E}\u{3F}\u{40}'>[number];
type ThirdRange = StringToArray<'\u{5B}\u{5C}\u{5D}\u{5E}\u{5F}\u{60}'>[number];
type FourthRange = StringToArray<'\u{7B}\u{7C}\u{7D}\u{7E}'>[number];
expectTypeOf<AsciiPunctuationCharacter>().toBe<FirstRange | SecondRange | ThirdRange | FourthRange>();
expectTypeOf<UnionToTuple<AsciiPunctuationCharacter>['length']>().toBe<32>();
expectTypeOf<StringLength<AsciiPunctuationCharacter>>().toBe<1>();

// ASCII punctuation includes characters that Unicode classifies as symbols.
expectTypeOf<'$' | '+' | '<' | '=' | '>' | '^' | '`' | '|' | '~'>().toBeAssignableTo<AsciiPunctuationCharacter>();

// Quotes, backslashes, and template literal metacharacters retain their literal identity.
expectTypeOf<'\'' | '"' | '\\' | '`' | '$' | '{' | '}'>().toBeAssignableTo<AsciiPunctuationCharacter>();
expectTypeOf<'-' | '_'>().toBeAssignableTo<AsciiPunctuationCharacter>();

// Neither letters, digits, nor whitespace belong to this set.
expectTypeOf<Extract<Alphanumeric, AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<WhitespaceCharacter, AsciiPunctuationCharacter>>().toBe<never>();

// Control characters, including DEL immediately after the final range, are excluded.
type LowerAsciiControls = StringToArray<'\u{0}\u{1}\u{2}\u{3}\u{4}\u{5}\u{6}\u{7}\u{8}\u{9}\u{A}\u{B}\u{C}\u{D}\u{E}\u{F}'>[number];
type UpperAsciiControls = StringToArray<'\u{10}\u{11}\u{12}\u{13}\u{14}\u{15}\u{16}\u{17}\u{18}\u{19}\u{1A}\u{1B}\u{1C}\u{1D}\u{1E}\u{1F}\u{7F}'>[number];
expectTypeOf<Extract<LowerAsciiControls | UpperAsciiControls, AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<'\u{80}' | '\u{85}' | '\u{9F}', AsciiPunctuationCharacter>>().toBe<never>();

// Non-ASCII punctuation and lookalikes must not silently broaden the ASCII contract.
expectTypeOf<Extract<'¡' | '¿' | '«' | '»' | '\u{2013}' | '\u{2014}' | '…' | '‘' | '’' | '“' | '”', AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<'、' | '。' | '！' | '，' | '：' | '＿' | '＄' | '＋' | '～', AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<'§' | '£' | '€' | '×' | '÷' | '−' | '©' | '😀' | '\u{FE0F}', AsciiPunctuationCharacter>>().toBe<never>();

// A member is exactly one character, not an empty string or a punctuation sequence.
expectTypeOf<''>().not.toBeAssignableTo<AsciiPunctuationCharacter>();
expectTypeOf<Extract<'::' | '...' | '?!' | '${' | '\\n', AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<`${AsciiPunctuationCharacter}${AsciiPunctuationCharacter}`, AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<`a${AsciiPunctuationCharacter}` | `${AsciiPunctuationCharacter}a` | ` ${AsciiPunctuationCharacter}`, AsciiPunctuationCharacter>>().toBe<never>();

// Broad inputs and non-string primitives do not guarantee a punctuation character.
expectTypeOf<AsciiPunctuationCharacter>().toBeAssignableTo<string>();
expectTypeOf<string>().not.toBeAssignableTo<AsciiPunctuationCharacter>();
expectTypeOf<unknown>().not.toBeAssignableTo<AsciiPunctuationCharacter>();
expectTypeOf<Extract<number | bigint | boolean | symbol | null | undefined | object, AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<string, AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<unknown, AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<never, AsciiPunctuationCharacter>>().toBe<never>();
expectTypeOf<Extract<any, AsciiPunctuationCharacter>>().toBe<any>();
expectTypeOf<Extract<AsciiPunctuationCharacter, any>>().toBe<AsciiPunctuationCharacter>();
expectTypeOf<Extract<AsciiPunctuationCharacter, unknown>>().toBe<AsciiPunctuationCharacter>();
expectTypeOf<Extract<AsciiPunctuationCharacter, never>>().toBe<never>();

// The documented filtering example preserves the selected literals.
expectTypeOf<Extract<',' | ';' | ' ' | 'a', AsciiPunctuationCharacter>>().toBe<',' | ';'>();
expectTypeOf<Exclude<':' | '/' | 'a' | ' ' | '：', AsciiPunctuationCharacter>>().toBe<'a' | ' ' | '：'>();

const delimiter: AsciiPunctuationCharacter = ':';
expectTypeOf(delimiter).toBe<':'>();
// @ts-expect-error
const invalidDelimiter: AsciiPunctuationCharacter = '::';

// Constrain generic APIs without losing the chosen delimiter's literal type.
function punctuationDelimiter<Delimiter extends AsciiPunctuationCharacter>(value: Delimiter): Delimiter {
	return value;
}

expectTypeOf(punctuationDelimiter(';')).toBe<';'>();
expectTypeOf(punctuationDelimiter('\\')).toBe<'\\'>();
// @ts-expect-error
punctuationDelimiter('');
// @ts-expect-error
punctuationDelimiter('::');
// @ts-expect-error
punctuationDelimiter(' ');
// @ts-expect-error
punctuationDelimiter('！');
// @ts-expect-error
punctuationDelimiter(1);

// Compose a template literal grammar with exactly one punctuation separator.
type Field = `name${AsciiPunctuationCharacter}value`;
expectTypeOf<'name:value' | 'name=value' | 'name_value' | 'name\\value'>().toBeAssignableTo<Field>();
expectTypeOf<Extract<'namevalue' | 'name::value' | 'name value' | 'name：value', Field>>().toBe<never>();

// The public character set matches the punctuation used by the word splitter.
expectTypeOf<{[Character in AsciiPunctuationCharacter]: Words<`foo${Character}bar`, {splitOnPunctuation: true}>}>()
	.toBe<{[Character in AsciiPunctuationCharacter]: ['foo', 'bar']}>();

// Parse a field using any punctuation character, without treating regex metacharacters specially.
type ParseField<Value extends string> = Value extends `${infer Name}${AsciiPunctuationCharacter}${infer Content}` ? [Name, Content] : never;
expectTypeOf<{[Character in AsciiPunctuationCharacter]: ParseField<`name${Character}value`>}>()
	.toBe<{[Character in AsciiPunctuationCharacter]: ['name', 'value']}>();
expectTypeOf<ParseField<'name:value' | 'size=large'>>().toBe<['name', 'value'] | ['size', 'large']>();
expectTypeOf<ParseField<'name:value' | 'missing'>>().toBe<['name', 'value']>();
expectTypeOf<ParseField<`${AsciiPunctuationCharacter}value`>>().toBe<['', 'value']>();
expectTypeOf<ParseField<`name${AsciiPunctuationCharacter}`>>().toBe<['name', '']>();
expectTypeOf<ParseField<AsciiPunctuationCharacter>>().toBe<['', '']>();
expectTypeOf<ParseField<''>>().toBe<never>();
expectTypeOf<ParseField<'name value' | 'name\tvalue' | 'name\nvalue'>>().toBe<never>();
expectTypeOf<ParseField<'name：value' | 'name。value' | 'name\u{2014}value'>>().toBe<never>();
expectTypeOf<ParseField<never>>().toBe<never>();
expectTypeOf<ParseField<string>>().toBe<never>();

// A punctuation constraint preserves unions and does not accept unchecked strings or boxed strings.
declare const delimiterChoice: ':' | ';';
expectTypeOf(punctuationDelimiter(delimiterChoice)).toBe<':' | ';'>();
declare const broadDelimiter: string;
// @ts-expect-error
punctuationDelimiter(broadDelimiter);
declare const unknownDelimiter: unknown;
// @ts-expect-error
punctuationDelimiter(unknownDelimiter);
declare const boxedDelimiter: String;
// @ts-expect-error
punctuationDelimiter(boxedDelimiter);
// @ts-expect-error
punctuationDelimiter(undefined);
// @ts-expect-error
punctuationDelimiter(null);

// Constrain a set of delimiters while retaining each tuple element's literal identity.
const delimiters = [',', ';', '\\', '`', '$'] as const satisfies readonly AsciiPunctuationCharacter[];
expectTypeOf(delimiters).toBe<readonly [',', ';', '\\', '`', '$']>();
// @ts-expect-error
const invalidDelimiters = [',', '::'] as const satisfies readonly AsciiPunctuationCharacter[];

// Every member can be used as an exact object key, with no broad string index signature.
type DelimiterTable = {[Character in AsciiPunctuationCharacter]: {delimiter: Character}};
expectTypeOf<keyof DelimiterTable>().toBe<AsciiPunctuationCharacter>();
expectTypeOf<DelimiterTable['\\']>().toBe<{delimiter: '\\'}>();
expectTypeOf<DelimiterTable['"']>().toBe<{delimiter: '"'}>();
expectTypeOf<DelimiterTable['\'']>().toBe<{delimiter: '\''}>();
expectTypeOf<DelimiterTable['$']>().toBe<{delimiter: '$'}>();
// @ts-expect-error
type InvalidDelimiterLookup = DelimiterTable['a'];

// Punctuation has no case, so it remains unchanged in case-insensitive delimiter grammars.
expectTypeOf<Uppercase<AsciiPunctuationCharacter>>().toBe<AsciiPunctuationCharacter>();
expectTypeOf<Lowercase<AsciiPunctuationCharacter>>().toBe<AsciiPunctuationCharacter>();
expectTypeOf<Capitalize<AsciiPunctuationCharacter>>().toBe<AsciiPunctuationCharacter>();
expectTypeOf<Uncapitalize<AsciiPunctuationCharacter>>().toBe<AsciiPunctuationCharacter>();
