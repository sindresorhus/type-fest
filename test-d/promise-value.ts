import {expectType} from 'tsd';
import {PromiseValue} from '..';

type NumberPromise = Promise<number>;
type Otherwise = object;

// Test the normal behaviour.
expectType<PromiseValue<NumberPromise>>(2);

// Test what happens when the `PromiseValue` type is not handed a `Promise` type.
expectType<PromiseValue<number>>(2);

// Test the `Otherwise` generic parameter.
expectType<PromiseValue<number, Otherwise>>({});
