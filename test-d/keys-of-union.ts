import {expectType} from 'tsd';
import type {KeysOfUnion} from '../index';

// When passing types that are not unions
// It behaves exactly as the `keyof` operator

type Example1 = {
	string: string;
	number: number;
	boolean: boolean;
	null: null;
	array: number[];
};

type Expected1 = keyof Example1;

declare const actual1: KeysOfUnion<Example1>;

expectType<Expected1>(actual1);

// When passing a type that is a union
// It returns a union of all keys of all union members

type Example2 = {
	common: string;
	a: number;
} | {
	common: string;
	b: string;
} | {
	common: string;
	c: boolean;
};

type Expected2 = 'common' | 'a' | 'b' | 'c';

declare const actual2: KeysOfUnion<Example2>;

expectType<Expected2>(actual2);
