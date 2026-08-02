import {expectType} from 'tsd';
import type {IsUppercase} from '../index.d.ts';

// Literals
expectType<IsUppercase<'ABC'>>(true);
expectType<IsUppercase<''>>(true);
expectType<IsUppercase<'123'>>(true);
expectType<IsUppercase<'!@#'>>(true);

expectType<IsUppercase<'Abc'>>(false);
expectType<IsUppercase<'abc'>>(false);

// Non-literals
expectType<IsUppercase<Uppercase<string>>>(true);
expectType<IsUppercase<Uppercase<`on${string}`>>>(true);

expectType<IsUppercase<Lowercase<string>>>(false);
expectType<IsUppercase<Uncapitalize<`ON${string}`>>>(false);
expectType<IsUppercase<`ON${Uncapitalize<string>}`>>(false);
expectType<IsUppercase<Uncapitalize<`${string}END`>>>(false);

expectType<IsUppercase<string>>({} as boolean);
expectType<IsUppercase<`ON${string}`>>({} as boolean);
expectType<IsUppercase<Capitalize<string>>>({} as boolean);
expectType<IsUppercase<Capitalize<`ON${string}`>>>({} as boolean);
expectType<IsUppercase<`ON${Capitalize<string>}`>>({} as boolean);
expectType<IsUppercase<`${number}`>>({} as boolean);

expectType<IsUppercase<`sTART${string}`>>(false);
expectType<IsUppercase<`${string}eND`>>(false);
expectType<IsUppercase<`${string}mID${string}`>>(false);

// Complex non-literals
expectType<IsUppercase<`${Uppercase<string>}${Uppercase<string>}`>>(true);

expectType<IsUppercase<`${Lowercase<string>}${Uppercase<string>}`>>(false);
expectType<IsUppercase<`${Uppercase<string>}${Lowercase<string>}`>>(false);
expectType<IsUppercase<`${Uppercase<string>}${Lowercase<string>}${Uppercase<string>}`>>(false);
expectType<IsUppercase<`${Uncapitalize<string>}${Uppercase<string>}`>>(false);
expectType<IsUppercase<`${Uppercase<string>}${Uncapitalize<string>}`>>(false);
expectType<IsUppercase<`${string}${Uncapitalize<string>}`>>(false);
expectType<IsUppercase<`${number}${Uncapitalize<string>}`>>(false);

expectType<IsUppercase<`${string}${Uppercase<string>}`>>({} as boolean);
expectType<IsUppercase<`${string}${string}`>>({} as boolean);
expectType<IsUppercase<`${Uppercase<string>}${Uppercase<string>}${string}`>>({} as boolean);
expectType<IsUppercase<`${string}${Capitalize<string>}`>>({} as boolean);
expectType<IsUppercase<`${number}/${number}`>>({} as boolean);
expectType<IsUppercase<`${string}${number}`>>({} as boolean);

// Unions
expectType<IsUppercase<'ABC' | 'XYZ'>>(true); // Both `true`
expectType<IsUppercase<'ABc' | 'XyZ'>>(false); // Both `false`
expectType<IsUppercase<'ABC' | 'aBC'>>({} as boolean); // One `true`, one `false`
expectType<IsUppercase<'ABC' | `${Capitalize<string>}END`>>({} as boolean); // One `true`, one `boolean`
expectType<IsUppercase<'XyZ' | `ABC${string}`>>({} as boolean); // One `false`, one `boolean`
