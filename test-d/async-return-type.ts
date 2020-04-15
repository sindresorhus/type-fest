import {expectType, expectError} from 'tsd';
import {AsyncReturnType} from '..';

async function asyncFunction(base: number): Promise<number> {
	return base * 3;
}

type Value = AsyncReturnType<typeof asyncFunction>;

asyncFunction().then(value => {
	expectType<Value>(value);
	expectError<string>(value);
});
