import {expectType} from 'tsd';
import type {PascalCasedProperties} from '../index';

declare const foo: PascalCasedProperties<{helloWorld: {fooBar: string}}>;
expectType<{HelloWorld: {fooBar: string}}>(foo);

declare const bar: PascalCasedProperties<Array<{helloWorld: string}>>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: PascalCasedProperties<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom',
};
expectType<PascalCasedProperties<User>>(result);
