import {expectTypeOf} from 'nz';
import type {Flavor} from '../source/flavor.d.ts';
import type {IsTemplateLiteral} from '../source/is-template-literal.d.ts';
import type {LiteralUnion} from '../source/literal-union.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

// Template literals
expectTypeOf<IsTemplateLiteral<`item-${number}`>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`on${string}`>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`id-${number}-${string}`>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`a${string}b${string}c`>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`${number}`>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`${bigint}`>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Uppercase<`on${string}`>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`${'a' | 'b'}-${number}`>>().toBe<true>(); // Expands to a union of patterns
expectTypeOf<IsTemplateLiteral<`${bigint | number}`>>().toBe<true>(); // The placeholder union stays one infinite pattern

// Plain and collapsed string types
expectTypeOf<IsTemplateLiteral<string>>().toBe<false>();
// `` `${string}` `` collapses to plain `string`, so it is not a pattern.
// eslint-disable-next-line @typescript-eslint/no-unnecessary-template-expression -- The collapsed spelling is the point of the test.
expectTypeOf<IsTemplateLiteral<`${string}`>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<`${number | string}`>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<String>>().toBe<false>();

// String literals
expectTypeOf<IsTemplateLiteral<'foo'>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<''>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Uppercase<'abc'>>>().toBe<false>();

// Templates that TypeScript resolves to finite unions of literals
expectTypeOf<IsTemplateLiteral<`v${1 | 2}`>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<`v${boolean}`>>().toBe<false>();
type Alpha = 'a';
type One = 1;
type Null = null;
// A placeholder with a single value resolves the whole template to one literal.
expectTypeOf<IsTemplateLiteral<`v${Alpha}`>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<`v${One}`>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<`v${Null}`>>().toBe<false>();

// Infinite intrinsic string types
expectTypeOf<IsTemplateLiteral<Uppercase<string>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Lowercase<string>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Capitalize<string>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Uncapitalize<string>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Capitalize<Lowercase<Uppercase<string>>>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`${Uppercase<string>}abc`>>().toBe<true>();

// Non-strings
expectTypeOf<IsTemplateLiteral<number>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<bigint>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<boolean>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<symbol>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<null>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<undefined>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<void>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<PropertyKey>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<{}>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<{foo: 'bar'}>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Record<string, string>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<() => void>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<string[]>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Date>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<RegExp>>().toBe<false>();

// Unions
expectTypeOf<IsTemplateLiteral<`on${string}` | `off${string}`>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<'a' | 'b'>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<'a' | 1>>().toBe<false>(); // Literals and non-strings, no pattern member
expectTypeOf<IsTemplateLiteral<'sm' | 'md' | `${number}px`>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<'a' | `on${string}`>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<string | `a${number}`>>().toBe<false>(); // `string` subsumes the pattern
// eslint-disable-next-line @typescript-eslint/no-unnecessary-template-expression -- The collapsed spelling is the point of the test.
expectTypeOf<IsTemplateLiteral<`${string}` | `${number}`>>().toBe<false>(); // `string` subsumes the pattern
expectTypeOf<IsTemplateLiteral<number | String>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<number | `a${number}`>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<null | 'a' | `${number}`>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<string | number | `${number}`>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<`on${string}` | unknown>>().toBe<false>(); // `unknown` subsumes the pattern
expectTypeOf<IsTemplateLiteral<never | `on${string}`>>().toBe<true>(); // `never` vanishes from the union
expectTypeOf<IsTemplateLiteral<`on${string}` | {}>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<`on${string}` | undefined>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<Uppercase<string> | 'literal'>>().toBe<boolean>();

// Boundary types
expectTypeOf<IsTemplateLiteral<any>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<unknown>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<never>>().toBe<false>();

