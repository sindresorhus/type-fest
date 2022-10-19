import {expectTypeOf} from 'expect-type';
import type {SnakeCasedProperties} from '../index';

declare const foo: SnakeCasedProperties<{helloWorld: {fooBar: string}}>;
expectTypeOf(foo).toEqualTypeOf<{hello_world: {fooBar: string}}>();

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};
expectTypeOf(result).toEqualTypeOf<SnakeCasedProperties<User>>();
