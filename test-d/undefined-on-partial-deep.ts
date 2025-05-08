// TODO: Test equality
import {expectAssignable} from 'tsd';
import type {UndefinedOnPartialDeep} from '../source/undefined-on-partial-deep.d.ts';

type TestType1 = UndefinedOnPartialDeep<{required: string; optional?: string; optional2?: number; optional3?: string}>;
expectAssignable<TestType1>({required: '', optional: undefined, optional2: 1});

type TestType2 = UndefinedOnPartialDeep<{optional?: string | undefined}>;
expectAssignable<TestType2>({optional: undefined});

type TestType3 = UndefinedOnPartialDeep<{requiredWithUndefind: string | undefined}>;
expectAssignable<TestType3>({requiredWithUndefind: undefined});

// Test null and undefined
type NullType = UndefinedOnPartialDeep<{null?: null}>;
expectAssignable<NullType>({null: undefined});
type UndefinedType = UndefinedOnPartialDeep<{ud?: undefined}>;
expectAssignable<UndefinedType>({ud: undefined});

// Test mixed types
type MixedType = UndefinedOnPartialDeep<{
	required: string;
	union?: 'test1' | 'test2';
	boolean?: boolean;
	string?: string;
	symbol?: symbol;
	date?: Date;
	regExp?: RegExp;
	func?: (arguments0: string, arguments1: number) => boolean;
}>;
expectAssignable<MixedType>({
	required: '',
	union: undefined,
	boolean: undefined,
	string: undefined,
	symbol: undefined,
	date: undefined,
	regExp: undefined,
	func: undefined,
});

// Test object
type ObjectType = UndefinedOnPartialDeep<{obj?: {key: string}}>;
expectAssignable<ObjectType>({obj: undefined});

type ObjectDeepType = UndefinedOnPartialDeep<{obj?: {subObj?: {key?: string}}}>;
expectAssignable<ObjectDeepType>({obj: undefined});
expectAssignable<ObjectDeepType>({obj: {subObj: undefined}});
expectAssignable<ObjectDeepType>({obj: {subObj: {key: undefined}}});

// Test map
type MapType = UndefinedOnPartialDeep<{map?: Map<string, {key?: string}>}>;
expectAssignable<MapType>({map: undefined});
expectAssignable<MapType>({map: new Map([['', {key: undefined}]])});

// Test set
type SetType = UndefinedOnPartialDeep<{set?: Set<{key?: string}>}>;
expectAssignable<SetType>({set: undefined});
expectAssignable<SetType>({set: new Set([{key: undefined}])});

// Test array and tuple
type TupleType = UndefinedOnPartialDeep<{tuple?: [string, number]}>;
expectAssignable<TupleType>({tuple: undefined});
type ArrayType = UndefinedOnPartialDeep<{array?: string[]}>;
expectAssignable<ArrayType>({array: undefined});
type ArrayDeepType = UndefinedOnPartialDeep<{array?: Array<{subArray?: string[]}>}>;
expectAssignable<ArrayDeepType>({array: undefined});
expectAssignable<ArrayDeepType>({array: [{subArray: undefined}]});
type ObjectListType = UndefinedOnPartialDeep<{array?: Array<{key?: string}>}>;
expectAssignable<ObjectListType>({array: undefined});
expectAssignable<ObjectListType>({array: [{key: undefined}]});

// Test readonly array
type ReadonlyType = UndefinedOnPartialDeep<{readonly?: readonly string[]}>;
expectAssignable<ReadonlyType>({readonly: undefined});
// eslint-disable-next-line @typescript-eslint/array-type
type ReadonlyArrayTest = UndefinedOnPartialDeep<{readonly?: ReadonlyArray<string>}>;
expectAssignable<ReadonlyArrayTest>({readonly: undefined});
