import {expectTypeOf} from 'nz';
import type {AnyFunction, PartialApply, UnknownArray} from '../index.d.ts';

type Request = (url: string, retries: number, timeout?: number) => Promise<string>;

expectTypeOf<PartialApply<Request, []>>().toBe<(url: string, retries: number, timeout?: number) => Promise<string>>();
expectTypeOf<PartialApply<Request, [string]>>().toBe<(retries: number, timeout?: number) => Promise<string>>();
expectTypeOf<PartialApply<Request, [string, number]>>().toBe<(timeout?: number) => Promise<string>>();
expectTypeOf<PartialApply<Request, [string, number, number]>>().toBe<() => Promise<string>>();
expectTypeOf<PartialApply<Request, readonly [string]>>().toBe<(retries: number, timeout?: number) => Promise<string>>();

// Partial applications compose.
expectTypeOf<PartialApply<PartialApply<Request, [string]>, [number]>>().toBe<(timeout?: number) => Promise<string>>();

// Incompatible arguments.
expectTypeOf<PartialApply<Request, [number]>>().toBe<never>();
expectTypeOf<PartialApply<Request, [string, string]>>().toBe<never>();
expectTypeOf<PartialApply<Request, [string, number, number, number]>>().toBe<never>();
expectTypeOf<PartialApply<() => string, [string]>>().toBe<never>();

// The whole argument type must be accepted, not just one union member.
expectTypeOf<PartialApply<(value: string) => void, [string | number]>>().toBe<never>();
expectTypeOf<PartialApply<(value: string | number) => void, [string]>>().toBe<() => void>();
expectTypeOf<PartialApply<(value: {id: string; name: string}) => void, [{id: string}]>>().toBe<never>();

// `undefined` is accepted by an optional parameter, but not by a required one.
expectTypeOf<PartialApply<Request, [string, number, undefined]>>().toBe<() => Promise<string>>();
expectTypeOf<PartialApply<Request, [string, undefined]>>().toBe<never>();
expectTypeOf<PartialApply<(value: number | undefined, other: string) => void, [undefined]>>().toBe<(other: string) => void>();
expectTypeOf<PartialApply<(value: void) => void, [undefined]>>().toBe<() => void>();
expectTypeOf<PartialApply<(value: void) => void, []>>().toBe<(value?: void) => void>();
expectTypeOf<PartialApply<(...values: number[]) => void, [undefined]>>().toBe<never>();
expectTypeOf<PartialApply<(prefix?: string, ...values: number[]) => void, [string, undefined]>>().toBe<never>();

// Optional parameters.
expectTypeOf<PartialApply<(first?: string, second?: number) => void, [string]>>().toBe<(second?: number) => void>();
expectTypeOf<PartialApply<(first?: string, second?: number) => void, [number]>>().toBe<never>();
expectTypeOf<PartialApply<(first?: string) => void, [string, number]>>().toBe<never>();
expectTypeOf<PartialApply<(first?: string) => void, [unknown]>>().toBe<never>();
expectTypeOf<PartialApply<(first?: string, second?: number, third?: boolean) => void, [string, number]>>().toBe<(third?: boolean) => void>();
expectTypeOf<PartialApply<(first?: string, second?: number, third?: boolean) => void, [undefined, number]>>().toBe<(third?: boolean) => void>();

// Rest parameters keep accepting arguments.
expectTypeOf<PartialApply<(...values: number[]) => number, [1, 2]>>().toBe<(...values: number[]) => number>();
expectTypeOf<PartialApply<(...values: readonly number[]) => number, [1, 2]>>().toBe<(...values: readonly number[]) => number>();
expectTypeOf<PartialApply<(...values: number[]) => number, ['1']>>().toBe<never>();
expectTypeOf<PartialApply<(prefix: string, ...values: number[]) => void, [string]>>().toBe<(...values: number[]) => void>();
expectTypeOf<PartialApply<(prefix: string, ...values: number[]) => void, [string, 1, 2]>>().toBe<(...values: number[]) => void>();
expectTypeOf<PartialApply<(prefix: string, ...values: number[]) => void, [string, string]>>().toBe<never>();
expectTypeOf<PartialApply<(prefix?: string, ...values: number[]) => void, [string, 1]>>().toBe<(...values: number[]) => void>();
expectTypeOf<PartialApply<(prefix?: string, ...values: number[]) => void, [string]>>().toBe<(...values: number[]) => void>();
expectTypeOf<PartialApply<(...values: unknown[]) => void, [string, number]>>().toBe<(...values: unknown[]) => void>();
expectTypeOf<PartialApply<(...values: never[]) => void, [never]>>().toBe<(...values: never[]) => void>();
expectTypeOf<PartialApply<(first: string, second?: number, ...rest: boolean[]) => void, [string, number, true]>>().toBe<(...rest: boolean[]) => void>();
expectTypeOf<PartialApply<(first: string, second?: number, ...rest: boolean[]) => void, [string, boolean]>>().toBe<never>();

