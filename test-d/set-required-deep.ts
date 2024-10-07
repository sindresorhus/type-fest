import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {MergeDeep, OverrideProperties, SetRequired, SetRequiredDeep, Simplify, SimplifyDeep} from '../index';

// Update an optional nested key to required.
declare const variation1: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b.c'>;
expectType<{a?: number; b: {c: string}}>(variation1);

// Update a root key to required.
declare const variation2: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'a'>;
expectType<{a: number; b?: {c?: string}}>(variation2);

// Keeps required key as required
declare const variation3: SetRequiredDeep<{a: number; b?: {c?: string}}, 'a'>;
expectType<{a: number; b?: {c?: string}}>(variation3);

// Update optional keys to required in a union.
declare const variation4: SetRequiredDeep<{a?: '1'; b?: {c?: boolean}} | {a?: '2'; b?: {c?: boolean}}, 'a' | 'b.c'>;
expectType<{a: '1'; b: {c: boolean}} | {a: '2'; b: {c: boolean}}>(variation4);

// Set key inside array to required
declare const variation5: SetRequiredDeep<{a?: number; array?: Array<{b?: number}>}, 'array'>;
expectType<{a?: number; array: Array<{b: number}>}>(variation5);

// Set specific key inside array to required
expectAssignable<SetRequiredDeep<{a?: number; array?: Array<{b?: number}>}, 'array.0.b'>>({a: 1, array: [{b: 2}]});
expectNotAssignable<SetRequiredDeep<{a?: number; array?: Array<{b?: number}>}, 'array.0.b'>>({array: [{}]});

// Set only specified keys inside array to required
expectAssignable<SetRequiredDeep<{a?: number; array?: Array<{b?: number; c?: string}>}, `array.${number}.b`>>({array: [{b: 4}]});
expectNotAssignable<SetRequiredDeep<{a?: number; array?: Array<{b?: number; c?: string}>}, `array.${number}.b`>>({array: [{}]});

// Set specific key inside specific array item to required
expectAssignable<SetRequiredDeep<{a?: number; array?: [{b?: number}, {c?: string}]}, 'array.1.c'>>({array: [{}, {c: 'foo'}]});
expectNotAssignable<SetRequiredDeep<{a?: number; array?: [{b?: number}, {c?: string}]}, 'array.1.c'>>({array: [{b: 2}, {}]});

