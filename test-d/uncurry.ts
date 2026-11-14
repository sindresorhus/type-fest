import {expectTypeOf} from 'nz';
import type {Curry, Uncurry} from '../index.d.ts';

expectTypeOf<Uncurry<(path: string) => (attempts: number) => boolean>>().toBe<(path: string, attempts: number) => boolean>();
expectTypeOf<Uncurry<(a: string) => (b: number, c: boolean) => (d: Date) => string>>().toBe<(a: string, b: number, c: boolean, d: Date) => string>();
expectTypeOf<Uncurry<(a: 1) => (b: 2) => (c: 3) => (d: 4) => (fifth: 5) => 6>>().toBe<(a: 1, b: 2, c: 3, d: 4, fifth: 5) => 6>();
expectTypeOf<Uncurry<(a: 1) => (b: 2) => (c: 3) => (d: 4) => (fifth: 5) => (sixth: 6) => 7>>().toBe<(a: 1, b: 2, c: 3, d: 4, fifth: 5, sixth: 6) => 7>();

// A function that is not a chain is kept as it is.
expectTypeOf<Uncurry<(value: string) => boolean>>().toBe<(value: string) => boolean>();
expectTypeOf<Uncurry<() => string>>().toBe<() => string>();
expectTypeOf<Uncurry<(value: never) => unknown>>().toBe<(value: never) => unknown>();
expectTypeOf<Uncurry<(value: string | number) => boolean>>().toBe<(value: string | number) => boolean>();

// A zero-parameter stage contributes no parameters.
expectTypeOf<Uncurry<() => (b: number) => boolean>>().toBe<(b: number) => boolean>();
expectTypeOf<Uncurry<(a: string) => () => boolean>>().toBe<(a: string) => boolean>();
expectTypeOf<Uncurry<(a: string) => () => (b: number) => boolean>>().toBe<(a: string, b: number) => boolean>();
expectTypeOf<Uncurry<(a: string) => (b: number) => (c: string) => () => boolean>>().toBe<(a: string, b: number, c: string) => boolean>();
expectTypeOf<Uncurry<() => () => string>>().toBe<() => string>();

// Parameter types are kept as they are.
expectTypeOf<Uncurry<(value: undefined) => (other: null) => void>>().toBe<(value: undefined, other: null) => void>();
expectTypeOf<Uncurry<(value: readonly string[]) => (other: [string, number]) => void>>().toBe<(value: readonly string[], other: [string, number]) => void>();
expectTypeOf<Uncurry<(callback: (value: string) => void) => (value: string) => void>>().toBe<(callback: (value: string) => void, value: string) => void>();
expectTypeOf<Uncurry<(a: any) => (b: number) => boolean>>().toBe<(a: any, b: number) => boolean>();
expectTypeOf<Uncurry<(a: unknown) => (b: unknown) => unknown>>().toBe<(a: unknown, b: unknown) => unknown>();

// Parameter names are kept.
expectTypeOf<Uncurry<(first: string) => (second: number) => boolean>>().toBe<(first: string, second: number) => boolean>();

// A tuple-typed parameter is one parameter, not a parameter list.
expectTypeOf<Uncurry<(a: [x: string, y: number]) => (b: {z: boolean}) => void>>().toBe<(a: [x: string, y: number], b: {z: boolean}) => void>();
expectTypeOf<Uncurry<(a: readonly [x: string]) => (b: readonly [y: number]) => void>>().toBe<(a: readonly [x: string], b: readonly [y: number]) => void>();

// Return types are kept as they are.
expectTypeOf<Uncurry<(value: string) => (other: string) => string | undefined>>().toBe<(value: string, other: string) => string | undefined>();
expectTypeOf<Uncurry<(value: string) => (other: string) => Promise<void>>>().toBe<(value: string, other: string) => Promise<void>>();

// A return type of `any`, `never`, or a non-function ends the chain.
expectTypeOf<Uncurry<(a: string) => any>>().toBe<(a: string) => any>();
expectTypeOf<Uncurry<(a: string) => never>>().toBe<(a: string) => never>();
expectTypeOf<Uncurry<(a: string) => unknown>>().toBe<(a: string) => unknown>();
expectTypeOf<Uncurry<(a: string) => (b: number) => unknown>>().toBe<(a: string, b: number) => unknown>();