// The `console.log` shape, where an optional parameter is followed by a rest parameter of the same type.
expectTypeOf<PartialApply<(message?: any, ...optionalParameters: any[]) => void, ['[prefix]']>>().toBe<(...optionalParameters: any[]) => void>();
expectTypeOf<PartialApply<(message?: unknown, ...optionalParameters: unknown[]) => void, [string, number]>>().toBe<(...optionalParameters: unknown[]) => void>();
expectTypeOf<PartialApply<(...values: any[]) => void, [string, number]>>().toBe<(...values: any[]) => void>();
expectTypeOf<PartialApply<(...values: any) => void, [string]>>().toBe<(...values: any[]) => void>();

// Elements after a rest element only accept arguments before the rest element.
expectTypeOf<PartialApply<(first: string, ...rest: [...number[], boolean]) => void, [string]>>().toBe<(...rest: [...number[], boolean]) => void>();
expectTypeOf<PartialApply<(first: string, ...rest: [...number[], boolean]) => void, [string, number]>>().toBe<never>();
expectTypeOf<PartialApply<(...values: [...string[], number]) => void, []>>().toBe<(...values: [...string[], number]) => void>();
expectTypeOf<PartialApply<(...values: [...string[], number]) => void, [string]>>().toBe<never>();
expectTypeOf<PartialApply<(first: string, second: string, ...rest: [...number[], boolean]) => void, [string]>>().toBe<(...rest: [string, ...number[], boolean]) => void>();
expectTypeOf<PartialApply<(first: string, second: string, ...rest: [...number[], boolean]) => void, [string, string]>>().toBe<(...arguments_: [...number[], boolean]) => void>();

// Arguments must be a fixed tuple without optional or rest elements.
expectTypeOf<PartialApply<(...values: string[]) => void, string[]>>().toBe<never>();
expectTypeOf<PartialApply<(first: string, second: string) => void, string[]>>().toBe<never>();
expectTypeOf<PartialApply<(...values: string[]) => void, [string, ...string[]]>>().toBe<never>();
expectTypeOf<PartialApply<(value?: string) => void, [string?]>>().toBe<never>();

// A rest parameter with optional elements in its tuple type.
expectTypeOf<PartialApply<(...arguments_: [string, number?]) => void, [string]>>().toBe<(value?: number) => void>();
expectTypeOf<PartialApply<(...arguments_: [string, number?]) => void, [string, number, boolean]>>().toBe<never>();

// Unions of parameter tuples keep only the members that accept the arguments.
type Format = (...arguments_: [text: string, width: number] | [text: string] | [flag: boolean]) => string;
expectTypeOf<PartialApply<Format, [string]>>().toBe<(...arguments_: [width: number] | []) => string>();
expectTypeOf<PartialApply<Format, [boolean]>>().toBe<() => string>();
expectTypeOf<PartialApply<Format, [number]>>().toBe<never>();
expectTypeOf<PartialApply<(...arguments_: [first?: string] | [first: string, second: number]) => void, [string]>>().toBe<(...arguments_: [] | [second: number]) => void>();

// Unions of functions and unions of argument tuples.
expectTypeOf<PartialApply<((value: string) => 1) | ((value: number) => 2), [string]>>().toBe<() => 1>();
expectTypeOf<PartialApply<((value: string, count: number) => 1) | ((value: string) => 2), [string]>>().toBe<((count: number) => 1) | (() => 2)>();
expectTypeOf<PartialApply<(value: string, count: number) => void, [string] | [string, number]>>().toBe<((count: number) => void) | (() => void)>();
expectTypeOf<PartialApply<(value: string, count: number) => void, [string] | [number]>>().toBe<(count: number) => void>();
expectTypeOf<PartialApply<(value: string, count: number) => void, [number] | [boolean]>>().toBe<never>();
expectTypeOf<PartialApply<(...values: string[]) => void, [string] | [string, string]>>().toBe<(...values: string[]) => void>();
expectTypeOf<PartialApply<((value: string) => 1) | ((value: number) => 2), [string] | [number]>>().toBe<(() => 1) | (() => 2)>();

// Parameter and return types are kept as they are.
expectTypeOf<PartialApply<(value: string) => never, [string]>>().toBe<() => never>();
expectTypeOf<PartialApply<(value: never) => string, [never]>>().toBe<() => string>();
// `never` arguments pass the parameter check.
expectTypeOf<PartialApply<(value: string) => void, [never]>>().toBe<() => void>();
expectTypeOf<PartialApply<(value: string, next: string) => void, [string, never]>>().toBe<() => void>();
expectTypeOf<PartialApply<(value: string, next: never) => string, [string]>>().toBe<(next: never) => string>();
expectTypeOf<PartialApply<(value: any, next: unknown) => any, [Date]>>().toBe<(next: unknown) => any>();
expectTypeOf<PartialApply<(value: unknown, next: unknown) => void, [symbol]>>().toBe<(next: unknown) => void>();
expectTypeOf<PartialApply<(value: string, count: number) => void, [any, any]>>().toBe<() => void>();
// The generic return type is not inferred from the arguments.
expectTypeOf<PartialApply<<T>(value: T[], index: number) => T, [string[]]>>().toBe<(index: number) => unknown>();
expectTypeOf<PartialApply<(...arguments_: readonly [text: string, count: number]) => void, [string]>>().toBe<(count: number) => void>();

