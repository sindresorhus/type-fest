import {expectTypeOf} from 'nz';
import type {RemovePrefix} from '../source/remove-prefix.d.ts';

expectTypeOf<RemovePrefix<'on-change', 'on-'>>().toBe<'change'>();
expectTypeOf<RemovePrefix<'handleClick', 'handle'>>().toBe<'Click'>();
expectTypeOf<RemovePrefix<'.vscode', '.'>>().toBe<'vscode'>();
expectTypeOf<RemovePrefix<' whitespace', ' '>>().toBe<'whitespace'>();

// Prefix not present
expectTypeOf<RemovePrefix<'', 'foo'>>().toBe<''>();
expectTypeOf<RemovePrefix<'on-mouse-move', 'click'>>().toBe<'on-mouse-move'>();

// Empty prefix
expectTypeOf<RemovePrefix<'baz', ''>>().toBe<'baz'>();

// Prefix completely matches the input string
expectTypeOf<RemovePrefix<'click', 'click'>>().toBe<''>();

// Prefix partially matches the input string
expectTypeOf<RemovePrefix<'foobar', 'foobaz'>>().toBe<'foobar'>();
expectTypeOf<RemovePrefix<'hello', 'helloworld'>>().toBe<'hello'>();

// Multiple occurrences of prefix (should only remove from start)
expectTypeOf<RemovePrefix<'bar-bar-bar-foo', 'bar-'>>().toBe<'bar-bar-foo'>();
expectTypeOf<RemovePrefix<'foofoofoo', 'foo'>>().toBe<'foofoo'>();

// === Non-literals ===

// Input: Non-literal, Prefix: Literal
expectTypeOf<RemovePrefix<`hover:${string}`, 'hover:'>>().toBe<string>();
expectTypeOf<RemovePrefix<`on${Capitalize<string>}`, 'on'>>().toBe<Capitalize<string>>();
expectTypeOf<RemovePrefix<`id-${number}`, 'id-'>>().toBe<`${number}`>();
expectTypeOf<RemovePrefix<`--${string}--`, '--'>>().toBe<`${string}--`>();
expectTypeOf<RemovePrefix<`hover:focus:${string}`, 'hover:'>>().toBe<`focus:${string}`>();
expectTypeOf<RemovePrefix<`user_${string}`, 'admin_'>>().toBe<`user_${string}`>();
expectTypeOf<RemovePrefix<string, 'on'>>().toBe<string>();
expectTypeOf<RemovePrefix<`${string}/${number}`, 'foo'>>().toBe<`${string}/${number}`>();

// Input: Literal, Prefix: Non-literal
expectTypeOf<RemovePrefix<'on-click', `${string}-`>>().toBe<string>();
expectTypeOf<RemovePrefix<'hover:flex', string>>().toBe<string>();
expectTypeOf<RemovePrefix<':foo:bar:baz', any>>().toBe<string>();
expectTypeOf<RemovePrefix<'handle-click', Uppercase<string>>>().toBe<string>();
expectTypeOf<RemovePrefix<'on-change', `${string}--`>>().toBe<string>();

// Input: Non-literal, Prefix: Non-literal
expectTypeOf<RemovePrefix<`hover:${string}`, `${string}:`>>().toBe<string>();
expectTypeOf<RemovePrefix<`${string}/${number}`, `${string}/`>>().toBe<string>();
expectTypeOf<RemovePrefix<string, string>>().toBe<string>();
expectTypeOf<RemovePrefix<`${any}foo${any}bar`, any>>().toBe<string>();
expectTypeOf<RemovePrefix<`${string}/${number}`, `${string}:`>>().toBe<string>();
expectTypeOf<RemovePrefix<`${number}:${number}`, `-${string}`>>().toBe<string>();

// Unions
expectTypeOf<RemovePrefix<'on-click' | 'on-hover' | 'on-change', 'on-'>>().toBe<'click' | 'hover' | 'change'>();
expectTypeOf<RemovePrefix<'on-click' | 'on-hover' | 'handle-change', 'on-'>>().toBe<'click' | 'hover' | 'handle-change'>();
expectTypeOf<RemovePrefix<`id-${Uppercase<string>}` | `id-${number}`, 'id-'>>().toBe<Uppercase<string> | `${number}`>();
expectTypeOf<RemovePrefix<`hover:${string}` | `focus:${string}`, `${string}:`>>().toBe<string>();

