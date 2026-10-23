import {expectTypeOf} from 'nz';
import type {Opaque, Tagged} from '../index.d.ts';
import type {RemoveSuffix, RemoveSuffixOptions} from '../source/remove-suffix.d.ts';

expectTypeOf<RemoveSuffix<'report.pdf', '.pdf'>>().toBe<'report'>();
expectTypeOf<RemoveSuffix<'handleClick', 'Click'>>().toBe<'handle'>();
expectTypeOf<RemoveSuffix<'50px', 'px'>>().toBe<'50'>();
expectTypeOf<RemoveSuffix<'whitespace ', ' '>>().toBe<'whitespace'>();

// Suffix not present
expectTypeOf<RemoveSuffix<'', 'foo'>>().toBe<''>();
expectTypeOf<RemoveSuffix<'report.pdf', '.txt'>>().toBe<'report.pdf'>();

// Empty suffix
expectTypeOf<RemoveSuffix<'baz', ''>>().toBe<'baz'>();

// Suffix completely matches the input string
expectTypeOf<RemoveSuffix<'click', 'click'>>().toBe<''>();

// Suffix partially matches the input string
expectTypeOf<RemoveSuffix<'foobar', 'barbaz'>>().toBe<'foobar'>();
expectTypeOf<RemoveSuffix<'hello', 'helloworld'>>().toBe<'hello'>();

// Multiple occurrences of suffix (should only remove from end)
expectTypeOf<RemoveSuffix<'foo-bar-bar-bar', '-bar'>>().toBe<'foo-bar-bar'>();
expectTypeOf<RemoveSuffix<'foofoofoo', 'foo'>>().toBe<'foofoo'>();

// === Non-literals ===

// Input: Non-literal, Suffix: Literal
expectTypeOf<RemoveSuffix<`${string}.ts`, '.ts'>>().toBe<string>();
expectTypeOf<RemoveSuffix<`${Capitalize<string>}Action`, 'Action'>>().toBe<Capitalize<string>>();
expectTypeOf<RemoveSuffix<`${number}rem`, 'rem'>>().toBe<`${number}`>();
expectTypeOf<RemoveSuffix<`--${string}--`, '--'>>().toBe<`--${string}`>();
expectTypeOf<RemoveSuffix<`${string}--disabled--loading`, '--loading'>>().toBe<`${string}--disabled`>();
// A failed template match cannot prove that an unknown input part lacks the affix.
expectTypeOf<RemoveSuffix<`${string}_user`, '_admin'>>().toBe<string>();
expectTypeOf<RemoveSuffix<string, 'Action'>>().toBe<string>();
expectTypeOf<RemoveSuffix<`${string}/${number}`, 'foo'>>().toBe<string>();

// Input: Literal, Suffix: Non-literal
expectTypeOf<RemoveSuffix<'report.pdf', `.${string}`>>().toBe<string>();
expectTypeOf<RemoveSuffix<'100s', string>>().toBe<string>();
expectTypeOf<RemoveSuffix<'foo:bar:baz:', any>>().toBe<string>();
expectTypeOf<RemoveSuffix<'report.pdf', Uppercase<string>>>().toBe<string>();
expectTypeOf<RemoveSuffix<'user-id', `--${string}`>>().toBe<string>();

// Input: Non-literal, Suffix: Non-literal
expectTypeOf<RemoveSuffix<`${string}--disabled`, `--${string}`>>().toBe<string>();
expectTypeOf<RemoveSuffix<`${number}/${string}`, `/${string}`>>().toBe<string>();
expectTypeOf<RemoveSuffix<string, string>>().toBe<string>();
expectTypeOf<RemoveSuffix<`foo${any}bar${any}`, any>>().toBe<string>();
expectTypeOf<RemoveSuffix<`${number}/${string}`, `:${string}`>>().toBe<string>();
expectTypeOf<RemoveSuffix<`${number}:${number}`, `${string}-`>>().toBe<string>();

// Unions
expectTypeOf<RemoveSuffix<'foo.ts' | 'bar.ts' | 'baz.ts', '.ts'>>().toBe<'foo' | 'bar' | 'baz'>();
expectTypeOf<RemoveSuffix<'foo.ts' | 'bar.ts' | 'baz.js', '.ts'>>().toBe<'foo' | 'bar' | 'baz.js'>();
expectTypeOf<RemoveSuffix<`${Uppercase<string>}Action` | `${number}Action`, 'Action'>>().toBe<Uppercase<string> | `${number}`>();
expectTypeOf<RemoveSuffix<`${string}--disabled` | `${string}--loading`, `--${string}`>>().toBe<string>();

