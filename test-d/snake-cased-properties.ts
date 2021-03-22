import {SnakeCasedProperties} from '../ts41/snake-cased-properties';
import {expectType} from 'tsd';

declare const foo: SnakeCasedProperties<{helloWorld: {fooBar: string}}>;
expectType<{hello_world: {fooBar: string}}>(foo);

// Verify example
interface User {
	userId: number;
	userName: string;
}
const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom'
};
expectType<SnakeCasedProperties<User>>(result);
