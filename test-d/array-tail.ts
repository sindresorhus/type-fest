import {expectType} from 'tsd';
import type {ArrayTail, UnknownArray} from '../index.d.ts';

declare const getArrayTail: <T extends readonly unknown[]>(array: T) => ArrayTail<T>;

expectType<[]>(getArrayTail([]));
expectType<[]>(getArrayTail(['a']));
expectType<[]>(getArrayTail(['a', 'b', 'c']));

expectType<[]>(getArrayTail([] as const));
expectType<[]>(getArrayTail(['a'] as const));
expectType<['b', 'c']>(getArrayTail(['a', 'b', 'c'] as const));

// Optional elements tests
expectType<[undefined, 'c']>(getArrayTail(['a', undefined, 'c'] as const));

// Mixed optional/required
type MixedArray = [string, undefined?, number?];
expectType<[undefined?, number?]>(getArrayTail(['hello'] as MixedArray));

// Optional numbers
expectType<[undefined, 3]>(getArrayTail([1, undefined, 3] as const));

// Complex mixed case
type ComplexArray = [string, boolean, number?, string?];
expectType<[boolean, number?, string?]>(getArrayTail(['test', false] as ComplexArray));

// All optional elements
expectType<['b'?]>([] as ArrayTail<['a'?, 'b'?]>);

// Union of tuples
expectType<[] | ['b']>([] as ArrayTail<[] | ['a', 'b']>);
expectType<['y'?] | ['b', ...string[]] | []>([] as ArrayTail<readonly ['x'?, 'y'?] | ['a', 'b', ...string[]] | readonly string[]>);

// `preserveReadonly` option
type ReadonlyPreservingArrayTail<Type extends UnknownArray> = ArrayTail<Type, {preserveReadonly: true}>;

expectType<[]>({} as ReadonlyPreservingArrayTail<[]>);
expectType<readonly []>({} as ReadonlyPreservingArrayTail<readonly []>);
expectType<[number?, ...string[]]>({} as ReadonlyPreservingArrayTail<[string?, number?, ...string[]]>);
expectType<readonly [number?, ...string[]]>({} as ReadonlyPreservingArrayTail<readonly [string?, number?, ...string[]]>);

expectType<[number] | readonly [boolean, string?]>({} as ReadonlyPreservingArrayTail<[string, number] | readonly [number, boolean, string?]>);
expectType<readonly [number] | readonly []>({} as ReadonlyPreservingArrayTail<readonly [string, number] | readonly string[]>);
expectType<[number?] | [boolean, string?] | []>({} as ReadonlyPreservingArrayTail<[string?, number?] | [number, boolean, string?] | [...string[], number]>);

expectType<[]>({} as ReadonlyPreservingArrayTail<string[]>);
expectType<readonly []>({} as ReadonlyPreservingArrayTail<readonly string[]>);
