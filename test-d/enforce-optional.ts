import {expectTypeOf} from 'expect-type';
import type {EnforceOptional} from '../source/enforce-optional';

type Foo = {
	a: string;
	b?: string;
	c: undefined;
	d: number | undefined;
};

type EnforcedOptionalFoo = EnforceOptional<Foo>;

declare const enforcedOptionalFoo: EnforcedOptionalFoo;

expectTypeOf(enforcedOptionalFoo).toEqualTypeOf<{
	a: string;
	b?: string;
	c: undefined;
	d?: number;
}>();
