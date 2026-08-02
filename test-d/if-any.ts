import {expectType} from 'tsd';
import type {IfAny} from '../index.d.ts';

declare const _any: any;

// `IfAny` should return `true`/`false` if only `T` is specified
expectType<IfAny<any>>(true);
expectType<IfAny<string>>(false);
expectType<IfAny<any, 'T', 'F'>>('T');
expectType<IfAny<string, 'T', 'F'>>('F');

// Missing generic parameter
// @ts-expect-error
type A = IfAny;
