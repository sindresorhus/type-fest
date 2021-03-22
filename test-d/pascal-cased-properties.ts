import {PascalCasedProperties} from '../ts41/pascal-cased-properties';
import {expectType} from 'tsd';

declare const foo: PascalCasedProperties<{helloWorld: {fooBar: string}}>;
expectType<{HelloWorld: {fooBar: string}}>(foo);

declare const bar: PascalCasedProperties<Array<{helloWorld: string}>>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: PascalCasedProperties<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

// Verify example
interface User {
	userId: number;
	userName: string;
}
const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom'
};
expectType<PascalCasedProperties<User>>(result);
