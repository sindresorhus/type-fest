import {expectType} from 'tsd';
import type {Patch} from '../index';

type In1 = {a: string; b?: boolean};
type Out1 = {a: string; b: boolean | undefined};

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
	b: 2 | undefined;
	c: 3 | undefined;
	d: 4 | null | undefined;
	e: 5 | undefined | null;
	f: 6 | undefined;
	g: {} | undefined;
	h: {
		i: 7;
		j: 7 | undefined;
		k: {
			l: 8 | undefined;
			m: 9;
			n: 10 | undefined;
			o: 11 | null | undefined;
			p: 12 | undefined | null;
			q: 13 | undefined;
		} | undefined;
	};
};

type In6 = {
	a?:
	| 1
	| {b: 2; c?: 3; d: undefined | readonly undefined[] | {e?: {a?: 1} | {a?: 2}}};
};

type Out6 = {
	a: 1 | {
		b: 2;
		c: 3 | undefined;
		d: readonly undefined[] | {
			e: {
				a: 1 | undefined;
			} | {
				a: 2 | undefined;
			} | undefined;
		} | undefined;
	} | undefined;
};

type In7 = {a?: 1};

type Out7 = {a: | 0 | 1};

declare const test1: Patch<In1>;
declare const test2: Patch<In2, null>;
declare const test3: Patch<In3>;
declare const test4: Patch<In4>;
declare const test5: Patch<In5>;
declare const test6: Patch<In6>;
declare const test7: Patch<In7, 0>;

expectType<Out1>(test1);
expectType<Out2>(test2);
expectType<Out3>(test3);
expectType<Out4>(test4);
expectType<Out5>(test5);
expectType<Out6>(test6);
expectType<Out7>(test7);
