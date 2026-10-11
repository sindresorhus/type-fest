import {expectTypeOf} from 'nz';
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

expectTypeOf(foobar).toBe<FooBar>();

const arrayFoo = [1, 2, 3];
const arrayBar = [4, 5, 6];

const arrayFooBar = [...arrayFoo, ...arrayBar]; //=> number[]
type ArrayFooBar = Spread<typeof arrayFoo, typeof arrayBar>;

expectTypeOf(arrayFooBar).toBe<ArrayFooBar>();
expectTypeOf(arrayFooBar).toBe<number[]>();

const stringArray = ['4', '5', '6'];

const mixedArrayFooBar = [...arrayFoo, ...stringArray]; //=> (string | number)[]
type MixedArrayFooBar = Spread<typeof arrayFoo, typeof stringArray>;

expectTypeOf(mixedArrayFooBar).toBe<MixedArrayFooBar>();
expectTypeOf(mixedArrayFooBar).toBe<Array<string | number>>();

const tupleFoo: [1, 2, 3] = [1, 2, 3];
const tupleBar: [4, 5, 6] = [4, 5, 6];

const tupleFooBar = [...tupleFoo, ...tupleBar]; //=> (1 | 2 | 3 | 4 | 5 | 6)[]
type TupleFooBar = Spread<typeof tupleFoo, typeof tupleBar>;

expectTypeOf(tupleFooBar).toBe<TupleFooBar>();
expectTypeOf(tupleFooBar).toBe<Array<1 | 2 | 3 | 4 | 5 | 6>>();

const arrayTupleFooBar = [...arrayFoo, ...tupleBar]; //=> number[]
type ArrayTupleFooBar = Spread<typeof arrayFoo, typeof tupleBar>;

expectTypeOf(arrayTupleFooBar).toBe<ArrayTupleFooBar>();
expectTypeOf(arrayTupleFooBar).toBe<number[]>();

const tupleArrayFooBar = [...tupleFoo, ...arrayBar]; //=> number[]
type TupleArrayFooBar = Spread<typeof tupleFoo, typeof arrayBar>;

expectTypeOf(tupleArrayFooBar).toBe<TupleArrayFooBar>();
expectTypeOf(tupleArrayFooBar).toBe<number[]>();

// A union second operand spreads to a union, just like the real spread syntax.
declare const unionSpreadFirst: {a: 1};
declare const unionSpreadSecond: {b: 2} | {c: 3};
const realUnionSpread = {...unionSpreadFirst, ...unionSpreadSecond};

expectTypeOf(realUnionSpread).toBe<{b: 2; a: 1} | {c: 3; a: 1}>();
expectTypeOf(realUnionSpread).toBe<Spread<typeof unionSpreadFirst, typeof unionSpreadSecond>>();

declare const unionFirst: {a: 1} | {z: 9};
declare const unionSecond: {b: 2};
const realBothUnions = {...unionFirst, ...unionSecond};

expectTypeOf(realBothUnions).toBe<{a: 1; b: 2} | {z: 9; b: 2}>();
expectTypeOf(realBothUnions).toBe<Spread<typeof unionFirst, typeof unionSecond>>();

// The spread syntax produces a fresh object literal, so it also drops `readonly`.
declare const readonlyFirst: {readonly a: 1; b?: 2};
declare const readonlySecond: {readonly c: 3; d?: 4};
const realReadonlySpread = {...readonlyFirst, ...readonlySecond};

expectTypeOf(realReadonlySpread).toBe<{a: 1; b?: 2; c: 3; d?: 4}>();
expectTypeOf(realReadonlySpread).toBe<Spread<typeof readonlyFirst, typeof readonlySecond>>();

// An index signature that only one operand has contributes no keys.
declare const indexSignatureFirst: {[k: string]: number};
declare const plainSecond: {b: string};
const realIndexSignatureFirst = {...indexSignatureFirst, ...plainSecond};
expectTypeOf<Spread<typeof indexSignatureFirst, typeof plainSecond>>().toBe<typeof realIndexSignatureFirst>();

declare const plainFirst: {a: 1};
declare const indexSignatureSecond: {[k: string]: string};
const realIndexSignatureSecond = {...plainFirst, ...indexSignatureSecond};
expectTypeOf<Spread<typeof plainFirst, typeof indexSignatureSecond>>().toBe<typeof realIndexSignatureSecond>();

// The spread syntax produces a fresh object literal, so it also drops an optional modifier that the spread itself would have introduced, and a key the two operands do not share keeps its own modifier.
declare const optionalFirst: {a?: 1; readonly b?: 2};
declare const plainThird: {c: 3};
const realOptionalSpread = {...optionalFirst, ...plainThird};
expectTypeOf(realOptionalSpread).toBe<{a?: 1; b?: 2; c: 3}>();
expectTypeOf(realOptionalSpread).toBe<Spread<typeof optionalFirst, typeof plainThird>>();

