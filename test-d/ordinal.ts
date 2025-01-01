import {expectNotAssignable, expectType} from 'tsd';
import type {Ordinal} from '../source/ordinal';

// Basic numbers (1-5)
expectType<'1st'>('1st' as Ordinal<1>);
expectType<'2nd'>('2nd' as Ordinal<2>);
expectType<'3rd'>('3rd' as Ordinal<3>);
expectType<'4th'>('4th' as Ordinal<4>);

// Teen numbers (special cases)
expectType<'11th'>('11th' as Ordinal<11>);
expectType<'12th'>('12th' as Ordinal<12>);
expectType<'13th'>('13th' as Ordinal<13>);

// Numbers ending in 1,2,3
expectType<'21st'>('21st' as Ordinal<21>);
expectType<'22nd'>('22nd' as Ordinal<22>);
expectType<'23rd'>('23rd' as Ordinal<23>);

// Numbers ending in 11,12,13
expectType<'111th'>('111th' as Ordinal<111>);
expectType<'212th'>('212th' as Ordinal<212>);
expectType<'313th'>('313th' as Ordinal<313>);

// Numbers ending in 0
expectType<'10th'>('10th' as Ordinal<10>);
expectType<'20th'>('20th' as Ordinal<20>);
expectType<'100th'>('100th' as Ordinal<100>);

// Edge cases
expectType<'0th'>('0th' as Ordinal<0>);
expectType<'999th'>('999th' as Ordinal<999>);
expectType<'322nd'>('322nd' as Ordinal<322>);
expectType<'333rd'>('333rd' as Ordinal<333>);

// Invalid inputs
expectNotAssignable<Ordinal<-1>>('-1st');
expectNotAssignable<Ordinal<1.5>>('1.5th');
expectNotAssignable<Ordinal<0.5>>('0.5th');
