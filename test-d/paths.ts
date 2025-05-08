import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {Paths} from '../index.d.ts';

declare const normal: Paths<{foo: string}>;
expectType<'foo'>(normal);

type DeepObject = {
	a: {
		b: {
			c: {
				d: string;
			};
		};
		b2: number[];
		b3: boolean;
	};
};
declare const deepObject: Paths<DeepObject>;
type DeepPath = 'a' | 'a.b' | 'a.b2' | 'a.b3' | 'a.b.c' | 'a.b.c.d' | `a.b2.${number}`;
expectType<DeepPath>(deepObject);

// Test for interface
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InterfaceType extends DeepObject {}
declare const interfaceType: Paths<InterfaceType>;
expectType<DeepPath>(interfaceType);

declare const emptyObject: Paths<{}>;
expectType<never>(emptyObject);

declare const emptyArray: Paths<[]>;
expectType<never>(emptyArray);

declare const symbol: Paths<{[Symbol.iterator]: string}>;
expectType<never>(symbol);

declare const never: Paths<never>;
expectType<never>(never);

declare const date: Paths<{foo: Date}>;
expectType<'foo'>(date);

declare const mixed: Paths<{foo: boolean} | {bar: string}>;
expectType<'foo' | 'bar'>(mixed);

declare const array: Paths<Array<{foo: string}>>;
expectType<number | `${number}` | `${number}.foo`>(array);

declare const tuple: Paths<[{foo: string}]>;
expectType<'0' | '0.foo'>(tuple);

declare const deeplist: Paths<{foo: Array<{bar: boolean[]}>}>;
expectType<'foo' | `foo.${number}` | `foo.${number}.bar` | `foo.${number}.bar.${number}`>(deeplist);

declare const readonly: Paths<{foo: Readonly<{bar: string}>}>;
expectType<'foo' | 'foo.bar'>(readonly);

declare const readonlyArray: Paths<{foo: readonly string[]}>;
expectType<'foo' | `foo.${number}`>(readonlyArray);

declare const optional: Paths<{foo?: {bar?: number}}>;
expectType<'foo' | 'foo.bar'>(optional);

declare const record: Paths<Record<'a', any>>;
expectType<'a'>(record);

declare const record2: Paths<Record<1, unknown>>;
expectType<1 | '1'>(record2);

declare const map: Paths<{foo?: {bar?: Map<string, number>}}>;
expectType<'foo' | 'foo.bar'>(map);

declare const map2: Paths<Map<string, number>>;
expectType<never>(map2);

declare const readonlyMap: Paths<{foo?: {bar?: ReadonlyMap<string, number>}}>;
expectType<'foo' | 'foo.bar'>(readonlyMap);

declare const set: Paths<{foo?: {bar?: Set<string>}}>;
expectType<'foo' | 'foo.bar'>(set);

declare const set2: Paths<Set<string>>;
expectType<never>(set2);

declare const readonlySet: Paths<{foo?: {bar?: ReadonlySet<string>}}>;
expectType<'foo' | 'foo.bar'>(readonlySet);

// Test for unknown length array
declare const trailingSpreadTuple: Paths<[{a: string}, ...Array<{b: number}>]>;
expectType<number | `${number}` | '0.a' | `${number}.b`>(trailingSpreadTuple);

declare const trailingSpreadTuple1: Paths<[{a: string}, {b: number}, ...Array<{c: number}>]>;
expectType<number | `${number}` | '0.a' | `${number}.b`>(trailingSpreadTuple);
expectType<number | `${number}` | '0.a' | '1.b' | `${number}.c`>(trailingSpreadTuple1);

declare const leadingSpreadTuple: Paths<[...Array<{a: string}>, {b: number}]>;
expectType<number | `${number}` | `${number}.b` | `${number}.a`>(leadingSpreadTuple);

declare const leadingSpreadTuple1: Paths<[...Array<{a: string}>, {b: number}, {c: number}]>;
expectType<number | `${number}` | `${number}.b` | `${number}.c` | `${number}.a`>(leadingSpreadTuple1);

// Circularly references
type MyEntity = {
	myOtherEntity?: MyOtherEntity;
};
type MyOtherEntity = {
	myEntity?: MyEntity;
};
type MyEntityPaths = Paths<MyEntity>;
expectAssignable<string>({} as MyEntityPaths);

// By default, the recursion limit should be reasonably long
type RecursiveFoo = {foo: RecursiveFoo};
expectAssignable<Paths<RecursiveFoo, {maxRecursionDepth: 10}>>('foo.foo.foo.foo.foo.foo.foo.foo');

