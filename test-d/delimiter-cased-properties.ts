import {expectTypeOf} from 'expect-type';
import type {DelimiterCasedProperties} from '../index';

declare const foo: DelimiterCasedProperties<{helloWorld: {fooBar: string}}, '/'>;
expectTypeOf(foo).toEqualTypeOf<{'hello/world': {fooBar: string}}>();

declare const bar: DelimiterCasedProperties<Array<{helloWorld: string}>, '-'>;
expectTypeOf(bar).toEqualTypeOf<Array<{helloWorld: string}>>();

declare const fooBar: DelimiterCasedProperties<() => {a: string}, '-'>;
expectTypeOf(fooBar).toEqualTypeOf<() => {a: string}>();

// Verify example
type User = {
	userId: number;
	userName: string;
};
const result: DelimiterCasedProperties<User, '-'> = {
	'user-id': 1,
	'user-name': 'Tom',
};
expectTypeOf(result).toEqualTypeOf<DelimiterCasedProperties<User, '-'>>();
