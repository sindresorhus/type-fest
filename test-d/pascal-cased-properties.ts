import {expectTypeOf} from 'expect-type';
import type {PascalCasedProperties} from '../index';

declare const foo: PascalCasedProperties<{helloWorld: {fooBar: string}}>;
expectTypeOf(foo).toEqualTypeOf<{HelloWorld: {fooBar: string}}>();

declare const bar: PascalCasedProperties<Array<{helloWorld: string}>>;
expectTypeOf(bar).toEqualTypeOf<Array<{helloWorld: string}>>();

declare const fooBar: PascalCasedProperties<() => {a: string}>;
expectTypeOf(fooBar).toEqualTypeOf<() => {a: string}>();

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: PascalCasedProperties<User> = {
	UserId: 1,
	UserName: 'Tom',
};
expectTypeOf(result).toEqualTypeOf<PascalCasedProperties<User>>();
