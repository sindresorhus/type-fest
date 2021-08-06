import {expectType, expectError} from 'tsd';
import {AsyncReturnType} from '../index';

async function asyncFunction(): Promise<number> {
	return Promise.resolve(2);
}

type Value = AsyncReturnType<typeof asyncFunction>;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
asyncFunction().then(value => {
	expectType<Value>(value);
	expectError<string>(value);
});