declare const recursion0: Paths<RecursiveFoo, {maxRecursionDepth: 0}>;
expectType<'foo'>(recursion0);

declare const recursion1: Paths<RecursiveFoo, {maxRecursionDepth: 1}>;
expectType<'foo' | 'foo.foo'>(recursion1);

// Test a[0].b style
type Object1 = {
	arr: [{a: string}];
};
expectType<Paths<Object1, {bracketNotation: true}>>({} as 'arr' | 'arr[0]' | 'arr[0].a');

type Object2 = {
	arr: Array<{a: string}>;
	arr1: string[];
};
expectType<Paths<Object2, {bracketNotation: true}>>({} as 'arr' | 'arr1' | `arr[${number}]` | `arr[${number}].a` | `arr1[${number}]`);

type Object3 = {
	1: 'foo';
	'2': 'bar';
};
expectType<Paths<Object3, {bracketNotation: true}>>({} as '[1]' | '[2]');

type deepArray = {
	arr: Array<Array<Array<{a: string}>>>;
};
expectType<Paths<deepArray, {bracketNotation: true}>>({} as 'arr' | `arr[${number}]` | `arr[${number}][${number}]` | `arr[${number}][${number}][${number}]` | `arr[${number}][${number}][${number}].a`);

type RecursionArray = RecursionArray[];
type RecursionArrayPaths = Paths<RecursionArray, {bracketNotation: true; maxRecursionDepth: 3}>;
expectAssignable<RecursionArrayPaths>({} as `[${number}][${number}][${number}][${number}]`);
expectNotAssignable<RecursionArrayPaths>({} as `[${number}][${number}][${number}][${number}][${number}]`);

// -- leavesOnly option --

declare const leaves: Paths<{a: {b: string; c?: Date; d: (x: string) => number; e: Map<string, string>; f?: {g?: Set<string>}}; h: boolean}, {leavesOnly: true}>;
expectType<'a.b' | 'a.c' | 'a.d' | 'a.e' | 'a.f.g' | 'h'>(leaves);

declare const unionLeaves: Paths<{a: {b?: number}} | {a: string; b?: {c: string}}, {leavesOnly: true}>;
expectType<'a.b' | 'a' | 'b.c'>(unionLeaves);

declare const emptyObjectLeaves: Paths<{a: {}}, {leavesOnly: true}>;
expectType<'a'>(emptyObjectLeaves);

declare const emptyArrayLeaves: Paths<{a: []}, {leavesOnly: true}>;
expectType<'a'>(emptyArrayLeaves);

declare const readonlyEmptyArrayLeaves: Paths<{a: readonly []}, {leavesOnly: true}>;
expectType<'a'>(readonlyEmptyArrayLeaves);

declare const arrayLeaves: Paths<string[], {leavesOnly: true}>;
expectType<number | `${number}`>(arrayLeaves);

declare const tupleLeaves: Paths<[string, number?], {leavesOnly: true}>;
expectType<'0' | '1'>(tupleLeaves);

declare const objectArrayLeaves: Paths<Array<{a: number}>, {leavesOnly: true}>;
expectType<`${number}.a`>(objectArrayLeaves);

declare const objectTupleLeaves: Paths<readonly [{a?: number}?], {leavesOnly: true}>;
expectType<'0.a'>(objectTupleLeaves);

declare const deepArrayLeaves: Paths<{a?: {b: readonly string[]}; c: boolean[]}, {leavesOnly: true}>;
expectType<`a.b.${number}` | `c.${number}`>(deepArrayLeaves);

declare const deepTupleLeaves: Paths<{a: {b: [string, number]}}, {leavesOnly: true}>;
expectType<'a.b.0' | 'a.b.1'>(deepTupleLeaves);

declare const deepObjectArrayLeaves: Paths<{a: {b: ReadonlyArray<{readonly c?: number; d: string}>}}, {leavesOnly: true}>;
expectType<`a.b.${number}.c` | `a.b.${number}.d`>(deepObjectArrayLeaves);

declare const deepObjectTupleLeaves: Paths<{a: {readonly b: [{readonly c: string}, {d?: number}]}}, {leavesOnly: true}>;
expectType<'a.b.0.c' | 'a.b.1.d'>(deepObjectTupleLeaves);

declare const nestedArrayLeaves: Paths<{a?: Array<Array<Array<{b: string}>>>}, {leavesOnly: true}>;
expectType<`a.${number}.${number}.${number}.b`>(nestedArrayLeaves);

declare const nestedTupleLeaves: Paths<{a: [[[{b: string}]]?]}, {leavesOnly: true}>;
expectType<'a.0.0.0.b'>(nestedTupleLeaves);

