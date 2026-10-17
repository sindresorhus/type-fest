import {expectTypeOf} from 'nz';
import type {AnyFunction, RequireArity} from '../index.d.ts';

// Required parameters
expectTypeOf<RequireArity<(a: string) => void>>().toBe<(a: string) => void>();
expectTypeOf<RequireArity<(a: string, b: number) => void>>().toBe<(a: string, b: number) => void>();
expectTypeOf<RequireArity<(a: string | undefined) => void>>().toBe<(a: string | undefined) => void>();
expectTypeOf<RequireArity<(a: string, ...rest: number[]) => void>>().toBe<(a: string, ...rest: number[]) => void>();
expectTypeOf<RequireArity<(a: string, b?: number) => void>>().toBe<(a: string, b?: number) => void>();
expectTypeOf<RequireArity<<Value>(value: Value) => Value>>().toBe<<Value>(value: Value) => Value>();
expectTypeOf<RequireArity<(this: Date, a: string) => void>>().toBe<(this: Date, a: string) => void>();
expectTypeOf<RequireArity<(a: unknown) => void>>().toBe<(a: unknown) => void>();
expectTypeOf<RequireArity<(a: never) => void>>().toBe<(a: never) => void>();
expectTypeOf<RequireArity<(items: readonly string[]) => void>>().toBe<(items: readonly string[]) => void>();
expectTypeOf<RequireArity<{(a: string): void; displayName: string}>>().toBe<{(a: string): void; displayName: string}>();

// Too few required parameters
expectTypeOf<RequireArity<() => void>>().toBe<never>();
expectTypeOf<RequireArity<(a?: string) => void>>().toBe<never>();
expectTypeOf<RequireArity<(...rest: string[]) => void>>().toBe<never>();
expectTypeOf<RequireArity<(...rest: any[]) => void>>().toBe<never>();
expectTypeOf<RequireArity<(...rest: readonly string[]) => void>>().toBe<never>();
expectTypeOf<RequireArity<(...rest: readonly any[]) => void>>().toBe<never>();
expectTypeOf<RequireArity<(this: Date) => void>>().toBe<never>();
expectTypeOf<RequireArity<(a?: string, ...rest: number[]) => void>>().toBe<never>();
expectTypeOf<RequireArity<<Arguments extends unknown[]>(...arguments_: Arguments) => void>>().toBe<never>();

// TypeScript makes a trailing `void` parameter optional
expectTypeOf<RequireArity<(a: void) => void>>().toBe<never>();
expectTypeOf<RequireArity<(a: string | void) => void>>().toBe<never>();

// Rest tuples
expectTypeOf<RequireArity<(...arguments_: [string, number]) => void, 2>>().toBe<(...arguments_: [string, number]) => void>();
expectTypeOf<RequireArity<(...arguments_: [string, number?]) => void, 2>>().toBe<never>();
expectTypeOf<RequireArity<(...arguments_: readonly [string]) => void>>().toBe<(...arguments_: readonly [string]) => void>();
expectTypeOf<RequireArity<(...arguments_: readonly []) => void>>().toBe<never>();
expectTypeOf<RequireArity<(...arguments_: [first: string, second?: number]) => void>>().toBe<(...arguments_: [first: string, second?: number]) => void>();
expectTypeOf<RequireArity<(...arguments_: [first: string, second?: number]) => void, 2>>().toBe<never>();
expectTypeOf<RequireArity<(...arguments_: [string, ...number[]]) => void>>().toBe<(...arguments_: [string, ...number[]]) => void>();
expectTypeOf<RequireArity<(...arguments_: [string, ...number[]]) => void, 2>>().toBe<never>();

// `Count`
expectTypeOf<RequireArity<(a: string, b: number) => void, 2>>().toBe<(a: string, b: number) => void>();
expectTypeOf<RequireArity<(a: string, b: number, c: boolean) => void, 2>>().toBe<(a: string, b: number, c: boolean) => void>();
expectTypeOf<RequireArity<(a: string) => void, 2>>().toBe<never>();
expectTypeOf<RequireArity<(a: string, b?: number) => void, 2>>().toBe<never>();
expectTypeOf<RequireArity<() => void, 0>>().toBe<() => void>();
expectTypeOf<RequireArity<(a?: string) => void, 0>>().toBe<(a?: string) => void>();
expectTypeOf<RequireArity<(...rest: readonly string[]) => void, 0>>().toBe<(...rest: readonly string[]) => void>();
expectTypeOf<RequireArity<(a: string, b: number, c: boolean) => void, 3>>().toBe<(a: string, b: number, c: boolean) => void>();
expectTypeOf<RequireArity<(a: string, b: number, c: boolean) => void, 4>>().toBe<never>();

// A decimal `Count` is truncated, and a negative `Count` acts as `0`
expectTypeOf<RequireArity<(a: string) => void, 1.5>>().toBe<(a: string) => void>();
expectTypeOf<RequireArity<() => void, 1.5>>().toBe<never>();
expectTypeOf<RequireArity<() => void, -1>>().toBe<() => void>();

// Non-literal `Count` accepts any function
expectTypeOf<RequireArity<() => void, number>>().toBe<() => void>();

// A union `Count` acts as its smallest member
expectTypeOf<RequireArity<(a: string) => void, 1 | 2>>().toBe<(a: string) => void>();
expectTypeOf<RequireArity<() => void, 1 | 2>>().toBe<never>();

// Overloads are checked by their last signature
expectTypeOf<RequireArity<{(): void; (a: string): void}>>().toBe<{(): void; (a: string): void}>();
expectTypeOf<RequireArity<{(a: string): void; (): void}>>().toBe<never>();
expectTypeOf<RequireArity<(() => void) & ((a: string) => void)>>().toBe<(() => void) & ((a: string) => void)>();
expectTypeOf<RequireArity<((a: string) => void) & (() => void)>>().toBe<never>();

