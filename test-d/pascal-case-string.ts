import {expectTypeOf} from 'nz';
import type {PascalCaseString, Tagged} from '../index.d.ts';

// A valid value is kept as is
expectTypeOf<PascalCaseString<'FooBar'>>().toBe<'FooBar'>();
expectTypeOf<PascalCaseString<'Foo'>>().toBe<'Foo'>();
expectTypeOf<PascalCaseString<'A'>>().toBe<'A'>();
expectTypeOf<PascalCaseString<'XmlHttp'>>().toBe<'XmlHttp'>();
expectTypeOf<PascalCaseString<'Foo2Bar'>>().toBe<'Foo2Bar'>();
expectTypeOf<PascalCaseString<'FooBARBaz', {preserveConsecutiveUppercase: true}>>().toBe<'FooBARBaz'>();
expectTypeOf<PascalCaseString<'FööBär'>>().toBe<'FööBär'>();

// A string with no letters has no case, so every casing accepts it
expectTypeOf<PascalCaseString<'123'>>().toBe<'123'>();

// Anything the transformer would change is rejected
expectTypeOf<PascalCaseString<'fooBar'>>().toBe<never>();
expectTypeOf<PascalCaseString<'foo'>>().toBe<never>();
expectTypeOf<PascalCaseString<'FOO'>>().toBe<never>();
expectTypeOf<PascalCaseString<'XMLHttp'>>().toBe<never>();
expectTypeOf<PascalCaseString<'Foo-bar'>>().toBe<never>();
expectTypeOf<PascalCaseString<'Foo_Bar'>>().toBe<never>();
expectTypeOf<PascalCaseString<'Foo bar'>>().toBe<never>();

// An empty string is rejected, even though the transformer keeps it
expectTypeOf<PascalCaseString<''>>().toBe<never>();

// Punctuation is not part of any case, even when the transformer keeps it
expectTypeOf<PascalCaseString<'Foo.Bar'>>().toBe<never>();
expectTypeOf<PascalCaseString<'Foo+Bar'>>().toBe<never>();

// A leading underscore is only part of the case when the transformer is told to keep it, and the first letter is never capitalized then
expectTypeOf<PascalCaseString<'_fooBar'>>().toBe<never>();
expectTypeOf<PascalCaseString<'_fooBar', {preserveLeadingUnderscores: true}>>().toBe<'_fooBar'>();
expectTypeOf<PascalCaseString<'_FooBar', {preserveLeadingUnderscores: true}>>().toBe<never>();

// A union is kept only when every member is valid
expectTypeOf<PascalCaseString<'FooBar' | 'BazQux'>>().toBe<'FooBar' | 'BazQux'>();
expectTypeOf<PascalCaseString<'FooBar' | 'Baz-qux'>>().toBe<never>();
expectTypeOf<PascalCaseString<'FooBar' | ''>>().toBe<never>();

// A type that is not a single literal is rejected
expectTypeOf<PascalCaseString<string>>().toBe<never>();
expectTypeOf<PascalCaseString<Capitalize<string>>>().toBe<never>();
expectTypeOf<PascalCaseString<any>>().toBe<never>();
expectTypeOf<PascalCaseString<never>>().toBe<never>();

// @ts-expect-error `unknown` is not a string.
type UnknownValue = PascalCaseString<unknown>;

// A valid branded string keeps its brand
expectTypeOf<PascalCaseString<Tagged<'FooBar', 'ComponentName'>>>().toBe<Tagged<'FooBar', 'ComponentName'>>();
expectTypeOf<PascalCaseString<Tagged<'fooBar', 'ComponentName'>>>().toBe<never>();
expectTypeOf<PascalCaseString<Tagged<'', 'ComponentName'>>>().toBe<never>();

// A generic parameter is the only place where the type can check a value
declare function defineComponent<Name extends string>(component: {name: PascalCaseString<Name>}): Name;

const componentName = defineComponent({name: 'SubmitButton'});
expectTypeOf(componentName).toBe<'SubmitButton'>();

// @ts-expect-error Not pascal case.
defineComponent({name: 'submitButton'});

declare const wide: string;

// @ts-expect-error A wide string cannot be proven to be pascal case.
defineComponent({name: wide});
