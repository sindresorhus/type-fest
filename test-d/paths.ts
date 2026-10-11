import {expectTypeOf} from 'nz';
import type {Paths, UnknownArray} from '../index.d.ts';
import type {MapsSetsOrArrays, NonRecursiveType} from '../source/internal/type.d.ts';

declare const normal: Paths<{foo: string}>;
expectTypeOf(normal).toBe<'foo'>();

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
expectTypeOf(deepObject).toBe<DeepPath>();

// Test for interface
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InterfaceType extends DeepObject {}
declare const interfaceType: Paths<InterfaceType>;
expectTypeOf(interfaceType).toBe<DeepPath>();

declare const emptyObject: Paths<{}>;
expectTypeOf(emptyObject).toBe<never>();

declare const emptyArray: Paths<[]>;
expectTypeOf(emptyArray).toBe<never>();

declare const symbol: Paths<{[Symbol.iterator]: string}>;
expectTypeOf(symbol).toBe<never>();

declare const never: Paths<never>;
expectTypeOf(never).toBe<never>();

declare const date: Paths<{foo: Date}>;
expectTypeOf(date).toBe<'foo'>();

declare const mixed: Paths<{foo: boolean} | {bar: string}>;
expectTypeOf(mixed).toBe<'foo' | 'bar'>();

declare const array: Paths<Array<{foo: string}>>;
expectTypeOf(array).toBe<number | `${number}` | `${number}.foo`>();

declare const tuple: Paths<[{foo: string}]>;
expectTypeOf(tuple).toBe<'0' | '0.foo'>();

declare const deeplist: Paths<{foo: Array<{bar: boolean[]}>}>;
expectTypeOf(deeplist).toBe<'foo' | `foo.${number}` | `foo.${number}.bar` | `foo.${number}.bar.${number}`>();

declare const readonly: Paths<{foo: Readonly<{bar: string}>}>;
expectTypeOf(readonly).toBe<'foo' | 'foo.bar'>();

declare const readonlyArray: Paths<{foo: readonly string[]}>;
expectTypeOf(readonlyArray).toBe<'foo' | `foo.${number}`>();

declare const optional: Paths<{foo?: {bar?: number}}>;
expectTypeOf(optional).toBe<'foo' | 'foo.bar'>();

declare const record: Paths<Record<'a', any>>;
expectTypeOf(record).toBe<'a'>();

declare const record2: Paths<Record<1, unknown>>;
expectTypeOf(record2).toBe<1 | '1'>();

declare const map: Paths<{foo?: {bar?: Map<string, number>}}>;
expectTypeOf(map).toBe<'foo' | 'foo.bar'>();

declare const map2: Paths<Map<string, number>>;
expectTypeOf(map2).toBe<never>();

declare const readonlyMap: Paths<{foo?: {bar?: ReadonlyMap<string, number>}}>;
expectTypeOf(readonlyMap).toBe<'foo' | 'foo.bar'>();

declare const readonlyMap2: Paths<ReadonlyMap<string, number>>;
expectTypeOf(readonlyMap2).toBe<never>();

declare const weakMap: Paths<{foo?: {bar?: WeakMap<{a: string}, number>}}>;
expectTypeOf(weakMap).toBe<'foo' | 'foo.bar'>();

declare const weakMap2: Paths<WeakMap<{a: string}, number>>;
expectTypeOf(weakMap2).toBe<never>();

declare const set: Paths<{foo?: {bar?: Set<string>}}>;
expectTypeOf(set).toBe<'foo' | 'foo.bar'>();

declare const set2: Paths<Set<string>>;
expectTypeOf(set2).toBe<never>();

declare const readonlySet: Paths<{foo?: {bar?: ReadonlySet<string>}}>;
expectTypeOf(readonlySet).toBe<'foo' | 'foo.bar'>();

declare const readonlySet2: Paths<ReadonlySet<string>>;
expectTypeOf(readonlySet2).toBe<never>();

declare const weakSet: Paths<{foo?: {bar?: WeakSet<{a: string}>}}>;
expectTypeOf(weakSet).toBe<'foo' | 'foo.bar'>();

declare const weakSet2: Paths<WeakSet<{a: string}>>;
expectTypeOf(weakSet2).toBe<never>();

declare const nonRecursives: Paths<{a: NonRecursiveType | Exclude<MapsSetsOrArrays, UnknownArray>}>;
expectTypeOf(nonRecursives).toBe<'a'>();

// Test for unknown length array
declare const trailingSpreadTuple: Paths<[{a: string}, ...Array<{b: number}>]>;
expectTypeOf(trailingSpreadTuple).toBe<number | `${number}` | '0.a' | `${number}.b`>();

declare const trailingSpreadTuple1: Paths<[{a: string}, {b: number}, ...Array<{c: number}>]>;
expectTypeOf(trailingSpreadTuple1).toBe<number | `${number}` | '0.a' | '1.b' | `${number}.c`>();

