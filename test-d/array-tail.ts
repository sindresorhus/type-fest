import {expectType} from 'tsd';
import type {ArrayTail} from '../index.d.ts';

declare const getArrayTail: <T extends readonly unknown[]>(array: T) => ArrayTail<T>;

expectType<[]>(getArrayTail([] as []));
expectType<[]>(getArrayTail(['a'] as ['a']));
expectType<['b', 'c']>(getArrayTail(['a', 'b', 'c'] as ['a', 'b', 'c']));

expectType<readonly []>(getArrayTail([] as const));
expectType<readonly []>(getArrayTail(['a'] as const));
expectType<readonly ['b', 'c']>(getArrayTail(['a', 'b', 'c'] as const));

// Optional elements
expectType<readonly [undefined, 'c'?]>(getArrayTail(['a', undefined, 'c'] as readonly ['a', undefined, 'c'?]));
expectType<[undefined?, number?]>(getArrayTail(['hello'] as [string, undefined?, number?]));
expectType<readonly [undefined?, 3?]>(getArrayTail([1, undefined, 3] as readonly [1, undefined?, 3?]));
expectType<[boolean, number?, string?]>(getArrayTail(['test', false] as [string, boolean, number?, string?]));

// All optional elements
expectType<['b'?]>({} as ArrayTail<['a'?, 'b'?]>);
expectType<readonly [number?]>({} as ArrayTail<readonly [string?, number?]>);

// Rest element
expectType<readonly [number, boolean, ...string[]]>({} as ArrayTail<readonly [string, number, boolean, ...string[]]>); // Required & Rest
expectType<readonly [number?, boolean?, ...string[]]>({} as ArrayTail<readonly [string?, number?, boolean?, ...string[]]>); // Optional & Rest
expectType<readonly [number, boolean?, ...string[]]>({} as ArrayTail<readonly [string, number, boolean?, ...string[]]>); // Required, Optional & Rest
// expectType<readonly [...string[], string, number]>({} as ArrayTail<readonly [...string[], string, number]>); // Rest & Required
expectType<readonly [number, ...string[], boolean, bigint]>({} as ArrayTail<readonly [string, number, ...string[], boolean, bigint]>); // Required, Rest & Required

// Labelled tuples
expectType<[y: string]>({} as ArrayTail<[x: number, y: string]>);
expectType<[bar: string, ...rest: boolean[]]>({} as ArrayTail<[foo: number, bar: string, ...rest: boolean[]]>);
expectType<[...rest: boolean[], foo: number, bar: string]>({} as ArrayTail<[...rest: boolean[], foo: number, bar: string]>);

// Union of tuples
expectType<[] | ['b']>({} as ArrayTail<[] | ['a', 'b']>);
expectType<readonly ['y'?] | ['b', ...string[]] | readonly string[]>({} as ArrayTail<readonly ['x'?, 'y'?] | ['a', 'b', ...string[]] | readonly string[]>);
expectType<[number] | readonly [boolean, string?]>({} as ArrayTail<[string, number] | readonly [number, boolean, string?]>);
expectType<readonly [number] | readonly string[]>({} as ArrayTail<readonly [string, number] | readonly string[]>);

// Non tuple arrays
expectType<string[]>({} as ArrayTail<string[]>);
expectType<readonly string[]>({} as ArrayTail<readonly string[]>);
expectType<never[]>({} as ArrayTail<never[]>);
expectType<any[]>({} as ArrayTail<any[]>);

// Boundary cases
expectType<never>({} as ArrayTail<never>);
expectType<any>({} as ArrayTail<any>);
