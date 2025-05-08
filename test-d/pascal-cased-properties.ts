import {expectType} from 'tsd';
import type {PascalCasedProperties} from '../index.d.ts';

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

declare const baz: PascalCasedProperties<{fooBAR: number; BARFoo: string}, {preserveConsecutiveUppercase: true}>;
expectType<{FooBAR: number; BARFoo: string}>(baz);

declare const biz: PascalCasedProperties<{fooBAR: number; BARFoo: string}>;
expectType<{FooBar: number; BarFoo: string}>(biz);
