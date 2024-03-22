import {expectNotAssignable, expectType} from 'tsd';
import type {AsyncReturnType} from '../index';

async function asyncFunction(): Promise<number> {
	return 2;
}

type Value = AsyncReturnType<typeof asyncFunction>;

asyncFunction().then(value => { // eslint-disable-line unicorn/prefer-top-level-await, @typescript-eslint/no-floating-promises
	expectType<Value>(value);
	expectNotAssignable<string>(value);
});
