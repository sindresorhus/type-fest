import {expectType} from 'tsd';
import type {DeepUndefinedToNull} from '../index';

type In1 = {a: string; b?: boolean};
type Out1 = {a: string; b: boolean | null};

type In2 = {a?: string; b?: boolean};
type Out2 = {a: string | null; b: boolean | null};

type In3 = {a: string; b: boolean};
type Out3 = {a: string; b: boolean};

type In4 = {a: undefined};
type Out4 = In4;

type In5 = {
	a: 1;
	b?: 2;
	c?: 3 | undefined;
	d?: 4 | null;
	e?: 5 | undefined | null;
	f: 6 | undefined;
	g?: {};
	h: {
		i: 7;
		j?: 7;
		k?: {
			l?: 8;
			m: 9;
			n?: 10 | undefined;
			o?: 11 | null;
			p?: 12 | undefined | null;
			q: 13 | undefined;
		};
	};
};

type Out5 = {
	a: 1;
	b: 2 | null;
	c: 3 | null;
	d: 4 | null;
	e: 5 | null;
	f: 6 | undefined;
	g: {} | null;
	h: {
		i: 7;
		j: 7 | null;
		k: {
			l: 8 | null;
			m: 9;
			n: 10 | null;
			o: 11 | null;
			p: 12 | null;
			q: 13 | undefined;
		} | null;
	};
};

type In6 = {
	a?: 1;
};

type Out6 = {
	a: 1 | 0;
};

declare const test1: DeepUndefinedToNull<In1>;
declare const test2: DeepUndefinedToNull<In2>;
declare const test3: DeepUndefinedToNull<In3>;
declare const test4: DeepUndefinedToNull<In4>;
declare const test5: DeepUndefinedToNull<In5>;
declare const test6: DeepUndefinedToNull<In6, 0>;

expectType<Out1>(test1);
expectType<Out2>(test2);
expectType<Out3>(test3);
expectType<Out4>(test4);
expectType<Out5>(test5);
expectType<Out6>(test6);
