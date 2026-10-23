import {expectTypeOf} from 'nz';
import type {ExtractExactly} from '../index.d.ts';

expectTypeOf<ExtractExactly<number, '1'>>().toBe<never>();
expectTypeOf<ExtractExactly<number, number>>().toBe<number>();
expectTypeOf<ExtractExactly<0, number>>().toBe<never>();
expectTypeOf<ExtractExactly<string, '1'>>().toBe<never>();
expectTypeOf<ExtractExactly<string, string>>().toBe<string>();
expectTypeOf<ExtractExactly<'0', string>>().toBe<never>();

expectTypeOf<ExtractExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>>().toBe<{readonly a: 0}>();
expectTypeOf<ExtractExactly<{a: 0} | {readonly a: 0}, {a: 0}>>().toBe<{a: 0}>();
expectTypeOf<ExtractExactly<{readonly a: 0}, {readonly a: 0}>>().toBe<{readonly a: 0}>();

// `never` extracts nothing
expectTypeOf<ExtractExactly<0 | 1 | 2, never>>().toBe<never>();
expectTypeOf<ExtractExactly<never, never>>().toBe<never>();
expectTypeOf<ExtractExactly<any, never>>().toBe<never>();
expectTypeOf<ExtractExactly<unknown, never>>().toBe<never>();

// Extracting from `unknown`/`any`
expectTypeOf<ExtractExactly<unknown, string>>().toBe<never>();
expectTypeOf<ExtractExactly<[unknown], [number]>>().toBe<never>();
expectTypeOf<ExtractExactly<unknown[], number[]>>().toBe<never>();
expectTypeOf<ExtractExactly<{a: unknown}, {a: number}>>().toBe<never>();
expectTypeOf<ExtractExactly<number[] | unknown[], number[]>>().toBe<number[]>();
expectTypeOf<ExtractExactly<any, string>>().toBe<never>();
expectTypeOf<ExtractExactly<[any], [number]>>().toBe<never>();
expectTypeOf<ExtractExactly<any[], number[]>>().toBe<never>();
expectTypeOf<ExtractExactly<{a: any}, {a: number}>>().toBe<never>();
expectTypeOf<ExtractExactly<number[] | any[], number[]>>().toBe<number[]>();

// Extracting `unknown`/`any`
expectTypeOf<ExtractExactly<unknown, unknown>>().toBe<unknown>();
expectTypeOf<ExtractExactly<any, any>>().toBe<any>();
expectTypeOf<ExtractExactly<unknown, any>>().toBe<never>();
expectTypeOf<ExtractExactly<any, unknown>>().toBe<never>();
expectTypeOf<ExtractExactly<string | number, unknown>>().toBe<never>();
expectTypeOf<ExtractExactly<string | number, any>>().toBe<never>();
expectTypeOf<ExtractExactly<never, any>>().toBe<never>();
expectTypeOf<ExtractExactly<never, unknown>>().toBe<never>();

// Unions
expectTypeOf<ExtractExactly<0 | 1 | 2, 0 | 1>>().toBe<0 | 1>();
expectTypeOf<ExtractExactly<0 | 1 | 2, 0 | 1 | 2>>().toBe<0 | 1 | 2>();
expectTypeOf<ExtractExactly<'1' | 2 | true | null, '1' | boolean | undefined>>().toBe<'1' | true>();
expectTypeOf<ExtractExactly<0 | '' | null | undefined | false, 0 | string | undefined>>().toBe<0 | undefined>();
expectTypeOf<ExtractExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0}
>>().toBe<{a: 0} | {readonly a: 0} | {a?: 0}>();
expectTypeOf<ExtractExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}
>>().toBe<{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}>();

// Exact matching distinguishes modifiers, nested sentinels, tuples, and function signatures.
expectTypeOf<ExtractExactly<string | number | boolean | null, number | boolean>>().toBe<number | boolean>();
expectTypeOf<ExtractExactly<readonly [string] | [string], readonly [string]>>().toBe<readonly [string]>();
expectTypeOf<ExtractExactly<{value?: string} | {value: string | undefined}, {value?: string}>>().toBe<{value?: string}>();
expectTypeOf<ExtractExactly<{value: any} | {value: unknown} | {value: never}, {value: unknown} | {value: never}>>().toBe<{value: unknown} | {value: never}>();
expectTypeOf<ExtractExactly<{readonly id: number} | {id: number}, {id: number}>>().toBe<{id: number}>();
expectTypeOf<ExtractExactly<((value: string) => number) | ((value: number) => string), (value: number) => string>>().toBe<(value: number) => string>();
expectTypeOf<ExtractExactly<{kind: 'ready'; value: string} | {kind: 'failed'; error: Error}, {kind: 'ready'; value: string}>>().toBe<{kind: 'ready'; value: string}>();

// The selected member can be inferred from an actual argument, and generic results remain part of the input union.
function _readOriginalValue<Union, Match>(value: ExtractExactly<Union, Match>): Union {
	return value;
}

declare function selectExact<Union, Match>(input: Union, match: Match): ExtractExactly<Union, Match>;
declare const response: {kind: 'ready'; value: string} | {kind: 'failed'; error: Error};
declare const readyResponse: {kind: 'ready'; value: string};
expectTypeOf(selectExact(response, readyResponse)).toBe<{kind: 'ready'; value: string}>();
expectTypeOf<{kind: 'other'}>().not.toBeAssignableTo<ExtractExactly<typeof response, typeof readyResponse>>();

// Symbol keys and nested property modifiers also participate in exact identity.
declare const identity: unique symbol;
expectTypeOf<ExtractExactly<{readonly [identity]: 'user'} | {readonly [identity]: 'project'}, {readonly [identity]: 'user'}>>().toBe<{readonly [identity]: 'user'}>();
expectTypeOf<ExtractExactly<{value: {name: string}} | {value: {readonly name: string}}, {value: {name: string}}>>().toBe<{value: {name: string}}>();
type SimilarResponses = {kind: 'ready'; value: string} | {kind: 'ready'; value: string; cached?: boolean};
expectTypeOf<ExtractExactly<SimilarResponses, {kind: 'ready'; value: string}>>().toBe<{kind: 'ready'; value: string}>();
