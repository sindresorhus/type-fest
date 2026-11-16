import {expectTypeOf} from 'nz';
import type {CamelCase, CamelCaseOptions, PascalCase, Tagged} from '../index.d.ts';

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
expectTypeOf<PascalCase<'onDialog:close', {splitOnPunctuation: false}>>().toBe<'OnDialog:close'>();
expectTypeOf<PascalCase<'foo-bar>>baz', {splitOnPunctuation: false}>>().toBe<'FooBar>>baz'>();
expectTypeOf<PascalCase<'foo-bar::01', {splitOnPunctuation: false}>>().toBe<'FooBar::01'>();

expectTypeOf<PascalCase<'onDialog:close'>>().toBe<'OnDialogClose'>();
expectTypeOf<PascalCase<'foo-bar>>baz'>>().toBe<'FooBarBaz'>();
expectTypeOf<PascalCase<'fooBAR:biz', {splitOnPunctuation: true; preserveConsecutiveUppercase: true}>>().toBe<'FooBARBiz'>();
expectTypeOf<PascalCase<'foo-bar::01'>>().toBe<'FooBar01'>();
expectTypeOf<PascalCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: false}>>().toBe<'FooBar01'>();
expectTypeOf<PascalCase<'foo-bar::01', {splitOnPunctuation: true; splitOnNumbers: true}>>().toBe<'FooBar01'>();

// Non-literal string types are passed through unchanged, like `DelimiterCase` does.
expectTypeOf<Uppercase<string>>().toBe<PascalCase<Uppercase<string>>>();
expectTypeOf<Lowercase<string>>().toBe<PascalCase<Lowercase<string>>>();
expectTypeOf<`${string}abc`>().toBe<PascalCase<`${string}abc`>>();

// The first letter after the leading underscores is capitalized, like `camelcase` with `pascalCase: true`.
declare const preserveLeadingUnderscores: PascalCase<'_foo', {preserveLeadingUnderscores: true}>;
expectTypeOf(preserveLeadingUnderscores).toBe<'_Foo'>();

declare const multipleLeadingUnderscores: PascalCase<'__foo', {preserveLeadingUnderscores: true}>;
expectTypeOf(multipleLeadingUnderscores).toBe<'__Foo'>();

// `PascalCase` capitalizes the words of the camel-cased result, so it inherits the same fix.
expectTypeOf<PascalCase<'a-à-vache'>>().toBe<'AÀVache'>();
expectTypeOf<PascalCase<'a-écaille'>>().toBe<'AÉcaille'>();

// String members are converted even when the union also contains a non-string member.
expectTypeOf<PascalCase<'foo-bar' | 'baz_qux' | 42>>().toBe<'FooBar' | 'BazQux' | 42>();
expectTypeOf<PascalCase<'foo-bar' | `prefix${string}` | undefined>>().toBe<'FooBar' | `prefix${string}` | undefined>();

// Pascal casing delegates option defaults to the same transformation as camel casing.
expectTypeOf<PascalCase<'_foo_bar', never>>().toBe<'_FooBar'>();
expectTypeOf<PascalCase<'_foo_bar', any>>().toBe<'_FooBar'>();
expectTypeOf<PascalCase<'__fooBAR_baz', {preserveLeadingUnderscores: true; preserveConsecutiveUppercase: true}>>().toBe<'__FooBARBaz'>();
expectTypeOf<PascalCase<'__fooBAR_baz', {preserveLeadingUnderscores: false; preserveConsecutiveUppercase: true}>>().toBe<'FooBARBaz'>();
expectTypeOf<PascalCase<'__p2p:network', {splitOnNumbers: true; splitOnPunctuation: true}>>().toBe<'__P2PNetwork'>();
expectTypeOf<PascalCase<'__p2p:network', {splitOnNumbers: false; splitOnPunctuation: true}>>().toBe<'__P2pNetwork'>();
expectTypeOf<PascalCase<'__p2p:network', {splitOnNumbers: true; splitOnPunctuation: false}>>().toBe<'__P2P:network'>();
expectTypeOf<PascalCase<'__p2p:network', {splitOnNumbers: false; splitOnPunctuation: false}>>().toBe<'__P2p:network'>();
expectTypeOf<PascalCase<'__p2p:network'>>().toBe<'__P2pNetwork'>();
expectTypeOf<PascalCase<Tagged<'__fooBAR', 'Text'>, {preserveLeadingUnderscores: true; preserveConsecutiveUppercase: true}>>().toBe<'__FooBAR'>();
expectTypeOf<PascalCase<Tagged<'foo-bar', 'Text'>, never>>().toBe<'FooBar'>();
expectTypeOf<PascalCase<'__FOO_BAR', never>>().toBe<'__FooBar'>();
expectTypeOf<PascalCase<'__foo_bar' | '__on_change', any>>().toBe<'__FooBar' | '__OnChange'>();
expectTypeOf<PascalCase<'_', never>>().toBe<'_'>();
expectTypeOf<PascalCase<string, never>>().toBe<string>();
expectTypeOf<PascalCase<Tagged<string, 'Text'>, any>>().toBe<Tagged<string, 'Text'>>();
expectTypeOf<PascalCase<any, never>>().toBe<any>();
expectTypeOf<PascalCase<never, any>>().toBe<never>();
expectTypeOf<PascalCase<unknown, never>>().toBe<unknown>();

function _readGenericPascalUnderscores<Options extends CamelCaseOptions>(value: PascalCase<'_foo', Options>): '_Foo' {
	return value;
}

function _readInvariantPascalWords<Options extends CamelCaseOptions>(value: PascalCase<'foo-bar', Options>): 'FooBar' {
	return value;
}

expectTypeOf<PascalCase<'_foo', {preserveLeadingUnderscores: any}>>().toBe<'_Foo'>();
// A non-literal preservation flag resolves like the default.
expectTypeOf<PascalCase<'_foo', {preserveLeadingUnderscores: boolean}>>().toBe<'_Foo'>();
// @ts-expect-error Unknown is not a preservation flag.
expectTypeOf<PascalCase<'foo', {preserveLeadingUnderscores: unknown}>>();