declare const trailingSpreadLeaves: Paths<[{a: string}, ...Array<{b: number}>], {leavesOnly: true}>;
expectType<'0.a' | `${number}.b`>(trailingSpreadLeaves);

declare const trailingSpreadLeaves1: Paths<[{a: string}, {b: number}, ...Array<{c?: number}>], {leavesOnly: true}>;
expectType<'0.a' | '1.b' | `${number}.c`>(trailingSpreadLeaves1);

declare const leadingSpreadLeaves: Paths<[...Array<{a?: string}>, {readonly b: number}], {leavesOnly: true}>;
expectType<`${number}.a` | `${number}.b`>(leadingSpreadLeaves);

declare const leadingSpreadLeaves1: Paths<[...Array<{a?: string}>, {readonly b: number}, {c: number}], {leavesOnly: true}>;
expectType<`${number}.a` | `${number}.b` | `${number}.c`>(leadingSpreadLeaves1);

declare const recursiveLeaves: Paths<RecursiveFoo, {leavesOnly: true; maxRecursionDepth: 10}>;
expectType<'foo.foo.foo.foo.foo.foo.foo.foo.foo.foo.foo'>(recursiveLeaves);

declare const recursiveWithMaxLeaves: Paths<RecursiveFoo, {maxRecursionDepth: 0; leavesOnly: true}>;
expectType<'foo'>(recursiveWithMaxLeaves);

declare const recursiveWithMaxLeaves1: Paths<RecursiveFoo, {maxRecursionDepth: 1; leavesOnly: true}>;
expectType<'foo.foo'>(recursiveWithMaxLeaves1);

declare const recursiveArrayLeaves: Paths<RecursionArray, {bracketNotation: true; maxRecursionDepth: 2; leavesOnly: true}>;
expectType<`[${number}][${number}][${number}]`>(recursiveArrayLeaves);

declare const bracketArrayLeaves: Paths<{a: Array<{b: string; c?: string}>}, {bracketNotation: true; leavesOnly: true}>;
expectType<`a[${number}].b` | `a[${number}].c`>(bracketArrayLeaves);

declare const bracketTupleLeaves: Paths<{a: [{b?: string}, {c: string}]}, {bracketNotation: true; leavesOnly: true}>;
expectType<'a[0].b' | 'a[1].c'>(bracketTupleLeaves);

declare const bracketNumericLeaves: Paths<{a: {1: string; 2: number}}, {bracketNotation: true; leavesOnly: true}>;
expectType<'a[1]' | 'a[2]'>(bracketNumericLeaves);

declare const bracketNestedArrayLeaves: Paths<{a: Array<Array<Array<{b: string}>>>}, {bracketNotation: true; leavesOnly: true}>;
expectType<`a[${number}][${number}][${number}].b`>(bracketNestedArrayLeaves);

// -- depth option --
declare const zeroDepth: Paths<DeepObject, {depth: 0}>;
expectType<'a'>(zeroDepth);

declare const oneDepth: Paths<DeepObject, {depth: 1}>;
expectType<'a.b' | 'a.b2' | 'a.b3'>(oneDepth);

declare const twoDepth: Paths<DeepObject, {depth: 2}>;
expectType<'a.b.c' | `a.b2.${number}`>(twoDepth);

declare const threeDepth: Paths<DeepObject, {depth: 3}>;
expectType<'a.b.c.d'>(threeDepth);

declare const unionDepth: Paths<{a: {readonly b?: string}} | {x: {y?: {z: number}}}, {depth: 1}>;
expectType<'a.b' | 'x.y'>(unionDepth);

declare const unionDepth2: Paths<{a?: {b: string; readonly c: {d?: string}}} | {readonly x?: {y: string}}, {depth: 2}>;
expectType<'a.c.d'>(unionDepth2);

declare const unionDepth3: Paths<DeepObject, {depth: 0 | 3}>;
expectType<'a' | 'a.b.c.d'>(unionDepth3);

declare const unionDepth4: Paths<{a?: {b: string; readonly c: {d?: [string, number]}}} | {readonly x?: {y: string}}, {depth: 1 | 3}>;
expectType<'a.b' | 'a.c' | 'x.y' | 'a.c.d.0' | 'a.c.d.1'>(unionDepth4);

declare const unionDepth5: Paths<{a: {b?: string}} | {x: {y?: {z: number}}}, {depth: 0 | 2}>;
expectType<'a' | 'x' | 'x.y.z'>(unionDepth5);