// Tagged types
expectTypeOf<IsTemplateLiteral<Tagged<'foo', 'Tag'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Tagged<`on${string}`, 'Tag'>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Tagged<string, 'Tag'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Tagged<Uppercase<string>, 'Tag'>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Tagged<'foo' | `on${string}`, 'Tag'>>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<Tagged<`on${string}` | number, 'Tag'>>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<Tagged<Tagged<Uppercase<string>, 'Text'>, 'Validated'>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Tagged<Tagged<string, 'Text'>, 'Validated'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Tagged<string, 'Tag'> | Tagged<number, 'Tag'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Tagged<'foo', 'Tag'> | Tagged<`on${string}`, 'Tag'>>>().toBe<boolean>();

// Opaque types
expectTypeOf<IsTemplateLiteral<Opaque<`on${string}`, 'Tag'>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Opaque<Uppercase<string>, 'Tag'>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Opaque<string, 'Tag'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Opaque<number, 'Tag'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Opaque<'foo' | `on${string}`, 'Tag'>>>().toBe<boolean>();

// Branded types
type Brand = {readonly __brand: unique symbol};

expectTypeOf<IsTemplateLiteral<`a${number}` & Brand>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Uppercase<string> & Brand>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<`a${string}` & {brand: 'x'}>>().toBe<true>(); // A brand with an explicit marker property
expectTypeOf<IsTemplateLiteral<string & Brand>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<number & Brand>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<('foo' | `on${string}`) & Brand>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<(string & Brand) | (number & Brand)>>().toBe<false>();

// Flavors (a single optional marker)
expectTypeOf<IsTemplateLiteral<Flavor<`on${string}`, 'F'>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<Flavor<string, 'F'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Flavor<'foo' | `on${string}`, 'F'>>>().toBe<boolean>();

// Enum members are literal types, so they are not patterns.
enum StringEnum {A = 'a', B = 'b'}
enum NumericEnum {A, B}
expectTypeOf<IsTemplateLiteral<StringEnum>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<StringEnum.A>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<NumericEnum>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<NumericEnum.A>>().toBe<false>();

// Uncollapsed unions
expectTypeOf<IsTemplateLiteral<`on${string}` & {}>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<LiteralUnion<'onClick', `on${string}`>>>().toBe<true>();
expectTypeOf<IsTemplateLiteral<LiteralUnion<'auto', string>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<LiteralUnion<'on' | 'off', `on${string}`>>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<LiteralUnion<'press' | 'onClick', `on${string}`>>>().toBe<boolean>();
expectTypeOf<IsTemplateLiteral<Tagged<LiteralUnion<'auto', string>, 'Theme'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<Tagged<LiteralUnion<'press', `on${string}`>, 'Event'>>>().toBe<boolean>();

// Normalize open string members before classifying unions that also contain objects.
expectTypeOf<IsTemplateLiteral<LiteralUnion<'onClick', `on${string}`> | {handler?: () => void}>>().toBe<boolean>();

// A widened branded member must still absorb unbranded literals before classification.
expectTypeOf<IsTemplateLiteral<'ready' | Tagged<string, 'Text'>>>().toBe<false>();
expectTypeOf<IsTemplateLiteral<'ready' | Tagged<'set', 'Text'>>>().toBe<false>();
// Unwrapping must happen before collapsing, or the literal would not merge into the unwrapped pattern.
expectTypeOf<IsTemplateLiteral<'on1' | Tagged<`on${string}`, 'Tag'>>>().toBe<true>();

// A route handler picks a parameterized signature only for pattern routes.
type RouteHandler<Route extends string> =
	IsTemplateLiteral<Route> extends true
		? (parameters: Record<string, string>) => void
		: () => void;
expectTypeOf<RouteHandler<'/health'>>().toBe<() => void>();
expectTypeOf<RouteHandler<`/users/${string}`>>().toBe<(parameters: Record<string, string>) => void>();

// The flag is computed per element when mapping over a tuple.
declare function templateLiteralFlags<const Values extends readonly unknown[]>(values: Values): {[Key in keyof Values]: IsTemplateLiteral<Values[Key]>};
expectTypeOf(templateLiteralFlags(['onClick' as `on${string}`, 'fixed' as string, {value: 'fixed'}])).toBe<readonly [true, false, false]>();

function _templateLiteralFlag<Value>(flag: IsTemplateLiteral<Value>): boolean {
	return flag;
}
