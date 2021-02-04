import {KebabCasedProps} from '../ts41/kebab-cased-props';
import {expectType} from 'tsd';

declare const foo: KebabCasedProps<{ helloWorld: { fooBar: string } }>;
expectType<{ 'hello-world': { fooBar: string } }>(foo);

// Verify Example
interface User {
	userId: number;
	userName: string;
}
const result: KebabCasedProps<User> = {
	'user-id': 1,
	'user-name': 'Tom'
};
expectType<KebabCasedProps<User>>(result);
