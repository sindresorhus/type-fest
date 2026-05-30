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
expectType<Record<string, never>>({} as OmitOptional<AllOptional>);

// Should work with readonly
expectType<{readonly a: string}>({} as OmitOptional<{readonly a: string; readonly b?: number}>);

// Should work with empty object
expectType<Record<string, never>>({} as OmitOptional<{}>);