declare const optionalElementsWithTrailingSpreadTuple: Paths<{foo: [{a: string}, ({b: number})?, ...Array<{c: number}>]}>;
expectTypeOf(optionalElementsWithTrailingSpreadTuple).toBe<'foo' | `foo.${number}` | 'foo.0.a' | 'foo.1.b' | `foo.${number}.c`>();

declare const optionalElementsWithTrailingSpreadTuple1: Paths<[({a: string})?, ({b: number})?, ...Array<{c: number}>]>;
expectTypeOf(optionalElementsWithTrailingSpreadTuple1).toBe<number | `${number}` | '0.a' | '1.b' | `${number}.c`>();

declare const leadingSpreadTuple: Paths<[...Array<{a: string}>, {b: number}]>;
expectTypeOf(leadingSpreadTuple).toBe<number | `${number}` | `${number}.b` | `${number}.a`>();

declare const leadingSpreadTuple1: Paths<[...Array<{a: string}>, {b: number}, {c: number}]>;
expectTypeOf(leadingSpreadTuple1).toBe<number | `${number}` | `${number}.b` | `${number}.c` | `${number}.a`>();

declare const middleSpreadTuple: Paths<[{a: string}, ...Array<{b: number}>, {c: boolean}]>;
expectTypeOf(middleSpreadTuple).toBe<number | `${number}` | '0.a' | `${number}.b` | `${number}.c`>();

// Circularly references
type MyEntity = {
	myOtherEntity?: MyOtherEntity;
};
type MyOtherEntity = {
	myEntity?: MyEntity;
};
type MyEntityPaths = Paths<MyEntity>;
expectTypeOf<MyEntityPaths>().toBeAssignableTo<string>();

// By default, the recursion limit should be reasonably long
type RecursiveFoo = {foo: RecursiveFoo};
expectTypeOf<'foo.foo.foo.foo.foo.foo.foo.foo'>().toBeAssignableTo<Paths<RecursiveFoo, {maxRecursionDepth: 10}>>();

declare const recursion0: Paths<RecursiveFoo, {maxRecursionDepth: 0}>;
expectTypeOf(recursion0).toBe<'foo'>();

declare const recursion1: Paths<RecursiveFoo, {maxRecursionDepth: 1}>;
expectTypeOf(recursion1).toBe<'foo' | 'foo.foo'>();

// Test a[0].b style
type Object1 = {
	arr: [{a: string}];
};
expectTypeOf<'arr' | 'arr[0]' | 'arr[0].a'>().toBe<Paths<Object1, {bracketNotation: true}>>();

type Object2 = {
	arr: Array<{a: string}>;
	arr1: string[];
};
expectTypeOf<'arr' | 'arr1' | `arr[${number}]` | `arr[${number}].a` | `arr1[${number}]`>().toBe<Paths<Object2, {bracketNotation: true}>>();

type Object3 = {
	1: 'foo';
	'2': 'bar';
};
expectTypeOf<'[1]' | '[2]'>().toBe<Paths<Object3, {bracketNotation: true}>>();

type Object4 = {
	1: {
		a: string;
	};
};
expectTypeOf<'[1]' | '[1].a'>().toBe<Paths<Object4, {bracketNotation: true}>>();

type Object5 = {
	1: {
		2: string;
	};
};
expectTypeOf<'[1]' | '[1][2]'>().toBe<Paths<Object5, {bracketNotation: true}>>();

type deepArray = {
	arr: Array<Array<Array<{a: string}>>>;
};
expectTypeOf<'arr' | `arr[${number}]` | `arr[${number}][${number}]` | `arr[${number}][${number}][${number}]` | `arr[${number}][${number}][${number}].a`>().toBe<Paths<deepArray, {bracketNotation: true}>>();

type RecursionArray = RecursionArray[];
type RecursionArrayPaths = Paths<RecursionArray, {bracketNotation: true; maxRecursionDepth: 3}>;
expectTypeOf<`[${number}][${number}][${number}][${number}]`>().toBeAssignableTo<RecursionArrayPaths>();
expectTypeOf<`[${number}][${number}][${number}][${number}][${number}]`>().not.toBeAssignableTo<RecursionArrayPaths>();

// -- leavesOnly option --

declare const leaves: Paths<{a: {b: string; c?: Date; d: (x: string) => number; e: Map<string, string>; f?: {g?: Set<string>}}; h: boolean}, {leavesOnly: true}>;
expectTypeOf(leaves).toBe<'a.b' | 'a.c' | 'a.d' | 'a.e' | 'a.f.g' | 'h'>();

declare const unionLeaves: Paths<{a: {b?: number}} | {a: string; b?: {c: string}}, {leavesOnly: true}>;
expectTypeOf(unionLeaves).toBe<'a.b' | 'a' | 'b.c'>();

declare const unionLeaves1: Paths<{a: {} | {c: number}}, {leavesOnly: true}>;
expectTypeOf(unionLeaves1).toBe<'a' | 'a.c'>();

declare const unionLeaves2: Paths<{a: {[x: string]: number} | {c: number}}, {leavesOnly: true}>;
expectTypeOf(unionLeaves2).toBe<`a.${string}`>(); // Collapsed union