// Receiver types, type predicates, generic relationships, and function properties are not preserved.
expectTypeOf<PartialApply<(this: Date, value: string, count: number) => void, [string]>>().toBe<(count: number) => void>();
expectTypeOf<PartialApply<(value: unknown) => value is string, [unknown]>>().toBe<() => boolean>();
expectTypeOf<PartialApply<<T>(first: T, second: T) => T, [string]>>().toBe<(second: unknown) => unknown>();
expectTypeOf<PartialApply<{(value: string, count: number): void; extra: true}, [string]>>().toBe<(count: number) => void>();

// Each overload is applied, keeping the ones that accept the arguments in order.
type Overloaded = {
	(value: number): number;
	(value: string, count: number): string;
	(value: string): boolean;
};
expectTypeOf<PartialApply<Overloaded, [number]>>().toBe<() => number>();
expectTypeOf<PartialApply<Overloaded, [string]>>().toBe<((count: number) => string) & (() => boolean)>();
expectTypeOf<PartialApply<Overloaded, [string, number]>>().toBe<() => string>();
expectTypeOf<PartialApply<Overloaded, [Date]>>().toBe<never>();
expectTypeOf<PartialApply<Overloaded, [number] | [string, number]>>().toBe<(() => number) | (() => string)>();
expectTypeOf<PartialApply<{<T>(value: T): T; (value: string, count: number): string}, [string]>>().toBe<(() => unknown) & ((count: number) => string)>();

type On = {
	(event: 'exit', listener: (code: number) => void): void;
	(event: 'message', listener: (message: string) => void): void;
	(event: string, listener: (...arguments_: any[]) => void): void;
};
expectTypeOf<PartialApply<On, ['message']>>().toBe<((listener: (message: string) => void) => void) & ((listener: (...arguments_: any[]) => void) => void)>();
expectTypeOf<PartialApply<{(value: string): 1; (value: number): 2} | {(value: string, count: number): 3; (): 4}, [string]>>().toBe<(() => 1) | ((count: number) => 3)>();

// Calls use the first matching overload. `Function#bind` only uses the last overload, which gives `any` here.
declare const onExit: PartialApply<On, ['exit']>;
onExit(code => {
	expectTypeOf(code).toBe<number>();
});

expectTypeOf<PartialApply<any, [string]>>().toBe<any>();
expectTypeOf<PartialApply<never, [string]>>().toBe<never>();
expectTypeOf<PartialApply<Request, any>>().toBe<any>();
expectTypeOf<PartialApply<Request, never>>().toBe<never>();
// The function type is checked first, so `any` gives `any` and `never` gives `never`.
expectTypeOf<PartialApply<any, never>>().toBe<any>();
expectTypeOf<PartialApply<never, any>>().toBe<never>();

// @ts-expect-error A callable function is required.
type NotFunction = PartialApply<string, []>;
// @ts-expect-error Constructors are not functions.
type Constructor = PartialApply<new (value: string) => Date, [string]>;
// @ts-expect-error The arguments must be an array.
type NotArray = PartialApply<Request, string>;

// Matches `Function#bind`.
declare const request: Request;
const boundRequest: PartialApply<Request, [string]> = request.bind(undefined, '/users');
expectTypeOf(boundRequest(3)).toBe<Promise<string>>();
// @ts-expect-error The bound URL is not a parameter anymore.
void boundRequest('/users', 3);
// @ts-expect-error The retries are still required.
void boundRequest();

// Describes the result of a partial application helper.
declare function partial<FunctionType extends AnyFunction, Arguments extends UnknownArray>(function_: FunctionType, ...arguments_: Arguments): PartialApply<FunctionType, Arguments>;

const requestUsers = partial(request, '/users');
expectTypeOf(requestUsers).toBe<(retries: number, timeout?: number) => Promise<string>>();
expectTypeOf(requestUsers(3)).toBe<Promise<string>>();
// @ts-expect-error The retries must be a number.
void requestUsers('3');

declare const log: (message?: any, ...optionalParameters: any[]) => void;
const logWithPrefix = partial(log, '[prefix]');
expectTypeOf(logWithPrefix).toBe<(...optionalParameters: any[]) => void>();

// Incompatible arguments make the helper return `never`.
const invalidRequest = partial(request, 3);
expectTypeOf(invalidRequest).toBe<never>();
