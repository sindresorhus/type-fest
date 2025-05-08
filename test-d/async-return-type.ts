import {expectNotAssignable, expectType} from 'tsd';
import type {AsyncReturnType} from '../index.d.ts';

async function asyncFunction(): Promise<number> {
	return 2;
}

type Value = AsyncReturnType<typeof asyncFunction>;

asyncFunction().then(value => { // eslint-disable-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
	expectType<Value>(value);
	expectNotAssignable<string>(value);
});

function asyncPromiseLike(): PromiseLike<number> {
	return Promise.resolve(2);
}

type ValuePromiseLike = AsyncReturnType<typeof asyncPromiseLike>;

asyncPromiseLike().then(value => { // eslint-disable-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
	expectType<ValuePromiseLike>(value);
	expectNotAssignable<string>(value);
});
