import {CamelCasedProps} from '../ts41/camel-cased-props';
import {expectType} from 'tsd';

declare const foo: CamelCasedProps<{
	A: number;
	B: {
		C: string;
	};
}>;

expectType<{ a: number; b: { C: string } }>(foo);

// Verify Example
interface User {
	UserId: number;
	UserName: string;
}

const result: CamelCasedProps<User> = {
	userId: 1,
	userName: 'Tom'
};
expectType<CamelCasedProps<User>>(result);
