import {expectType} from 'tsd';
import type {KebabCasedProperties} from '../index.d.ts';

type Foobar = {helloWorld1: {fooBar: string}};

declare const foo: KebabCasedProperties<Foobar>;
expectType<{'hello-world1': {fooBar: string}}>(foo);

declare const bar: KebabCasedProperties<Foobar, {splitOnNumbers: true}>;
expectType<{'hello-world-1': {fooBar: string}}>(bar);

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: KebabCasedProperties<User> = {
	'user-id': 1,
	'user-name': 'Tom',
};
expectType<KebabCasedProperties<User>>(result);
