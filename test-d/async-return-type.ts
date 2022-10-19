import {expectTypeOf} from 'expect-type';
import type {AsyncReturnType} from '../index';

async function asyncFunction(): Promise<number> {
	return 2;
}

type Value = AsyncReturnType<typeof asyncFunction>;

// eslint-disable-next-line @typescript-eslint/no-floating-promises
asyncFunction().then(value => {
	expectTypeOf(value).toEqualTypeOf<Value>();
	expectTypeOf(value).not.toMatchTypeOf<string>();
});