declare const unionLeaves3: Paths<{a: string | {toLowerCase: number}}, {leavesOnly: true}>;
expectTypeOf(unionLeaves3).toBe<'a' | 'a.toLowerCase'>();

declare const unionLeaves4: Paths<{a: {b: string} | {c: string}}, {leavesOnly: true}>; // No common keys b/w `{b: string}` and `{c: string}`, but this shouldn't make `a` a leaf.
expectTypeOf(unionLeaves4).toBe<'a.b' | 'a.c'>();

declare const emptyObjectLeaves: Paths<{a: {}}, {leavesOnly: true}>;
expectTypeOf(emptyObjectLeaves).toBe<'a'>();

declare const emptyArrayLeaves: Paths<{a: []}, {leavesOnly: true}>;
expectTypeOf(emptyArrayLeaves).toBe<'a'>();

declare const readonlyEmptyArrayLeaves: Paths<{a: readonly []}, {leavesOnly: true}>;
expectTypeOf(readonlyEmptyArrayLeaves).toBe<'a'>();

declare const arrayLeaves: Paths<string[], {leavesOnly: true}>;
expectTypeOf(arrayLeaves).toBe<number | `${number}`>();

declare const tupleLeaves: Paths<[string, number?], {leavesOnly: true}>;
expectTypeOf(tupleLeaves).toBe<'0' | '1'>();

declare const objectArrayLeaves: Paths<Array<{a: number}>, {leavesOnly: true}>;
expectTypeOf(objectArrayLeaves).toBe<`${number}.a`>();

declare const objectTupleLeaves: Paths<readonly [{a?: number}?], {leavesOnly: true}>;
expectTypeOf(objectTupleLeaves).toBe<'0.a'>();

declare const deepArrayLeaves: Paths<{a?: {b: readonly string[]}; c: boolean[]}, {leavesOnly: true}>;
expectTypeOf(deepArrayLeaves).toBe<`a.b.${number}` | `c.${number}`>();

declare const deepTupleLeaves: Paths<{a: {b: [string, number]}}, {leavesOnly: true}>;
expectTypeOf(deepTupleLeaves).toBe<'a.b.0' | 'a.b.1'>();

declare const deepObjectArrayLeaves: Paths<{a: {b: ReadonlyArray<{readonly c?: number; d: string}>}}, {leavesOnly: true}>;
expectTypeOf(deepObjectArrayLeaves).toBe<`a.b.${number}.c` | `a.b.${number}.d`>();

declare const deepObjectTupleLeaves: Paths<{a: {readonly b: [{readonly c: string}, {d?: number}]}}, {leavesOnly: true}>;
expectTypeOf(deepObjectTupleLeaves).toBe<'a.b.0.c' | 'a.b.1.d'>();

declare const nestedArrayLeaves: Paths<{a?: Array<Array<Array<{b: string}>>>}, {leavesOnly: true}>;
expectTypeOf(nestedArrayLeaves).toBe<`a.${number}.${number}.${number}.b`>();

declare const nestedTupleLeaves: Paths<{a: [[[{b: string}]]?]}, {leavesOnly: true}>;
expectTypeOf(nestedTupleLeaves).toBe<'a.0.0.0.b'>();

declare const trailingSpreadLeaves: Paths<[{a: string}, ...Array<{b: number}>], {leavesOnly: true}>;
expectTypeOf(trailingSpreadLeaves).toBe<'0.a' | `${number}.b`>();

declare const trailingSpreadLeaves1: Paths<[{a: string}, {b: number}, ...Array<{c?: number}>], {leavesOnly: true}>;
expectTypeOf(trailingSpreadLeaves1).toBe<'0.a' | '1.b' | `${number}.c`>();

declare const leadingSpreadLeaves: Paths<[...Array<{a?: string}>, {readonly b: number}], {leavesOnly: true}>;
expectTypeOf(leadingSpreadLeaves).toBe<`${number}.a` | `${number}.b`>();

declare const leadingSpreadLeaves1: Paths<[...Array<{a?: string}>, {readonly b: number}, {c: number}], {leavesOnly: true}>;
expectTypeOf(leadingSpreadLeaves1).toBe<`${number}.a` | `${number}.b` | `${number}.c`>();

declare const recursiveLeaves: Paths<RecursiveFoo, {leavesOnly: true; maxRecursionDepth: 10}>;
expectTypeOf(recursiveLeaves).toBe<'foo.foo.foo.foo.foo.foo.foo.foo.foo.foo.foo'>();

declare const recursiveWithMaxLeaves: Paths<RecursiveFoo, {maxRecursionDepth: 0; leavesOnly: true}>;
expectTypeOf(recursiveWithMaxLeaves).toBe<'foo'>();

declare const recursiveWithMaxLeaves1: Paths<RecursiveFoo, {maxRecursionDepth: 1; leavesOnly: true}>;
expectTypeOf(recursiveWithMaxLeaves1).toBe<'foo.foo'>();

