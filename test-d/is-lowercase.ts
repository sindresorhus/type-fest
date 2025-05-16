import {expectType} from 'tsd';
import type {IsLowercase} from '../index.d.ts';

// Literals
expectType<IsLowercase<'abc'>>(true);
expectType<IsLowercase<''>>(true);
expectType<IsLowercase<'123'>>(true);
expectType<IsLowercase<'!@#'>>(true);

expectType<IsLowercase<'Abc'>>(false);
expectType<IsLowercase<'ABC'>>(false);

// Non-literals
expectType<IsLowercase<Lowercase<string>>>(true);
expectType<IsLowercase<Lowercase<`on${string}`>>>(true);

expectType<IsLowercase<Uppercase<string>>>(false);
expectType<IsLowercase<Capitalize<`on${string}`>>>(false);
expectType<IsLowercase<`on${Capitalize<string>}`>>(false);
expectType<IsLowercase<Capitalize<`${string}end`>>>(false);

expectType<IsLowercase<string>>({} as boolean);
expectType<IsLowercase<`on${string}`>>({} as boolean);
expectType<IsLowercase<Uncapitalize<string>>>({} as boolean);
expectType<IsLowercase<Uncapitalize<`on${string}`>>>({} as boolean);
expectType<IsLowercase<`on${Uncapitalize<string>}`>>({} as boolean);
expectType<IsLowercase<`${number}`>>({} as boolean);

expectType<IsLowercase<`Start${string}`>>(false);
expectType<IsLowercase<`${string}End`>>(false);
expectType<IsLowercase<`${string}Mid${string}`>>(false);

// Complex non-literals
expectType<IsLowercase<`${Lowercase<string>}${Lowercase<string>}`>>(true);

expectType<IsLowercase<`${Uppercase<string>}${Lowercase<string>}`>>(false);
expectType<IsLowercase<`${Lowercase<string>}${Uppercase<string>}`>>(false);
expectType<IsLowercase<`${Lowercase<string>}${Uppercase<string>}${Lowercase<string>}`>>(false);
expectType<IsLowercase<`${Capitalize<string>}${Lowercase<string>}`>>(false);
expectType<IsLowercase<`${Lowercase<string>}${Capitalize<string>}`>>(false);
expectType<IsLowercase<`${string}${Capitalize<string>}`>>(false);
expectType<IsLowercase<`${number}${Capitalize<string>}`>>(false);

expectType<IsLowercase<`${string}${Lowercase<string>}`>>({} as boolean);
expectType<IsLowercase<`${string}${string}`>>({} as boolean);
expectType<IsLowercase<`${Lowercase<string>}${Lowercase<string>}${string}`>>({} as boolean);
expectType<IsLowercase<`${string}${Uncapitalize<string>}`>>({} as boolean);
expectType<IsLowercase<`${number}/${number}`>>({} as boolean);
expectType<IsLowercase<`${string}${number}`>>({} as boolean);

// Unions
expectType<IsLowercase<'abc' | 'xyz'>>(true); // Both `true`
expectType<IsLowercase<'abC' | 'xYz'>>(false); // Both `false`
expectType<IsLowercase<'abc' | 'Abc'>>({} as boolean); // One `true`, one `false`
expectType<IsLowercase<'abc' | `${Uncapitalize<string>}end`>>({} as boolean); // One `true`, one `boolean`
expectType<IsLowercase<'xYz' | `abc${string}`>>({} as boolean); // One `false`, one `boolean`
