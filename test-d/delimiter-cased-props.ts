import {expectType} from 'tsd';
import {DelimiterCasedProps} from '../ts41/delimiter-cased-props';

declare const foo: DelimiterCasedProps<{ helloWorld: { fooBar: string } }, '/'>;
expectType<{ 'hello/world': { fooBar: string } }>(foo);

// Verify Example
interface User {
	userId: number;
	userName: string;
}
const result: DelimiterCasedProps<User, '-'> = {
	'user-id': 1,
	'user-name': 'Tom'
};
expectType<DelimiterCasedProps<User, '-'>>(result);
