import {expectTypeOf} from 'nz';
import type {SetParameterType} from '../index.d.ts';

function function_(_a: number, _b: string, _c: Object, ..._arguments: boolean[]) {
	return null;
}

function functionWithThis(this: typeof globalThis, _a: number) {
	return null;
}

const arrowFunction = (_a: number) => null;

// Normal case
declare const test1: SetParameterType<typeof function_, {1: boolean}>;
expectTypeOf(test1).toBe<(a: number, b: boolean, c: Object, ...arguments_: boolean[]) => null>();
test1(1, true, {}, true);

// Test multiple parameters
declare const test2: SetParameterType<typeof function_, {0: string; 2: boolean}>;
expectTypeOf(test2).toBe<(a: string, b: string, c: boolean, ...arguments_: boolean[]) => null>();
test2('1', '2', true, true);

// Test another define way
declare const test3: SetParameterType<typeof function_, [a: 'a', b: 'b']>;
expectTypeOf(test3).toBe<(a: 'a', b: 'b', c: Object, ...arguments_: boolean[]) => null>();
test3('a', 'b', {}, true);

// Test `...args` parameter
declare const testargs: SetParameterType<typeof function_, {3: string}>;
expectTypeOf(testargs).toBe<(a: number, b: string, c: Object, ...arguments_: string[]) => null>();
testargs(1, '1', {}, '1');

declare const testargs2: SetParameterType<typeof function_, [string, number, number, ...boolean[]]>;
expectTypeOf(testargs2).toBe<(a: string, b: number, c: number, ...arguments_: boolean[]) => null>();
testargs2('1', 1, 1, true);

// Test `...args` parameter when an optional parameter comes before it
function functionWithOptionalParameter(_a: number, _b?: string, ..._arguments: boolean[]) {
	return null;
}

declare const testargs3: SetParameterType<typeof functionWithOptionalParameter, {2: string}>;
expectTypeOf(testargs3).toBe<(a: number, b?: string, ...arguments_: string[]) => null>();
testargs3(1, '1', '2');

// An unspecified `...args` parameter is kept as-is
declare const testargs4: SetParameterType<typeof functionWithOptionalParameter, {1: number}>;
expectTypeOf(testargs4).toBe<(a: number, b?: number, ...arguments_: boolean[]) => null>();
testargs4(1, 1, true);

// The array form of the replacement sets a `...args` parameter too, just like the object form does.
declare const testargs5: SetParameterType<(a: string, ...rest: boolean[]) => null, [string, number]>;
expectTypeOf(testargs5).toBe<(a: string, ...rest: number[]) => null>();
testargs5('1', 1, 2);

// The rest parameter is kept as-is when the replacement is too short to reach it.
declare const testargs6: SetParameterType<(a: string, ...rest: boolean[]) => null, [Date]>;
expectTypeOf(testargs6).toBe<(a: Date, ...rest: boolean[]) => null>();
testargs6(new Date(), true);

// A parameter list that is only a `...args` parameter is replaced as a whole.
declare const testargs7: SetParameterType<(...arguments_: string[]) => null, [Date]>;
expectTypeOf(testargs7).toBe<(...arguments_: Date[]) => null>();
testargs7(new Date());

// Only index `0` is addressable when the parameter list is only a `...args` parameter, so a longer replacement is truncated.
declare const testargs8: SetParameterType<(...arguments_: string[]) => null, [Date, number]>;
expectTypeOf(testargs8).toBe<(...arguments_: Date[]) => null>();
testargs8(new Date());

// Test arrow function
declare const test5: SetParameterType<typeof arrowFunction, {0: string}>;
expectTypeOf(test5).toBe<(a: string) => null>();

// Test the function that has `this` parameter
declare const testThis: SetParameterType<typeof functionWithThis, {0: string}>;
expectTypeOf(testThis).toBe<(this: typeof globalThis, _a: string) => null>();
testThis.call(globalThis, '1');
// @ts-expect-error
testThis.call(new Date(), '1');

// A type with several call signatures collapses to its last signature. This is a TypeScript limitation, not a choice, so it is pinned here rather than worked around.
declare const overloaded: SetParameterType<{(): void; (x: number): void}, [string]>;
expectTypeOf(overloaded).toBe<(x: string) => void>();

// Replacing a rest parameter must preserve the explicit receiver and every optional position before it.
declare const withReceiverAndOptionalParameters: SetParameterType<(this: Date, first?: string, second?: boolean, ...rest: number[]) => Date, {2: string}>;
expectTypeOf(withReceiverAndOptionalParameters).toBe<(this: Date, first?: string, second?: boolean, ...rest: string[]) => Date>();
withReceiverAndOptionalParameters.call(new Date(), undefined, true, 'value');
// @ts-expect-error -- The receiver is still required to be a Date.
withReceiverAndOptionalParameters.call('invalid', undefined, true, 'value');
// @ts-expect-error -- The old rest parameter type is rejected.
withReceiverAndOptionalParameters.call(new Date(), undefined, true, 1);

