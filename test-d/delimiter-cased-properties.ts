import {expectTypeOf} from 'nz';
import type {WordsOptions} from '../source/words.d.ts';
import type {DelimiterCasedProperties, Opaque, Tagged} from '../index.d.ts';

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

// Generic options cannot delay values that are returned unchanged.
function _keepValue<Options extends WordsOptions>(value: readonly string[]): DelimiterCasedProperties<readonly string[], '-', Options> {
	return value;
}

function _keepCallable<Options extends WordsOptions>(value: () => number): DelimiterCasedProperties<() => number, '-', Options> {
	return value;
}

// A delimiter union produces alternative object shapes, not every spelling at once.
expectTypeOf<{'foo-bar': 1}>().toBeAssignableTo<DelimiterCasedProperties<{fooBar: 1}, '-' | '_'>>();
expectTypeOf<{foo_bar: 1}>().toBeAssignableTo<DelimiterCasedProperties<{fooBar: 1}, '-' | '_'>>();

// Delimiter choices stay correlated across sibling keys and preserve modifiers.
expectTypeOf<DelimiterCasedProperties<{readonly fooBar: 1; bazQux?: 2}, '-' | '_'>>().toBe<{readonly 'foo-bar': 1; 'baz-qux'?: 2} | {readonly foo_bar: 1; baz_qux?: 2}>();
expectTypeOf<{'foo-bar': 1; baz_qux: 2}>().not.toBeAssignableTo<DelimiterCasedProperties<{fooBar: 1; bazQux: 2}, '-' | '_'>>();
expectTypeOf<DelimiterCasedProperties<{fooBar: 1}, Tagged<'-' | '_', 'Delimiter'>>>().toBe<{'foo-bar': 1} | {foo_bar: 1}>();
expectTypeOf<DelimiterCasedProperties<{fooBar: 1}, Opaque<'-', 'Delimiter'> | ''>>().toBe<{'foo-bar': 1} | {foobar: 1}>();
expectTypeOf<DelimiterCasedProperties<{fooBar: Tagged<1, 'Value'>}, '-' | '_'>>().toBe<{'foo-bar': Tagged<1, 'Value'>} | {foo_bar: Tagged<1, 'Value'>}>();
expectTypeOf<DelimiterCasedProperties<{fooBar: 1}, ('-' | '_') & {readonly brand: true}>>().toBe<{'foo-bar': 1} | {foo_bar: 1}>();
expectTypeOf<DelimiterCasedProperties<{fooBar1: 1}, '-' | '_', {splitOnNumbers: true}>>().toBe<{'foo-bar-1': 1} | {foo_bar_1: 1}>();
expectTypeOf<DelimiterCasedProperties<{fooBar: 1} | {bazQux: 2}, '-' | '_'>>().toBe<{'foo-bar': 1} | {foo_bar: 1} | {'baz-qux': 2} | {baz_qux: 2}>();
expectTypeOf<DelimiterCasedProperties<never, '-' | '_'>>().toBe<never>();
expectTypeOf<{}>().toBeAssignableTo<DelimiterCasedProperties<unknown, '-' | '_'>>();
expectTypeOf<DelimiterCasedProperties<unknown, '-' | '_'>>().toBeAssignableTo<{}>();
expectTypeOf<DelimiterCasedProperties<{fooBar: any; bazQux: never}, '-' | '_'>>().toBe<{'foo-bar': any; 'baz-qux': never} | {foo_bar: any; baz_qux: never}>();
expectTypeOf<DelimiterCasedProperties<{fooBar: 1; 0: 2; [Symbol.iterator]: 3}, never>>().toBe<{0: 2; [Symbol.iterator]: 3}>();
expectTypeOf<DelimiterCasedProperties<readonly [string, number?], never>>().toBe<readonly [string, number?]>();
expectTypeOf<DelimiterCasedProperties<{fooBar: 1}, '-' | '_', never>>().toBe<DelimiterCasedProperties<{fooBar: 1}, '-' | '_'>>();
// @ts-expect-error Delimiters must be strings.
type InvalidDelimiter = DelimiterCasedProperties<{fooBar: 1}, unknown>;

// Generic delimiters and options must not delay unchanged leaves or containers.
function _keepArrayWithDelimiter<Delimiter extends string, Options extends WordsOptions>(value: readonly string[]): {value: DelimiterCasedProperties<readonly string[], Delimiter, Options>} {
	return {value};
}

function _keepCallableWithDelimiter<Delimiter extends string, Options extends WordsOptions>(value: () => number): {value: DelimiterCasedProperties<() => number, Delimiter, Options>} {
	return {value};
}

expectTypeOf<DelimiterCasedProperties<any, '-' | '_'>>().toBe<any>();
expectTypeOf<DelimiterCasedProperties<{fooBar: 1}, Tagged<Tagged<'-', 'Inner'>, 'Outer'> | '_'>>().toBe<{'foo-bar': 1} | {foo_bar: 1}>();