declare const recursiveArrayLeaves: Paths<RecursionArray, {bracketNotation: true; maxRecursionDepth: 2; leavesOnly: true}>;
expectTypeOf(recursiveArrayLeaves).toBe<`[${number}][${number}][${number}]`>();

declare const bracketArrayLeaves: Paths<{a: Array<{b: string; c?: string}>}, {bracketNotation: true; leavesOnly: true}>;
expectTypeOf(bracketArrayLeaves).toBe<`a[${number}].b` | `a[${number}].c`>();

declare const bracketTupleLeaves: Paths<{a: [{b?: string}, {c: string}]}, {bracketNotation: true; leavesOnly: true}>;
expectTypeOf(bracketTupleLeaves).toBe<'a[0].b' | 'a[1].c'>();

declare const bracketNumericLeaves: Paths<{a: {1: string; 2: number}}, {bracketNotation: true; leavesOnly: true}>;
expectTypeOf(bracketNumericLeaves).toBe<'a[1]' | 'a[2]'>();

declare const bracketNestedArrayLeaves: Paths<{a: Array<Array<Array<{b: string}>>>}, {bracketNotation: true; leavesOnly: true}>;
expectTypeOf(bracketNestedArrayLeaves).toBe<`a[${number}][${number}][${number}].b`>();

declare const mapLeaves: Paths<{a: {b: Map<string, number>; c: ReadonlyMap<string, number>}; d: WeakMap<{a: string}, number>}, {leavesOnly: true}>;
expectTypeOf(mapLeaves).toBe<'a.b' | 'a.c' | 'd'>();

declare const setLeaves: Paths<{a: {b: Set<string>; c: ReadonlySet<string>}; d: WeakSet<{a: string}>}, {leavesOnly: true}>;
expectTypeOf(setLeaves).toBe<'a.b' | 'a.c' | 'd'>();

declare const unknownLeaves: Paths<{a: {b: unknown}}, {leavesOnly: true}>;
expectTypeOf(unknownLeaves).toBe<'a.b'>();

declare const anyLeaves: Paths<{a: {b: any}}, {leavesOnly: true}>;
expectTypeOf(anyLeaves).toBe<'a.b'>();

declare const neverLeaves: Paths<{a: {b: never}}, {leavesOnly: true}>;
expectTypeOf(neverLeaves).toBe<'a.b'>();

// -- depth option --
declare const zeroDepth: Paths<DeepObject, {depth: 0}>;
expectTypeOf(zeroDepth).toBe<'a'>();

declare const oneDepth: Paths<DeepObject, {depth: 1}>;
expectTypeOf(oneDepth).toBe<'a.b' | 'a.b2' | 'a.b3'>();

declare const twoDepth: Paths<DeepObject, {depth: 2}>;
expectTypeOf(twoDepth).toBe<'a.b.c' | `a.b2.${number}`>();

declare const threeDepth: Paths<DeepObject, {depth: 3}>;
expectTypeOf(threeDepth).toBe<'a.b.c.d'>();

declare const unionDepth: Paths<{a: {readonly b?: string}} | {x: {y?: {z: number}}}, {depth: 1}>;
expectTypeOf(unionDepth).toBe<'a.b' | 'x.y'>();

declare const unionDepth2: Paths<{a?: {b: string; readonly c: {d?: string}}} | {readonly x?: {y: string}}, {depth: 2}>;
expectTypeOf(unionDepth2).toBe<'a.c.d'>();

declare const unionDepth3: Paths<DeepObject, {depth: 0 | 3}>;
expectTypeOf(unionDepth3).toBe<'a' | 'a.b.c.d'>();

declare const unionDepth4: Paths<{a?: {b: string; readonly c: {d?: [string, number]}}} | {readonly x?: {y: string}}, {depth: 1 | 3}>;
expectTypeOf(unionDepth4).toBe<'a.b' | 'a.c' | 'x.y' | 'a.c.d.0' | 'a.c.d.1'>();

declare const unionDepth5: Paths<{a: {b?: string}} | {x: {y?: {z: number}}}, {depth: 0 | 2}>;
expectTypeOf(unionDepth5).toBe<'a' | 'x' | 'x.y.z'>();

declare const unreachableDepth: Paths<DeepObject, {depth: 4}>;
expectTypeOf(unreachableDepth).toBe<never>();

declare const unreachableDepth2: Paths<{a: {}}, {depth: 1}>;
expectTypeOf(unreachableDepth2).toBe<never>();

declare const unreachableDepth3: Paths<{a: readonly []}, {depth: 1}>;
expectTypeOf(unreachableDepth3).toBe<never>();

declare const unreachableAndReachableDepth: Paths<{a: {b: string}}, {depth: 1 | 2}>;
expectTypeOf(unreachableAndReachableDepth).toBe<'a.b'>();

declare const maxLessThanDepth: Paths<DeepObject, {maxRecursionDepth: 2; depth: 3}>;
expectTypeOf(maxLessThanDepth).toBe<never>();

declare const maxLessThanDepth2: Paths<RecursiveFoo, {depth: 12}>; // Default `maxRecursionDepth` is 10
expectTypeOf(maxLessThanDepth2).toBe<never>();

