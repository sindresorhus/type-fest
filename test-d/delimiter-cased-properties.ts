import {expectTypeOf} from 'nz';
import type {DelimiterCasedProperties} from '../index.d.ts';

declare const foo: DelimiterCasedProperties<{helloWorld: {fooBar: string}}, '/'>;
expectTypeOf(foo).toBe<{'hello/world': {fooBar: string}}>();

declare const bar: DelimiterCasedProperties<Array<{helloWorld: string}>, '-'>;
expectTypeOf(bar).toBe<Array<{helloWorld: string}>>();

declare const fooBar: DelimiterCasedProperties<() => {a: string}, '-'>;
expectTypeOf(fooBar).toBe<() => {a: string}>();

declare const withOptions: DelimiterCasedProperties<{helloWorld1: {fooBar: string}}, '.', {splitOnNumbers: true}>;
expectTypeOf(withOptions).toBe<{'hello.world.1': {fooBar: string}}>();

declare const withPunctuation: DelimiterCasedProperties<{'hello@World1': {'foo::Bar': string}}, '.'>;
expectTypeOf(withPunctuation).toBe<{'hello@world1': {'foo::Bar': string}}>();

declare const withPunctuationSplit: DelimiterCasedProperties<{'hello@World1': {'foo::Bar': string}}, '.', {splitOnPunctuation: true}>;
expectTypeOf(withPunctuationSplit).toBe<{'hello.world1': {'foo::Bar': string}}>();

declare const withPunctuationSplitAndNumbers: DelimiterCasedProperties<{'hello@World1': {'foo::Bar': string}}, '.', {splitOnPunctuation: true; splitOnNumbers: true}>;
expectTypeOf(withPunctuationSplitAndNumbers).toBe<{'hello.world.1': {'foo::Bar': string}}>();

declare const startsWithPunctuation: DelimiterCasedProperties<{'^fooBarBaz': {'^foo_bar_baz': string}}, ':'>;
expectTypeOf(startsWithPunctuation).toBe<{'^foo:bar:baz': {'^foo_bar_baz': string}}>();

declare const startsWithPunctuationSameAsDelimiter: DelimiterCasedProperties<{'#fooBarBaz': {'#foo_bar_baz': string}}, '#'>;
expectTypeOf(startsWithPunctuationSameAsDelimiter).toBe<{'#foo#bar#baz': {'#foo_bar_baz': string}}>();

declare const emptyStringDelimiter: DelimiterCasedProperties<{'fooBarBaz': {'foo_bar_baz': string}}, ''>;
expectTypeOf(emptyStringDelimiter).toBe<{'foobarbaz': {'foo_bar_baz': string}}>();

declare const moreThanOneLengthDelimiter: DelimiterCasedProperties<{'fooBarBaz': {'foo_bar_baz': string}}, '__'>;
expectTypeOf(moreThanOneLengthDelimiter).toBe<{'foo__bar__baz': {'foo_bar_baz': string}}>();

declare const moreThanOneLengthDelimiter1: DelimiterCasedProperties<{'fooBarBaz': {'foo_bar_baz': string}}, '-->'>;
expectTypeOf(moreThanOneLengthDelimiter1).toBe<{'foo-->bar-->baz': {'foo_bar_baz': string}}>();

// Verify example
type User = {
	userId: number;
	userName: string;
};

type UserPunctuated = {
	'user::Id': number;
	'user::Name': string;
};

const result: DelimiterCasedProperties<User, '-'> = {
	'user-id': 1,
	'user-name': 'Tom',
};
expectTypeOf(result).toBe<DelimiterCasedProperties<User, '-'>>();
expectTypeOf(result).toBe<DelimiterCasedProperties<UserPunctuated, '-', {splitOnPunctuation: true}>>();
