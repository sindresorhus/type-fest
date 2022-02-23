import {expectType} from 'tsd';
import {NonNullableKeys} from '../index';

type Mixed = {
	a: number;
	b: string;
	c: number | string;
	d: number | null;
	e: string | null;
	f: number | string | null;
};

type StandaloneNull = {
	a: string;
	b: null;
};

type ObjectOrNull = {
	a: string;
	b: {
		c: number;
	} | null;
};

declare const MixedKeys: NonNullableKeys<Mixed>;
expectType<'a' | 'b' | 'c'>(MixedKeys);

declare const StandaloneNullKeys: NonNullableKeys<StandaloneNull>;
expectType<'a'>(StandaloneNullKeys);

declare const ObjectOrNullKeys: NonNullableKeys<ObjectOrNull>;
expectType<'a'>(ObjectOrNullKeys);
