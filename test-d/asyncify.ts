import {expectType, expectError} from 'tsd';
import {Asyncify} from '../index';

declare function getFooSync(name: string): RegExp;
declare function getFooWithThisArgSync(this: Date, name: string): RegExp;

// Basic usage.
declare const getFooAsync1: Asyncify<typeof getFooSync>;
expectType<(name: string) => Promise<RegExp>>(getFooAsync1);

// Noops with async functions.
declare const getFooAsync2: Asyncify<typeof getFooAsync1>;
expectType<typeof getFooAsync1>(getFooAsync2);

// Respects `thisArg`.
declare const getFooWithThisArgAsync1: Asyncify<typeof getFooWithThisArgSync>;
const callResult = getFooWithThisArgAsync1.call(new Date(), 'foo');
expectType<Promise<RegExp>>(callResult);
expectError(getFooWithThisArgAsync1.call('not-date', 'foo'));
