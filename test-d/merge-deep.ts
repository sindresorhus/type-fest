import {expectAssignable, expectNotType, expectType} from 'tsd';
import {MergeDeep} from '../index';

// Test MergeDeep inputs

declare const signature1: MergeDeep<{}, {}>; // {}
declare const signature2: MergeDeep<[], []>; // Never

expectNotType<never>(signature1);
expectNotType<never>(signature2);

declare const signature3: MergeDeep<{}, []>; // Never
declare const signature4: MergeDeep<[], {}>; // Never

expectType<never>(signature3);
expectType<never>(signature4);

declare const signature5: MergeDeep<42, {}>; // Never
declare const signature6: MergeDeep<42, []>; // Never

expectType<never>(signature5);
expectType<never>(signature6);

declare const signature7: MergeDeep<{}, 42>; // Never
declare const signature8: MergeDeep<[], 42>; // Never

expectType<never>(signature7);
expectType<never>(signature8);

declare const signature9: MergeDeep<{}, {}, {recurseIntoArrays: true}>; // {}
declare const signature10: MergeDeep<[], [], {recurseIntoArrays: true}>; // []

expectNotType<never>(signature9);
expectNotType<never>(signature10);

declare const signature11: MergeDeep<{}, [], {recurseIntoArrays: true}>; // Never
declare const signature12: MergeDeep<[], {}, {recurseIntoArrays: true}>; // Never

expectType<never>(signature11);
expectType<never>(signature12);

declare const signature13: MergeDeep<42, {}, {recurseIntoArrays: true}>; // Never
declare const signature14: MergeDeep<42, [], {recurseIntoArrays: true}>; // Never

expectType<never>(signature13);
expectType<never>(signature14);

declare const signature15: MergeDeep<{}, 42, {recurseIntoArrays: true}>; // Never
declare const signature16: MergeDeep<[], 42, {recurseIntoArrays: true}>; // Never

expectType<never>(signature15);
expectType<never>(signature16);

// Test flat plain object

const source1 = {life: 42, name: 'nyan', a: undefined};
const destination1 = {life: '24', fly: true, b: undefined};
const merge1 = {...destination1, ...source1};

expectType<MergeDeep<typeof destination1, typeof source1>>(merge1);

// Test deep plain object

const source2 = {a: 'a', b: source1, c: {d: source1}};
const destination2 = {a: 'z', b: destination1, c: {d: destination1}};
const merge2 = {a: 'a', b: merge1, c: {d: merge1}};

expectType<MergeDeep<typeof destination2, typeof source2>>(merge2);

// Undefied properties must be preserved

const source3 = {a: 'a', c: undefined, e: 42, f: undefined};
const destination3 = {b: 'b', d: undefined, e: undefined, f: 42};

const merge3 = {a: 'a', b: 'b', c: undefined, d: undefined, e: 42, f: undefined};
declare const type3: MergeDeep<typeof destination3, typeof source3>;

expectType<typeof merge3>(type3);

// Undefied properties must be skipped

const merge4 = {a: 'a', b: 'b', e: 42};
declare const type4: MergeDeep<typeof destination3, typeof source3, {stripUndefinedValues: true}>;

expectType<typeof merge4>(type4);

// Should replace arrays

const source5 = {a: 'a', items: ['4', '5', '6']};
const destination5 = {b: 'b', items: [1, 2, 3]};

const merge5 = {a: 'a', b: 'b', items: ['4', '5', '6']};
declare const prout5: MergeDeep<typeof destination5, typeof source5>;

expectType<typeof merge5>(prout5);

// Should concat arrays

const merge6 = {a: 'a', b: 'b', items: [1, 2, 3, '4', '5', '6']};
declare const prout6: MergeDeep<typeof destination5, typeof source5, {recurseIntoArrays: true}>;

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
