import {expectAssignable, expectType} from 'tsd';
import type {Paths, PickDeep} from '../index';

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
