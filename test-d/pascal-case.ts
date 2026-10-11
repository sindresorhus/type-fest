import {expectTypeOf} from 'nz';
import type {PascalCase} from '../index.d.ts';

const pascalFromCamel: PascalCase<'fooBar'> = 'FooBar';
expectTypeOf(pascalFromCamel).toBe<'FooBar'>();

const pascalFromKebab: PascalCase<'foo-bar'> = 'FooBar';
expectTypeOf(pascalFromKebab).toBe<'FooBar'>();

const pascalFromComplexKebab: PascalCase<'foo-bar-abc-123'> = 'FooBarAbc123';
expectTypeOf(pascalFromComplexKebab).toBe<'FooBarAbc123'>();

expectTypeOf<PascalCase<'fooBAR'>>().toBe<'FooBar'>();
expectTypeOf<PascalCase<'fooBAR', {preserveConsecutiveUppercase: true}>>().toBe<'FooBAR'>();

expectTypeOf<PascalCase<'fooBARBiz'>>().toBe<'FooBarBiz'>();
expectTypeOf<PascalCase<'fooBARBiz', {preserveConsecutiveUppercase: true}>>().toBe<'FooBARBiz'>();

expectTypeOf<PascalCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: true}>>().toBe<'FooBARBizBUZZ'>();
expectTypeOf<PascalCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: false}>>().toBe<'FooBarBizBuzz'>();
expectTypeOf<PascalCase<'foo\tBAR-Biz_BUZZ'>>().toBe<'FooBarBizBuzz'>();

// A non-literal string is passed through unchanged, like `DelimiterCase` does.
expectTypeOf<string>().toBe<PascalCase<string, {preserveConsecutiveUppercase: true}>>();
expectTypeOf<string>().toBe<PascalCase<string>>();

// Punctuation
expectTypeOf<PascalCase<'onDialog:close'>>().toBe<'OnDialog:close'>();
expectTypeOf<PascalCase<'foo-bar>>baz'>>().toBe<'FooBar>>baz'>();
expectTypeOf<PascalCase<'foo-bar::01'>>().toBe<'FooBar::01'>();

expectTypeOf<PascalCase<'onDialog:close', {splitOnPunctuation: true}>>().toBe<'OnDialogClose'>();
expectTypeOf<PascalCase<'foo-bar>>baz', {splitOnPunctuation: true}>>().toBe<'FooBarBaz'>();
expectTypeOf<PascalCase<'fooBAR:biz', {splitOnPunctuation: true; preserveConsecutiveUppercase: true}>>().toBe<'FooBARBiz'>();
expectTypeOf<PascalCase<'foo-bar::01', {splitOnPunctuation: true}>>().toBe<'FooBar01'>();
expectTypeOf<PascalCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: false}>>().toBe<'FooBar01'>();
expectTypeOf<PascalCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: true}>>().toBe<'FooBar01'>();

// Non-literal string types are passed through unchanged, like `DelimiterCase` does.
expectTypeOf<Uppercase<string>>().toBe<PascalCase<Uppercase<string>>>();
expectTypeOf<Lowercase<string>>().toBe<PascalCase<Lowercase<string>>>();
expectTypeOf<`${string}abc`>().toBe<PascalCase<`${string}abc`>>();

// `PascalCase` is `Capitalize<CamelCase<…>>`, and `Capitalize` does nothing when the first character has no uppercase form, which an underscore does not. So the `preserveLeadingUnderscores` option also turns off the Pascal casing, because the underscores come first. See the note in the docs.
declare const preserveLeadingUnderscores: PascalCase<'_foo', {preserveLeadingUnderscores: true}>;
expectTypeOf(preserveLeadingUnderscores).toBe<'_foo'>();

declare const multipleLeadingUnderscores: PascalCase<'__foo', {preserveLeadingUnderscores: true}>;
expectTypeOf(multipleLeadingUnderscores).toBe<'__foo'>();

// `PascalCase` capitalizes the words of the camel-cased result, so it inherits the same fix.
expectTypeOf<PascalCase<'a-à-vache'>>().toBe<'AÀVache'>();
expectTypeOf<PascalCase<'a-écaille'>>().toBe<'AÉcaille'>();

// String members are converted even when the union also contains a non-string member.
expectTypeOf<PascalCase<'foo-bar' | 'baz_qux' | 42>>().toBe<'FooBar' | 'BazQux' | 42>();
expectTypeOf<PascalCase<'foo-bar' | `prefix${string}` | undefined>>().toBe<'FooBar' | `prefix${string}` | undefined>();
