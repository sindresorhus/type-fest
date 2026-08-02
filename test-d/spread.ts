import {expectType} from 'tsd';
import type {Spread} from '../index.d.ts';

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

const arrayFoo = [1, 2, 3];
const arrayBar = [4, 5, 6];

const arrayFooBar = [...arrayFoo, ...arrayBar]; //=> number[]
type ArrayFooBar = Spread<typeof arrayFoo, typeof arrayBar>;

expectType<ArrayFooBar>(arrayFooBar);
expectType<number[]>(arrayFooBar);

const stringArray = ['4', '5', '6'];

const mixedArrayFooBar = [...arrayFoo, ...stringArray]; //=> (string | number)[]
type MixedArrayFooBar = Spread<typeof arrayFoo, typeof stringArray>;

expectType<MixedArrayFooBar>(mixedArrayFooBar);
expectType<Array<string | number>>(mixedArrayFooBar);

const tupleFoo: [1, 2, 3] = [1, 2, 3];
const tupleBar: [4, 5, 6] = [4, 5, 6];

const tupleFooBar = [...tupleFoo, ...tupleBar]; //=> (1 | 2 | 3 | 4 | 5 | 6)[]
type TupleFooBar = Spread<typeof tupleFoo, typeof tupleBar>;

expectType<TupleFooBar>(tupleFooBar);
expectType<Array<1 | 2 | 3 | 4 | 5 | 6>>(tupleFooBar);

const arrayTupleFooBar = [...arrayFoo, ...tupleBar]; //=> number[]
type ArrayTupleFooBar = Spread<typeof arrayFoo, typeof tupleBar>;

expectType<ArrayTupleFooBar>(arrayTupleFooBar);
expectType<number[]>(arrayTupleFooBar);

const tupleArrayFooBar = [...tupleFoo, ...arrayBar]; //=> number[]
type TupleArrayFooBar = Spread<typeof tupleFoo, typeof arrayBar>;

expectType<TupleArrayFooBar>(tupleArrayFooBar);
expectType<number[]>(tupleArrayFooBar);
