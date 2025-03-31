import {expectNever, expectType} from 'tsd';
import type {NonEmptyString} from '../index';

declare const empty: NonEmptyString<''>;
expectNever(empty);

declare const a: NonEmptyString<'a'>;
expectType<NonEmptyString<'a'>>(a);

declare const b: NonEmptyString<'b' | 'c'>;
expectType<NonEmptyString<'b' | 'c'>>(b);