import {expectTypeOf} from 'nz';
import type {NonEmptyString, Opaque, Tagged} from '../index.d.ts';

expectTypeOf<NonEmptyString<''>>().toBe<never>();

expectTypeOf<NonEmptyString<'a'>>().toBe<'a'>();

expectTypeOf<NonEmptyString<string>>().toBe<never>();
expectTypeOf<NonEmptyString<Uppercase<string>>>().toBe<never>();
expectTypeOf<NonEmptyString<`on${string}`>>().toBe<`on${string}`>();

expectTypeOf<NonEmptyString<'a' | 'b'>>().toBe<'a' | 'b'>();
expectTypeOf<NonEmptyString<'a' | `${number}.${number}`>>().toBe<'a' | `${number}.${number}`>();
expectTypeOf<NonEmptyString<'' | 'a'>>().toBe<never>();
expectTypeOf<NonEmptyString<'a' | Uppercase<string>>>().toBe<never>();
expectTypeOf<NonEmptyString<'' | `on${string}`>>().toBe<never>();

// `NonEmptyString<S>` should be assignable to `string`
type Assignability1<_S extends string> = unknown;
type Test1<S extends string> = Assignability1<NonEmptyString<S>>;

// `string` should NOT be assignable to `NonEmptyString<S>`
type Assignability2<_S extends string, _SS extends NonEmptyString<_S>> = unknown;
// @ts-expect-error
type Test2<S extends string> = Assignability2<S, S>;

// A brand does not prove that its underlying string is non-empty.
expectTypeOf<NonEmptyString<Tagged<'', 'Text'>>>().toBe<never>();
expectTypeOf<NonEmptyString<Tagged<string, 'Text'>>>().toBe<never>();
expectTypeOf<NonEmptyString<Opaque<'', 'Text'>>>().toBe<never>();
expectTypeOf<NonEmptyString<Tagged<Uppercase<string>, 'Text'>>>().toBe<never>();
expectTypeOf<NonEmptyString<Tagged<'foo', 'Text'>>>().toBe<Tagged<'foo', 'Text'>>();
expectTypeOf<NonEmptyString<Tagged<`on${string}`, 'Text'>>>().toBe<Tagged<`on${string}`, 'Text'>>();
expectTypeOf<NonEmptyString<Opaque<'foo', 'Text'>>>().toBe<Opaque<'foo', 'Text'>>();
expectTypeOf<NonEmptyString<Tagged<'' | 'foo', 'Text'>>>().toBe<never>();
expectTypeOf<NonEmptyString<Tagged<'foo' | 'bar', 'Text'>>>().toBe<Tagged<'foo' | 'bar', 'Text'>>();
expectTypeOf<NonEmptyString<Tagged<Tagged<'', 'Text'>, 'Validated'>>>().toBe<never>();
expectTypeOf<NonEmptyString<Tagged<Tagged<'foo', 'Text'>, 'Validated'>>>().toBe<Tagged<Tagged<'foo', 'Text'>, 'Validated'>>();
expectTypeOf<NonEmptyString<any>>().toBe<never>();
expectTypeOf<NonEmptyString<never>>().toBe<never>();
// @ts-expect-error - Only strings can be checked for emptiness.
type UnknownString = NonEmptyString<unknown>;

// String enum identities do not change their runtime contents.
enum StringChoice {
	Empty = '',
	Value = 'value',
}
expectTypeOf<NonEmptyString<StringChoice.Empty>>().toBe<never>();
expectTypeOf<NonEmptyString<StringChoice>>().toBe<never>();
expectTypeOf<NonEmptyString<StringChoice.Value>>().toBe<StringChoice.Value>();
expectTypeOf<NonEmptyString<Tagged<StringChoice.Empty, 'Text'>>>().toBe<never>();
expectTypeOf<NonEmptyString<Tagged<StringChoice.Value, 'Text'>>>().toBe<Tagged<StringChoice.Value, 'Text'>>();
