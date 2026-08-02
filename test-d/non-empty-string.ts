import {expectType} from 'tsd';
import type {NonEmptyString} from '../index.d.ts';

expectType<never>({} as NonEmptyString<''>);

expectType<'a'>({} as NonEmptyString<'a'>);

expectType<never>({} as NonEmptyString<string>);
expectType<never>({} as NonEmptyString<Uppercase<string>>);
expectType<`on${string}`>({} as NonEmptyString<`on${string}`>);

expectType<'a' | 'b'>({} as NonEmptyString<'a' | 'b'>);
expectType<'a' | `${number}.${number}`>({} as NonEmptyString<'a' | `${number}.${number}`>);
expectType<never>({} as NonEmptyString<'' | 'a'>);
expectType<never>({} as NonEmptyString<'a' | Uppercase<string>>);
expectType<never>({} as NonEmptyString<'' | `on${string}`>);

// `NonEmptyString<S>` should be assignable to `string`
type Assignability1<_S extends string> = unknown;
type Test1<S extends string> = Assignability1<NonEmptyString<S>>;

// `string` should NOT be assignable to `NonEmptyString<S>`
type Assignability2<_S extends string, _SS extends NonEmptyString<_S>> = unknown;
// @ts-expect-error
type Test2<S extends string> = Assignability2<S, S>;
