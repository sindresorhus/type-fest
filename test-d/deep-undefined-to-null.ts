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
	a: void;
	b?: void;
	c?: {
		d?: void;
		e?: {
			f?: void;
			g: void;
		};
	};
	d?: void | undefined;
	e?: void | null;
	f?: void | undefined | null;
	g: void | undefined;
};

type Out5 = {
	a: void;
	b: never;
	c: {
		d: never;
		e: {
			f: never;
			g: void;
		};
	};
	d: never;
	e: void | null;
	f: void | null;
	g: void | undefined;
};

declare const test1: DeepUndefinedToNull<In1>;
declare const test2: DeepUndefinedToNull<In2>;
declare const test3: DeepUndefinedToNull<In3>;
declare const test4: DeepUndefinedToNull<In4>;
declare const test5: DeepUndefinedToNull<In5>;

expectType<Out1>(test1);
expectType<Out2>(test2);
expectType<Out3>(test3);
expectType<Out4>(test4);
expectType<Out5>(test5);