expectTypeOf<RemovePrefix<'on-change', 'on' | 'on-'>>().toBe<'-change' | 'change'>();
expectTypeOf<RemovePrefix<'on-change', 'on-' | 'handle-'>>().toBe<'change' | 'on-change'>();
expectTypeOf<RemovePrefix<'on-change', 'off-' | 'handle-'>>().toBe<'on-change'>();
expectTypeOf<RemovePrefix<'on-change', `${string}-` | 'on'>>().toBe<string>();

expectTypeOf<RemovePrefix<'on:change' | 'onChange', `${string}-`>>().toBe<string>();
expectTypeOf<RemovePrefix<'get-name' | 'set-age' | 'other', 'get-' | 'set-'>>().toBe<'name' | 'get-name' | 'age' | 'set-age' | 'other'>();
expectTypeOf<RemovePrefix<`id:${Uppercase<string>}` | `id/${number}`, `${string}:` | `${string}/`>>().toBe<string>();

// Boundary types
expectTypeOf<RemovePrefix<any, 'foo'>>().toBe<any>();
expectTypeOf<RemovePrefix<never, 'foo'>>().toBe<never>();
expectTypeOf<RemovePrefix<'on-change', any>>().toBe<string>();
expectTypeOf<RemovePrefix<'on-change', never>>().toBe<'on-change'>();

// === strict: false ===

// No effect if `Prefix` is a literal
expectTypeOf<RemovePrefix<'on-change', 'on-', {strict: false}>>().toBe<'change'>();
expectTypeOf<RemovePrefix<'on-change' | 'on-hover', 'on-', {strict: false}>>().toBe<'change' | 'hover'>();
expectTypeOf<RemovePrefix<`handle${Capitalize<string>}`, 'handle', {strict: false}>>().toBe<Capitalize<string>>();
expectTypeOf<RemovePrefix<':foo:bar:baz', any, {strict: false}>>().toBe<'foo:bar:baz'>();

expectTypeOf<RemovePrefix<'on-click', `${string}-`, {strict: false}>>().toBe<'click'>();
expectTypeOf<RemovePrefix<'hover:flex', string, {strict: false}>>().toBe<'over:flex'>();
expectTypeOf<RemovePrefix<`${string}/${number}`, `${string}/`, {strict: false}>>().toBe<`${number}`>();
expectTypeOf<RemovePrefix<'on-change', `${string}--`, {strict: false}>>().toBe<'on-change'>();
expectTypeOf<RemovePrefix<`${string}/${number}`, `${string}:`, {strict: false}>>().toBe<`${string}/${number}`>();
expectTypeOf<RemovePrefix<'on-change', `${string}-` | 'on', {strict: false}>>().toBe<'change' | '-change'>();
expectTypeOf<RemovePrefix<'on:change' | 'on-change', `${string}-`, {strict: false}>>().toBe<'on:change' | 'change'>();
expectTypeOf<RemovePrefix<`id:${Uppercase<string>}` | `id/${number}`, `${string}:` | `${string}/`, {strict: false}>>().toBe<Uppercase<string> | `id:${Uppercase<string>}` | `${number}` | `id/${number}`>();
expectTypeOf<RemovePrefix<`${any}foo${any}bar`, any, {strict: false}>>().toBe<`foo${any}bar`>();
expectTypeOf<RemovePrefix<`${string}foo${string}bar`, any, {strict: false}>>().toBe<`foo${string}bar`>();

// Generic assignability test
type Assignability<S extends string> = S;
// Output of `RemovePrefix` should be assignable to `string`.
type Test1<S extends string, Prefix extends string> = Assignability<RemovePrefix<S, Prefix>>;
type Test2<S extends Uppercase<string>, Prefix extends '-' | '/' | '#'> = Assignability<RemovePrefix<S, Prefix>>;
