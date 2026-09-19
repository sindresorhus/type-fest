import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {AnyAsyncFunction, AnyFunction, AsyncFunction} from '../index.d.ts';

declare const asyncFunction: AsyncFunction<[value: string], number>;
expectType<Promise<number>>(asyncFunction('value'));

// `Arguments` is enforced.
// The required `value` argument cannot be omitted.
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-floating-promises
asyncFunction();
// `value` must be a string.
// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-floating-promises
asyncFunction(123);

// `ReturnValue` is enforced.
expectNotAssignable<AsyncFunction<[value: string], number>>(
	async (value: string) => value,
);

declare const defaultAsyncFunction: AsyncFunction;
expectType<Promise<unknown>>(defaultAsyncFunction());

// Defaults accept arbitrary arguments.
expectType<Promise<unknown>>(defaultAsyncFunction('value', 123));

declare const anyAsyncFunction: AsyncFunction<any, any>;
expectType<Promise<any>>(anyAsyncFunction());

expectAssignable<AnyAsyncFunction>(async (value: string) => value.length);
expectNotAssignable<AnyAsyncFunction>(async (value: never) => value);
declare const promiseReturningFunction: (value: {id: string}) => Promise<string>;
declare const synchronousFunction: (value: {id: string}) => string;
expectAssignable<AnyAsyncFunction>(promiseReturningFunction);
expectNotAssignable<AnyAsyncFunction>(synchronousFunction);

expectAssignable<AnyFunction>((value: never) => value);
expectAssignable<AnyFunction>(async () => 'value');
expectAssignable<AnyFunction>(() => 'value');

// Erased functions remain callable with an unknown result.
declare const anyFunction: AnyFunction;
expectType<unknown>(anyFunction('value', 123));

declare const erasedAsyncFunction: AnyAsyncFunction;
expectType<Promise<unknown>>(erasedAsyncFunction('value', 123));

// Ordinary required parameters are supported.
expectAssignable<AnyFunction>((value: string) => value);
