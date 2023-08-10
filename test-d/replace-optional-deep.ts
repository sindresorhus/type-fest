import {expectType} from 'tsd';
import type {ReplaceOptionalDeep} from '../index';

type In1 = {a: string; b?: boolean};
type Out1 = {a: string; b: undefined | boolean};

type In2 = {a?: string; b?: boolean};
type Out2 = {a: null | string; b: null | boolean};

type In3 = {a: string; b: boolean};
type Out3 = {a: string; b: boolean};

type In4 = {a: undefined};
type Out4 = In4;

type In5 = {
	a: 1;
	b?: 2;
	c?: undefined | 3;
	d?: null | 4 ;
	e?: undefined | null | 5;
	f: undefined | 6;
	g?: {};
	h: {
		i: 7;
		j?: 7;
		k?: {
			l?: 8;
			m: 9;
			n?: undefined | 10;
			o?: null | 11;
			p?: undefined | null | 12;
			q: undefined | 13;
		};
	};
};

type Out5 = {
	a: 1;
	b: undefined | 2;
	c: undefined | 3;
	d: undefined | null | 4;
	e: undefined | null | 5;
	f: undefined | 6;
	g: undefined | {};
	h: {
		i: 7;
		j: undefined | 7;
		k:
		| undefined
		| {
			l: undefined | 8;
			m: 9;
			n: undefined | 10;
			o: undefined | null | 11;
			p: undefined | null | 12;
			q: undefined | 13;
		};
	};
};

type In6 = {
	a?:
	| 1
	| {
		b: 2;
		c?: 3;
		d:
		| undefined
		| readonly undefined[]
		| {
			e?:
			| {a?: 1}
			| {a?: 2};
		};
	};
};

type Out6 = {
	a:
	| undefined
	| 1
	| {
		b: 2;
		c:
		| undefined
		| 3;
		d:
		| undefined
		| readonly undefined[]
		| {
			e:
			| undefined
			| {a: undefined | 1}
			| {a: undefined | 2};
		};
	};
};

type In7 = {a?: 1};

type Out7 = {a: 0 | 1};

declare const test1: ReplaceOptionalDeep<In1>;
declare const test2: ReplaceOptionalDeep<In2, null>;
declare const test3: ReplaceOptionalDeep<In3>;
declare const test4: ReplaceOptionalDeep<In4>;
declare const test5: ReplaceOptionalDeep<In5>;
declare const test6: ReplaceOptionalDeep<In6>;
declare const test7: ReplaceOptionalDeep<In7, 0>;

expectType<Out1>(test1);
expectType<Out2>(test2);
expectType<Out3>(test3);
expectType<Out4>(test4);
expectType<Out5>(test5);
expectType<Out6>(test6);
expectType<Out7>(test7);
