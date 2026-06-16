import {expectType} from 'tsd';
import type {StringLength} from '../source/string-length.d.ts';
import type {StringRepeat} from '../source/string-repeat.d.ts';

// Empty string
expectType<0>({} as StringLength<''>);

// Literals
expectType<1>({} as StringLength<'a'>);
expectType<5>({} as StringLength<'abcde'>);
expectType<3>({} as StringLength<'012'>);

// Non-literals
expectType<number>({} as StringLength<string>);
expectType<number>({} as StringLength<Uppercase<string>>);
expectType<number>({} as StringLength<`${string}abc`>);
expectType<number>({} as StringLength<`abc${string}`>);
expectType<number>({} as StringLength<`abc${string}def`>);
expectType<number>({} as StringLength<`abc${string}def${string}ij`>);

// Unions
expectType<3 | 5>({} as StringLength<'abcde' | 'fgh'>);
expectType<number>({} as StringLength<'abc' | Uppercase<string>>);
expectType<number>({} as StringLength<`ab${string}` | `${number}`>);

// Long strings
expectType<200>({} as StringLength<StringRepeat<'a', 200>>);
expectType<900>({} as StringLength<StringRepeat<'a', 900>>);

// Boundary cases
expectType<never>({} as StringLength<never>);
expectType<number>({} as StringLength<any>);
