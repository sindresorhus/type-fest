import {expectType} from 'tsd';
import type {ArrayTail, UnknownArray} from '../index.d.ts';

declare const getArrayTail: <T extends readonly unknown[]>(array: T) => ArrayTail<T>;

expectType<[]>(getArrayTail([]));
expectType<[]>(getArrayTail(['a']));
expectType<[]>(getArrayTail(['a', 'b', 'c']));

expectType<readonly []>(getArrayTail([] as const));
expectType<readonly []>(getArrayTail(['a'] as const));
expectType<readonly ['b', 'c']>(getArrayTail(['a', 'b', 'c'] as const));

// Optional elements tests
expectType<readonly [undefined, 'c']>(getArrayTail(['a', undefined, 'c'] as const));

// Mixed optional/required
type MixedArray = [string, undefined?, number?];
expectType<[undefined?, number?]>(getArrayTail(['hello'] as MixedArray));

// Optional numbers
expectType<readonly [undefined, 3]>(getArrayTail([1, undefined, 3] as const));

// Complex mixed case
type ComplexArray = [string, boolean, number?, string?];
expectType<[boolean, number?, string?]>(getArrayTail(['test', false] as ComplexArray));

// All optional elements
expectType<['b'?]>([] as ArrayTail<['a'?, 'b'?]>);

// Union of tuples
expectType<[] | ['b']>([] as ArrayTail<[] | ['a', 'b']>);
expectType<readonly ['y'?] | ['b', ...string[]] | readonly []>([] as ArrayTail<readonly ['x'?, 'y'?] | ['a', 'b', ...string[]] | readonly string[]>);

// `preserveReadonly` option
type NotReadonlyPreservingArrayTail<Type extends UnknownArray> = ArrayTail<Type, {preserveReadonly: false}>;

expectType<[]>({} as NotReadonlyPreservingArrayTail<[]>);
expectType<[]>({} as NotReadonlyPreservingArrayTail<readonly []>);
expectType<[number?, ...string[]]>({} as NotReadonlyPreservingArrayTail<[string?, number?, ...string[]]>);
expectType<[number?, ...string[]]>({} as NotReadonlyPreservingArrayTail<readonly [string?, number?, ...string[]]>);

expectType<[number] | [boolean, string?]>({} as NotReadonlyPreservingArrayTail<[string, number] | readonly [number, boolean, string?]>);
expectType<[number] | []>({} as NotReadonlyPreservingArrayTail<readonly [string, number] | readonly string[]>);
expectType<[number?] | [boolean, string?] | []>({} as NotReadonlyPreservingArrayTail<[string?, number?] | [number, boolean, string?] | [...string[], number]>);

expectType<[]>({} as NotReadonlyPreservingArrayTail<string[]>);
expectType<[]>({} as NotReadonlyPreservingArrayTail<readonly string[]>);
