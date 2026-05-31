import {expectType} from 'tsd';
import type {RemoveSuffix} from '../source/remove-suffix.d.ts';

expectType<'report'>({} as RemoveSuffix<'report.pdf', '.pdf'>);
expectType<'handle'>({} as RemoveSuffix<'handleClick', 'Click'>);
expectType<'50'>({} as RemoveSuffix<'50px', 'px'>);
expectType<'whitespace'>({} as RemoveSuffix<'whitespace ', ' '>);

// Suffix not present
expectType<''>({} as RemoveSuffix<'', 'foo'>);
expectType<'report.pdf'>({} as RemoveSuffix<'report.pdf', '.txt'>);

// Empty suffix
expectType<'baz'>({} as RemoveSuffix<'baz', ''>);

// Suffix completely matches the input string
expectType<''>({} as RemoveSuffix<'click', 'click'>);

// Suffix partially matches the input string
expectType<'foobar'>({} as RemoveSuffix<'foobar', 'barbaz'>);
expectType<'hello'>({} as RemoveSuffix<'hello', 'helloworld'>);

// Multiple occurrences of suffix (should only remove from end)
expectType<'foo-bar-bar'>({} as RemoveSuffix<'foo-bar-bar-bar', '-bar'>);
expectType<'foofoo'>({} as RemoveSuffix<'foofoofoo', 'foo'>);

// === Non-literals ===

// Input: Non-literal, Suffix: Literal
expectType<string>({} as RemoveSuffix<`${string}.ts`, '.ts'>);
expectType<Capitalize<string>>({} as RemoveSuffix<`${Capitalize<string>}Action`, 'Action'>);
expectType<`${number}`>({} as RemoveSuffix<`${number}rem`, 'rem'>);
expectType<`--${string}`>({} as RemoveSuffix<`--${string}--`, '--'>);
expectType<`${string}--disabled`>({} as RemoveSuffix<`${string}--disabled--loading`, '--loading'>);
expectType<`${string}_user`>({} as RemoveSuffix<`${string}_user`, '_admin'>);
expectType<string>({} as RemoveSuffix<string, 'Action'>);
expectType<`${string}/${number}`>({} as RemoveSuffix<`${string}/${number}`, 'foo'>);

// Input: Literal, Suffix: Non-literal
expectType<string>({} as RemoveSuffix<'report.pdf', `.${string}`>);
expectType<string>({} as RemoveSuffix<'100s', string>);
expectType<string>({} as RemoveSuffix<'foo:bar:baz:', any>);
expectType<string>({} as RemoveSuffix<'report.pdf', Uppercase<string>>);
expectType<string>({} as RemoveSuffix<'user-id', `--${string}`>);

// Input: Non-literal, Suffix: Non-literal
expectType<string>({} as RemoveSuffix<`${string}--disabled`, `--${string}`>);
expectType<string>({} as RemoveSuffix<`${number}/${string}`, `/${string}`>);
expectType<string>({} as RemoveSuffix<string, string>);
expectType<string>({} as RemoveSuffix<`foo${any}bar${any}`, any>);
expectType<string>({} as RemoveSuffix<`${number}/${string}`, `:${string}`>);
expectType<string>({} as RemoveSuffix<`${number}:${number}`, `${string}-`>);

// Unions
expectType<'foo' | 'bar' | 'baz'>({} as RemoveSuffix<'foo.ts' | 'bar.ts' | 'baz.ts', '.ts'>);
expectType<'foo' | 'bar' | 'baz.js'>({} as RemoveSuffix<'foo.ts' | 'bar.ts' | 'baz.js', '.ts'>);
expectType<Uppercase<string> | `${number}`>({} as RemoveSuffix<`${Uppercase<string>}Action` | `${number}Action`, 'Action'>);
expectType<string>({} as RemoveSuffix<`${string}--disabled` | `${string}--loading`, `--${string}`>);

expectType<'foo.' | 'foo'>({} as RemoveSuffix<'foo.png', 'png' | '.png'>);
expectType<'foo' | 'foo.png'>({} as RemoveSuffix<'foo.png', '.png' | '.jpeg'>);
expectType<'user' | 'user-id'>({} as RemoveSuffix<'user-id', '-id' | '-handle'>);
expectType<'user-id'>({} as RemoveSuffix<'user-id', '-name' | '-age'>);
expectType<string>({} as RemoveSuffix<'user-id', `-${string}` | 'id'>);

expectType<string>({} as RemoveSuffix<'click_button' | 'clickButton', `:${string}`>);
expectType<'index.html' | 'styles.css' | 'styles' | 'main.js' | 'main'>(
	{} as RemoveSuffix<'index.html' | 'styles.css' | 'main.js', '.css' | '.js'>,
);
expectType<string>({} as RemoveSuffix<`${Lowercase<string>}.end` | `${number}/end`, `.${string}` | `/${string}`>);

// Boundary types
expectType<any>({} as RemoveSuffix<any, 'foo'>);
expectType<never>({} as RemoveSuffix<never, 'foo'>);
expectType<string>({} as RemoveSuffix<'report.pdf', any>);
expectType<'report.pdf'>({} as RemoveSuffix<'report.pdf', never>);

// === strict: false ===

// No effect if `Suffix` is a literal
expectType<'report'>({} as RemoveSuffix<'report.pdf', '.pdf', {strict: false}>);
expectType<'foo' | 'bar'>({} as RemoveSuffix<'foo.js' | 'bar.js', '.js', {strict: false}>);
expectType<Capitalize<string>>({} as RemoveSuffix<`${Capitalize<string>}Action`, 'Action', {strict: false}>);

expectType<'report'>({} as RemoveSuffix<'report.pdf', `.${string}`, {strict: false}>);
expectType<'r'>({} as RemoveSuffix<'report.pdf', string, {strict: false}>);
expectType<`${number}`>({} as RemoveSuffix<`${number}/${string}`, `/${string}`, {strict: false}>);
expectType<'report.pdf'>({} as RemoveSuffix<'report.pdf', `..${string}` | 'name', {strict: false}>);
expectType<`${number}/${string}`>({} as RemoveSuffix<`${number}/${string}`, `:${string}`, {strict: false}>);
expectType<'report' | 'report.'>({} as RemoveSuffix<'report.pdf', `.${string}` | 'pdf', {strict: false}>);
expectType<'flex' | 'btn'>({} as RemoveSuffix<'flex' | 'btn__disabled', `__${string}`, {strict: false}>);
expectType<Uppercase<string> | `${Uppercase<string>}:id` | `${number}` | `${number}/id`>(
	{} as RemoveSuffix<`${Uppercase<string>}:id` | `${number}/id`, `:${string}` | `/${string}`, {strict: false}>,
);

// Generic assignability test
type Assignability<S extends string> = S;
// Output of `RemoveSuffix` should be assignable to `string`.
type Test1<S extends string, Suffix extends string> = Assignability<RemoveSuffix<S, Suffix>>;
type Test2<S extends Uppercase<string>, Suffix extends '-' | '/' | '#'> = Assignability<RemoveSuffix<S, Suffix>>;
