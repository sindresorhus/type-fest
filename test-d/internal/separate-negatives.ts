import {expectType} from 'tsd';
import type {SeparateNegatives} from '../../source/internal/numeric.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric.d.ts';

//  Basic single number cases
expectType<SeparateNegatives<1>>({} as [1, never]);
expectType<SeparateNegatives<-1>>({} as [never, -1]);
expectType<SeparateNegatives<0>>({} as [0, never]);
expectType<SeparateNegatives<number>>({} as [number, never]);

//  Simple unions
expectType<SeparateNegatives<1 | -1>>({} as [1, -1]);
expectType<SeparateNegatives<1 | 2 | -3>>({} as [1 | 2, -3]);
expectType<SeparateNegatives<0 | -1 | 2>>({} as [0 | 2, -1]);
expectType<SeparateNegatives<-1 | -2 | -3>>({} as [never, -1 | -2 | -3]);
expectType<SeparateNegatives<-1 | -2 | -3 | 4>>({} as [4, -1 | -2 | -3]);
expectType<SeparateNegatives<(1 | 2) | (-3 | -4)>>({} as [1 | 2, -3 | -4]);

//  Mixed with infinity types
expectType<SeparateNegatives<PositiveInfinity>>({} as [PositiveInfinity, never]);
expectType<SeparateNegatives<NegativeInfinity>>({} as [never, NegativeInfinity]);
expectType<SeparateNegatives<PositiveInfinity | NegativeInfinity>>({} as [
	PositiveInfinity,
	NegativeInfinity,
]);
expectType<SeparateNegatives<0 | PositiveInfinity | NegativeInfinity | 5 | -3>>({} as [
	0 | PositiveInfinity | 5,
	NegativeInfinity | -3,
]);
expectType<SeparateNegatives<-1 | NegativeInfinity | 0 | 2 | PositiveInfinity>>({} as [
	0 | 2 | PositiveInfinity,
	-1 | NegativeInfinity,
]);

//  Edge cases and literal union
expectType<SeparateNegatives<never>>({} as never);
expectType<SeparateNegatives<any>>({} as any);
expectType<SeparateNegatives<1 | 2 | -3 | (number & {})>>({} as [1 | 2 | (number & {}), -3]);
