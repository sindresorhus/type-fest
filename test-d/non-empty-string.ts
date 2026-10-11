import {expectTypeOf} from 'nz';
import type {NonEmptyString} from '../index.d.ts';

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
