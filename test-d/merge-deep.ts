import {expectAssignable, expectNotType, expectType} from 'tsd';
import {MergeDeep} from '../index';

// Test MergeDeep inputs

declare const sign1: MergeDeep<{}, {}>; // {}
declare const sign2: MergeDeep<[], []>; // Never

expectNotType<never>(sign1);
expectType<never>(sign2);

declare const sign3: MergeDeep<{}, []>; // Never
declare const sign4: MergeDeep<[], {}>; // Never

expectType<never>(sign3);
expectType<never>(sign4);

declare const sign5: MergeDeep<42, {}>; // Never
declare const sign6: MergeDeep<42, []>; // Never

expectType<never>(sign5);
expectType<never>(sign6);

declare const sign7: MergeDeep<{}, 42>; // Never
declare const sign8: MergeDeep<[], 42>; // Never

expectType<never>(sign7);
expectType<never>(sign8);

declare const sign9: MergeDeep<{}, {}, {recurseIntoArrays: true}>; // {}
declare const sign10: MergeDeep<[], [], {recurseIntoArrays: true}>; // []

expectNotType<never>(sign9);
expectNotType<never>(sign10);

declare const sign11: MergeDeep<{}, [], {recurseIntoArrays: true}>; // Never
declare const sign12: MergeDeep<[], {}, {recurseIntoArrays: true}>; // Never

expectType<never>(sign11);
expectType<never>(sign12);

declare const sign13: MergeDeep<42, {}, {recurseIntoArrays: true}>; // Never
declare const sign14: MergeDeep<42, [], {recurseIntoArrays: true}>; // Never

expectType<never>(sign13);
expectType<never>(sign14);

declare const sign15: MergeDeep<{}, 42, {recurseIntoArrays: true}>; // Never
declare const sign16: MergeDeep<[], 42, {recurseIntoArrays: true}>; // Never

expectType<never>(sign15);
expectType<never>(sign16);

// Test flat plain object

const src1 = {life: 42, name: 'nyan', a: undefined};
const dest1 = {life: '24', fly: true, b: undefined};
const merge1 = {...dest1, ...src1};

expectType<MergeDeep<typeof dest1, typeof src1>>(merge1);

// Test deep plain object

const src2 = {a: 'a', b: src1, c: {d: src1}};
const dest2 = {a: 'z', b: dest1, c: {d: dest1}};
const merge2 = {a: 'a', b: merge1, c: {d: merge1}};

expectType<MergeDeep<typeof dest2, typeof src2>>(merge2);

// Undefied properties must be preserved

const src3 = {a: 'a', c: undefined, e: 42, f: undefined};
const dest3 = {b: 'b', d: undefined, e: undefined, f: 42};

const merge3 = {a: 'a', b: 'b', c: undefined, d: undefined, e: 42, f: undefined};
declare const type3: MergeDeep<typeof dest3, typeof src3>;

expectType<typeof merge3>(type3);

// Undefied properties must be skipped

const merge4 = {a: 'a', b: 'b', e: 42};
declare const type4: MergeDeep<typeof dest3, typeof src3, {stripUndefinedValues: true}>;

expectType<typeof merge4>(type4);

// Should replace arrays

const src5 = {a: 'a', items: ['4', '5', '6']};
const dest5 = {b: 'b', items: [1, 2, 3]};

const merge5 = {a: 'a', b: 'b', items: ['4', '5', '6']};
declare const prout5: MergeDeep<typeof dest5, typeof src5>;

expectType<typeof merge5>(prout5);

// Should concat arrays

const merge6 = {a: 'a', b: 'b', items: [1, 2, 3, '4', '5', '6']};
declare const prout6: MergeDeep<typeof dest5, typeof src5, {recurseIntoArrays: true}>;

expectType<typeof merge6>(prout6);

// Test deep object with arrays ans undefined values

type Foo1 = {
	l0: string;
	a: string;
	b: {
		skipped: undefined;
		l1: string;
		x: string;
		y: {
			l2: string;
			u: string;
			v: string;
      items: string[];
		};
	};
	q: Date;
};

type Bar1 = {
	new: number;
	a: number;
	b: {
		x: number;
		y: {
			u: number;
			v: number;
			skipped: undefined;
      items: number[];
		};
	};
	q: {life: 42};
	skipped: undefined;
};

expectAssignable<MergeDeep<Foo1, Bar1>>({
	l0: 'string',
	a: 42,
	b: {
    skipped: undefined,
    l1: 'string',
		x: 42,
		y: {
			l2: 'string',
			u: 42,
			v: 42,
			skipped: undefined,
      items: [1, 2, 3],
		},
	},
	q: {
		life: 42,
	},
  skipped: undefined,
	new: 42,
});

expectAssignable<MergeDeep<Foo1, Bar1, {stripUndefinedValues: true; recurseIntoArrays: true}>>({
	l0: 'string',
	a: 42,
	b: {
		l1: 'string',
		x: 42,
		y: {
			l2: 'string',
			u: 42,
			v: 42,
      items: [1, 2, 3, 'a', 'b', 'c'],
		},
	},
	q: {
		life: 42,
	},
	new: 42,
});
