import {expectNotAssignable, expectType} from 'tsd';
import type {AsyncReturnType} from '../index';

async function asyncFunction(): Promise<number> {
	return 2;
}

type Value = AsyncReturnType<typeof asyncFunction>;

const value = await asyncFunction();
expectType<Value>(value);
expectNotAssignable<string>(value);
