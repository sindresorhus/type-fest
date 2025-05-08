import {expectType} from 'tsd';
import type {DelimiterCasedProperties} from '../index.d.ts';

declare const foo: DelimiterCasedProperties<{helloWorld: {fooBar: string}}, '/'>;
expectType<{'hello/world': {fooBar: string}}>(foo);

declare const bar: DelimiterCasedProperties<Array<{helloWorld: string}>, '-'>;
expectType<Array<{helloWorld: string}>>(bar);

declare const fooBar: DelimiterCasedProperties<() => {a: string}, '-'>;
expectType<() => {a: string}>(fooBar);

declare const withOptions: DelimiterCasedProperties<{helloWorld1: {fooBar: string}}, '.', {splitOnNumbers: true}>;
expectType<{'hello.world.1': {fooBar: string}}>(withOptions);

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: DelimiterCasedProperties<User, '-'> = {
	'user-id': 1,
	'user-name': 'Tom',
};
expectType<DelimiterCasedProperties<User, '-'>>(result);
