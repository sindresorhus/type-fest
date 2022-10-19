import {expectTypeOf} from 'expect-type';
import type {Asyncify} from '../index';

declare function getFooSync(name: string): RegExp;
declare function getFooWithThisArgSync(this: Date, name: string): RegExp;

// Basic usage.
declare const getFooAsync1: Asyncify<typeof getFooSync>;
expectTypeOf(getFooAsync1).toEqualTypeOf<(name: string) => Promise<RegExp>>();

// Noops with async functions.
declare const getFooAsync2: Asyncify<typeof getFooAsync1>;
expectTypeOf(getFooAsync2).toEqualTypeOf<typeof getFooAsync1>();

// Respects `thisArg`.
declare const getFooWithThisArgAsync1: Asyncify<typeof getFooWithThisArgSync>;
const callResult = getFooWithThisArgAsync1.call(new Date(), 'foo');
expectTypeOf(callResult).toEqualTypeOf<Promise<RegExp>>();
// @ts-expect-error
void getFooWithThisArgAsync1.call('not-date', 'foo');