declare const unreachableDepth: Paths<DeepObject, {depth: 4}>;
expectType<never>(unreachableDepth);

declare const unreachableDepth2: Paths<{a: {}}, {depth: 1}>;
expectType<never>(unreachableDepth2);

declare const unreachableDepth3: Paths<{a: readonly []}, {depth: 1}>;
expectType<never>(unreachableDepth3);

declare const unreachableAndReachableDepth: Paths<{a: {b: string}}, {depth: 1 | 2}>;
expectType<'a.b'>(unreachableAndReachableDepth);

declare const maxLessThanDepth: Paths<DeepObject, {maxRecursionDepth: 2; depth: 3}>;
expectType<never>(maxLessThanDepth);

declare const maxLessThanDepth2: Paths<RecursiveFoo, {depth: 12}>; // Default `maxRecursionDepth` is 10
expectType<never>(maxLessThanDepth2);

declare const maxSimilarToDepth: Paths<DeepObject, {maxRecursionDepth: 2; depth: 2}>;
expectType<'a.b.c' | `a.b2.${number}`>(maxSimilarToDepth);

declare const maxSimilarToDepth2: Paths<RecursiveFoo, {maxRecursionDepth: 0; depth: 0}>;
expectType<'foo'>(maxSimilarToDepth2);

declare const maxSimilarToDepth3: Paths<RecursiveFoo, {depth: 10; maxRecursionDepth: 10}>; // Default `maxRecursionDepth` is 10
expectType<'foo.foo.foo.foo.foo.foo.foo.foo.foo.foo.foo'>(maxSimilarToDepth3);

declare const maxMoreThanDepth: Paths<DeepObject, {maxRecursionDepth: 2; depth: 1}>;
expectType<'a.b' | 'a.b2' | 'a.b3'>(maxMoreThanDepth);

declare const maxMoreThanDepth2: Paths<RecursiveFoo, {maxRecursionDepth: 6; depth: 3}>;
expectType<'foo.foo.foo.foo'>(maxMoreThanDepth2);

declare const maxMoreAndLessThanDepth: Paths<RecursionArray, {maxRecursionDepth: 2; depth: 1 | 3}>;
expectType<`${number}.${number}`>(maxMoreAndLessThanDepth);

declare const maxLessAndSimilarThanDepth: Paths<RecursionArray, {maxRecursionDepth: 1; depth: 0 | 1}>;
expectType<number | `${number}` | `${number}.${number}`>(maxLessAndSimilarThanDepth);

declare const maxSimilarAndMoreThanDepth: Paths<RecursionArray, {maxRecursionDepth: 2; depth: 2 | 3}>;
expectType<`${number}.${number}.${number}`>(maxSimilarAndMoreThanDepth);

declare const noLeavesAtDepth: Paths<DeepObject, {leavesOnly: true; depth: 0}>;
expectType<never>(noLeavesAtDepth);

declare const onlyLeavesAtDepth: Paths<DeepObject, {leavesOnly: true; depth: 1}>;
expectType<'a.b3'>(onlyLeavesAtDepth);

declare const onlyLeavesAtDepth2: Paths<DeepObject, {leavesOnly: true; depth: 2}>;
expectType<`a.b2.${number}`>(onlyLeavesAtDepth2);

declare const deepArrayDepth: Paths<{a?: {b: readonly string[]}; c: boolean[]}, {depth: 0 | 2}>;
expectType<'a' | 'c' | `a.b.${number}`>(deepArrayDepth);

declare const deepTupleDepth: Paths<{a: {b: [string, number]}}, {depth: 2}>;
expectType<'a.b.0' | 'a.b.1'>(deepTupleDepth);

declare const deepObjectArrayDepth: Paths<{a: {b: ReadonlyArray<{readonly c?: number; d: string}>}}, {depth: 1 | 3}>;
expectType<'a.b' | `a.b.${number}.c` | `a.b.${number}.d`>(deepObjectArrayDepth);

declare const deepObjectTupleDepth: Paths<{a: {readonly b: [{readonly c: string}, {d?: [number]}]}}, {leavesOnly: true; depth: 3}>;
expectType<'a.b.0.c'>(deepObjectTupleDepth);

declare const nestedArrayDepth: Paths<{a?: Array<Array<Array<{b: string}>>>}, {depth: 1 | 2 | 3}>;
expectType<`a.${number}` | `a.${number}.${number}` | `a.${number}.${number}.${number}`>(nestedArrayDepth);

declare const nestedTupleDepth: Paths<{a: [[[{b: string}]]?]}, {depth: 0 | 4}>;
expectType<'a' | 'a.0.0.0.b'>(nestedTupleDepth);

