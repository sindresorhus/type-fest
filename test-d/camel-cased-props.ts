import {CamelCasedProperties} from '../ts41/camel-cased-props';
import {expectType} from 'tsd';

declare const foo: CamelCasedProperties<{
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

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom'
};
expectType<CamelCasedProperties<User>>(result);
