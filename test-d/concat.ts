import {expectType} from 'tsd';
import type {Concat, EmptyObject, Primitive, TupleOf} from '../index.d.ts';

type TestTuple = [number, string];

expectType<[]>({} as Concat<[], []>);

expectType<[number, string]>({} as Concat<[number], [string]>);
expectType<[number, string]>({} as Concat<[], TestTuple>);
expectType<[number, string]>({} as Concat<TestTuple, []>);

expectType<[number, string]>({} as Concat<Required<TestTuple>, []>);
expectType<[number?, string?]>({} as Concat<Partial<TestTuple>, []>);

expectType<[number, string, number, string]>({} as Concat<TestTuple, Readonly<TestTuple>>);
expectType<[number, string, number, number]>({} as Concat<TestTuple, TupleOf<2, number>>);
expectType<[number, string?, string?, string?]>({} as Concat<[number], Partial<TupleOf<3, string>>>);
expectType<TupleOf<5, TestTuple>>({} as Concat<TupleOf<2, TestTuple>, TupleOf<3, TestTuple>>);

expectType<[number, ...string[]]>({} as Concat<[number], string[]>);
expectType<[number, ...string[]]>({} as Concat<[number], readonly string[]>);
expectType<[number, string, ...boolean[]]>({} as Concat<TestTuple, boolean[]>);
expectType<Array<number | string>>({} as Concat<number[], string[]>);
expectType<number[]>({} as Concat<number[], number[]>);
expectType<[number, string] | [number, boolean]>({} as Concat<[number], [string] | [boolean]>);

// @ts-expect-error
let foo: Concat<TestTuple, unknown>;
// @ts-expect-error
let bar: Concat<TestTuple, Primitive>;
// @ts-expect-error
let baz: Concat<TestTuple, EmptyObject>;
// @ts-expect-error
let qux: Concat<TestTuple, () => void>;
