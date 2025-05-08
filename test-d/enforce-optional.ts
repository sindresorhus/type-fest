import {expectType} from 'tsd';
import type {EnforceOptional} from '../source/enforce-optional.d.ts';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type EnforcedOptionalFoo = EnforceOptional<Foo>;

declare const enforcedOptionalFoo: EnforcedOptionalFoo;

expectType<{
	a: string;
	b?: string;
	c: undefined;
	d?: number;
}>(enforcedOptionalFoo);
