import {PascalCasedProps} from '../ts41/pascal-cased-props';
import {expectType} from 'tsd';

declare const foo: PascalCasedProps<{ helloWorld: { fooBar: string } }>;
expectType<{ HelloWorld: { fooBar: string } }>(foo);

// Verify Example
interface User {
	userId: number;
	userName: string;
}
const result: PascalCasedProps<User> = {
	UserId: 1,
	UserName: 'Tom'
};
expectType<PascalCasedProps<User>>(result);
