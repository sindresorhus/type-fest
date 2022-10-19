import {expectTypeOf} from 'expect-type';
import type {KebabCasedProperties} from '../index';

declare const foo: KebabCasedProperties<{helloWorld: {fooBar: string}}>;
expectTypeOf(foo).toEqualTypeOf<{'hello-world': {fooBar: string}}>();

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom',
};
expectTypeOf(result).toEqualTypeOf<KebabCasedProperties<User>>();
