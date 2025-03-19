import {expectType} from 'tsd';
import type {SetParameterType} from '../index';

function function_(_a: number, _b: string, _c: Object, ..._arguments: boolean[]) {
	return null;
}

// @ts-ignore Global requires @types/node
function functionWithThis(this: Global, _a: number) {
	return null;
}

const arrowFunction = (_a: number) => null;

// Normal case
declare const test1: SetParameterType<typeof function_, {1: boolean}>;
expectType<(a: number, b: boolean, c: Object, ...arguments_: boolean[]) => null>(test1);
test1(1, true, {}, true);

// Test multiple parameters
declare const test2: SetParameterType<typeof function_, {0: string; 2: boolean}>;
expectType<(a: string, b: string, c: boolean, ...arguments_: boolean[]) => null>(test2);
test2('1', '2', true, true);

// Test another define way
declare const test3: SetParameterType<typeof function_, [a: 'a', b: 'b']>;
expectType<(a: 'a', b: 'b', c: Object, ...arguments_: boolean[]) => null>(test3);
test3('a', 'b', {}, true);

// Test `...args` parameter
declare const testargs: SetParameterType<typeof function_, {3: string}>;
expectType<(a: number, b: string, c: Object, ...arguments_: string[]) => null>(testargs);
testargs(1, '1', {}, '1');

declare const testargs2: SetParameterType<typeof function_, [string, number, number, ...boolean[]]>;
expectType<(a: string, b: number, c: number, ...arguments_: boolean[]) => null>(testargs2);
testargs2('1', 1, 1, true);

// Test arrow function
declare const test5: SetParameterType<typeof arrowFunction, {0: string}>;
expectType<(a: string) => null>(test5);

// Test the function that has `this` parameter
declare const testThis: SetParameterType<typeof functionWithThis, {0: string}>;

// @ts-ignore Global requires @types/node
expectType<(this: Global, a: string) => null>(testThis);

// @ts-ignore global requires @types/node
// eslint-disable-next-line @typescript-eslint/no-unsafe-call, unicorn/prefer-global-this
testThis.call(global, '1');