// Optional, rest, `void`, readonly, and union-of-tuples parameters are appended as they are.
expectTypeOf<Uncurry<(a: string) => (b?: number) => boolean>>().toBe<(a: string, b?: number) => boolean>();
expectTypeOf<Uncurry<(a: string) => (...rest: number[]) => boolean>>().toBe<(a: string, ...arguments_: number[]) => boolean>();
expectTypeOf<Uncurry<(a: string) => (...rest: [b: number, ...tail: boolean[]]) => void>>().toBe<(a: string, b: number, ...tail: boolean[]) => void>();
expectTypeOf<Uncurry<(a: string) => (b: void) => boolean>>().toBe<(a: string, b?: void) => boolean>();
expectTypeOf<Uncurry<(a: string) => (...arguments_: readonly [b: number]) => void>>().toBe<(a: string, b: number) => void>();
expectTypeOf<Uncurry<(a: string) => (...args: [b: number] | [c: boolean, d: string]) => void>>().toBe<(...arguments_: [a: string, b: number] | [a: string, c: boolean, d: string]) => void>();

// An optional parameter stays optional unless a required parameter follows it in the result.
expectTypeOf<Uncurry<(a?: string) => boolean>>().toBe<(a?: string) => boolean>();
expectTypeOf<Uncurry<(a?: string) => (b?: number) => boolean>>().toBe<(a?: string, b?: number) => boolean>();
expectTypeOf<Uncurry<(a: string) => (b?: number, ...rest: boolean[]) => void>>().toBe<(a: string, b?: number, ...rest: boolean[]) => void>();
expectTypeOf<Uncurry<(a: string) => (b: void, ...rest: boolean[]) => void>>().toBe<(a: string, b?: void, ...rest: boolean[]) => void>();
expectTypeOf<Uncurry<(a?: string) => (...rest: number[]) => void>>().toBe<(a?: string, ...arguments_: number[]) => void>();
expectTypeOf<Uncurry<(a: void) => boolean>>().toBe<(a?: void) => boolean>();

// An optional parameter followed by a required one becomes a required parameter that accepts `undefined`.
expectTypeOf<Uncurry<(a?: string) => (b: number) => boolean>>().toBe<(a: string | undefined, b: number) => boolean>();
expectTypeOf<Uncurry<(a?: string) => (b: number, ...rest: boolean[]) => void>>().toBe<(a: string | undefined, b: number, ...rest: boolean[]) => void>();
expectTypeOf<Uncurry<(a: string) => (b: void) => (c: number) => boolean>>().toBe<(a: string, b: void | undefined, c: number) => boolean>();

// A rest parameter is kept in place when another stage follows it.
expectTypeOf<Uncurry<(a: string) => (...rest: number[]) => (c: boolean) => string>>().toBe<(...arguments_: [a: string, ...rest: number[], c: boolean]) => string>();

// Rest parameters of consecutive stages merge into one rest parameter.
expectTypeOf<Uncurry<(a: string) => (...x: number[]) => (...y: boolean[]) => void>>().toBe<(a: string, ...arguments_: Array<number | boolean>) => void>();

// Best-effort: Multiple rest parameters can absorb required parameters between them.
type MultipleRestParameters = Uncurry<(...names: string[]) => (count: number) => (...flags: boolean[]) => Date>;
expectTypeOf<MultipleRestParameters>().toBe<(...arguments_: Array<string | number | boolean>) => Date>();
declare const multipleRestParameters: MultipleRestParameters;
expectTypeOf(multipleRestParameters()).toBe<Date>();

// Best-effort: An optional parameter after a rest parameter merges into it and loses its position.
type RestThenOptional = Uncurry<(...names: string[]) => (count?: number) => Date>;
expectTypeOf<RestThenOptional>().toBe<(...arguments_: Array<string | number | undefined>) => Date>();
declare const restThenOptional: RestThenOptional;
expectTypeOf(restThenOptional(1, 'name', 2)).toBe<Date>();

// A union-of-tuples rest parameter distributes through the following stages.
expectTypeOf<Uncurry<(a: string) => (...args: [b: 1] | [c: 2]) => (d: 3) => void>>().toBe<(...arguments_: [a: string, b: 1, d: 3] | [a: string, c: 2, d: 3]) => void>();

// A returned union of functions flattens each member.
expectTypeOf<Uncurry<(a: string) => ((b: number) => boolean) | ((c: number) => string)>>().toBe<((a: string, b: number) => boolean) | ((a: string, c: number) => string)>();
expectTypeOf<Uncurry<(a: 1) => ((b: 2) => 3) | ((c: 2) => 4) | ((d: 2) => 5)>>().toBe<((a: 1, b: 2) => 3) | ((a: 1, c: 2) => 4) | ((a: 1, d: 2) => 5)>();

