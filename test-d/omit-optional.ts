import {expectType} from 'tsd';
import type {OmitOptional} from '../index.d.ts';

type WithOptional = {
	a: string;
	b?: boolean;
	c?: number;
};

type WithoutOptional = {
	a: string;
	b: boolean;
	c: number;
};

declare const test1: OmitOptional<WithOptional>;
expectType<{a: string}>(test1);

declare const test2: OmitOptional<WithoutOptional>;
expectType<{a: string; b: boolean; c: number}>(test2);

// Works with readonly
declare const test3: OmitOptional<{readonly a: string}>;
expectType<{readonly a: string}>(test3);