expectTypeOf<RemoveSuffix<'foo.png', 'png' | '.png'>>().toBe<'foo.' | 'foo'>();
expectTypeOf<RemoveSuffix<'foo.png', '.png' | '.jpeg'>>().toBe<'foo' | 'foo.png'>();
expectTypeOf<RemoveSuffix<'user-id', '-id' | '-handle'>>().toBe<'user' | 'user-id'>();
expectTypeOf<RemoveSuffix<'user-id', '-name' | '-age'>>().toBe<'user-id'>();
expectTypeOf<RemoveSuffix<'user-id', `-${string}` | 'id'>>().toBe<string>();

expectTypeOf<RemoveSuffix<'click_button' | 'clickButton', `:${string}`>>().toBe<string>();
expectTypeOf<RemoveSuffix<'index.html' | 'styles.css' | 'main.js', '.css' | '.js'>>().toBe<'index.html' | 'styles.css' | 'styles' | 'main.js' | 'main'>();
expectTypeOf<RemoveSuffix<`${Lowercase<string>}.end` | `${number}/end`, `.${string}` | `/${string}`>>().toBe<string>();

// Boundary types
expectTypeOf<RemoveSuffix<any, 'foo'>>().toBe<any>();
expectTypeOf<RemoveSuffix<never, 'foo'>>().toBe<never>();
expectTypeOf<RemoveSuffix<'report.pdf', any>>().toBe<string>();
expectTypeOf<RemoveSuffix<'report.pdf', never>>().toBe<'report.pdf'>();

// === strict: false ===

// No effect if `Suffix` is a literal
expectTypeOf<RemoveSuffix<'report.pdf', '.pdf', {strict: false}>>().toBe<'report'>();
expectTypeOf<RemoveSuffix<'foo.js' | 'bar.js', '.js', {strict: false}>>().toBe<'foo' | 'bar'>();
expectTypeOf<RemoveSuffix<`${Capitalize<string>}Action`, 'Action', {strict: false}>>().toBe<Capitalize<string>>();

expectTypeOf<RemoveSuffix<'report.pdf', `.${string}`, {strict: false}>>().toBe<'report'>();
expectTypeOf<RemoveSuffix<'report.pdf', string, {strict: false}>>().toBe<'r'>();
expectTypeOf<RemoveSuffix<`${number}/${string}`, `/${string}`, {strict: false}>>().toBe<`${number}`>();
expectTypeOf<RemoveSuffix<'report.pdf', `..${string}` | 'name', {strict: false}>>().toBe<'report.pdf'>();
expectTypeOf<RemoveSuffix<`${number}/${string}`, `:${string}`, {strict: false}>>().toBe<string>();
expectTypeOf<RemoveSuffix<'report.pdf', `.${string}` | 'pdf', {strict: false}>>().toBe<'report' | 'report.'>();
expectTypeOf<RemoveSuffix<'flex' | 'btn__disabled', `__${string}`, {strict: false}>>().toBe<'flex' | 'btn'>();
expectTypeOf<RemoveSuffix<`${Uppercase<string>}:id` | `${number}/id`, `:${string}` | `/${string}`, {strict: false}>>().toBe<string>();

// Generic assignability test
type Assignability<S extends string> = S;
// Output of `RemoveSuffix` should be assignable to `string`.
type Test1<S extends string, Suffix extends string> = Assignability<RemoveSuffix<S, Suffix>>;
type Test2<S extends Uppercase<string>, Suffix extends '-' | '/' | '#'> = Assignability<RemoveSuffix<S, Suffix>>;

// A brand on the input or affix does not change its characters.
expectTypeOf<RemoveSuffix<Tagged<'report.pdf', 'Text'>, '.pdf'>>().toBe<'report'>();
expectTypeOf<RemoveSuffix<'report.pdf', Tagged<'.pdf', 'Affix'>>>().toBe<'report'>();

expectTypeOf<RemoveSuffix<Tagged<'report.pdf', 'Text'>, '.txt'>>().toBe<Tagged<'report.pdf', 'Text'>>();
expectTypeOf<RemoveSuffix<Tagged<'report.pdf', 'Text'>, never>>().toBe<Tagged<'report.pdf', 'Text'>>();
expectTypeOf<RemoveSuffix<Tagged<'report.pdf' | 'report.txt', 'Text'>, '.pdf'>>().toBe<'report' | Tagged<'report.txt', 'Text'>>();
expectTypeOf<RemoveSuffix<Tagged<'report.pdf', 'Text'>, Tagged<'.pdf' | '.txt', 'Affix'>>>().toBe<'report' | Tagged<'report.pdf', 'Text'>>();
expectTypeOf<RemoveSuffix<Tagged<`${number}px`, 'Text'>, Tagged<'px', 'Affix'>>>().toBe<`${number}`>();
expectTypeOf<RemoveSuffix<Tagged<'report.pdf', 'Text'>, Tagged<`.${string}`, 'Affix'>, {strict: false}>>().toBe<'report'>();