// Members of different chain depths are each flattened.
expectTypeOf<Uncurry<((a: string) => (b: number) => boolean) | ((c: 1) => (d: 2) => (element: 3) => void)>>().toBe<((a: string, b: number) => boolean) | ((c: 1, d: 2, element: 3) => void)>();

// A returned union that includes other types is kept as it is, so the shape of each call is still known.
expectTypeOf<Uncurry<(a: string) => string | ((b: number) => void)>>().toBe<(a: string) => string | ((b: number) => void)>();

// Each overload of the input is uncurried, keeping the supported ones in order.
expectTypeOf<Uncurry<{(a: string): (b: number) => boolean; (a: number): (c: string) => boolean}>>().toBe<((a: string, b: number) => boolean) & ((a: number, c: string) => boolean)>();
expectTypeOf<Uncurry<{(): (a: string) => number; (a: number, b: number): (c: string) => string}>>().toBe<((a: string) => number) & ((a: number, b: number, c: string) => string)>();
expectTypeOf<Uncurry<{(a: 1): (b: 2) => 3; (a: 4): (b: 2) => 3; (a: 5): (b: 6) => 7}>>().toBe<((a: 1, b: 2) => 3) & ((a: 4, b: 2) => 3) & ((a: 5, b: 6) => 7)>();

// Each overload of a returned function is uncurried with the parameters of its stage.
expectTypeOf<Uncurry<(a: string) => {(b: number): boolean; (b: string): void}>>().toBe<((a: string, b: number) => boolean) & ((a: string, b: string) => void)>();

// Generic relationships are not preserved.
expectTypeOf<Uncurry<<T>(a: T) => (b: T) => T>>().toBe<(a: unknown, b: unknown) => unknown>();
expectTypeOf<Uncurry<(a: string) => <T>(b: T) => T[]>>().toBe<(a: string, b: unknown) => unknown[]>();
expectTypeOf<Uncurry<{<T>(a: T): (b: T) => T; (a: number): (c: string) => number}>>().toBe<((a: unknown, b: unknown) => unknown) & ((a: number, c: string) => number)>();

// A generic input that is not a chain loses its type parameter.
expectTypeOf<Uncurry<<T>(a: T) => boolean>>().toBe<(a: unknown) => boolean>();

// Type predicates are not preserved.
expectTypeOf<Uncurry<(value: unknown) => value is string>>().toBe<(value: unknown) => boolean>();
expectTypeOf<Uncurry<(value: unknown) => (candidate: unknown) => candidate is string>>().toBe<(value: unknown, candidate: unknown) => boolean>();

// Assertion signatures become `void`.
expectTypeOf<Uncurry<(value: string) => asserts value is string>>().toBe<(value: string) => void>();
expectTypeOf<Uncurry<(value: unknown) => (candidate: unknown) => asserts candidate is string>>().toBe<(value: unknown, candidate: unknown) => void>();

// Receiver types are not preserved.
expectTypeOf<Uncurry<(this: Date, a: string) => (b: number) => boolean>>().toBe<(a: string, b: number) => boolean>();
expectTypeOf<Uncurry<(a: string) => (this: Date, b: number) => boolean>>().toBe<(a: string, b: number) => boolean>();

// Function properties are not preserved.
expectTypeOf<Uncurry<{(a: string): (b: number) => boolean; extra: true}>>().toBe<(a: string, b: number) => boolean>();
expectTypeOf<Uncurry<((a: string) => (b: number) => boolean) & {extra: true}>>().toBe<(a: string, b: number) => boolean>();

// Unions of functions distribute.
expectTypeOf<Uncurry<((a: string) => (b: number) => boolean) | ((c: number) => string)>>().toBe<((a: string, b: number) => boolean) | ((c: number) => string)>();
expectTypeOf<Uncurry<((a: string) => (b: number) => boolean) | ((c: string) => (d: number) => void)>>().toBe<((a: string, b: number) => boolean) | ((c: string, d: number) => void)>();

