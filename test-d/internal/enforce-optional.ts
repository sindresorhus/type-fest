import {expectTypeOf} from 'nz';
import type {EnforceOptional} from '../../source/internal/index.d.ts';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type EnforcedOptionalFoo = EnforceOptional<Foo>;

declare const enforcedOptionalFoo: EnforcedOptionalFoo;

expectTypeOf(enforcedOptionalFoo).toBe<{
	a: string;
	b?: string;
	c: undefined;
	d?: number;
}>();
