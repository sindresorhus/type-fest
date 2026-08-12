import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {AnyAsyncFunction, AnyFunction, AsyncFunction} from '../index.d.ts';

declare const asyncFunction: AsyncFunction<[value: string], number>;
expectType<Promise<number>>(asyncFunction('value'));

declare const defaultAsyncFunction: AsyncFunction;
expectType<Promise<unknown>>(defaultAsyncFunction());

declare const anyAsyncFunction: AsyncFunction<any, any>;
expectType<Promise<any>>(anyAsyncFunction());

expectAssignable<AnyAsyncFunction>(async () => 'value');
expectNotAssignable<AnyAsyncFunction>(() => 'value');

expectAssignable<AnyFunction>((value: never) => value);
expectAssignable<AnyFunction>(async () => 'value');
expectAssignable<AnyFunction>(() => 'value');