declare const maxSimilarToDepth: Paths<DeepObject, {maxRecursionDepth: 2; depth: 2}>;
expectTypeOf(maxSimilarToDepth).toBe<'a.b.c' | `a.b2.${number}`>();

declare const maxSimilarToDepth2: Paths<RecursiveFoo, {maxRecursionDepth: 0; depth: 0}>;
expectTypeOf(maxSimilarToDepth2).toBe<'foo'>();

declare const maxSimilarToDepth3: Paths<RecursiveFoo, {depth: 10; maxRecursionDepth: 10}>; // Default `maxRecursionDepth` is 10
expectTypeOf(maxSimilarToDepth3).toBe<'foo.foo.foo.foo.foo.foo.foo.foo.foo.foo.foo'>();

declare const maxMoreThanDepth: Paths<DeepObject, {maxRecursionDepth: 2; depth: 1}>;
expectTypeOf(maxMoreThanDepth).toBe<'a.b' | 'a.b2' | 'a.b3'>();

declare const maxMoreThanDepth2: Paths<RecursiveFoo, {maxRecursionDepth: 6; depth: 3}>;
expectTypeOf(maxMoreThanDepth2).toBe<'foo.foo.foo.foo'>();

declare const maxMoreAndLessThanDepth: Paths<RecursionArray, {maxRecursionDepth: 2; depth: 1 | 3}>;
expectTypeOf(maxMoreAndLessThanDepth).toBe<`${number}.${number}`>();

declare const maxLessAndSimilarThanDepth: Paths<RecursionArray, {maxRecursionDepth: 1; depth: 0 | 1}>;
expectTypeOf(maxLessAndSimilarThanDepth).toBe<number | `${number}` | `${number}.${number}`>();

declare const maxSimilarAndMoreThanDepth: Paths<RecursionArray, {maxRecursionDepth: 2; depth: 2 | 3}>;
expectTypeOf(maxSimilarAndMoreThanDepth).toBe<`${number}.${number}.${number}`>();

declare const noLeavesAtDepth: Paths<DeepObject, {leavesOnly: true; depth: 0}>;
expectTypeOf(noLeavesAtDepth).toBe<never>();

declare const onlyLeavesAtDepth: Paths<DeepObject, {leavesOnly: true; depth: 1}>;
expectTypeOf(onlyLeavesAtDepth).toBe<'a.b3'>();

declare const onlyLeavesAtDepth2: Paths<DeepObject, {leavesOnly: true; depth: 2}>;
expectTypeOf(onlyLeavesAtDepth2).toBe<`a.b2.${number}`>();

declare const deepArrayDepth: Paths<{a?: {b: readonly string[]}; c: boolean[]}, {depth: 0 | 2}>;
expectTypeOf(deepArrayDepth).toBe<'a' | 'c' | `a.b.${number}`>();

declare const deepTupleDepth: Paths<{a: {b: [string, number]}}, {depth: 2}>;
expectTypeOf(deepTupleDepth).toBe<'a.b.0' | 'a.b.1'>();

declare const deepObjectArrayDepth: Paths<{a: {b: ReadonlyArray<{readonly c?: number; d: string}>}}, {depth: 1 | 3}>;
expectTypeOf(deepObjectArrayDepth).toBe<'a.b' | `a.b.${number}.c` | `a.b.${number}.d`>();

declare const deepObjectTupleDepth: Paths<{a: {readonly b: [{readonly c: string}, {d?: [number]}]}}, {leavesOnly: true; depth: 3}>;
expectTypeOf(deepObjectTupleDepth).toBe<'a.b.0.c'>();

declare const nestedArrayDepth: Paths<{a?: Array<Array<Array<{b: string}>>>}, {depth: 1 | 2 | 3}>;
expectTypeOf(nestedArrayDepth).toBe<`a.${number}` | `a.${number}.${number}` | `a.${number}.${number}.${number}`>();

declare const nestedTupleDepth: Paths<{a: [[[{b: string}]]?]}, {depth: 0 | 4}>;
expectTypeOf(nestedTupleDepth).toBe<'a' | 'a.0.0.0.b'>();

declare const recursiveDepth: Paths<RecursiveFoo, {depth: 4}>;
expectTypeOf(recursiveDepth).toBe<'foo.foo.foo.foo.foo'>();

declare const recursiveDepth2: Paths<RecursiveFoo, {depth: 1 | 3 | 8; maxRecursionDepth: 10}>;
expectTypeOf(recursiveDepth2).toBe<'foo.foo' | 'foo.foo.foo.foo' | 'foo.foo.foo.foo.foo.foo.foo.foo.foo'>();

// For recursive types, leaves are at `maxRecursionDepth`
declare const recursiveDepth3: Paths<RecursiveFoo, {leavesOnly: true; depth: 5; maxRecursionDepth: 10}>;
expectTypeOf(recursiveDepth3).toBe<never>();

