import {expectTypeOf} from 'nz';
import type {Asyncify} from '../index.d.ts';

declare function getFooSync(name: string): RegExp;
declare function getFooWithThisArgumentSync(this: Date, name: string): RegExp;

// Basic usage.
declare const getFooAsync1: Asyncify<typeof getFooSync>;
expectTypeOf(getFooAsync1).toBe<(name: string) => Promise<RegExp>>();

// Noops with async functions.
declare const getFooAsync2: Asyncify<typeof getFooAsync1>;
expectTypeOf(getFooAsync2).toBe<typeof getFooAsync1>();

// Respects `thisArg`.
declare const getFooWithThisArgumentAsync1: Asyncify<typeof getFooWithThisArgumentSync>;
const callResult = getFooWithThisArgumentAsync1.call(new Date(), 'foo');
expectTypeOf(callResult).toBe<Promise<RegExp>>();

// @ts-expect-error
// eslint-disable-next-line @typescript-eslint/no-floating-promises
getFooWithThisArgumentAsync1.call('not-date', 'foo');

// Each function keeps the promise of its own return type when the input is a union.
type FunctionUnion = ((name: string) => number) | ((count: number) => string);
expectTypeOf<Asyncify<FunctionUnion>>().toBe<((name: string) => Promise<number>) | ((count: number) => Promise<string>)>();

// Unwrap asynchronous return values independently for each function.
type AsyncFunctionUnion = ((name: string) => Promise<number>) | ((count: number) => PromiseLike<string>);
expectTypeOf<Asyncify<AsyncFunctionUnion>>().toBe<((name: string) => Promise<number>) | ((count: number) => Promise<string>)>();
expectTypeOf<Asyncify<((name: string) => number) | ((count: number) => Promise<string>)>>().toBe<((name: string) => Promise<number>) | ((count: number) => Promise<string>)>();

// Preserve the receiver alongside each member's arguments and return value.
type FunctionUnionWithThis = ((this: Date, name: string) => number) | ((this: RegExp, count: number) => string);
expectTypeOf<Asyncify<FunctionUnionWithThis>>().toBe<((this: Date, name: string) => Promise<number>) | ((this: RegExp, count: number) => Promise<string>)>();
expectTypeOf<Asyncify<((this: Date, name: string) => number) | ((count: number) => string)>>().toBe<((this: Date, name: string) => Promise<number>) | ((count: number) => Promise<string>)>();

// A member that never returns does not borrow another member's return type.
expectTypeOf<Asyncify<(() => never) | ((name: string) => number)>>().toBe<(() => Promise<never>) | ((name: string) => Promise<number>)>();
expectTypeOf<Asyncify<never>>().toBe<never>();

// Optional and rest parameters survive the conversion.
expectTypeOf<Asyncify<((name?: string) => number) | ((...counts: number[]) => string)>>().toBe<((name?: string) => Promise<number>) | ((...counts: number[]) => Promise<string>)>();

// A union in a single function's return value stays inside its promise.
expectTypeOf<Asyncify<() => number | Promise<string>>>().toBe<() => Promise<number | string>>();

// A readonly rest parameter, such as a parameter list typed with `as const`, keeps its parameter positions.
expectTypeOf<Asyncify<(...arguments_: readonly [string, number?]) => boolean>>().toBe<(first: string, second?: number) => Promise<boolean>>();
expectTypeOf<Asyncify<(first: string, ...rest: readonly number[]) => boolean>>().toBe<(first: string, ...rest: number[]) => Promise<boolean>>();
