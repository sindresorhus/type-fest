import {expectTypeOf} from 'nz';
import type {FunctionParameters, UnknownArray} from '../index.d.ts';

// Ordinary parameter lists
expectTypeOf<FunctionParameters<() => void>>().toBe<[]>();
expectTypeOf<FunctionParameters<(foo: string, bar: number) => void>>().toBe<[foo: string, bar: number]>();
expectTypeOf<FunctionParameters<(foo: string, bar?: number) => void>>().toBe<[foo: string, bar?: number | undefined]>();
expectTypeOf<FunctionParameters<(foo: string, ...bar: number[]) => void>>().toBe<[foo: string, ...bar: number[]]>();
expectTypeOf<FunctionParameters<(foo: string, bar?: number, ...baz: boolean[]) => void>>().toBe<[foo: string, bar?: number | undefined, ...baz: boolean[]]>();
expectTypeOf<FunctionParameters<(foo: string | undefined, bar: undefined) => void>>().toBe<[foo: string | undefined, bar: undefined]>();
expectTypeOf<FunctionParameters<({foo}: {foo: string}, [bar]: [number]) => void>>().toBe<[{foo: string}, [number]]>();

// Mutable rest parameters
expectTypeOf<FunctionParameters<(...arguments_: any[]) => void>>().toBe<any[]>();
expectTypeOf<FunctionParameters<(...arguments_: unknown[]) => void>>().toBe<unknown[]>();
expectTypeOf<FunctionParameters<(...arguments_: [foo: string, bar?: number]) => void>>().toBe<[foo: string, bar?: number]>();
expectTypeOf<FunctionParameters<(...arguments_: [...head: string[], tail: number]) => void>>().toBe<[...head: string[], tail: number]>();
expectTypeOf<FunctionParameters<(...arguments_: [foo: string] | [foo: number, bar: boolean]) => void>>().toBe<[foo: string] | [foo: number, bar: boolean]>();
expectTypeOf<FunctionParameters<(...arguments_: string[] | [number, boolean]) => void>>().toBe<string[] | [number, boolean]>();
expectTypeOf<FunctionParameters<(foo: string, ...rest: number[] | [boolean]) => void>>().toBe<[foo: string, ...rest: number[]] | [foo: string, rest: boolean]>();

// Readonly rest arrays, which the built-in `Parameters` gets wrong
expectTypeOf<FunctionParameters<(...arguments_: readonly number[]) => void>>().toBe<readonly number[]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly any[]) => void>>().toBe<readonly any[]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly unknown[]) => void>>().toBe<readonly unknown[]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly never[]) => void>>().toBe<readonly never[]>();
expectTypeOf<FunctionParameters<(...arguments_: ReadonlyArray<string | number>) => void>>().toBe<ReadonlyArray<string | number>>();
expectTypeOf<FunctionParameters<(...arguments_: readonly number[] | readonly string[]) => void>>().toBe<readonly number[] | readonly string[]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly string[] | [number]) => void>>().toBe<readonly string[] | [number]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly number[] & {brand: true}) => void>>().toBe<readonly number[] & {brand: true}>();
expectTypeOf<Parameters<(...arguments_: readonly number[]) => void>>().toBe<never>();
expectTypeOf<Parameters<(...arguments_: readonly any[]) => void>>().toBe<unknown[]>();

// A union of readonly tuples is kept as is
expectTypeOf<FunctionParameters<(...arguments_: readonly [number, string] | readonly [string, number]) => void>>().toBe<readonly [number, string] | readonly [string, number]>();

// TypeScript expands a single readonly tuple into separate parameters, so the `readonly` modifier is lost
expectTypeOf<FunctionParameters<(...arguments_: readonly [foo: string, bar?: number]) => void>>().toBe<[foo: string, bar?: number]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly [foo: string, ...rest: number[]]) => void>>().toBe<[foo: string, ...rest: number[]]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly [...head: string[], tail: number]) => void>>().toBe<[...head: string[], tail: number]>();
expectTypeOf<FunctionParameters<(...arguments_: readonly []) => void>>().toBe<[]>();
expectTypeOf<FunctionParameters<(foo: string, ...rest: readonly number[]) => void>>().toBe<[foo: string, ...rest: number[]]>();

// The `this` parameter is not included
expectTypeOf<FunctionParameters<(this: Date, foo: string) => void>>().toBe<[foo: string]>();
expectTypeOf<FunctionParameters<(this: Date) => void>>().toBe<[]>();
expectTypeOf<FunctionParameters<(this: Date, ...values: readonly number[]) => void>>().toBe<readonly number[]>();

// The return type does not matter
expectTypeOf<FunctionParameters<(value: unknown) => value is string>>().toBe<[value: unknown]>();
expectTypeOf<FunctionParameters<(value: unknown) => asserts value is string>>().toBe<[value: unknown]>();

