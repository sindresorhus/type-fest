import {expectType} from 'tsd';
import type {Subtract} from '../index';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric';

declare const positive: {
	12: Subtract<10, -2>;
	0: Subtract<2, 2>;
	2: Subtract<-1, -3>;
	69: Subtract<69, 0>;
};
// Positive result
expectType<12>(positive[12]);
expectType<0>(positive[0]);
expectType<2>(positive[2]);
expectType<69>(positive[69]);

// Negative result
declare const negative: {
	1: Subtract<1, 2>;
	6: Subtract<-10, -4>;
	333: Subtract<-111, 222>;
	420: Subtract<0, 420>;
};
expectType<-1>(negative[1]);
expectType<-6>(negative[6]);
expectType<-333>(negative[333]);
expectType<-420>(negative[420]);

// Infinity
declare const infinity: {
	positive1: Subtract<PositiveInfinity, 999>;
	positive2: Subtract<-999, PositiveInfinity>;
	negative1: Subtract<NegativeInfinity, 999>;
	negative2: Subtract<999, NegativeInfinity>;
	negative3: Subtract<NegativeInfinity, PositiveInfinity>;
};
expectType<PositiveInfinity>(infinity.positive1);
expectType<NegativeInfinity>(infinity.positive2);
expectType<NegativeInfinity>(infinity.negative1);
expectType<PositiveInfinity>(infinity.negative2);
expectType<NegativeInfinity>(infinity.negative3);

// Number
declare const number: {
	0: Subtract<number, 2>;
	1: Subtract<2, number>;
	2: Subtract<number, number>;
	infinity1: Subtract<NegativeInfinity, NegativeInfinity>;
	infinity2: Subtract<PositiveInfinity, PositiveInfinity>;
	infinity3: Subtract<number, PositiveInfinity>;
	infinity4: Subtract<PositiveInfinity, number>;
};
expectType<number>(number[0]);
expectType<number>(number[1]);
expectType<number>(number[2]);
expectType<number>(number.infinity1);
expectType<number>(number.infinity2);
expectType<number>(number.infinity3);
expectType<number>(number.infinity4);

// Union
declare const union: {
	1: Subtract<10, 1 | 2>;
	2: Subtract<10 | 5, 1>;
	3: Subtract<10 | 5, 1 | 2>;
};
expectType<9 | 8>(union[1]);
expectType<9 | 4>(union[2]);
expectType<9 | 8 | 4 | 3>(union[3]);
