import {expectType, expectError} from 'tsd';
import {AsyncReturnType} from '..';

async function asyncFunction(): Promise<number> {
	return Promise.resolve(2);
}

type Value = AsyncReturnType<typeof asyncFunction>;

asyncFunction().then(value => {
	expectType<Value>(value);
	expectError<string>(value);
});
