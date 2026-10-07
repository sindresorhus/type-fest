import {expectType} from 'tsd';
import type {PascalCase} from '../index.d.ts';

const pascalFromCamel: PascalCase<'fooBar'> = 'FooBar';
expectType<'FooBar'>(pascalFromCamel);

const pascalFromKebab: PascalCase<'foo-bar'> = 'FooBar';
expectType<'FooBar'>(pascalFromKebab);

const pascalFromComplexKebab: PascalCase<'foo-bar-abc-123'> = 'FooBarAbc123';
expectType<'FooBarAbc123'>(pascalFromComplexKebab);

expectType<PascalCase<'fooBAR'>>('FooBar');
expectType<PascalCase<'fooBAR', {preserveConsecutiveUppercase: true}>>('FooBAR');

expectType<PascalCase<'fooBARBiz'>>('FooBarBiz');
expectType<PascalCase<'fooBARBiz', {preserveConsecutiveUppercase: true}>>('FooBARBiz');

expectType<PascalCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: true}>>('FooBARBizBUZZ');
expectType<PascalCase<'foo BAR-Biz_BUZZ', {preserveConsecutiveUppercase: false}>>('FooBarBizBuzz');
expectType<PascalCase<'foo\tBAR-Biz_BUZZ'>>('FooBarBizBuzz');

// A non-literal string is passed through unchanged, like `DelimiterCase` does.
expectType<PascalCase<string, {preserveConsecutiveUppercase: true}>>({} as string);
expectType<PascalCase<string>>({} as string);

// Punctuation
expectType<PascalCase<'onDialog:close'>>('OnDialog:close');
expectType<PascalCase<'foo-bar>>baz'>>('FooBar>>baz');
expectType<PascalCase<'foo-bar::01'>>('FooBar::01');

expectType<PascalCase<'onDialog:close', {splitOnPunctuation: true}>>('OnDialogClose');
expectType<PascalCase<'foo-bar>>baz', {splitOnPunctuation: true}>>('FooBarBaz');
expectType<PascalCase<'fooBAR:biz', {splitOnPunctuation: true; preserveConsecutiveUppercase: true}>>('FooBARBiz');
expectType<PascalCase<'foo-bar::01', {splitOnPunctuation: true}>>('FooBar01');
expectType<PascalCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: false}>>('FooBar01');
expectType<PascalCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: true}>>('FooBar01');

// Non-literal string types are passed through unchanged, like `DelimiterCase` does.
expectType<PascalCase<Uppercase<string>>>({} as Uppercase<string>);
expectType<PascalCase<Lowercase<string>>>({} as Lowercase<string>);
expectType<PascalCase<`${string}abc`>>({} as `${string}abc`);

// `PascalCase` is `Capitalize<CamelCase<…>>`, and `Capitalize` does nothing when the first character has no uppercase form, which an underscore does not. So the `preserveLeadingUnderscores` option also turns off the Pascal casing, because the underscores come first. See the note in the docs.
declare const preserveLeadingUnderscores: PascalCase<'_foo', {preserveLeadingUnderscores: true}>;
expectType<'_foo'>(preserveLeadingUnderscores);

declare const multipleLeadingUnderscores: PascalCase<'__foo', {preserveLeadingUnderscores: true}>;
expectType<'__foo'>(multipleLeadingUnderscores);

// `PascalCase` capitalizes the words of the camel-cased result, so it inherits the same fix.
expectType<'AÀVache'>({} as PascalCase<'a-à-vache'>);
expectType<'AÉcaille'>({} as PascalCase<'a-écaille'>);

// String members are converted even when the union also contains a non-string member.
expectType<'FooBar' | 'BazQux' | 42>({} as PascalCase<'foo-bar' | 'baz_qux' | 42>);
expectType<'FooBar' | `prefix${string}` | undefined>({} as PascalCase<'foo-bar' | `prefix${string}` | undefined>);
