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

// Optional numeric properties share their key with the corresponding string spelling.
expectTypeOf<Spread<{0: 'first'}, {'0'?: 'second'}>>().toBe<{0: 'first' | 'second'}>();
expectTypeOf<Spread<{'0': 'first'}, {0?: 'second'}>>().toBe<{'0': 'first' | 'second'}>();
expectTypeOf<Spread<{readonly 0?: 'first'}, {readonly '0'?: 'second'}>>().toBe<{0?: 'first' | 'second'}>();
expectTypeOf<Spread<{readonly '0'?: 'first'}, {readonly 0: 'second'}>>().toBe<{0: 'second'}>();
expectTypeOf<Spread<{0: 'first'}, {'0'?: 'second' | undefined}>>().toBe<{0: 'first' | 'second' | undefined}>();
expectTypeOf<Spread<{'01': 'padded'}, {1?: 'canonical'}>>().toBe<{'01': 'padded'; 1?: 'canonical'}>();
expectTypeOf<Spread<{1: 'canonical'}, {'01'?: 'padded'}>>().toBe<{1: 'canonical'; '01'?: 'padded'}>();
expectTypeOf<Spread<{1.5: 'first'}, {'1.5'?: 'second'}>>().toBe<{1.5: 'first' | 'second'}>();
expectTypeOf<Spread<{'-1': 'first'}, {[-1]?: 'second'}>>().toBe<{'-1': 'first' | 'second'}>();
expectTypeOf<Spread<{0: any}, {'0'?: string}>>().toBe<{0: any}>();
expectTypeOf<Spread<{0: unknown}, {'0'?: string}>>().toBe<{0: unknown}>();
expectTypeOf<Spread<{0: never}, {'0'?: string}>>().toBe<{0: string}>();
expectTypeOf<Spread<{0: 'first'; keep: true} | {'0': 'other'; keep: false}, {'0'?: 'second'}>>().toBe<{0: 'first' | 'second'; keep: true} | {'0': 'other' | 'second'; keep: false}>();

// Match compiler inference for both spellings and modifier combinations.
declare const numericProperty: {readonly 0: 'first'; keep: true};
declare const optionalStringProperty: {readonly '0'?: 'second'};
const numericAliasSpread = {...numericProperty, ...optionalStringProperty};
expectTypeOf(numericAliasSpread).toBe<Spread<typeof numericProperty, typeof optionalStringProperty>>();

const numericAliasSpreadReverse = {...optionalStringProperty, ...numericProperty};
expectTypeOf(numericAliasSpreadReverse).toBe<Spread<typeof optionalStringProperty, typeof numericProperty>>();

// A string enum key and its literal spelling name the same property during a spread.
enum SpreadKey {
	Value = 'value',
}
expectTypeOf<Spread<{value: string}, {[SpreadKey.Value]?: number}>>().toBe<{value: string | number}>();
expectTypeOf<Spread<{[SpreadKey.Value]: string}, {value?: number}>>().toBe<{[SpreadKey.Value]: string | number}>();
expectTypeOf<Spread<{value: string}, {[SpreadKey.Value]: number}>>().toBe<{[SpreadKey.Value]: number}>();

// Compare both value and key shapes with TypeScript's own spread inference.
declare const enumRequired: {readonly [SpreadKey.Value]: string; keep?: boolean};
declare const enumOptional: {readonly [SpreadKey.Value]?: number};
declare const literalRequired: {readonly value: boolean};
declare const literalOptional: {readonly value?: number};
const enumAfterLiteral = {...literalRequired, ...enumOptional};
const literalAfterEnum = {...enumRequired, ...literalOptional};
const requiredEnumAfterLiteral = {...literalRequired, ...enumRequired};
const requiredLiteralAfterEnum = {...enumRequired, ...literalRequired};
expectTypeOf(enumAfterLiteral).toBe<Spread<typeof literalRequired, typeof enumOptional>>();
expectTypeOf(literalAfterEnum).toBe<Spread<typeof enumRequired, typeof literalOptional>>();
expectTypeOf(requiredEnumAfterLiteral).toBe<Spread<typeof literalRequired, typeof enumRequired>>();
expectTypeOf(requiredLiteralAfterEnum).toBe<Spread<typeof enumRequired, typeof literalRequired>>();
expectTypeOf<keyof Spread<typeof literalRequired, typeof enumOptional>>().toBe<keyof typeof enumAfterLiteral>();
expectTypeOf<keyof Spread<typeof enumRequired, typeof literalOptional>>().toBe<keyof typeof literalAfterEnum>();
expectTypeOf<Pick<Spread<typeof enumRequired, typeof literalOptional>, SpreadKey.Value>>()
	.toBe<Pick<typeof literalAfterEnum, SpreadKey.Value>>();

// Optionality and explicit undefined survive, while spread drops readonly.
expectTypeOf<Spread<{readonly value?: string}, {readonly [SpreadKey.Value]?: number}>>().toBe<{value?: string | number}>();
expectTypeOf<Spread<{readonly [SpreadKey.Value]?: string}, {readonly value?: number}>>().toBe<{[SpreadKey.Value]?: string | number}>();
expectTypeOf<Spread<{value: string}, {[SpreadKey.Value]?: number | undefined}>>().toBe<{value: string | number | undefined}>();
expectTypeOf<Spread<{[SpreadKey.Value]: string}, {value?: number | undefined}>>().toBe<{[SpreadKey.Value]: string | number | undefined}>();
expectTypeOf<Spread<{[SpreadKey.Value]?: string}, {value: number}>>().toBe<{value: number}>();

