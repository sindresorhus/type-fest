import {expectTypeOf} from 'nz';
import type {SetParameterType} from '../index.d.ts';

function function_(_a: number, _b: string, _c: Object, ..._arguments: boolean[]) {
	return null;
}

// @ts-expect-error Global requires @types/node
function functionWithThis(this: Global, _a: number) {
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

// TODO: Fix. The `this` is reported as `any`.
// Test the function that has `this` parameter
// declare const testThis: SetParameterType<typeof functionWithThis, {0: string}>;

// expectType<(this: typeof globalThis, a: string) => null>(testThis);

// // eslint-disable-next-line @typescript-eslint/no-unsafe-call
// testThis.call(globalThis, '1');

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
