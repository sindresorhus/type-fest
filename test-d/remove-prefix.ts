import {expectType} from 'tsd';
import type {RemovePrefix} from '../source/remove-prefix.d.ts';

expectType<'change'>({} as RemovePrefix<'on-change', 'on-'>);
expectType<'Click'>({} as RemovePrefix<'handleClick', 'handle'>);
expectType<'vscode'>({} as RemovePrefix<'.vscode', '.'>);
expectType<'whitespace'>({} as RemovePrefix<' whitespace', ' '>);

// Prefix not present
expectType<''>({} as RemovePrefix<'', 'foo'>);
expectType<'on-mouse-move'>({} as RemovePrefix<'on-mouse-move', 'click'>);

// Empty prefix
expectType<'baz'>({} as RemovePrefix<'baz', ''>);

// Prefix completely matches the input string
expectType<''>({} as RemovePrefix<'click', 'click'>);

// Prefix partially matches the input string
expectType<'foobar'>({} as RemovePrefix<'foobar', 'foobaz'>);
expectType<'hello'>({} as RemovePrefix<'hello', 'helloworld'>);

// Multiple occurrences of prefix (should only remove from start)
expectType<'bar-bar-foo'>({} as RemovePrefix<'bar-bar-bar-foo', 'bar-'>);
expectType<'foofoo'>({} as RemovePrefix<'foofoofoo', 'foo'>);

// === Non-literals ===

// Input: Non-literal, Prefix: Literal
expectType<string>({} as RemovePrefix<`hover:${string}`, 'hover:'>);
expectType<Capitalize<string>>({} as RemovePrefix<`on${Capitalize<string>}`, 'on'>);
expectType<`${number}`>({} as RemovePrefix<`id-${number}`, 'id-'>);
expectType<`${string}--`>({} as RemovePrefix<`--${string}--`, '--'>);
expectType<`focus:${string}`>({} as RemovePrefix<`hover:focus:${string}`, 'hover:'>);
expectType<`user_${string}`>({} as RemovePrefix<`user_${string}`, 'admin_'>);
expectType<string>({} as RemovePrefix<string, 'on'>);
expectType<`${string}/${number}`>({} as RemovePrefix<`${string}/${number}`, 'foo'>);

// Input: Literal, Prefix: Non-literal
expectType<string>({} as RemovePrefix<'on-click', `${string}-`>);
expectType<string>({} as RemovePrefix<'hover:flex', string>);
expectType<'handle-click'>({} as RemovePrefix<'handle-click', Uppercase<string>>);
expectType<'on-change'>({} as RemovePrefix<'on-change', `${string}--`>);

// Input: Non-literal, Prefix: Non-literal
expectType<string>({} as RemovePrefix<`hover:${string}`, `${string}:`>);
expectType<string>({} as RemovePrefix<`${string}/${number}`, `${string}/`>);
expectType<string>({} as RemovePrefix<string, string>);
expectType<`${string}/${number}`>({} as RemovePrefix<`${string}/${number}`, `${string}:`>);
expectType<`${number}:${number}`>({} as RemovePrefix<`${number}:${number}`, `-${string}`>);

// Unions
expectType<'click' | 'hover' | 'change'>({} as RemovePrefix<'on-click' | 'on-hover' | 'on-change', 'on-'>);
expectType<'click' | 'hover' | 'handle-change'>({} as RemovePrefix<'on-click' | 'on-hover' | 'handle-change', 'on-'>);
expectType<Uppercase<string> | `${number}`>({} as RemovePrefix<`id-${Uppercase<string>}` | `id-${number}`, 'id-'>);
expectType<string>({} as RemovePrefix<`hover:${string}` | `focus:${string}`, `${string}:`>);

expectType<'-change' | 'change'>({} as RemovePrefix<'on-change', 'on' | 'on-'>);
expectType<'change' | 'on-change'>({} as RemovePrefix<'on-change', 'on-' | 'handle-'>);
expectType<'on-change'>({} as RemovePrefix<'on-change', 'off-' | 'handle-'>);
expectType<string>({} as RemovePrefix<'on-change', `${string}-` | 'on'>);

expectType<'on:change' | 'onChange'>({} as RemovePrefix<'on:change' | 'onChange', `${string}-`>);
expectType<'name' | 'get-name' | 'age' | 'set-age' | 'other'>(
	{} as RemovePrefix<'get-name' | 'set-age' | 'other', 'get-' | 'set-'>,
);
expectType<string>({} as RemovePrefix<`id:${Uppercase<string>}` | `id/${number}`, `${string}:` | `${string}/`>);

// Boundary types
expectType<any>({} as RemovePrefix<any, 'foo'>);
expectType<never>({} as RemovePrefix<never, 'foo'>);
expectType<string>({} as RemovePrefix<'on-change', any>);
expectType<'on-change'>({} as RemovePrefix<'on-change', never>);

// === strict: false ===

// No effect if `Prefix` is a literal
expectType<'change'>({} as RemovePrefix<'on-change', 'on-', {strict: false}>);
expectType<'change' | 'hover'>({} as RemovePrefix<'on-change' | 'on-hover', 'on-', {strict: false}>);
expectType<Capitalize<string>>({} as RemovePrefix<`handle${Capitalize<string>}`, 'handle', {strict: false}>);

expectType<'click'>({} as RemovePrefix<'on-click', `${string}-`, {strict: false}>);
expectType<'over:flex'>({} as RemovePrefix<'hover:flex', string, {strict: false}>);
expectType<`${number}`>({} as RemovePrefix<`${string}/${number}`, `${string}/`, {strict: false}>);
expectType<'change' | '-change'>({} as RemovePrefix<'on-change', `${string}-` | 'on', {strict: false}>);
expectType<'on:change' | 'change'>({} as RemovePrefix<'on:change' | 'on-change', `${string}-`, {strict: false}>);
expectType<Uppercase<string> | `id:${Uppercase<string>}` | `${number}` | `id/${number}`>(
	{} as RemovePrefix<`id:${Uppercase<string>}` | `id/${number}`, `${string}:` | `${string}/`, {strict: false}>,
);

// Generic assignability test
type Assignability<S extends string> = S;
// Output of `RemovePrefix` should be assignable to `string`.
type Test1<S extends string, Prefix extends string> = Assignability<RemovePrefix<S, Prefix>>;
type Test2<S extends Uppercase<string>, Prefix extends '-' | '/' | '#'> = Assignability<RemovePrefix<S, Prefix>>;
