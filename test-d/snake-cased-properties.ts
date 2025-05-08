import {expectType} from 'tsd';
import type {SnakeCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};

declare const foo: SnakeCasedProperties<Foobar>;
expectType<{hello_world1: {fooBar: string}}>(foo);

declare const bar: SnakeCasedProperties<Foobar, {splitOnNumbers: true}>;
expectType<{hello_world_1: {fooBar: string}}>(bar);

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: SnakeCasedProperties<User> = {
	user_id: 1,
	user_name: 'Tom',
};
expectType<SnakeCasedProperties<User>>(result);
