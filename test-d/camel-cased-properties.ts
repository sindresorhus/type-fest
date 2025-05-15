import {expectType} from 'tsd';
import type {CamelCasedProperties} from '../index.d.ts';

declare const foo: CamelCasedProperties<{A: number; B: {C: string}}>;
expectType<{a: number; b: {C: string}}>(foo);

declare const bar: CamelCasedProperties<Array<{helloWorld: string}>>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: CamelCasedProperties<() => {a: string}>;
expectType<() => {a: string}>(fooBar);

declare const baz: CamelCasedProperties<{fooBAR: number; BARFoo: string}, {preserveConsecutiveUppercase: true}>;
expectType<{fooBAR: number; bARFoo: string}>(baz);

declare const biz: CamelCasedProperties<{fooBAR: number; BARFoo: string}>;
expectType<{fooBar: number; barFoo: string}>(biz);

// Verify example
type User = {
	UserId: number;
	UserName: string;
};

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom',
};
expectType<CamelCasedProperties<User>>(result);
