import {SnakeCasedProps} from '../ts41/snake-cased-props';
import {expectType} from 'tsd';

declare const foo: SnakeCasedProps<{ helloWorld: { fooBar: string } }>;
expectType<{ hello_world: { fooBar: string } }>(foo);

// Verify Example
interface User {
	userId: number;
	userName: string;
}
const result: SnakeCasedProps<User> = {
	user_id: 1,
	user_name: 'Tom'
};
expectType<SnakeCasedProps<User>>(result);
