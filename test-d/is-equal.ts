import {expectType} from 'tsd';
import type {IsEqual} from '../index.d.ts';

const notEqualNumberAndString: IsEqual<number, string> = false;
expectType<false>(notEqualNumberAndString);

const equalNumbers: IsEqual<1, 1> = true;
expectType<true>(equalNumbers);

const notEqualAnyAndNumber: IsEqual<any, number> = false;
expectType<false>(notEqualAnyAndNumber);

const notEqualUnionAndNumber: IsEqual<1 | 2, 1> = false;
expectType<false>(notEqualUnionAndNumber);

const notEqualAnyAndNever: IsEqual<any, never> = false;
expectType<false>(notEqualAnyAndNever);

const notEqualArrayOfAnyAndArrayOfNever: IsEqual<[any], [never]> = false;
expectType<false>(notEqualArrayOfAnyAndArrayOfNever);

// Missing all generic parameters.
// @ts-expect-error
type A = IsEqual;

// Missing `Y` generic parameter.
// @ts-expect-error
type B = IsEqual<number>;

// Test for issue https://github.com/sindresorhus/type-fest/issues/537
type UnionType = IsEqual<{a: 1} & {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<UnionType>(true);

type IntersectionType = IsEqual<{a: 1} | {a: 1}, {a: 1}>; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<IntersectionType>(true);