declare const recursiveDepth4: Paths<RecursiveFoo, {leavesOnly: true; depth: 5 | 10; maxRecursionDepth: 10}>; // No leaves at depth `5`
expectTypeOf(recursiveDepth4).toBe<'foo.foo.foo.foo.foo.foo.foo.foo.foo.foo.foo'>();

declare const recursiveDepth6: Paths<RecursiveFoo, {leavesOnly: true; maxRecursionDepth: 6; depth: 5}>; // Leaves are at depth `6`
expectTypeOf(recursiveDepth6).toBe<never>();

declare const maxLeavesAndDepth: Paths<DeepObject, {leavesOnly: true; maxRecursionDepth: 2; depth: 2}>; // All depth `2` paths are leaves
expectTypeOf(maxLeavesAndDepth).toBe<'a.b.c' | `a.b2.${number}`>();

declare const maxLeavesAndDepth2: Paths<DeepObject, {leavesOnly: true; maxRecursionDepth: 2; depth: 0 | 1 | 2}>;
expectTypeOf(maxLeavesAndDepth2).toBe<'a.b3' | 'a.b.c' | `a.b2.${number}`>();

declare const recursiveBracketDepth: Paths<RecursionArray, {bracketNotation: true; depth: 3}>;
expectTypeOf(recursiveBracketDepth).toBe<`[${number}][${number}][${number}][${number}]`>();

declare const recursiveBracketDepth2: Paths<RecursionArray, {bracketNotation: true; leavesOnly: true; depth: 3}>; // Leaves are at depth `10`
expectTypeOf(recursiveBracketDepth2).toBe<never>();

declare const bracketArrayDepth: Paths<{a: Array<{b: string; c?: string}>}, {bracketNotation: true; depth: 1 | 2}>;
expectTypeOf(bracketArrayDepth).toBe<`a[${number}]` | `a[${number}].b` | `a[${number}].c`>();

declare const bracketTupleDepth: Paths<{a: [{b?: string}, {c: string}]}, {bracketNotation: true; leavesOnly: true; depth: 0 | 2}>;
expectTypeOf(bracketTupleDepth).toBe<'a[0].b' | 'a[1].c'>();

declare const bracketNumericDepth: Paths<{a: {1: string; 2: number}}, {bracketNotation: true; depth: 1}>;
expectTypeOf(bracketNumericDepth).toBe<'a[1]' | 'a[2]'>();

declare const bracketNestedArrayDepth: Paths<{a: Array<Array<Array<{b: string}>>>}, {bracketNotation: true; depth: 2 | 4}>;
expectTypeOf(bracketNestedArrayDepth).toBe<`a[${number}][${number}]` | `a[${number}][${number}][${number}].b`>();

declare const trailingSpreadDepth: Paths<[{a: string}, ...Array<{b: number}>], {depth: 1}>;
expectTypeOf(trailingSpreadDepth).toBe<'0.a' | `${number}.b`>();

declare const leadingSpreadDepth: Paths<[...Array<{a?: string}>, {readonly b: number}], {depth: 0 | 1}>;
expectTypeOf(leadingSpreadDepth).toBe<number | `${number}` | `${number}.b` | `${number}.a`>();

declare const negativeDepth: Paths<DeepObject, {depth: -1}>;
expectTypeOf(negativeDepth).toBe<never>();

declare const positiveAndNegativeDepth: Paths<DeepObject, {depth: 1 | -1}>;
expectTypeOf(positiveAndNegativeDepth).toBe<'a.b' | 'a.b2' | 'a.b3'>();

declare const zeroPositiveAndNegativeDepth: Paths<DeepObject, {depth: 0 | 2 | -4}>;
expectTypeOf(zeroPositiveAndNegativeDepth).toBe<'a' | 'a.b.c' | `a.b2.${number}`>();

declare const neverDepth: Paths<DeepObject, {depth: never}>;
expectTypeOf(neverDepth).toBe<never>();

declare const anyDepth: Paths<DeepObject, {depth: any}>;
expectTypeOf(anyDepth).toBe<'a' | 'a.b.c' | `a.b2.${number}` | 'a.b3' | 'a.b' | 'a.b2' | 'a.b.c.d'>();

// Index signatures
declare const indexSignature: Paths<{[x: string]: {a: string; b: number}}>;
expectTypeOf(indexSignature).toBe<string>(); // Collapsed union

declare const indexSignature1: Paths<{[x: Lowercase<string>]: {a: string; b: number}}>;
expectTypeOf(indexSignature1).toBe<Lowercase<string> | `${Lowercase<string>}.a` | `${Lowercase<string>}.b`>();

declare const indexSignature2: Paths<{[x: number]: {0: string; 1: number}}>;
expectTypeOf(indexSignature2).toBe<number | `${number}` | `${number}.0` | `${number}.1`>();

declare const indexSignature3: Paths<{[x: Uppercase<string>]: {a: string; b: number}}>;
expectTypeOf(indexSignature3).toBe<Uppercase<string> | `${Uppercase<string>}.a` | `${Uppercase<string>}.b`>();

