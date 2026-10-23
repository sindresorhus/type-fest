import {expectTypeOf} from 'nz';
import type {KebabCaseString, Opaque, Tagged} from '../index.d.ts';

// A valid value is kept as is
expectTypeOf<KebabCaseString<'foo-bar'>>().toBe<'foo-bar'>();
expectTypeOf<KebabCaseString<'foo'>>().toBe<'foo'>();
expectTypeOf<KebabCaseString<'a'>>().toBe<'a'>();
expectTypeOf<KebabCaseString<'123'>>().toBe<'123'>();
expectTypeOf<KebabCaseString<'foo-bar-baz-123'>>().toBe<'foo-bar-baz-123'>();
expectTypeOf<KebabCaseString<'webkit-animation'>>().toBe<'webkit-animation'>();

// A non-ASCII letter is a letter, so it is kept
expectTypeOf<KebabCaseString<'föö-bär'>>().toBe<'föö-bär'>();

// Numbers are not split by default, so a numeric run stays inside its word
expectTypeOf<KebabCaseString<'foo-1-bar'>>().toBe<'foo-1-bar'>();
expectTypeOf<KebabCaseString<'p2p-network'>>().toBe<'p2p-network'>();
expectTypeOf<KebabCaseString<'p2p-network', {splitOnNumbers: true}>>().toBe<never>();
expectTypeOf<KebabCaseString<'p-2-p-network', {splitOnNumbers: true}>>().toBe<'p-2-p-network'>();

// Anything the transformer would change is rejected
expectTypeOf<KebabCaseString<'fooBar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'FooBar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'FOO'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo_bar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo bar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo--bar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'-foo'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo-'>>().toBe<never>();
expectTypeOf<KebabCaseString<'-'>>().toBe<never>();
expectTypeOf<KebabCaseString<'-webkit-animation'>>().toBe<never>();

// An empty string is rejected, even though the transformer keeps it
expectTypeOf<KebabCaseString<''>>().toBe<never>();

// Whitespace separates words, so the transformer changes it
expectTypeOf<KebabCaseString<'foo\tbar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo\nbar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo\u{A0}bar'>>().toBe<never>();

// Punctuation is not part of any case, even when the transformer keeps it
expectTypeOf<KebabCaseString<'div.card'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo.bar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo+bar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo/bar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'a-b.c'>>().toBe<never>();

// Only ASCII punctuation is checked, so a character that the transformer keeps is accepted
expectTypeOf<KebabCaseString<'foo—bar'>>().toBe<'foo—bar'>();

// `splitOnPunctuation` cannot make punctuated input valid, because kebab case never holds punctuation
expectTypeOf<KebabCaseString<'div.card', {splitOnPunctuation: true}>>().toBe<never>();
expectTypeOf<KebabCaseString<'div-card', {splitOnPunctuation: true}>>().toBe<'div-card'>();

// A union is kept only when every member is valid
expectTypeOf<KebabCaseString<'foo-bar' | 'baz-qux'>>().toBe<'foo-bar' | 'baz-qux'>();
expectTypeOf<KebabCaseString<'foo-bar' | 'bazQux'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo-bar' | ''>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo-bar' | 'foo.bar'>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo-bar' | 'fooBar'>>().toBe<never>();

// A type that is not a single literal is rejected
expectTypeOf<KebabCaseString<string>>().toBe<never>();
expectTypeOf<KebabCaseString<string & {}>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo' | Lowercase<string>>>().toBe<never>();
expectTypeOf<KebabCaseString<`${string}-${string}`>>().toBe<never>();
expectTypeOf<KebabCaseString<Uppercase<string>>>().toBe<never>();
expectTypeOf<KebabCaseString<any>>().toBe<never>();
expectTypeOf<KebabCaseString<never>>().toBe<never>();

// @ts-expect-error `unknown` is not a string.
type UnknownValue = KebabCaseString<unknown>;

// A valid branded string keeps its brand
expectTypeOf<KebabCaseString<Tagged<'foo-bar', 'ClassName'>>>().toBe<Tagged<'foo-bar', 'ClassName'>>();
expectTypeOf<KebabCaseString<Tagged<'fooBar', 'ClassName'>>>().toBe<never>();
expectTypeOf<KebabCaseString<Tagged<string, 'ClassName'>>>().toBe<never>();
expectTypeOf<KebabCaseString<Tagged<'', 'ClassName'>>>().toBe<never>();
expectTypeOf<KebabCaseString<Tagged<'' | 'foo', 'ClassName'>>>().toBe<never>();
expectTypeOf<KebabCaseString<Tagged<Tagged<'foo-bar', 'ClassName'>, 'Primary'>>>().toBe<Tagged<Tagged<'foo-bar', 'ClassName'>, 'Primary'>>();
expectTypeOf<KebabCaseString<Opaque<'foo-bar', 'ClassName'>>>().toBe<Opaque<'foo-bar', 'ClassName'>>();
expectTypeOf<KebabCaseString<Opaque<'foo.bar', 'ClassName'>>>().toBe<never>();
expectTypeOf<KebabCaseString<'foo-bar' | Tagged<'baz', 'ClassName'>>>().toBe<'foo-bar' | Tagged<'baz', 'ClassName'>>();
expectTypeOf<KebabCaseString<Tagged<'foo-bar', 'ClassName'> | Tagged<'fooBar', 'ClassName'>>>().toBe<never>();

// A valid string enum member is kept
enum ClassName {
	Primary = 'button-primary',
	Secondary = 'button.secondary',
}

expectTypeOf<KebabCaseString<ClassName.Primary>>().toBe<ClassName.Primary>();
expectTypeOf<KebabCaseString<ClassName.Secondary>>().toBe<never>();

// A generic parameter is the only place where the type can check a value
declare function addClass<Name extends string>(name: KebabCaseString<Name>): Name;

const className = addClass('my-class');
expectTypeOf(className).toBe<'my-class'>();

// @ts-expect-error Not kebab case.
addClass('myClass');
// @ts-expect-error A dot is not part of kebab case.
addClass('my.class');

declare function defineClassNames<Name extends string>(names: Array<{name: KebabCaseString<Name>; description: string}>): void;

defineClassNames([{name: 'my-class', description: 'Primary button'}]);

// @ts-expect-error Not kebab case.
defineClassNames([{name: 'myClass', description: 'Primary button'}]);

declare const wide: string;

// @ts-expect-error A wide string cannot be proven to be kebab case.
addClass(wide);

declare const emptyClassName: Tagged<'', 'ClassName'>;

// @ts-expect-error A branded empty string is still empty.
addClass(emptyClassName);
