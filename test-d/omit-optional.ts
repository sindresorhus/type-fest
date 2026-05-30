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

type AllOptional = {
	a?: string;
	b?: boolean;
};

declare const test1: OmitOptional<WithOptional>;
expectType<{a: string}>(test1);

declare const test2: OmitOptional<WithoutOptional>;
expectType<{a: string; b: boolean; c: number}>(test2);

declare const test3: OmitOptional<AllOptional>;
type Result3 = OmitOptional<AllOptional>;
expectType<Result3>(test3);

// Should work with readonly
declare const test4: OmitOptional<{readonly a: string; readonly b?: number}>;
type Result4 = OmitOptional<{readonly a: string; readonly b?: number}>;
expectType<Result4>(test4);

// Should work with empty object
declare const test5: OmitOptional<{}>;
type Result5 = OmitOptional<{}>;
expectType<Result5>(test5);