// Normalize both operands independently, including unions and numeric enum keys.
expectTypeOf<Spread<{value: string} | {other: true}, {[SpreadKey.Value]?: number}>>()
	.toBe<{value: string | number} | {other: true; [SpreadKey.Value]?: number}>();
expectTypeOf<Spread<{value: string}, {[SpreadKey.Value]?: number} | {other: true}>>()
	.toBe<{value: string | number} | {value: string; other: true}>();
enum NumericSpreadKey {
	Zero = 0,
}
expectTypeOf<Spread<{'0': string}, {[NumericSpreadKey.Zero]?: number}>>().toBe<{'0': string | number}>();
expectTypeOf<Spread<{[NumericSpreadKey.Zero]: string}, {'0'?: number}>>().toBe<{[NumericSpreadKey.Zero]: string | number}>();
expectTypeOf<keyof Spread<{0: string}, {'0'?: number}>>().toBe<0>();
expectTypeOf<Pick<Spread<{0: string}, {'0'?: number}>, 0>>().toBe<{0: string | number}>();

// Distinct names, noncanonical numeric spellings, symbols, and signatures retain their existing rules.
expectTypeOf<Spread<{other: string}, {[SpreadKey.Value]?: number}>>().toBe<{other: string; [SpreadKey.Value]?: number}>();
expectTypeOf<Spread<{'01': string}, {[NumericSpreadKey.Zero]?: number}>>().toBe<{'01': string; [NumericSpreadKey.Zero]?: number}>();
expectTypeOf<Spread<{[spreadSymbol]: string; value: boolean}, {[SpreadKey.Value]?: number}>>()
	.toBe<{[spreadSymbol]: string; value: boolean | number}>();
expectTypeOf<Spread<{[index: number]: string; value: boolean}, {[index: number]: number; [SpreadKey.Value]?: Date}>>()
	.toBe<{[index: number]: string | number; value: boolean | Date}>();
expectTypeOf<Spread<{[key: string]: unknown; value: string}, {[key: string]: unknown; [SpreadKey.Value]?: number}>>()
	.toBe<{[key: string]: unknown; [key: number]: unknown; value: string | number}>();

expectTypeOf<Spread<{value: any}, {[SpreadKey.Value]?: number}>>().toBe<{value: any}>();
expectTypeOf<Spread<{value: unknown}, {[SpreadKey.Value]?: number}>>().toBe<{value: unknown}>();
expectTypeOf<Spread<{value: never}, {[SpreadKey.Value]?: number}>>().toBe<{value: number}>();
expectTypeOf<Spread<any, {[SpreadKey.Value]?: number}>>().toBe<any>();
expectTypeOf<Spread<never, {[SpreadKey.Value]?: number}>>().toBe<never>();
// @ts-expect-error Only objects or arrays can be spread.
type UnknownEnumSpread = Spread<unknown, {[SpreadKey.Value]?: number}>;

// A required second property fully replaces the first spelling, including its keyof identity.
expectTypeOf<keyof Spread<typeof literalRequired, typeof enumRequired>>().toBe<keyof typeof requiredEnumAfterLiteral>();
expectTypeOf<keyof Spread<typeof enumRequired, typeof literalRequired>>().toBe<keyof typeof requiredLiteralAfterEnum>();

// Required numeric and string aliases keep the correct values. Their keyof spelling is best-effort, because TypeScript sometimes retains the first string spelling even when the second key is numeric.
declare const requiredNumericAlias: {readonly 0: 'numeric'; keep: boolean};
declare const requiredStringAlias: {readonly '0': 'string'};
const requiredStringAliasSpread = {...requiredNumericAlias, ...requiredStringAlias};
const requiredNumericAliasSpread = {...requiredStringAlias, ...requiredNumericAlias};
expectTypeOf(requiredStringAliasSpread).toBe<Spread<typeof requiredNumericAlias, typeof requiredStringAlias>>();
expectTypeOf(requiredNumericAliasSpread).toBe<Spread<typeof requiredStringAlias, typeof requiredNumericAlias>>();
expectTypeOf<keyof Spread<typeof requiredNumericAlias, typeof requiredStringAlias>>().toBe<keyof typeof requiredStringAliasSpread>();
expectTypeOf<Pick<Spread<typeof requiredStringAlias, typeof requiredNumericAlias>, 0>>().toBe<{0: 'numeric'}>();

// Shared readonly index signatures become writable, with values from either operand.
declare const readonlyStringFirst: Readonly<Record<string, number>>;
declare const readonlyStringSecond: Readonly<Record<string, string>>;
const actualReadonlyStrings = {...readonlyStringFirst, ...readonlyStringSecond};
declare const writableStrings: Spread<typeof readonlyStringFirst, typeof readonlyStringSecond>;
expectTypeOf(writableStrings).toBeAssignableTo<typeof actualReadonlyStrings>();
expectTypeOf(actualReadonlyStrings).toBeAssignableTo<typeof writableStrings>();
writableStrings['entry'] = 1;
writableStrings['entry'] = 'value';
// @ts-expect-error The shared index signature still restricts its value type.
writableStrings['entry'] = false;

declare const writableNumbers: Spread<Readonly<Record<number, string>>, Readonly<Record<number, number>>>;
writableNumbers[0] = 1;
writableNumbers[1] = 'value';
// @ts-expect-error Dropping readonly does not widen numeric index values.
writableNumbers[2] = false;

declare const writablePattern: Spread<{readonly [key: `row-${string}`]: string}, {readonly [key: `row-${string}`]: number}>;
writablePattern['row-first'] = 1;
writablePattern['row-second'] = 'value';
// @ts-expect-error The template index signature still restricts its value type.
writablePattern['row-third'] = false;
// @ts-expect-error The template index signature does not accept unrelated keys.
writablePattern['other'] = 1;