// A union is rejected if any member has too few required parameters
expectTypeOf<RequireArity<((a: string) => void) | ((a: number) => void)>>().toBe<((a: string) => void) | ((a: number) => void)>();
expectTypeOf<RequireArity<((a: string) => void) | (() => void)>>().toBe<never>();

// Edge cases
expectTypeOf<RequireArity<any>>().toBe<any>();
expectTypeOf<RequireArity<never>>().toBe<never>();
expectTypeOf<RequireArity<AnyFunction>>().toBe<never>();
expectTypeOf<RequireArity<() => void, any>>().toBe<() => void>();
expectTypeOf<RequireArity<() => void, never>>().toBe<() => void>();

// @ts-expect-error
type NotAFunction = RequireArity<string>;

// @ts-expect-error
type UnknownFunction = RequireArity<unknown>;

// @ts-expect-error
type Constructor = RequireArity<new (a: string) => object>;

// @ts-expect-error
type NonNumberCount = RequireArity<(a: string) => void, '1'>;

// Usage on a generic function parameter
declare function useAsyncEffect<Callback extends (isMounted: () => boolean) => Promise<void>>(callback: RequireArity<Callback>): void;

useAsyncEffect(async isMounted => {
	expectTypeOf(isMounted).toBe<() => boolean>();
});

useAsyncEffect(async (isMounted: () => boolean) => {
	isMounted();
});

// @ts-expect-error
useAsyncEffect(async () => {
	await Promise.resolve();
});

// @ts-expect-error
useAsyncEffect(async (isMounted?: () => boolean) => {
	isMounted?.();
});

async function effectWithDefault(isMounted = () => true): Promise<void> {
	isMounted();
}

// @ts-expect-error
useAsyncEffect(effectWithDefault);

// @ts-expect-error
useAsyncEffect(async (...arguments_: Array<() => boolean>) => {
	arguments_[0]?.();
});

// @ts-expect-error
useAsyncEffect(async (...arguments_: ReadonlyArray<() => boolean>) => {
	arguments_[0]?.();
});

// An unannotated rest parameter gets its parameters from the constraint
useAsyncEffect(async (...arguments_) => {
	expectTypeOf(arguments_).toBe<[isMounted: () => boolean]>();
});

// Parameters that do not match the constraint are still rejected
// @ts-expect-error
useAsyncEffect(async (isMounted: string) => {
	isMounted.trim();
});

declare const anyCallback: any;
useAsyncEffect(anyCallback);

// A union is rejected if any member has too few required parameters
declare const unionCallback: ((isMounted: () => boolean) => Promise<void>) | (() => Promise<void>);
// @ts-expect-error
useAsyncEffect(unionCallback);

// An overloaded function is checked by its last signature
declare function effectWithParameterLast(): Promise<void>;
declare function effectWithParameterLast(isMounted: () => boolean): Promise<void>;
useAsyncEffect(effectWithParameterLast);

declare function effectWithParameterFirst(isMounted: () => boolean): Promise<void>;
declare function effectWithParameterFirst(): Promise<void>;
// @ts-expect-error
useAsyncEffect(effectWithParameterFirst);

// Callback in an options object
declare function on<Listener extends (event: string) => void>(options: {listener: RequireArity<Listener>}): void;

on({
	listener(event) {
		expectTypeOf(event).toBe<string>();
	},
});

// A destructured parameter is a required parameter
on({
	listener({length}) {
		expectTypeOf(length).toBe<number>();
	},
});

// @ts-expect-error
on({listener() {}}); // eslint-disable-line @typescript-eslint/no-empty-function

declare function sortNumbers<Compare extends (a: number, b: number) => number>(compare: RequireArity<Compare, 2>): void;

sortNumbers((a, b) => {
	expectTypeOf(a).toBe<number>();
	expectTypeOf(b).toBe<number>();
	return a - b;
});

// @ts-expect-error
sortNumbers(a => a);

// @ts-expect-error
sortNumbers(() => 0);

function compareNumbers(a: number, b: number): number {
	return a - b;
}

sortNumbers(compareNumbers);

// A parameter with a default value is counted when a required parameter comes after it
// eslint-disable-next-line @typescript-eslint/default-param-last
function compareWithDefault(a = 0, b: number): number {
	return a - b;
}

sortNumbers(compareWithDefault);

// A bound function keeps its remaining parameters
sortNumbers(compareNumbers.bind(undefined));

// @ts-expect-error
sortNumbers(compareNumbers.bind(undefined, 0));

declare function some<Callback extends (value: number, index: number, array: number[]) => boolean>(callback: RequireArity<Callback>): boolean;

some(value => value > 1);
some((value, index, array) => value > array.length + index);

// @ts-expect-error
some(() => true);

// @ts-expect-error
some(Boolean);

// A generic function
declare function isPositive<Value extends number>(value: Value): boolean;
some(isPositive);

// A method reference
class Counter {
	count = 0;

	add(amount: number): boolean {
		this.count += amount;
		return true;
	}

	reset(): boolean {
		this.count = 0;
		return true;
	}
}

const counter = new Counter();
some(counter.add);

// @ts-expect-error
some(counter.reset);

// Other type parameters are still inferred
declare function watch<Value, Callback extends (value: Value) => void>(value: Value, callback: RequireArity<Callback>): void;

watch(1, value => {
	expectTypeOf(value).toBe<number>();
});

watch('unicorn', value => {
	expectTypeOf(value).toBe<string>();
});

// @ts-expect-error
watch(1, () => {}); // eslint-disable-line @typescript-eslint/no-empty-function
