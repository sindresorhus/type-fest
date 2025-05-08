import {expectType} from 'tsd';
import type {Asyncify} from '../index.d.ts';

declare function getFooSync(name: string): RegExp;
declare function getFooWithThisArgumentSync(this: Date, name: string): RegExp;

// Basic usage.
declare const getFooAsync1: Asyncify<typeof getFooSync>;
expectType<(name: string) => Promise<RegExp>>(getFooAsync1);

// Noops with async functions.
declare const getFooAsync2: Asyncify<typeof getFooAsync1>;
expectType<typeof getFooAsync1>(getFooAsync2);

// Respects `thisArg`.
declare const getFooWithThisArgumentAsync1: Asyncify<typeof getFooWithThisArgumentSync>;
const callResult = getFooWithThisArgumentAsync1.call(new Date(), 'foo');
expectType<Promise<RegExp>>(callResult);

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-floating-promises
getFooWithThisArgumentAsync1.call('not-date', 'foo');
