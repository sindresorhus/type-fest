import {expectError, expectType} from 'tsd';
import type {IsEqual} from '../index';

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

declare const anything: any;

// Missing all generic parameters.
expectError<IsEqual>(anything);

// Missing `Y` generic parameter.
expectError<IsEqual<number>>(anything);
