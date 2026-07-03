import {expectType} from 'tsd';
import type {StringToArray} from '../source/string-to-array.d.ts';
import type {StringRepeat} from '../source/string-repeat.d.ts';
import type {TupleOf} from '../source/tuple-of.d.ts';

type StringToArrayElementNonLiterals<S extends string> = StringToArray<S, {mapNonLiteralsDirectly: true}>;

// Empty string
expectType<[]>({} as StringToArray<''>);
expectType<[]>({} as StringToArrayElementNonLiterals<''>);

// Literals
expectType<['a']>({} as StringToArray<'a'>);
expectType<['a', 'b', 'c', 'd', 'e']>({} as StringToArray<'abcde'>);
expectType<['0', '1', '2']>({} as StringToArray<'012'>);
expectType<['f', 'o', 'o', 'b', 'a', 'r']>({} as StringToArrayElementNonLiterals<'foobar'>);

// Non-literals
expectType<string[]>({} as StringToArray<string>);
expectType<Array<Lowercase<string>>>({} as StringToArray<Lowercase<string>>);
expectType<Array<Uppercase<string>>>({} as StringToArray<Uppercase<string>>);

expectType<[...string[], 'a', 'b', 'c']>({} as StringToArray<`${string}abc`>);
expectType<['a', 'b', 'c', ...string[]]>({} as StringToArray<`abc${string}`>);
expectType<['a', 'b', 'c', ...string[], 'd', 'e', 'f']>({} as StringToArray<`abc${string}def`>);

expectType<['a', 'b', 'c', ...string[]]>({} as StringToArray<`abc${string}def${string}`>);
expectType<['a', ...string[], 'c']>({} as StringToArray<`a${string}b${string}c`>);
expectType<['a', ...Array<Capitalize<string> | 'b' | Uppercase<string>>, 'c']>(
	{} as StringToArray<`a${Capitalize<string>}b${Uppercase<string>}c`>,
);
expectType<['a', 'b', ...Array<Capitalize<string> | 'c' | 'd' | Uppercase<string>>]>(
	{} as StringToArray<`ab${Capitalize<string>}cd${Uppercase<string>}`>,
);

// --- `mapNonLiteralsDirectly: true` ---
expectType<[string]>({} as StringToArrayElementNonLiterals<string>);
expectType<[Lowercase<string>]>({} as StringToArrayElementNonLiterals<Lowercase<string>>);
expectType<[Uppercase<string>]>({} as StringToArrayElementNonLiterals<Uppercase<string>>);

expectType<[string, 'a', 'b', 'c']>({} as StringToArrayElementNonLiterals<`${string}abc`>);
expectType<['a', 'b', 'c', string]>({} as StringToArrayElementNonLiterals<`abc${string}`>);
expectType<['a', 'b', 'c', string, 'd', 'e', 'f']>({} as StringToArrayElementNonLiterals<`abc${string}def`>);

expectType<['a', 'b', 'c', string, 'd', 'e', 'f', string]>(
	{} as StringToArrayElementNonLiterals<`abc${string}def${string}`>,
);
expectType<['a', string, 'b', string, 'c']>({} as StringToArrayElementNonLiterals<`a${string}b${string}c`>);
expectType<['a', Capitalize<string>, 'b', Uppercase<string>, 'c']>(
	{} as StringToArrayElementNonLiterals<`a${Capitalize<string>}b${Uppercase<string>}c`>,
);
expectType<['a', 'b', Capitalize<string>, 'c', 'd', Uppercase<string>]>(
	{} as StringToArrayElementNonLiterals<`ab${Capitalize<string>}cd${Uppercase<string>}`>,
);

// Unions
expectType<['a', 'b', 'c'] | ['d', 'e', 'f']>({} as StringToArray<'abc' | 'def'>);
expectType<['a', 'b', 'c'] | Array<Uppercase<string>>>({} as StringToArray<'abc' | Uppercase<string>>);
expectType<['a', 'b', ...string[]] | Array<`${number}`>>({} as StringToArray<`ab${string}` | `${number}`>);

expectType<['a', 'b', 'c'] | ['d', 'e', 'f']>({} as StringToArrayElementNonLiterals<'abc' | 'def'>);
expectType<['a', 'b', 'c'] | [Uppercase<string>]>({} as StringToArrayElementNonLiterals<'abc' | Uppercase<string>>);
expectType<['a', 'b', string] | [`${number}`]>({} as StringToArrayElementNonLiterals<`ab${string}` | `${number}`>);

// Long strings
expectType<TupleOf<200, 'a'>>({} as StringToArray<StringRepeat<'a', 200>>);
expectType<TupleOf<900, 'a'>>({} as StringToArray<StringRepeat<'a', 900>>);

// Boundary cases
expectType<never>({} as StringToArray<never>);
expectType<unknown[]>({} as StringToArray<any>);
expectType<never>({} as StringToArrayElementNonLiterals<never>);
expectType<unknown[]>({} as StringToArrayElementNonLiterals<any>);
