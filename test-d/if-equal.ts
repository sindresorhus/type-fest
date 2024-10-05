import {expectType} from 'tsd';
import type {IfEqual} from '../index';

// `IfEqual` should return `true`/`false` if only `T` is specified
expectType<IfEqual<true, true>>(true);
expectType<IfEqual<string, any>>(false);
expectType<IfEqual<unknown, unknown, 'T', 'F'>>('T');
expectType<IfEqual<1 | undefined, 1, 'T', 'F'>>('F');

// Missing all generic parameters.
// @ts-expect-error
type A = IfEqual;

// Missing `Y` generic parameter.
// @ts-expect-error
type B = IfEqual<number>;
