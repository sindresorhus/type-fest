import {expectType} from 'tsd';
import type {StringToNumber} from '../source/string-to-number.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Zero
expectType<0>({} as StringToNumber<'0'>);

// Positive integers
expectType<1>({} as StringToNumber<'1'>);
expectType<10>({} as StringToNumber<'10'>);
expectType<1234>({} as StringToNumber<'1234'>);
expectType<5000>({} as StringToNumber<'5000'>);

// Negative integers
expectType<-5>({} as StringToNumber<'-5'>);
expectType<-20>({} as StringToNumber<'-20'>);
expectType<-567>({} as StringToNumber<'-567'>);
expectType<-900>({} as StringToNumber<'-900'>);

// Positive floats
expectType<0.1>({} as StringToNumber<'0.1'>);
expectType<10.55>({} as StringToNumber<'10.55'>);
expectType<1234.56>({} as StringToNumber<'1234.56'>);

// Negative floats
expectType<-0.9>({} as StringToNumber<'-0.9'>);
expectType<-3.14>({} as StringToNumber<'-3.14'>);
expectType<-56.123>({} as StringToNumber<'-56.123'>);

// Infinity
expectType<PositiveInfinity>({} as StringToNumber<'Infinity'>);
expectType<NegativeInfinity>({} as StringToNumber<'-Infinity'>);

// Unions
expectType<1 | -1>({} as StringToNumber<'1' | '-1' | 'one'>);
expectType<1 | 2 | -3 | 1.25>({} as StringToNumber<'1' | '2' | '-3' | '1.25' | '-0.650' | '10_000_000'>);

// Non numeric strings
expectType<never>({} as StringToNumber<'two'>);
expectType<never>({} as StringToNumber<'1.2.30'>);
expectType<never>({} as StringToNumber<'..5'>);
expectType<never>({} as StringToNumber<Uppercase<string>>);
expectType<never>({} as StringToNumber<`${number}.${number}`>);

expectType<never>({} as StringToNumber<'-0'>);
expectType<never>({} as StringToNumber<'0.0'>);
expectType<never>({} as StringToNumber<'1.0'>);
expectType<never>({} as StringToNumber<'-3.50'>);
expectType<never>({} as StringToNumber<'12_345'>);

// Special cases
expectType<number>({} as StringToNumber<`${number}`>);
expectType<number>({} as StringToNumber<string>);

// Boundary cases
expectType<never>({} as StringToNumber<never>);
expectType<number>({} as StringToNumber<any>);
