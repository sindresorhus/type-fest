import {expectTypeOf} from 'nz';
import type {CamelCaseString, Opaque, Tagged} from '../index.d.ts';

// A valid value is kept as is
expectTypeOf<CamelCaseString<'fooBar'>>().toBe<'fooBar'>();
expectTypeOf<CamelCaseString<'foo'>>().toBe<'foo'>();
expectTypeOf<CamelCaseString<'fooBARBaz', {preserveConsecutiveUppercase: true}>>().toBe<'fooBARBaz'>();
expectTypeOf<CamelCaseString<'fööBär'>>().toBe<'fööBär'>();

// A string with no letters has no case, so every casing accepts it
expectTypeOf<CamelCaseString<'123'>>().toBe<'123'>();

// A single uppercase letter is a word of its own, so camel case lowercases it
expectTypeOf<CamelCaseString<'a'>>().toBe<'a'>();
expectTypeOf<CamelCaseString<'A'>>().toBe<never>();

// Numbers are split by default, so a numeric run must start a new word
expectTypeOf<CamelCaseString<'foo2bar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'foo2Bar'>>().toBe<'foo2Bar'>();
expectTypeOf<CamelCaseString<'2fa'>>().toBe<never>();

// Anything the transformer would change is rejected
expectTypeOf<CamelCaseString<'FooBar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'FOO'>>().toBe<never>();
expectTypeOf<CamelCaseString<'foo-bar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'foo_bar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'foo bar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'foo\tbar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'_'>>().toBe<never>();

// An empty string is rejected, even though the transformer keeps it
expectTypeOf<CamelCaseString<''>>().toBe<never>();

// An underscore is only part of the case when the transformer is told to keep a leading one
expectTypeOf<CamelCaseString<'_fooBar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'_fooBar', {preserveLeadingUnderscores: boolean}>>().toBe<never>();
expectTypeOf<CamelCaseString<'_fooBar', {preserveLeadingUnderscores: true}>>().toBe<'_fooBar'>();
expectTypeOf<CamelCaseString<'__foo', {preserveLeadingUnderscores: true}>>().toBe<'__foo'>();
expectTypeOf<CamelCaseString<'_foo_bar', {preserveLeadingUnderscores: true}>>().toBe<never>();

// Punctuation is not part of any case, even when the transformer keeps it
expectTypeOf<CamelCaseString<'foo.bar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'foo+bar'>>().toBe<never>();
expectTypeOf<CamelCaseString<'foo/bar'>>().toBe<never>();

// A union is kept only when every member is valid
expectTypeOf<CamelCaseString<'fooBar' | 'bazQux'>>().toBe<'fooBar' | 'bazQux'>();
expectTypeOf<CamelCaseString<'fooBar' | 'baz-qux'>>().toBe<never>();
expectTypeOf<CamelCaseString<'fooBar' | ''>>().toBe<never>();
expectTypeOf<CamelCaseString<'fooBar' | 'FooBar'>>().toBe<never>();

// A type that is not a single literal is rejected
expectTypeOf<CamelCaseString<string>>().toBe<never>();
expectTypeOf<CamelCaseString<`on${string}`>>().toBe<never>();
expectTypeOf<CamelCaseString<Uppercase<string>>>().toBe<never>();
expectTypeOf<CamelCaseString<any>>().toBe<never>();
expectTypeOf<CamelCaseString<never>>().toBe<never>();

// @ts-expect-error `unknown` is not a string.
type UnknownValue = CamelCaseString<unknown>;

// A valid branded string keeps its brand
expectTypeOf<CamelCaseString<Tagged<'fooBar', 'HandlerName'>>>().toBe<Tagged<'fooBar', 'HandlerName'>>();
expectTypeOf<CamelCaseString<Tagged<'foo-bar', 'HandlerName'>>>().toBe<never>();
expectTypeOf<CamelCaseString<Tagged<'', 'HandlerName'>>>().toBe<never>();
expectTypeOf<CamelCaseString<Tagged<'', 'HandlerName'> | 'fooBar'>>().toBe<never>();
expectTypeOf<CamelCaseString<Opaque<'fooBar', 'HandlerName'>>>().toBe<Opaque<'fooBar', 'HandlerName'>>();

// A valid string enum member is kept
enum HandlerName {
	Submit = 'onSubmit',
	Reset = 'on-reset',
}

expectTypeOf<CamelCaseString<HandlerName.Submit>>().toBe<HandlerName.Submit>();
expectTypeOf<CamelCaseString<HandlerName.Reset>>().toBe<never>();
expectTypeOf<CamelCaseString<HandlerName>>().toBe<never>();

// A generic parameter is the only place where the type can check a value
declare function defineHandler<Name extends string>(handler: {name: CamelCaseString<Name>}): Name;

const handlerName = defineHandler({name: 'onSubmit'});
expectTypeOf(handlerName).toBe<'onSubmit'>();

// @ts-expect-error Not camel case.
defineHandler({name: 'on-submit'});

declare const wide: string;

// @ts-expect-error A wide string cannot be proven to be camel case.
defineHandler({name: wide});
