import {expectType} from 'tsd';
import type {UndefinedOnPartialDeep} from '../source/undefined-on-partial-deep';

declare const test1: UndefinedOnPartialDeep<{required: string; optional?: string}>;
expectType<{required: string; optional?: string | undefined}>(test1);

declare const test2: UndefinedOnPartialDeep<{required: string; optional?: string | undefined}>;
expectType<{required: string; optional?: string | undefined}>(test2);

declare const test3: UndefinedOnPartialDeep<{required: string; requiredWithUndefind: string | undefined}>;
expectType<{required: string; requiredWithUndefind: string | undefined}>(test3);

// Test null and undefined
declare const nullTest: UndefinedOnPartialDeep<{null?: null}>;
expectType<{null?: null | undefined}>(nullTest);
declare const undefinedTest: UndefinedOnPartialDeep<{undefined?: undefined}>;
expectType<{undefined?: undefined}>(undefinedTest);

// Test mixed types
type MixedType = {
	required: string;
	union?: 'test1' | 'test2';
	boolean?: boolean;
	string?: string;
	symbol?: symbol;
	date?: Date;
	regExp?: RegExp;
	func?: (args0: string, args1: number) => boolean;
};
type TargetMixedType = {
	required: string;
	union?: 'test1' | 'test2' | undefined;
	boolean?: boolean | undefined;
	string?: string | undefined;
	symbol?: symbol | undefined;
	date?: Date | undefined;
	regExp?: RegExp | undefined;
	func?: ((args0: string, args1: number) => boolean) | undefined;
};
declare const mixTest: UndefinedOnPartialDeep<MixedType>;
expectType<TargetMixedType>(mixTest);

// Test object
declare const object: UndefinedOnPartialDeep<{obj?: {key: string}}>;
expectType<{obj?: {key: string} | undefined}>(object);
declare const objectDeep: UndefinedOnPartialDeep<{obj?: {subObj?: {key?: string}}}>;
expectType<{obj?: {subObj?: {key?: string | undefined} | undefined} | undefined}>(objectDeep);

// Test map and readonly map
declare const map: UndefinedOnPartialDeep<{map?: Map<string, {key?: string}>}>;
expectType<{map?: Map<string, {key?: string | undefined}> | undefined}>(map);
declare const readonlyMapTest: UndefinedOnPartialDeep<{readonly?: ReadonlyMap<string, {key?: string}>}>;
expectType<{readonly?: ReadonlyMap<string, {key?: string | undefined}> | undefined}>(readonlyMapTest);

// Test set and readonly set
declare const set: UndefinedOnPartialDeep<{set?: Set<{key?: string}>}>;
expectType<{set?: Set<{key?: string | undefined}> | undefined}>(set);
declare const readonlySet: UndefinedOnPartialDeep<{readonly?: ReadonlySet<{key?: string}>}>;
expectType<{readonly?: ReadonlySet<{key?: string | undefined}> | undefined}>(readonlySet);

// Test array and tuple
declare const tuple: UndefinedOnPartialDeep<{tuple?: [string, number]}>;
expectType<{tuple?: [string, number] | undefined}>(tuple);
declare const array: UndefinedOnPartialDeep<{array?: string[]}>;
expectType<{array?: string[] | undefined}>(array);
declare const arrayDeep: UndefinedOnPartialDeep<{array?: Array<{subArray?: string[]}>}>;
expectType<{array?: Array<{subArray?: string[] | undefined}> | undefined}>(arrayDeep);
declare const objectList: UndefinedOnPartialDeep<{array?: Array<{key?: string}>}>;
expectType<{array?: Array<{key?: string | undefined}> | undefined}>(objectList);

// Test readonly array
declare const readonlyTest: UndefinedOnPartialDeep<{readonly?: readonly string[]}>;
expectType<{readonly?: readonly string[] | undefined}>(readonlyTest);
// eslint-disable-next-line @typescript-eslint/array-type
declare const readonlyArrayTest: UndefinedOnPartialDeep<{readonly?: ReadonlyArray<string>}>;
// eslint-disable-next-line @typescript-eslint/array-type
expectType<{readonly?: ReadonlyArray<string> | undefined}>(readonlyArrayTest);

