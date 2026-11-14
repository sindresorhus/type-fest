import {expectTypeOf} from 'nz';
import type {Curry} from '../index.d.ts';

expectTypeOf<Curry<(path: string, retries: number) => Promise<string>>>().toBe<(argument: string) => (argument: number) => Promise<string>>();
expectTypeOf<Curry<(first: string, second: number, third: boolean) => Date>>().toBe<(argument: string) => (argument: number) => (argument: boolean) => Date>();
expectTypeOf<Curry<(value: string) => boolean>>().toBe<(argument: string) => boolean>();
expectTypeOf<Curry<() => string>>().toBe<() => string>();
expectTypeOf<Curry<() => never>>().toBe<() => never>();
expectTypeOf<Curry<(value: string) => never>>().toBe<(argument: string) => never>();
expectTypeOf<Curry<(value: never) => unknown>>().toBe<(argument: never) => unknown>();
expectTypeOf<Curry<(first: any, second: unknown) => any>>().toBe<(argument: any) => (argument: unknown) => any>();
expectTypeOf<Curry<(first: string, second: number) => () => boolean>>().toBe<(argument: string) => (argument: number) => () => boolean>();
expectTypeOf<Curry<(value?: string) => boolean>>().toBe<never>();
expectTypeOf<Curry<(value: string | undefined) => boolean>>().toBe<(argument: string | undefined) => boolean>();
expectTypeOf<Curry<(...values: string[]) => boolean>>().toBe<never>();
expectTypeOf<Curry<(...values: readonly string[]) => boolean>>().toBe<never>();
expectTypeOf<Curry<(first: string, ...rest: number[]) => boolean>>().toBe<never>();
expectTypeOf<Curry<(...arguments_: [text: string, count: number] | [flag: boolean]) => void>>().toBe<never>();
expectTypeOf<Curry<(...arguments_: [text: string, count: number]) => boolean>>().toBe<(argument: string) => (argument: number) => boolean>();
expectTypeOf<Curry<(value: string | number) => boolean>>().toBe<(argument: string | number) => boolean>();
expectTypeOf<Curry<((value: string) => number) | ((value: number) => string)>>().toBe<((argument: string) => number) | ((argument: number) => string)>();

// Each overload is curried, keeping the supported ones in order.
expectTypeOf<Curry<{(value: string): number; (value: number, count: number): string}>>().toBe<((value: string) => number) & ((value: number) => (count: number) => string)>();
expectTypeOf<Curry<{(value: string, count?: number): number; (value: number, count: number): string}>>().toBe<(value: number) => (count: number) => string>();
expectTypeOf<Curry<{(value: string, count?: number): number; (...values: number[]): string}>>().toBe<never>();
expectTypeOf<Curry<{(): number; (value: string): string}>>().toBe<(() => number) & ((value: string) => string)>();
expectTypeOf<Curry<{<T>(value: T): T; (value: number, count: number): string}>>().toBe<((value: unknown) => unknown) & ((value: number) => (count: number) => string)>();
expectTypeOf<Curry<{(...values: number[]): string; (value: string): number}>>().toBe<(value: string) => number>();
expectTypeOf<Curry<{(value?: string): 1; (value: string, count: number): 2; (...values: number[]): 3}>>().toBe<(value: string) => (count: number) => 2>();

// Calls use the first overload that accepts the argument, so a later overload with the same first parameter is unreachable.
declare const sharedFirstParameter: Curry<{(value: string): number; (value: string, count: number): string}>;
expectTypeOf(sharedFirstParameter('a')).toBe<number>();

declare const overloaded: Curry<{(value: string): number; (value: number, count: number): string}>;
expectTypeOf(overloaded('a')).toBe<number>();
expectTypeOf(overloaded(1)(2)).toBe<string>();
// @ts-expect-error No overload accepts a boolean.
overloaded(true);

expectTypeOf<Curry<any>>().toBe<any>();
expectTypeOf<Curry<never>>().toBe<never>();

declare const request: Curry<(path: string, retries: number) => boolean>;
expectTypeOf(request('/users')(3)).toBe<boolean>();
// @ts-expect-error Each stage accepts only one argument.
request('/users', 3);
// @ts-expect-error The second stage requires a number.
request('/users')('three');
// @ts-expect-error A callable function is required.
type UnknownFunction = Curry<unknown>;