// A function with a readonly rest parameter, such as a parameter list typed with `as const`, keeps its parameter positions.
declare const readonlyParameters: SetParameterType<(...arguments_: readonly [string, number?]) => boolean, {0: boolean}>;
expectTypeOf(readonlyParameters).toBe<(first: boolean, second?: number) => boolean>();

declare const readonlyParametersTuple: SetParameterType<(...arguments_: readonly [string, number?]) => boolean, [boolean]>;
expectTypeOf(readonlyParametersTuple).toBe<(first: boolean, second?: number) => boolean>();

declare const readonlyRestParameter: SetParameterType<(first: string, ...rest: readonly number[]) => boolean, {1: string}>;
expectTypeOf(readonlyRestParameter).toBe<(first: string, ...rest: string[]) => boolean>();

// Numeric parameter keys also accept their canonical string spelling.
expectTypeOf<SetParameterType<(value: string) => boolean, {'0': number}>>().toBe<(value: number) => boolean>();
expectTypeOf<SetParameterType<(value: string, ...rest: boolean[]) => number, {'1': Date}>>().toBe<(value: string, ...rest: Date[]) => number>();

expectTypeOf<SetParameterType<(first: string, second?: number) => boolean, {'0': Date; '1': boolean}>>().toBe<(first: Date, second?: boolean) => boolean>();
expectTypeOf<SetParameterType<(this: Date, first?: string, ...rest: number[]) => Date, {'1': boolean}>>().toBe<(this: Date, first?: string, ...rest: boolean[]) => Date>();
expectTypeOf<SetParameterType<(...rest: number[]) => string, {'0': boolean}>>().toBe<(...rest: boolean[]) => string>();
expectTypeOf<SetParameterType<(first: string, second: number) => boolean, {0: Date; '1': boolean}>>().toBe<(first: Date, second: boolean) => boolean>();
expectTypeOf<SetParameterType<(first: string, ...rest: number[]) => boolean, {'0': Date}>>().toBe<(first: Date, ...rest: number[]) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'1': Date}>>().toBe<(first: string) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'00': Date}>>().toBe<(first: string) => boolean>();
expectTypeOf<SetParameterType<(first: string, ...rest: number[]) => boolean, {'01': Date}>>().toBe<(first: string, ...rest: number[]) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'0': any}>>().toBe<(first: any) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'0': unknown}>>().toBe<(first: unknown) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'0': never}>>().toBe<(first: never) => boolean>();
expectTypeOf<SetParameterType<never, {'0': number}>>().toBe<never>();
expectTypeOf<SetParameterType<(() => string) | ((first: string) => number), {'0': Date}>>().toBe<(() => string) | ((first: Date) => number)>();
// @ts-expect-error - The input must be callable.
expectTypeOf<SetParameterType<unknown, {'0': number}>>();

// The transformed signature can be called with the replacement, and rejects the old value.
declare const withStringIndex: SetParameterType<(first: string, ...rest: number[]) => boolean, {'0': Date; '1': string}>;
withStringIndex(new Date(), 'value');
// @ts-expect-error
withStringIndex('old', 'value');
// @ts-expect-error
withStringIndex(new Date(), 1);

// A readonly rest array still has a replaceable parameter at index zero.
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: boolean}>>().toBe<(...rest: boolean[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {'0': boolean}>>().toBe<(...rest: boolean[]) => string>();

expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, [Date]>>().toBe<(...rest: Date[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, readonly [Date, boolean]>>().toBe<(...rest: Date[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, readonly Date[]>>().toBe<(...rest: readonly Date[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {}>>().toBe<(...rest: readonly number[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {1: Date}>>().toBe<(...rest: readonly number[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: unknown}>>().toBe<(...rest: readonly unknown[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: any}>>().toBe<(...rest: readonly any[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: never}>>().toBe<(...rest: readonly never[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly never[]) => string, {0: boolean}>>().toBe<(...rest: readonly boolean[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly unknown[]) => string, {0: boolean}>>().toBe<(...rest: readonly boolean[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly any[]) => string, {0: boolean}>>().toBe<(...rest: readonly boolean[]) => string>();
expectTypeOf<SetParameterType<(this: Date, ...rest: readonly number[]) => Date, {0: boolean}>>().toBe<(this: Date, ...rest: readonly boolean[]) => Date>();
expectTypeOf<SetParameterType<((...rest: readonly number[]) => string) | ((first: string) => number), {0: boolean}>>().toBe<((...rest: readonly boolean[]) => string) | ((first: boolean) => number)>();

declare const withReadonlyRest: SetParameterType<(this: Date, ...rest: readonly number[]) => Date, {0: boolean}>;
withReadonlyRest.call(new Date(), true, false);
// @ts-expect-error - The previous element type is replaced.
withReadonlyRest.call(new Date(), 1);
// @ts-expect-error - The receiver is preserved.
withReadonlyRest.call('wrong', true);
expectTypeOf<SetParameterType<any, {0: boolean}>>().toBe<any>();
