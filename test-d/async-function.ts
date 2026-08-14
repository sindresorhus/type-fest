import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {AnyAsyncFunction, AnyFunction, AsyncFunction} from '../index.d.ts';

declare const asyncFunction: AsyncFunction<[value: string], number>;
expectType<Promise<number>>(asyncFunction('value'));

declare const defaultAsyncFunction: AsyncFunction;
expectType<Promise<unknown>>(defaultAsyncFunction());

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
