import {expectTypeOf} from 'nz';
import type {AsyncReturnType} from '../index.d.ts';

async function asyncFunction(): Promise<number> {
	return 2;
}

type Value = AsyncReturnType<typeof asyncFunction>;

asyncFunction().then(value => { // eslint-disable-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
	expectTypeOf(value).toBe<Value>();
	expectTypeOf(value).not.toBeAssignableTo<string>();
});

function asyncPromiseLike(): PromiseLike<number> {
	return Promise.resolve(2);
}

type ValuePromiseLike = AsyncReturnType<typeof asyncPromiseLike>;

asyncPromiseLike().then(value => { // eslint-disable-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
	expectTypeOf(value).toBe<ValuePromiseLike>();
	expectTypeOf(value).not.toBeAssignableTo<string>();
});

// Awaiting recursively unwraps nested promises and retains alternatives from each function.
expectTypeOf<AsyncReturnType<() => PromiseLike<Promise<{id: string}>>>>().toBe<{id: string}>();
expectTypeOf<AsyncReturnType<(() => Promise<string>) | (() => PromiseLike<number>)>>().toBe<string | number>();
expectTypeOf<AsyncReturnType<() => Promise<unknown>>>().toBe<unknown>();
expectTypeOf<AsyncReturnType<() => Promise<never>>>().toBe<never>();
expectTypeOf<AsyncReturnType<() => Promise<any>>>().toBe<any>();
expectTypeOf<AsyncReturnType<never>>().toBe<never>();
expectTypeOf<AsyncReturnType<any>>().toBe<any>();

function constructAsyncPayload<Payload>(data: Payload): AsyncReturnType<() => Promise<{data: Payload}>> {
	return {data};
}

function _readAsyncPayload<Payload>(value: AsyncReturnType<() => Promise<{data: Payload}>>): Payload {
	return value.data;
}

const asyncPayload = constructAsyncPayload({id: 1} as const);
expectTypeOf(asyncPayload.data).toBe<{readonly id: 1}>();
expectTypeOf<{data: {id: 'wrong'}}>().not.toBeAssignableTo<typeof asyncPayload>();
// @ts-expect-error A synchronous function does not satisfy the asynchronous function constraint.
type SynchronousReturn = AsyncReturnType<() => string>;
// @ts-expect-error An unknown value is not known to be an asynchronous function.
type UnknownReturn = AsyncReturnType<unknown>;
