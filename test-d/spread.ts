import {expectTypeOf} from 'expect-type';
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

expectTypeOf(foobar).toEqualTypeOf<FooBar>();

const arrayFoo = [1, 2, 3];
const arrayBar = [4, 5, 6];

const arrayFooBar = [...arrayFoo, ...arrayBar]; //=> number[]
type ArrayFooBar = Spread<typeof arrayFoo, typeof arrayBar>;

expectTypeOf(arrayFooBar).toEqualTypeOf<ArrayFooBar>();
expectTypeOf(arrayFooBar).toEqualTypeOf<number[]>();

const stringArray = ['4', '5', '6'];

const mixedArrayFooBar = [...arrayFoo, ...stringArray]; //=> (string | number)[]
type MixedArrayFooBar = Spread<typeof arrayFoo, typeof stringArray>;

expectTypeOf(mixedArrayFooBar).toEqualTypeOf<MixedArrayFooBar>();
expectTypeOf(mixedArrayFooBar).toEqualTypeOf<Array<string | number>>();

const tupleFoo: [1, 2, 3] = [1, 2, 3];
const tupleBar: [4, 5, 6] = [4, 5, 6];

const tupleFooBar = [...tupleFoo, ...tupleBar]; //=> (1 | 2 | 3 | 4 | 5 | 6)[]
type TupleFooBar = Spread<typeof tupleFoo, typeof tupleBar>;

expectTypeOf(tupleFooBar).toEqualTypeOf<TupleFooBar>();
expectTypeOf(tupleFooBar).toEqualTypeOf<Array<1 | 2 | 3 | 4 | 5 | 6>>();

const arrayTupleFooBar = [...arrayFoo, ...tupleBar]; //=> number[]
type ArrayTupleFooBar = Spread<typeof arrayFoo, typeof tupleBar>;

expectTypeOf(arrayTupleFooBar).toEqualTypeOf<ArrayTupleFooBar>();
expectTypeOf(arrayTupleFooBar).toEqualTypeOf<number[]>();

const tupleArrayFooBar = [...tupleFoo, ...arrayBar]; //=> number[]
type TupleArrayFooBar = Spread<typeof tupleFoo, typeof arrayBar>;

expectTypeOf(tupleArrayFooBar).toEqualTypeOf<TupleArrayFooBar>();
expectTypeOf(tupleArrayFooBar).toEqualTypeOf<number[]>();