// Longer parameter lists.
expectTypeOf<Curry<(first: 1, second: 2, third: 3, fourth: 4) => 5>>().toBe<(first: 1) => (second: 2) => (third: 3) => (fourth: 4) => 5>();
expectTypeOf<Curry<(a: string, b: string) => string>>().toBe<(a: string) => (b: string) => string>();

// Parameter types are kept as they are.
expectTypeOf<Curry<(value: undefined) => void>>().toBe<(value: undefined) => void>();
expectTypeOf<Curry<(value: null, other: string[]) => void>>().toBe<(value: null) => (other: string[]) => void>();
expectTypeOf<Curry<(value: readonly string[]) => void>>().toBe<(value: readonly string[]) => void>();
expectTypeOf<Curry<(callback: (value: string) => void, value: string) => void>>().toBe<(callback: (value: string) => void) => (value: string) => void>();
expectTypeOf<Curry<(value: [string, number]) => void>>().toBe<(value: [string, number]) => void>();

// Return types are kept as they are.
expectTypeOf<Curry<(value: string) => void>>().toBe<(value: string) => void>();
expectTypeOf<Curry<(value: string) => string | undefined>>().toBe<(value: string) => string | undefined>();
expectTypeOf<Curry<(value: string) => Promise<void>>>().toBe<(value: string) => Promise<void>>();
expectTypeOf<Curry<(first: string, second: number) => (third: boolean) => Date>>().toBe<(first: string) => (second: number) => (third: boolean) => Date>();
expectTypeOf<Curry<() => () => string>>().toBe<() => () => string>();

// Readonly parameter tuples are expanded by TypeScript.
expectTypeOf<Curry<(...arguments_: readonly [string, number]) => void>>().toBe<(argument: string) => (argument: number) => void>();

// Receiver types, type predicates, generic relationships, and function properties are not preserved.
expectTypeOf<Curry<(this: Date, value: string) => number>>().toBe<(value: string) => number>();
expectTypeOf<Curry<(value: unknown) => value is string>>().toBe<(value: unknown) => boolean>();
expectTypeOf<Curry<<T>(first: T, second: T) => T>>().toBe<(first: unknown) => (second: unknown) => unknown>();
expectTypeOf<Curry<{(value: string): number; extra: true}>>().toBe<(value: string) => number>();

// Unsupported parameter lists.
expectTypeOf<Curry<(first: string, second?: number) => boolean>>().toBe<never>();
expectTypeOf<Curry<(first: string, second: number | undefined, third?: boolean) => boolean>>().toBe<never>();
expectTypeOf<Curry<(value: void) => string>>().toBe<never>();
expectTypeOf<Curry<(...arguments_: [string, number?]) => void>>().toBe<never>();
expectTypeOf<Curry<(...arguments_: [string, ...number[], boolean]) => void>>().toBe<never>();
expectTypeOf<Curry<(...arguments_: never) => string>>().toBe<never>();
expectTypeOf<Curry<(...arguments_: any[]) => string>>().toBe<never>();

// Unions of functions, where invalid members are dropped.
expectTypeOf<Curry<((value: string) => number) | ((value?: string) => number)>>().toBe<(value: string) => number>();
expectTypeOf<Curry<(() => 1) | ((value: string) => 2)>>().toBe<(() => 1) | ((value: string) => 2)>();

// Calls.
const step = request('/users');
expectTypeOf(step).toBe<(retries: number) => boolean>();
expectTypeOf(step(3)).toBe<boolean>();

declare const noArguments: Curry<() => string>;
expectTypeOf(noArguments()).toBe<string>();
// @ts-expect-error The function accepts no arguments.
noArguments('value');

declare const nested: Curry<(first: string, second: number, third: boolean) => Date>;
expectTypeOf(nested('a')(1)(true)).toBe<Date>();
// @ts-expect-error Each stage requires an argument.
nested('a')();
// @ts-expect-error The third stage requires a boolean.
nested('a')(1)('true');
// @ts-expect-error Constructors are not functions.
type Constructor = Curry<new (value: string) => Date>;