// The return type is only flattened when it is a function.
expectTypeOf<Uncurry<(a: string) => Promise<(b: number) => boolean>>>().toBe<(a: string) => Promise<(b: number) => boolean>>();
expectTypeOf<Uncurry<(a: string) => (b: number) => Promise<string>>>().toBe<(a: string, b: number) => Promise<string>>();
expectTypeOf<Uncurry<(a: string) => new (b: number) => Date>>().toBe<(a: string) => new (b: number) => Date>();
expectTypeOf<Uncurry<(a: string) => Function>>().toBe<(a: string) => Function>();
expectTypeOf<Uncurry<(a: string) => (...arguments_: any[]) => unknown>>().toBe<(a: string, ...arguments_: any[]) => unknown>();

// A function-valued result is flattened too, so this type is only for chains of sequential arguments.
expectTypeOf<Uncurry<(config: {theme: string}) => (width: number, height: number) => {id: number}>>().toBe<(config: {theme: string}, width: number, height: number) => {id: number}>();

// Inverse of `Curry`.
expectTypeOf<Uncurry<Curry<(path: string, retries: number) => boolean>>>().toBe<(path: string, retries: number) => boolean>();
expectTypeOf<Uncurry<Curry<(first: string, second: number, third: boolean) => Date>>>().toBe<(first: string, second: number, third: boolean) => Date>();
expectTypeOf<Uncurry<Curry<() => string>>>().toBe<() => string>();

// Uncurrying an uncurried chain is a no-op.
type CurriedChain = (path: string) => (retries: number) => boolean;
expectTypeOf<Uncurry<Uncurry<CurriedChain>>>().toBe<(path: string, retries: number) => boolean>();

expectTypeOf<Uncurry<any>>().toBe<any>();
expectTypeOf<Uncurry<never>>().toBe<never>();

// Calls.
declare const request: Uncurry<(path: string) => (retries: number) => boolean>;
expectTypeOf(request('/users', 3)).toBe<boolean>();
// @ts-expect-error The curried form is not callable. The uncurried function requires two arguments.
request('/users')(3);
// @ts-expect-error The function requires two arguments.
request('/users');
// @ts-expect-error The second argument requires a number.
request('/users', 'three');
// @ts-expect-error The function accepts two arguments.
request('/users', 3, true);

declare const zeroParameters: Uncurry<() => (b: number) => boolean>;
expectTypeOf(zeroParameters(1)).toBe<boolean>();

declare const optional: Uncurry<(a: string) => (b?: number) => boolean>;
expectTypeOf(optional('a')).toBe<boolean>();
expectTypeOf(optional('a', 2)).toBe<boolean>();

declare const rest: Uncurry<(a: string) => (...rest: number[]) => boolean>;
expectTypeOf(rest('a')).toBe<boolean>();
expectTypeOf(rest('a', 1, 2)).toBe<boolean>();

declare const optionalTail: Uncurry<(a?: string) => (b?: number) => boolean>;
expectTypeOf(optionalTail('a', 2)).toBe<boolean>();
expectTypeOf(optionalTail('a')).toBe<boolean>();
expectTypeOf(optionalTail(undefined, 2)).toBe<boolean>();
expectTypeOf(optionalTail(undefined)).toBe<boolean>();

// A required parameter after an optional one must be given, as `undefined`.
declare const midOptional: Uncurry<(a?: string) => (b: number) => boolean>;
expectTypeOf(midOptional('a', 1)).toBe<boolean>();
expectTypeOf(midOptional(undefined, 1)).toBe<boolean>();
// @ts-expect-error The second argument is required.
midOptional('a');
// @ts-expect-error The second argument is required.
midOptional();

declare const midVoid: Uncurry<(a: string) => (b: void) => (c: number) => boolean>;
expectTypeOf(midVoid('a', undefined, 1)).toBe<boolean>();
// @ts-expect-error The third argument is required.
midVoid('a', undefined);

declare const overloads: Uncurry<{(a: string): (b: number) => boolean; (a: number): (c: string) => boolean}>;
expectTypeOf(overloads('a', 1)).toBe<boolean>();
expectTypeOf(overloads(1, 'c')).toBe<boolean>();
// @ts-expect-error No overload accepts these arguments.
overloads(true, 1);

declare const noArguments: Uncurry<() => string>;
expectTypeOf(noArguments()).toBe<string>();
// @ts-expect-error The function accepts no arguments.
noArguments('value');

// @ts-expect-error A callable function is required.
type UnknownFunction = Uncurry<unknown>;
// @ts-expect-error A callable function is required.
type NotCallable = Uncurry<Date>;

// A self-referential chain has no finite result.
type Chain = (a: string) => Chain;
// @ts-expect-error A self-referential chain has no finite result.
type SelfReferential = Uncurry<Chain>;