declare const indexSignature4: Paths<{a: {[x: symbol]: {b: number; c: number}}}>;
expectTypeOf(indexSignature4).toBe<'a'>();

declare const indexSignatureWithStaticKeys: Paths<{[x: Uppercase<string>]: {a: string; b: number}; c: number}>;
expectTypeOf(indexSignatureWithStaticKeys).toBe<'c' | Uppercase<string> | `${Uppercase<string>}.a` | `${Uppercase<string>}.b`>();

declare const indexSignatureWithStaticKeys1: Paths<{[x: Uppercase<string>]: {a: string; b?: number}; C: {a: 'a'}}>;
expectTypeOf(indexSignatureWithStaticKeys1).toBe<Uppercase<string> | `${Uppercase<string>}.a` | `${Uppercase<string>}.b`>(); // Collapsed union

declare const nonRootIndexSignature: Paths<{a: {[x: string]: {b: string; c: number}}}>;
expectTypeOf(nonRootIndexSignature).toBe<'a' | `a.${string}` | `a.${string}.b` | `a.${string}.c`>();

declare const nonRootIndexSignature1: Paths<{a: {[x: Lowercase<string>]: {b: string; c: number}}}>;
expectTypeOf(nonRootIndexSignature1).toBe<'a' | `a.${Lowercase<string>}` | `a.${Lowercase<string>}.b` | `a.${Lowercase<string>}.c`>();

declare const nestedIndexSignature: Paths<{[x: string]: {[x: Lowercase<string>]: {a: string; b: number}}}>;
expectTypeOf(nestedIndexSignature).toBe<string>();

declare const nestedIndexSignature1: Paths<{[x: Uppercase<string>]: {[x: Lowercase<string>]: {a: string; b: number}}}>;
expectTypeOf(
	nestedIndexSignature1,
).toBe<Uppercase<string> | `${Uppercase<string>}.${Lowercase<string>}` | `${Uppercase<string>}.${Lowercase<string>}.a` | `${Uppercase<string>}.${Lowercase<string>}.b`>();

declare const indexSignatureUnion: Paths<{a: {[x: string]: number} | {b: number}}>;
expectTypeOf(indexSignatureUnion).toBe<'a' | `a.${string}`>(); // Collapsed union

declare const indexSignatureUnion1: Paths<{a: {[x: Uppercase<string>]: number} | {b: number}}>;
expectTypeOf(indexSignatureUnion1).toBe<'a' | 'a.b' | `a.${Uppercase<string>}`>();

declare const indexSignatureLeaves: Paths<{[x: string]: {a: string; b: number}}, {leavesOnly: true}>;
expectTypeOf(indexSignatureLeaves).toBe<`${string}.a` | `${string}.b`>();

declare const indexSignatureLeaves1: Paths<{a: {[x: string]: {b: string; c: number}}; d: string; e: {f: number}}, {leavesOnly: true}>;
expectTypeOf(indexSignatureLeaves1).toBe<`a.${string}.b` | `a.${string}.c` | 'd' | 'e.f'>();

declare const indexSignatureLeaves2: Paths<{a: {[x: string]: [] | {b: number}}}, {leavesOnly: true}>;
expectTypeOf(indexSignatureLeaves2).toBe<`a.${string}` | `a.${string}.b`>();

declare const indexSignatureDepth: Paths<{[x: string]: {a: string; b: number}}, {depth: 1}>;
expectTypeOf(indexSignatureDepth).toBe<`${string}.b` | `${string}.a`>();

declare const indexSignatureDepth1: Paths<{[x: string]: {a: string; b: number}}, {depth: 0}>;
expectTypeOf(indexSignatureDepth1).toBe<string>();

declare const indexSignatureDepth2: Paths<{[x: string]: {a: string; b: number}}, {depth: 0 | 1}>;
expectTypeOf(indexSignatureDepth2).toBe<string>(); // Collapsed union

declare const indexSignatureDepth3: Paths<{a: {[x: string]: {b: string; c: number}}; d: string; e: {f: number}}, {depth: 0 | 2}>;
expectTypeOf(indexSignatureDepth3).toBe<'a' | `a.${string}.b` | `a.${string}.c` | 'd' | 'e'>();

declare const indexSignatureDepth4: Paths<{a: {[x: string]: [] | {b: number}}}, {depth: 2}>;
expectTypeOf(indexSignatureDepth4).toBe<`a.${string}.b`>();

declare const indexSignatureDepthLeaves: Paths<{a: {[x: string]: {b: string; c: number}}; d: string; e: {f: number}}, {depth: 0 | 2; leavesOnly: true}>;
expectTypeOf(indexSignatureDepthLeaves).toBe<`a.${string}.b` | `a.${string}.c` | 'd'>();

// Generic types
type PathsConstraint<T, _U extends Paths<T>> = never;

type Generic1<T> = {bar: {baz: T}};
type Test1<T> = PathsConstraint<Generic1<T>, 'bar.baz'>;