// A key on both sides takes the second's value, and the result is required whatever the first said, because a fresh object literal has a value at every key the spread names.
declare const sharedOptional: {a?: string};
declare const sharedRequired: {a: number};
const realSharedSpread = {...sharedOptional, ...sharedRequired};
expectTypeOf(realSharedSpread).toBe<{a: number}>();
expectTypeOf(realSharedSpread).toBe<Spread<typeof sharedOptional, typeof sharedRequired>>();

// The other way round the second may not have overwritten what was there, so the union of both survives, and it is still required.
const realSharedSpreadReverse = {...sharedRequired, ...sharedOptional};
expectTypeOf(realSharedSpreadReverse).toBe<{a: string | number}>();
expectTypeOf(realSharedSpreadReverse).toBe<Spread<typeof sharedRequired, typeof sharedOptional>>();

// Only when the second also declares the key optional does the union stay optional, which is the one shape where optionality survives a shared key.
declare const sharedOptionalSecond: {a?: number};
const realSharedOptionalSpread = {...sharedOptional, ...sharedOptionalSecond};
expectTypeOf(realSharedOptionalSpread).toBe<{a?: string | number}>();
expectTypeOf(realSharedOptionalSpread).toBe<Spread<typeof sharedOptional, typeof sharedOptionalSecond>>();

// The spread syntax infers `any` when either operand is `any`, so the type has to as well: it drops the other operand's keys, which leaves it accepting strictly less than the runtime does.
declare const topTypeFirst: any;
declare const topTypeSecond: any;
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- the spread of an `any` is the point
const realTopTypeSpread = {...topTypeFirst, ...topTypeSecond};
expectTypeOf(realTopTypeSpread).toBe<any>();
expectTypeOf(realTopTypeSpread).toBe<Spread<any, any>>();

declare const plainSecondAny: {b: 2};
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- the spread of an `any` is the point
const realTopTypeSpreadWithPlain = {...topTypeFirst, ...plainSecondAny};
expectTypeOf(realTopTypeSpreadWithPlain).toBe<any>();
expectTypeOf(realTopTypeSpreadWithPlain).toBe<Spread<any, typeof plainSecondAny>>();

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- the spread of an `any` is the point
const realTopTypeSpreadWithPlainFirst = {...plainFirst, ...topTypeSecond};
expectTypeOf(realTopTypeSpreadWithPlainFirst).toBe<any>();
expectTypeOf(realTopTypeSpreadWithPlainFirst).toBe<Spread<typeof plainFirst, any>>();

// An array operand is a different branch, and spreading an array of `any` does give an array of `any`.
declare const topTypeArray: any[];
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- the spread of an array of `any` is the point
const realTopTypeArraySpread = [...topTypeArray, ...topTypeArray];
expectTypeOf(realTopTypeArraySpread).toBe<any[]>();
expectTypeOf(realTopTypeArraySpread).toBe<Spread<any[], any[]>>();

// A signature both operands have survives the spread, with both value types.
declare const recordFirst: Record<string, number>;
declare const recordSecond: Record<string, string>;
const realSharedSignature = {...recordFirst, ...recordSecond};
expectTypeOf(realSharedSignature).toBe<{[x: string]: string | number}>();
expectTypeOf<Spread<typeof recordFirst, typeof recordSecond>['anything']>().toBe<string | number>();

// Optional values explicitly admitting `undefined` can overwrite a required value with `undefined`.
declare const optionalUndefined: {a?: number | undefined};
const realExplicitUndefinedSpread = {...sharedRequired, ...optionalUndefined};
expectTypeOf(realExplicitUndefinedSpread).toBe<Spread<typeof sharedRequired, typeof optionalUndefined>>();

// Numeric index signatures and symbol keys follow the same spread rules as string keys.
declare const numericSignatureFirst: {readonly [index: number]: string};
declare const numericSignatureSecond: {[index: number]: number};
const realNumericSignatureSpread = {...numericSignatureFirst, ...numericSignatureSecond};
expectTypeOf(realNumericSignatureSpread).toBe<Spread<typeof numericSignatureFirst, typeof numericSignatureSecond>>();

declare const spreadSymbol: unique symbol;
declare const symbolFirst: {readonly [spreadSymbol]: string};
declare const symbolSecond: {[spreadSymbol]?: number};
const realSymbolSpread = {...symbolFirst, ...symbolSecond};
expectTypeOf(realSymbolSpread).toBe<Spread<typeof symbolFirst, typeof symbolSecond>>();