declare const recursiveDepth: Paths<RecursiveFoo, {depth: 4}>;
expectType<'foo.foo.foo.foo.foo'>(recursiveDepth);

declare const recursiveDepth2: Paths<RecursiveFoo, {depth: 1 | 3 | 8; maxRecursionDepth: 10}>;
expectType<'foo.foo' | 'foo.foo.foo.foo' | 'foo.foo.foo.foo.foo.foo.foo.foo.foo'>(recursiveDepth2);

// For recursive types, leaves are at `maxRecursionDepth`
declare const recursiveDepth3: Paths<RecursiveFoo, {leavesOnly: true; depth: 5; maxRecursionDepth: 10}>;
expectType<never>(recursiveDepth3);

declare const recursiveDepth4: Paths<RecursiveFoo, {leavesOnly: true; depth: 5 | 10; maxRecursionDepth: 10}>; // No leaves at depth `5`
expectType<'foo.foo.foo.foo.foo.foo.foo.foo.foo.foo.foo'>(recursiveDepth4);

declare const recursiveDepth6: Paths<RecursiveFoo, {leavesOnly: true; maxRecursionDepth: 6; depth: 5}>; // Leaves are at depth `6`
expectType<never>(recursiveDepth6);

declare const maxLeavesAndDepth: Paths<DeepObject, {leavesOnly: true; maxRecursionDepth: 2; depth: 2}>; // All depth `2` paths are leaves
expectType<'a.b.c' | `a.b2.${number}`>(maxLeavesAndDepth);

declare const maxLeavesAndDepth2: Paths<DeepObject, {leavesOnly: true; maxRecursionDepth: 2; depth: 0 | 1 | 2}>;
expectType<'a.b3' | 'a.b.c' | `a.b2.${number}`>(maxLeavesAndDepth2);

declare const recursiveBracketDepth: Paths<RecursionArray, {bracketNotation: true; depth: 3}>;
expectType<`[${number}][${number}][${number}][${number}]`>(recursiveBracketDepth);

declare const recursiveBracketDepth2: Paths<RecursionArray, {bracketNotation: true; leavesOnly: true; depth: 3}>; // Leaves are at depth `10`
expectType<never>(recursiveBracketDepth2);

declare const bracketArrayDepth: Paths<{a: Array<{b: string; c?: string}>}, {bracketNotation: true; depth: 1 | 2}>;
expectType<`a[${number}]` | `a[${number}].b` | `a[${number}].c`>(bracketArrayDepth);

declare const bracketTupleDepth: Paths<{a: [{b?: string}, {c: string}]}, {bracketNotation: true; leavesOnly: true; depth: 0 | 2}>;
expectType<'a[0].b' | 'a[1].c'>(bracketTupleDepth);

declare const bracketNumericDepth: Paths<{a: {1: string; 2: number}}, {bracketNotation: true; depth: 1}>;
expectType<'a[1]' | 'a[2]'>(bracketNumericDepth);

declare const bracketNestedArrayDepth: Paths<{a: Array<Array<Array<{b: string}>>>}, {bracketNotation: true; depth: 2 | 4}>;
expectType<`a[${number}][${number}]` | `a[${number}][${number}][${number}].b`>(bracketNestedArrayDepth);

declare const trailingSpreadDepth: Paths<[{a: string}, ...Array<{b: number}>], {depth: 1}>;
expectType<'0.a' | `${number}.b`>(trailingSpreadDepth);

declare const leadingSpreadDepth: Paths<[...Array<{a?: string}>, {readonly b: number}], {depth: 0 | 1}>;
expectType<number | `${number}` | `${number}.b` | `${number}.a`>(leadingSpreadDepth);

declare const negativeDepth: Paths<DeepObject, {depth: -1}>;
expectType<never>(negativeDepth);

declare const positiveAndNegativeDepth: Paths<DeepObject, {depth: 1 | -1}>;
expectType<'a.b' | 'a.b2' | 'a.b3'>(positiveAndNegativeDepth);

declare const zeroPositiveAndNegativeDepth: Paths<DeepObject, {depth: 0 | 2 | -4}>;
expectType<'a' | 'a.b.c' | `a.b2.${number}`>(zeroPositiveAndNegativeDepth);

declare const neverDepth: Paths<DeepObject, {depth: never}>;
expectType<never>(neverDepth);

declare const anyDepth: Paths<DeepObject, {depth: any}>;
expectType<'a' | 'a.b.c' | `a.b2.${number}` | 'a.b3' | 'a.b' | 'a.b2' | 'a.b.c.d'>(anyDepth);
