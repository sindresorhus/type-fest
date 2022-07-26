import {expectType} from 'tsd';
import type {Spread} from '../index';

type Foo = {
	a: 'a1';
	b?: 'b1';
	c: 'c1';
	d?: 'd1';
	e: 'e1' | undefined;
	f: 'f1';
	g?: 'g1';
};

type Bar = {
	a?: 'a2';
	b: 'b2';
	c: 'c2';
	d?: 'd2';
	e?: 'e2';
	h: 'h2';
	i?: 'i2';
};

type FooBar = Spread<Foo, Bar>;

const foo: Foo = {
	a: 'a1',
	b: 'b1',
	c: 'c1',
	d: 'd1',
	e: 'e1',
	f: 'f1',
	g: 'g1',
};

const bar: Bar = {
	b: 'b2',
	c: 'c2',
	h: 'h2',
};

const foobar = {...foo, ...bar};

expectType<FooBar>(foobar);
