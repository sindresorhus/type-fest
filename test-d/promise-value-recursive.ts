import {expectAssignable} from 'tsd';
import {PromiseValueRecursive} from '..';

type NumberPromise = Promise<number>;
type NestedPromise = Promise<NumberPromise>;
type Otherwise = object;

// Test the nested behaviour.
expectAssignable<PromiseValueRecursive<NestedPromise>>(2);

// Test the unnested behaviour.
expectAssignable<PromiseValueRecursive<NumberPromise>>(2);

// Test what happens when the `PromiseValue` type is not handed a `Promise` type.
expectAssignable<PromiseValueRecursive<number>>(2);

// Test the `Otherwise` generic parameter.
expectAssignable<PromiseValueRecursive<number, Otherwise>>({});
