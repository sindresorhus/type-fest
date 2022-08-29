import {expectType} from 'tsd';
import type {SnakeCasedProperties} from '../index';

declare const foo: SnakeCasedProperties<{helloWorld: {fooBar: string}}>;
expectType<{hello_world: {fooBar: string}}>(foo);

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};
expectType<SnakeCasedProperties<User>>(result);
