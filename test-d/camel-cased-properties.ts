import {CamelCasedProperties} from '../ts41/camel-cased-properties';
import {expectType} from 'tsd';

declare const foo: CamelCasedProperties<{A: number; B: {C: string}}>;

expectType<{a: number; b: {C: string}}>(foo);

declare const bar: CamelCasedProperties<Array<{helloWorld: string}>>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: CamelCasedProperties<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

// Verify example
interface User {
	UserId: number;
	UserName: string;
}

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom'
};
expectType<CamelCasedProperties<User>>(result);
