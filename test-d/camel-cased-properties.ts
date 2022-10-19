import {expectTypeOf} from 'expect-type';
import type {CamelCasedProperties} from '../index';

declare const foo: CamelCasedProperties<{A: number; B: {C: string}}>;

expectTypeOf(foo).toEqualTypeOf<{a: number; b: {C: string}}>();

declare const bar: CamelCasedProperties<Array<{helloWorld: string}>>;
expectTypeOf(bar).toEqualTypeOf<Array<{helloWorld: string}>>();

declare const fooBar: CamelCasedProperties<() => {a: string}>;
expectTypeOf(fooBar).toEqualTypeOf<() => {a: string}>();

// Verify example
type User = {
	UserId: number;
	UserName: string;
};

const result: CamelCasedProperties<User> = {
	userId: 1,
	userName: 'Tom',
};
expectTypeOf(result).toEqualTypeOf<CamelCasedProperties<User>>();
