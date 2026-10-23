import {expectTypeOf} from 'nz';
import type {Opaque, Tagged} from '../index.d.ts';
import type {RemovePrefix, RemovePrefixOptions} from '../source/remove-prefix.d.ts';

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
// A failed template match cannot prove that an unknown input part lacks the affix.
expectTypeOf<RemovePrefix<`user_${string}`, 'admin_'>>().toBe<string>();
expectTypeOf<RemovePrefix<string, 'on'>>().toBe<string>();
expectTypeOf<RemovePrefix<`${string}/${number}`, 'foo'>>().toBe<string>();

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
expectTypeOf<RemovePrefix<`${string}/${number}`, `${string}:`, {strict: false}>>().toBe<string>();
expectTypeOf<RemovePrefix<'on-change', `${string}-` | 'on', {strict: false}>>().toBe<'change' | '-change'>();
expectTypeOf<RemovePrefix<'on:change' | 'on-change', `${string}-`, {strict: false}>>().toBe<'on:change' | 'change'>();
expectTypeOf<RemovePrefix<`id:${Uppercase<string>}` | `id/${number}`, `${string}:` | `${string}/`, {strict: false}>>().toBe<string>();
expectTypeOf<RemovePrefix<`${any}foo${any}bar`, any, {strict: false}>>().toBe<`foo${any}bar`>();
expectTypeOf<RemovePrefix<`${string}foo${string}bar`, any, {strict: false}>>().toBe<`foo${string}bar`>();

// Generic assignability test
type Assignability<S extends string> = S;
// Output of `RemovePrefix` should be assignable to `string`.
type Test1<S extends string, Prefix extends string> = Assignability<RemovePrefix<S, Prefix>>;
type Test2<S extends Uppercase<string>, Prefix extends '-' | '/' | '#'> = Assignability<RemovePrefix<S, Prefix>>;

// A brand on the input or affix does not change its characters.
expectTypeOf<RemovePrefix<Tagged<'on-change', 'Text'>, 'on-'>>().toBe<'change'>();
expectTypeOf<RemovePrefix<'on-change', Tagged<'on-', 'Affix'>>>().toBe<'change'>();

expectTypeOf<RemovePrefix<Tagged<'on-change', 'Text'>, 'off-'>>().toBe<Tagged<'on-change', 'Text'>>();
expectTypeOf<RemovePrefix<Tagged<'on-change', 'Text'>, never>>().toBe<Tagged<'on-change', 'Text'>>();
expectTypeOf<RemovePrefix<Tagged<'on-change' | 'off-change', 'Text'>, 'on-'>>().toBe<'change' | Tagged<'off-change', 'Text'>>();
expectTypeOf<RemovePrefix<Tagged<'on-change', 'Text'>, Tagged<'on-' | 'off-', 'Affix'>>>().toBe<'change' | Tagged<'on-change', 'Text'>>();
expectTypeOf<RemovePrefix<Tagged<`id-${number}`, 'Text'>, Tagged<'id-', 'Affix'>>>().toBe<`${number}`>();
expectTypeOf<RemovePrefix<Tagged<'on-change', 'Text'>, Tagged<`${string}-`, 'Affix'>, {strict: false}>>().toBe<'change'>();

expectTypeOf<RemovePrefix<Opaque<'on-change', 'Text'>, Opaque<'on-', 'Affix'>>>().toBe<'change'>();
expectTypeOf<RemovePrefix<Tagged<Tagged<'on-change', 'First'>, 'Second'>, 'on-'>>().toBe<'change'>();
expectTypeOf<RemovePrefix<'on-change' & {readonly __brand: unique symbol}, 'on-'>>().toBe<'change'>();
expectTypeOf<RemovePrefix<Tagged<'on-on-change', 'Text'>, Tagged<'on-', 'Affix'>>>().toBe<'on-change'>();
expectTypeOf<RemovePrefix<Tagged<'on-', 'Text'>, Tagged<'on-', 'Affix'>>>().toBe<''>();
expectTypeOf<RemovePrefix<Tagged<'', 'Text'>, Tagged<'on-', 'Affix'>>>().toBe<Tagged<'', 'Text'>>();
expectTypeOf<RemovePrefix<Tagged<'on-change', 'Text'>, Tagged<'', 'Affix'>>>().toBe<'on-change'>();
expectTypeOf<RemovePrefix<Tagged<'on-change', 'Text'>, Tagged<`${string}-`, 'Affix'>>>().toBe<string>();
expectTypeOf<RemovePrefix<Tagged<string, 'Text'>, Tagged<'on-', 'Affix'>>>().toBe<string>();
expectTypeOf<RemovePrefix<any, Tagged<'on-', 'Affix'>>>().toBe<any>();
expectTypeOf<RemovePrefix<never, Tagged<'on-', 'Affix'>>>().toBe<never>();
// @ts-expect-error
expectTypeOf<RemovePrefix<unknown, 'on-'>>();
// @ts-expect-error
expectTypeOf<RemovePrefix<'on-change', unknown>>();

// An unknown part can contain the affix even when the whole template does not guarantee a match.
expectTypeOf<''>().toBeAssignableTo<RemovePrefix<`${string}/api`, '/api'>>();
expectTypeOf<''>().toBeAssignableTo<RemovePrefix<`${string}/api`, '/api', {strict: true}>>();
expectTypeOf<RemovePrefix<`${string}/api`, '/api'>>().toBe<string>();
expectTypeOf<RemovePrefix<`${string}/api`, '/api', {strict: true}>>().toBe<string>();

// Guaranteed matches remain precise, including numeric templates and literal alternatives.
expectTypeOf<RemovePrefix<`api/${number}` | 'plain', 'api/'>>().toBe<`${number}` | 'plain'>();
expectTypeOf<RemovePrefix<`${string}/api`, '/api' | 'other'>>().toBe<string>();
expectTypeOf<RemovePrefix<`${string}/api`, '/api', {strict: boolean}>>().toBe<string>();
expectTypeOf<RemovePrefix<`${string}/api`, never>>().toBe<`${string}/api`>();
expectTypeOf<RemovePrefix<`${string}/api`, ''>>().toBe<`${string}/api`>();
expectTypeOf<RemovePrefix<Tagged<`${string}/api`, 'Input'>, '/api'>>().toBe<string>();

function _prefixResult<Input extends string, Affix extends string, Options extends RemovePrefixOptions>(value: RemovePrefix<Input, Affix, Options>): string {
	return value;
}

function _prefixOptions<Options extends RemovePrefixOptions>(value: RemovePrefix<`api/${number}`, 'api/', Options>): `${number}` {
	return value;
}

declare function removePrefix<const Input extends string, const Affix extends string>(input: Input, affix: Affix): RemovePrefix<Input, Affix>;
expectTypeOf(removePrefix('api/value', 'api/')).toBe<'value'>();
declare const prefixInput: `${string}/api`;
expectTypeOf(removePrefix(prefixInput, '/api')).toBe<string>();

// Removing a capital can expose a lowercase first character in an unknown capitalized input.
expectTypeOf<'value'>().toBeAssignableTo<RemovePrefix<Capitalize<string>, 'A'>>();