expectTypeOf<RemoveSuffix<Opaque<'report.pdf', 'Text'>, Opaque<'.pdf', 'Affix'>>>().toBe<'report'>();
expectTypeOf<RemoveSuffix<Tagged<Tagged<'report.pdf', 'First'>, 'Second'>, '.pdf'>>().toBe<'report'>();
expectTypeOf<RemoveSuffix<'report.pdf' & {readonly __brand: unique symbol}, '.pdf'>>().toBe<'report'>();
expectTypeOf<RemoveSuffix<Tagged<'report.pdf.pdf', 'Text'>, Tagged<'.pdf', 'Affix'>>>().toBe<'report.pdf'>();
expectTypeOf<RemoveSuffix<Tagged<'.pdf', 'Text'>, Tagged<'.pdf', 'Affix'>>>().toBe<''>();
expectTypeOf<RemoveSuffix<Tagged<'', 'Text'>, Tagged<'.pdf', 'Affix'>>>().toBe<Tagged<'', 'Text'>>();
expectTypeOf<RemoveSuffix<Tagged<'report.pdf', 'Text'>, Tagged<'', 'Affix'>>>().toBe<'report.pdf'>();
expectTypeOf<RemoveSuffix<Tagged<'report.pdf', 'Text'>, Tagged<`.${string}`, 'Affix'>>>().toBe<string>();
expectTypeOf<RemoveSuffix<Tagged<string, 'Text'>, Tagged<'.pdf', 'Affix'>>>().toBe<string>();
expectTypeOf<RemoveSuffix<any, Tagged<'.pdf', 'Affix'>>>().toBe<any>();
expectTypeOf<RemoveSuffix<never, Tagged<'.pdf', 'Affix'>>>().toBe<never>();
// @ts-expect-error
expectTypeOf<RemoveSuffix<unknown, '.pdf'>>();
// @ts-expect-error
expectTypeOf<RemoveSuffix<'report.pdf', unknown>>();

// An unknown part can contain the affix even when the whole template does not guarantee a match.
expectTypeOf<''>().toBeAssignableTo<RemoveSuffix<`api/${string}`, 'api/'>>();
expectTypeOf<''>().toBeAssignableTo<RemoveSuffix<`api/${string}`, 'api/', {strict: true}>>();
expectTypeOf<RemoveSuffix<`api/${string}`, 'api/'>>().toBe<string>();
expectTypeOf<RemoveSuffix<`api/${string}`, 'api/', {strict: true}>>().toBe<string>();

// Guaranteed matches remain precise, including numeric templates and literal alternatives.
expectTypeOf<RemoveSuffix<`${number}/api` | 'plain', '/api'>>().toBe<`${number}` | 'plain'>();
expectTypeOf<RemoveSuffix<`api/${string}`, 'api/' | 'other'>>().toBe<string>();
expectTypeOf<RemoveSuffix<`api/${string}`, 'api/', {strict: boolean}>>().toBe<string>();
expectTypeOf<RemoveSuffix<`api/${string}`, never>>().toBe<`api/${string}`>();
expectTypeOf<RemoveSuffix<`api/${string}`, ''>>().toBe<`api/${string}`>();
expectTypeOf<RemoveSuffix<Tagged<`api/${string}`, 'Input'>, 'api/'>>().toBe<string>();

function _suffixResult<Input extends string, Affix extends string, Options extends RemoveSuffixOptions>(value: RemoveSuffix<Input, Affix, Options>): string {
	return value;
}

function _suffixOptions<Options extends RemoveSuffixOptions>(value: RemoveSuffix<`${number}/api`, '/api', Options>): `${number}` {
	return value;
}

declare function removeSuffix<const Input extends string, const Affix extends string>(input: Input, affix: Affix): RemoveSuffix<Input, Affix>;
expectTypeOf(removeSuffix('value/api', '/api')).toBe<'value'>();
declare const suffixInput: `api/${string}`;
expectTypeOf(removeSuffix(suffixInput, 'api/')).toBe<string>();