type Generic2<T, U> = {bar: {baz: {qux: T}; fizz: {buzz: U} | U | T}};
type Test2<T, U> = PathsConstraint<
	Generic2<T, U>,
	'bar' | 'bar.baz' | 'bar.baz.qux' | 'bar.fizz' | 'bar.fizz.buzz'
>;

type LeavesOnlyPathsConstraint<T, _U extends Paths<T, {leavesOnly: true}>> = never;

type Generic3<T> = {bar: {baz: T; qux: string}};
type Test3<T> = LeavesOnlyPathsConstraint<Generic3<T>, 'bar.qux'>;
// @ts-expect-error
type Test4<T> = LeavesOnlyPathsConstraint<Generic3<T>, 'bar'>; // 'bar' is not a leaf
// @ts-expect-error
type Test5<T> = LeavesOnlyPathsConstraint<Generic3<T>, 'bar.baz'>; // 'bar.baz' is not a leaf, because `T` is not known.

type DepthPathsConstraint<T, _U extends Paths<T, {depth: 1}>> = never;

type Generic4<T> = {bar: {baz: T}; qux: [T]};
type Test6<T> = DepthPathsConstraint<Generic4<T>, 'bar.baz' | 'qux.0'>;
// @ts-expect-error
type Test7<T> = DepthPathsConstraint<Generic4<T>, 'bar'>; // 'bar' is not at depth `1`
// @ts-expect-error
type Test8<T> = DepthPathsConstraint<Generic4<T>, 'qux'>; // 'qux' is not at depth `1`

type BracketNotationPathsConstraint<T, _U extends Paths<T, {bracketNotation: true}>> = never;

type Generic5<T> = {1: {2: T}; 3: [T]};
type Test9<T> = BracketNotationPathsConstraint<Generic5<T>, '[1]' | '[1][2]' | '[3]' | '[3][0]'>;

type MaxRecursionDepthPathsConstraint<T, _U extends Paths<T, {maxRecursionDepth: 2}>> = never;

type Generic6<T> = {foo: {bar: T}; baz: T; fizz: {buzz: {qux: {quxx: T}}}};
type Test10<T> = MaxRecursionDepthPathsConstraint<
	Generic6<T>,
	'foo' | 'foo.bar' | 'baz' | 'fizz' | 'fizz.buzz' | 'fizz.buzz.qux'
>;
// @ts-expect-error
type Test11<T> = MaxRecursionDepthPathsConstraint<Generic6<T>, 'fizz.buzz.qux.quxx'>; // 'fizz.buzz.qux.quxx' is at depth `3`

type LeavesOnlyAndDepthPathsConstraint<T, _U extends Paths<T, {leavesOnly: true; depth: 1}>> = never;

type Generic7<T> = {foo: {bar: T; baz: string; fizz: {buzz: number}}; qux: string};
type Test12<T> = LeavesOnlyAndDepthPathsConstraint<Generic7<T>, 'foo.baz'>;
// @ts-expect-error
type Test13<T> = LeavesOnlyAndDepthPathsConstraint<Generic7<T>, 'qux'>; // 'qux' is a leaf, but not at depth `1`.
// @ts-expect-error
type Test14<T> = LeavesOnlyAndDepthPathsConstraint<Generic7<T>, 'foo.fizz'>; // 'foo.fizz' is at depth `1`, but not a leaf.
// @ts-expect-error
type Test15<T> = LeavesOnlyAndDepthPathsConstraint<Generic7<T>, 'foo.bar'>; // 'foo.bar' is at depth `1`, but not a leaf because `T` is not known.

// An array is not a leaf, because there is a path for its elements, so its own path is dropped while the paths through it stay.
declare const leavesWithArray: Paths<{a: Array<{b: string}>}, {leavesOnly: true}>;
expectTypeOf(leavesWithArray).toBe<`a.${number}.b`>();

// A `maxRecursionDepth` past the deepest path stops nothing.
declare const limitPastTheShape: Paths<{a: {b: {c: string}}}, {leavesOnly: true; maxRecursionDepth: 3}>;
expectTypeOf(limitPastTheShape).toBe<'a.b.c'>();

// In bracket notation a numeric segment is written in brackets and joined with nothing, and the whole path stays one template literal type rather than a pattern followed by a `.key`.
declare const bracketedNestedArray: Paths<{a: ReadonlyArray<{b: string}>}, {bracketNotation: true}>;
expectTypeOf(bracketedNestedArray).toBe<'a' | `a[${number}]` | `a[${number}].b`>();

// A plain object with `name` and `message` is structurally an `Error`, but it is data, so its paths are walked.
expectTypeOf<Paths<{contact: {name: string; message: string; meta: {source: string}}}>>().toBe<'contact' | 'contact.name' | 'contact.message' | 'contact.meta' | 'contact.meta.source'>();

// A thenable is a single value like a `Promise`, so its members, extra ones included, are not paths.
expectTypeOf<Paths<{a: PromiseLike<number> & {extra: {b: 1}}}>>().toBe<'a'>();

// A typed array is a single value, so its indices and methods are not paths.
expectTypeOf<Paths<{a: Uint8Array}>>().toBe<'a'>();
