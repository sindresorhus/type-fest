import {expectTypeOf} from 'nz';
import type {AnyAsyncFunction, AnyFunction, AsyncFunction} from '../index.d.ts';

declare const asyncFunction: AsyncFunction<[value: string], number>;
expectTypeOf(asyncFunction('value')).toBe<Promise<number>>();

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
expectTypeOf<(value: string) => Promise<string>>().not.toBeAssignableTo<AsyncFunction<[value: string], number>>();

declare const defaultAsyncFunction: AsyncFunction;
expectTypeOf(defaultAsyncFunction()).toBe<Promise<unknown>>();

// Defaults accept arbitrary arguments.
expectTypeOf(defaultAsyncFunction('value', 123)).toBe<Promise<unknown>>();

declare const anyAsyncFunction: AsyncFunction<any, any>;
expectTypeOf(anyAsyncFunction()).toBe<Promise<any>>();

expectTypeOf<(value: string) => Promise<number>>().toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<(value: {id: string}) => Promise<string>>().toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<(value: {id: string}) => string>().not.toBeAssignableTo<AnyAsyncFunction>();

// A function with a `never` parameter only matches `AnyFunction`, as documented.
expectTypeOf<(value: never) => Promise<void>>().not.toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<(value: never) => Promise<void>>().toBeAssignableTo<AnyFunction>();
expectTypeOf<(value: never) => void>().toBeAssignableTo<AnyFunction>();

expectTypeOf<() => Promise<string>>().toBeAssignableTo<AnyFunction>();
expectTypeOf<() => string>().toBeAssignableTo<AnyFunction>();

// Erased functions remain callable with an unknown result.
declare const anyFunction: AnyFunction;
expectTypeOf(anyFunction('value', 123)).toBe<unknown>();

declare const erasedAsyncFunction: AnyAsyncFunction;
expectTypeOf(erasedAsyncFunction('value', 123)).toBe<Promise<unknown>>();

// Ordinary required parameters are supported.
expectTypeOf<(value: string) => string>().toBeAssignableTo<AnyFunction>();
