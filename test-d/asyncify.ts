import {expectTypeOf} from 'nz';
import type {Asyncify} from '../index.d.ts';

declare function getFooSync(name: string): RegExp;
declare function getFooWithThisArgumentSync(this: Date, name: string): RegExp;

// Basic usage.
declare const getFooAsync1: Asyncify<typeof getFooSync>;
expectTypeOf(getFooAsync1).toBe<(name: string) => Promise<RegExp>>();

// Noops with async functions.
declare const getFooAsync2: Asyncify<typeof getFooAsync1>;
expectTypeOf(getFooAsync2).toBe<typeof getFooAsync1>();

// Respects `thisArg`.
declare const getFooWithThisArgumentAsync1: Asyncify<typeof getFooWithThisArgumentSync>;
const callResult = getFooWithThisArgumentAsync1.call(new Date(), 'foo');
expectTypeOf(callResult).toBe<Promise<RegExp>>();

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-floating-promises
getFooWithThisArgumentAsync1.call('not-date', 'foo');
