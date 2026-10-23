import {expectTypeOf} from 'nz';
import type {ExcludeExactly} from '../index.d.ts';

expectTypeOf<ExcludeExactly<number, '1'>>().toBe<number>();
expectTypeOf<ExcludeExactly<number, number>>().toBe<never>();
expectTypeOf<ExcludeExactly<0, number>>().toBe<0>();
expectTypeOf<ExcludeExactly<string, '1'>>().toBe<string>();
expectTypeOf<ExcludeExactly<string, string>>().toBe<never>();
expectTypeOf<ExcludeExactly<'0', string>>().toBe<'0'>();

expectTypeOf<ExcludeExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>>().toBe<{a: 0}>();
expectTypeOf<ExcludeExactly<{a: 0} | {readonly a: 0}, {a: 0}>>().toBe<{readonly a: 0}>();
expectTypeOf<ExcludeExactly<{readonly a: 0}, {readonly a: 0}>>().toBe<never>();

// `never` excludes nothing
expectTypeOf<ExcludeExactly<0 | 1 | 2, never>>().toBe<0 | 1 | 2>();
expectTypeOf<ExcludeExactly<never, never>>().toBe<never>();
expectTypeOf<ExcludeExactly<any, never>>().toBe<any>();
expectTypeOf<ExcludeExactly<unknown, never>>().toBe<unknown>();

// Excluding from `unknown`/`any`
expectTypeOf<ExcludeExactly<unknown, string>>().toBe<unknown>();
expectTypeOf<ExcludeExactly<[unknown], [number]>>().toBe<[unknown]>();
expectTypeOf<ExcludeExactly<unknown[], number[]>>().toBe<unknown[]>();
expectTypeOf<ExcludeExactly<{a: unknown}, {a: number}>>().toBe<{a: unknown}>();
expectTypeOf<ExcludeExactly<number[] | unknown[], number[]>>().toBe<unknown[]>();
expectTypeOf<ExcludeExactly<any, string>>().toBe<any>();
expectTypeOf<ExcludeExactly<[any], [number]>>().toBe<[any]>();
expectTypeOf<ExcludeExactly<any[], number[]>>().toBe<any[]>();
expectTypeOf<ExcludeExactly<{a: any}, {a: number}>>().toBe<{a: any}>();
expectTypeOf<ExcludeExactly<number[] | any[], number[]>>().toBe<any[]>();

// Excluding `unknown`/`any`
expectTypeOf<ExcludeExactly<unknown, unknown>>().toBe<never>();
expectTypeOf<ExcludeExactly<any, any>>().toBe<never>();
expectTypeOf<ExcludeExactly<unknown, any>>().toBe<unknown>();
expectTypeOf<ExcludeExactly<any, unknown>>().toBe<any>();
expectTypeOf<ExcludeExactly<string | number, unknown>>().toBe<string | number>();
expectTypeOf<ExcludeExactly<string | number, any>>().toBe<string | number>();
expectTypeOf<ExcludeExactly<never, any>>().toBe<never>();
expectTypeOf<ExcludeExactly<never, unknown>>().toBe<never>();

// Unions
expectTypeOf<ExcludeExactly<0 | 1 | 2, 0 | 1>>().toBe<2>();
expectTypeOf<ExcludeExactly<0 | 1 | 2, 0 | 1 | 2>>().toBe<never>();
expectTypeOf<ExcludeExactly<'1' | 2 | true | null, '1' | boolean | undefined>>().toBe<2 | null>();
expectTypeOf<ExcludeExactly<0 | '' | null | undefined | false, 0 | string | undefined>>().toBe<'' | null | false>();
expectTypeOf<ExcludeExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0}
>>().toBe<{readonly a?: 0}>();
expectTypeOf<ExcludeExactly<
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0},
	{a: 0} | {readonly a: 0} | {a?: 0} | {readonly a?: 0}
>>().toBe<never>();

// Exact matching distinguishes modifiers, nested sentinels, tuples, and function signatures.
expectTypeOf<ExcludeExactly<string | number | boolean | null, number | boolean>>().toBe<string | null>();
expectTypeOf<ExcludeExactly<readonly [string] | [string], readonly [string]>>().toBe<[string]>();
expectTypeOf<ExcludeExactly<{value?: string} | {value: string | undefined}, {value?: string}>>().toBe<{value: string | undefined}>();
expectTypeOf<ExcludeExactly<{value: any} | {value: unknown} | {value: never}, {value: unknown} | {value: never}>>().toBe<{value: any}>();
expectTypeOf<ExcludeExactly<{readonly id: number} | {id: number}, {id: number}>>().toBe<{readonly id: number}>();
expectTypeOf<ExcludeExactly<((value: string) => number) | ((value: number) => string), (value: number) => string>>().toBe<(value: string) => number>();
expectTypeOf<ExcludeExactly<{kind: 'ready'; value: string} | {kind: 'failed'; error: Error}, {kind: 'ready'; value: string}>>().toBe<{kind: 'failed'; error: Error}>();

// The selected member can be inferred from an actual argument, and generic results remain part of the input union.
function _readOriginalValue<Union, Match>(value: ExcludeExactly<Union, Match>): Union {
	return value;
}

declare function selectExact<Union, Match>(input: Union, match: Match): ExcludeExactly<Union, Match>;
declare const response: {kind: 'ready'; value: string} | {kind: 'failed'; error: Error};
declare const readyResponse: {kind: 'ready'; value: string};
expectTypeOf(selectExact(response, readyResponse)).toBe<{kind: 'failed'; error: Error}>();
expectTypeOf<{kind: 'other'}>().not.toBeAssignableTo<ExcludeExactly<typeof response, typeof readyResponse>>();

// Symbol keys and nested property modifiers also participate in exact identity.
declare const identity: unique symbol;
expectTypeOf<ExcludeExactly<{readonly [identity]: 'user'} | {readonly [identity]: 'project'}, {readonly [identity]: 'user'}>>().toBe<{readonly [identity]: 'project'}>();
expectTypeOf<ExcludeExactly<{value: {name: string}} | {value: {readonly name: string}}, {value: {name: string}}>>().toBe<{value: {readonly name: string}}>();
type SimilarResponses = {kind: 'ready'; value: string} | {kind: 'ready'; value: string; cached?: boolean};
expectTypeOf<ExcludeExactly<SimilarResponses, {kind: 'ready'; value: string}>>().toBe<{kind: 'ready'; value: string; cached?: boolean}>();
