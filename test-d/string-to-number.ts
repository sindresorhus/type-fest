import {expectType} from 'tsd';
import type {StringToNumber} from '../source/string-to-number.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Zero
expectType<0>({} as StringToNumber<'0'>);
expectType<-0>({} as StringToNumber<'-0'>);
expectType<0>({} as StringToNumber<'0.0'>);
expectType<-0>({} as StringToNumber<'-0.0'>);
expectType<0>({} as StringToNumber<'0.0000'>);
expectType<-0>({} as StringToNumber<'-0.0000'>);

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

// Floats with trailing zeroes
expectType<1>({} as StringToNumber<'1.0'>);
expectType<-0.01>({} as StringToNumber<'-0.010'>);
expectType<10.5>({} as StringToNumber<'10.500'>);
expectType<32.0203>({} as StringToNumber<'32.02030'>);
expectType<-100>({} as StringToNumber<'-100.00'>);
expectType<-1234.056>({} as StringToNumber<'-1234.05600'>);

// Starting with `-0.` and ending with zeroes
expectType<-0.025>({} as StringToNumber<'-0.0250'>);
expectType<-0.203>({} as StringToNumber<'-0.2030'>);
expectType<-0.1>({} as StringToNumber<'-0.100'>);

// Separators
expectType<12_345>({} as StringToNumber<'12_345'>);
expectType<1_234_567_890>({} as StringToNumber<'1_234_567_890'>);
expectType<-3_456_789>({} as StringToNumber<'-3_456_789'>);
expectType<12_345.123_45>({} as StringToNumber<'12_345.123_45'>);
expectType<-12.345_678_9>({} as StringToNumber<'-12.345_678_9'>);
expectType<98_765.4321>({} as StringToNumber<'98_765.432_10'>);
expectType<-12.3>({} as StringToNumber<'-12.300_000'>);
expectType<0.123_456_789>({} as StringToNumber<'0.123_456_789'>);
expectType<-0.001>({} as StringToNumber<'-0.001_000_00'>);

// Invalid separators
expectType<never>({} as StringToNumber<'_15'>);
expectType<never>({} as StringToNumber<'15_'>);
expectType<never>({} as StringToNumber<'_15_'>);
expectType<never>({} as StringToNumber<'_0.125'>);
expectType<never>({} as StringToNumber<'0.125_'>);
expectType<never>({} as StringToNumber<'6__6'>);
expectType<never>({} as StringToNumber<'123_45__67'>);
expectType<never>({} as StringToNumber<'3._14'>);
expectType<never>({} as StringToNumber<'3_.14'>);

// Special cases
expectType<number>({} as StringToNumber<`${number}`>);

// Non numeric strings
expectType<never>({} as StringToNumber<'two'>);
expectType<never>({} as StringToNumber<'1.2.30'>);
expectType<never>({} as StringToNumber<'..5'>);
expectType<never>({} as StringToNumber<string>);
expectType<never>({} as StringToNumber<Uppercase<string>>);
expectType<never>({} as StringToNumber<`${number}.${number}`>);

// Unions
expectType<1 | -1>({} as StringToNumber<'1' | '-1' | 'one'>);
expectType<1 | 2 | -3 | 1.25 | -0.65 | 10_000_000>({} as StringToNumber<'1' | '2' | '-3' | '1.25' | '-0.650' | '10_000_000'>);

// Infinity
expectType<PositiveInfinity>({} as StringToNumber<'Infinity'>);
expectType<NegativeInfinity>({} as StringToNumber<'-Infinity'>);

// Boundary cases
expectType<never>({} as StringToNumber<never>);
expectType<number>({} as StringToNumber<any>);
