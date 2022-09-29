import {expectType, expectError} from 'tsd';
import type {AsyncReturnType} from '../index';

async function asyncFunction(): Promise<number> {
	return 2;
}

type Value = AsyncReturnType<typeof asyncFunction>;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
asyncFunction().then(value => {
	expectType<Value>(value);
	expectError<string>(value);
});
