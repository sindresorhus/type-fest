import {expectAssignable} from 'tsd';
import {PromiseValue} from '..';

type NumberPromise = Promise<number>;
type Otherwise = object;

// Test the normal behaviour.
expectAssignable<PromiseValue<NumberPromise>>(2);

// Test what happens when the `PromiseValue` type is not handed a `Promise` type.
expectAssignable<PromiseValue<number>>(2);

// Test the `Otherwise` generic parameter.
expectAssignable<PromiseValue<number, Otherwise>>({});
