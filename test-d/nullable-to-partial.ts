import {expectType} from 'tsd';
import {NullableToOptional} from '../index';

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

declare const MixedKeys: NullableToOptional<Mixed>;
expectType<{
	a: number;
	b: string;
	c: number | string;
	d?: number | null;
	e?: string | null;
	f?: number | string | null;
}>(MixedKeys);

declare const StandaloneNullKeys: NullableToOptional<StandaloneNull>;
expectType<{a: string; b?: null}>(StandaloneNullKeys);

declare const ObjectOrNullKeys: NullableToOptional<ObjectOrNull>;
expectType<{
	a: string;
	b?: {
		c: number;
	} | null;
}>(ObjectOrNullKeys);