// Type parameters resolve to their constraint
expectTypeOf<FunctionParameters<<Value>(value: Value, list: Value[]) => Value>>().toBe<[value: unknown, list: unknown[]]>();
expectTypeOf<FunctionParameters<<Value extends string>(value: Value) => Value>>().toBe<[value: string]>();
expectTypeOf<FunctionParameters<<Arguments extends unknown[]>(...arguments_: Arguments) => void>>().toBe<unknown[]>();
expectTypeOf<FunctionParameters<<Arguments extends readonly string[]>(...arguments_: Arguments) => void>>().toBe<readonly string[]>();
expectTypeOf<FunctionParameters<<const Arguments extends readonly unknown[]>(...arguments_: Arguments) => void>>().toBe<readonly unknown[]>();
expectTypeOf<FunctionParameters<<Arguments extends readonly [string, number]>(...arguments_: Arguments) => void>>().toBe<[string, number]>();

// Unions distribute
expectTypeOf<FunctionParameters<(() => void) | ((foo: string) => void)>>().toBe<[] | [foo: string]>();
expectTypeOf<FunctionParameters<((foo: string) => void) | ((...values: readonly number[]) => void)>>().toBe<[foo: string] | readonly number[]>();
expectTypeOf<Parameters<((foo: string) => void) | ((...values: readonly number[]) => void)>>().toBe<[foo: string]>();

// Only the last overload is used
type Overloaded = {
	(foo: string): void;
	(foo: number, bar: boolean): void;
};
expectTypeOf<FunctionParameters<Overloaded>>().toBe<[foo: number, bar: boolean]>();
expectTypeOf<FunctionParameters<((foo: string) => void) & ((bar: number) => void)>>().toBe<[bar: number]>();
expectTypeOf<FunctionParameters<{(foo: string): void; (...values: readonly number[]): void}>>().toBe<readonly number[]>();

// Callable objects
expectTypeOf<FunctionParameters<{(foo: string): void; displayName: string}>>().toBe<[foo: string]>();
expectTypeOf<FunctionParameters<{(...values: readonly number[]): void; displayName: string}>>().toBe<readonly number[]>();
expectTypeOf<FunctionParameters<Function & ((foo: string) => void)>>().toBe<[foo: string]>();

// Methods and declared functions
type Service = {
	log(...messages: readonly string[]): void;
	request(url: string, options?: {retry: number}): Promise<string>;
};
expectTypeOf<FunctionParameters<Service['log']>>().toBe<readonly string[]>();
expectTypeOf<FunctionParameters<Service['request']>>().toBe<[url: string, options?: {retry: number} | undefined]>();
expectTypeOf<FunctionParameters<typeof Math.max>>().toBe<number[]>();
expectTypeOf<FunctionParameters<typeof Number.parseInt>>().toBe<[string: string, radix?: number | undefined]>();

// Boundary types
expectTypeOf<FunctionParameters<any>>().toBe<UnknownArray>();
expectTypeOf<FunctionParameters<never>>().toBe<never>();
expectTypeOf<FunctionParameters<(...arguments_: any) => void>>().toBe<any[]>();
expectTypeOf<FunctionParameters<(...arguments_: never) => void>>().toBe<never>();

// Non-function types are rejected
// @ts-expect-error
type FromUnknown = FunctionParameters<unknown>;
// @ts-expect-error
type FromString = FunctionParameters<string>;
// @ts-expect-error
type FromObject = FunctionParameters<{foo: string}>;
// @ts-expect-error
type FromFunction = FunctionParameters<Function>;
// @ts-expect-error
type FromConstructor = FunctionParameters<new (foo: string) => object>;
// @ts-expect-error
type FromClass = FunctionParameters<typeof Map>;
// @ts-expect-error
type FromOptionalFunction = FunctionParameters<(() => void) | undefined>;

// Wrapping a function keeps its call signature
declare function wrap<FunctionType extends (...arguments_: readonly any[]) => unknown>(
	function_: FunctionType,
): (...arguments_: FunctionParameters<FunctionType>) => ReturnType<FunctionType>;

const wrappedReadonlyRest = wrap((...values: readonly number[]) => values.length);
expectTypeOf(wrappedReadonlyRest).toBe<(...arguments_: readonly number[]) => number>();
expectTypeOf(wrappedReadonlyRest(1, 2, 3)).toBe<number>();
expectTypeOf(wrappedReadonlyRest()).toBe<number>();
// @ts-expect-error
wrappedReadonlyRest('1');

declare const optional: (foo: string, bar?: number) => string;
const wrappedOptional = wrap(optional);
expectTypeOf(wrappedOptional('a')).toBe<string>();
expectTypeOf(wrappedOptional('a', 1)).toBe<string>();
// @ts-expect-error
wrappedOptional();
// @ts-expect-error
wrappedOptional('a', 1, 2);

// The result can be spread back into the function
declare const sum: (...values: readonly number[]) => number;
declare const sumArguments: FunctionParameters<typeof sum>;
expectTypeOf(sum(...sumArguments)).toBe<number>();
expectTypeOf<[1, 2, 3]>().toBeAssignableTo<FunctionParameters<typeof sum>>();
expectTypeOf<readonly [1, 2, 3]>().toBeAssignableTo<FunctionParameters<typeof sum>>();
expectTypeOf<['1']>().not.toBeAssignableTo<FunctionParameters<typeof sum>>();
