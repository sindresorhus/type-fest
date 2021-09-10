import {expectAssignable} from 'tsd';
import {PromiseValue} from '../index';

type NumberPromise = Promise<number>;
type NestedPromise = Promise<NumberPromise>;

// Test the normal behaviour.
expectAssignable<PromiseValue<NumberPromise>>(2);

// Test the nested behaviour.
expectAssignable<PromiseValue<NestedPromise>>(2);

// Test what happens when the `PromiseValue` type is not handed a `Promise` type.
expectAssignable<PromiseValue<number>>(2);
