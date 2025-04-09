import {expectNever, expectType} from 'tsd';
import type {NonEmptyString} from '../index';

declare const a: NonEmptyString<'a'>;
expectType<'a'>(a);

declare const b: NonEmptyString<'b' | 'c'>;
expectType<'b' | 'c'>(b);

expectType<'a'>({} as NonEmptyString<'' | 'a'>);
expectType<string>({} as NonEmptyString<string>);
expectType<Uppercase<string>>({} as NonEmptyString<Uppercase<string>>);
expectType<`on${string}`>({} as NonEmptyString<`on${string}`>);

// Tests that string types from mapped types work correctly
type StringMap = {[K in 'a' | 'b']: string};
type StringMapValues = StringMap[keyof StringMap];
expectType<string>({} as NonEmptyString<StringMapValues>);

// Tests handling of conditional types that resolve to empty string or string
type MaybeEmpty<T> = T extends number ? '' : string;
expectType<never>({} as NonEmptyString<MaybeEmpty<number>>);
expectType<string>({} as NonEmptyString<MaybeEmpty<boolean>>);

// Tests distribution over unions in conditional types
type UnionResult<T> = T extends string ? T | '' : never;
expectType<string>({} as NonEmptyString<UnionResult<string>>);

declare const empty: NonEmptyString<''>;
expectNever(empty);
