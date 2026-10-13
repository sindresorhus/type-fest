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

// Edge cases for the type arguments.
expectTypeOf<AsyncFunction<any>>().toBe<(...arguments_: any) => Promise<unknown>>();
expectTypeOf<AsyncFunction<never>>().toBe<(...arguments_: never) => Promise<unknown>>();
expectTypeOf<AsyncFunction<[], never>>().toBe<() => Promise<never>>();
expectTypeOf<AsyncFunction<[value: unknown], unknown>>().toBe<(value: unknown) => Promise<unknown>>();
expectTypeOf<AsyncFunction<readonly [value: string], number>>().toBe<(value: string) => Promise<number>>();
expectTypeOf<AsyncFunction<[value: string], string | undefined>>().toBe<(value: string) => Promise<string | undefined>>();

// Every asynchronous function is a function, but not every function is asynchronous.
expectTypeOf<AsyncFunction<[value: string], number>>().toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<AnyAsyncFunction>().toBeAssignableTo<AnyFunction>();
expectTypeOf<AnyFunction>().not.toBeAssignableTo<AnyAsyncFunction>();

// A return value that is only sometimes a promise, or a non-`Promise` thenable, is not asynchronous.
expectTypeOf<() => Promise<string> | string>().not.toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<() => Promise<string> | undefined>().not.toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<() => PromiseLike<string>>().not.toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<() => Promise<string> | Promise<number>>().toBeAssignableTo<AnyAsyncFunction>();

// Generic, overloaded, `this`, optional, and rest parameter signatures are accepted.
expectTypeOf<<Value>(value: Value) => Promise<Value>>().toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<{(value: string): Promise<string>; (value: number): Promise<number>}>().toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<(this: Date, value?: string, ...rest: number[]) => Promise<void>>().toBeAssignableTo<AnyAsyncFunction>();
expectTypeOf<(this: Date, value?: string, ...rest: number[]) => void>().toBeAssignableTo<AnyFunction>();

// Non-functions are not matched. `Function` has no call signature with a known shape.
expectTypeOf<string>().not.toBeAssignableTo<AnyFunction>();
expectTypeOf<{}>().not.toBeAssignableTo<AnyFunction>();
expectTypeOf<Function>().not.toBeAssignableTo<AnyFunction>();
expectTypeOf<new () => object>().not.toBeAssignableTo<AnyFunction>();
