import {expectType} from 'tsd';
import type {ArrayExclude} from '../index.d.ts';

type ObjectLike = {prop: string};

// ORDINARY ARRAYS
type OrdinaryArrayUnion =
	| number
	| string
	| boolean
	| Record<string, unknown>
	| null
	| symbol
	| ObjectLike;
type OrdinaryArray = OrdinaryArrayUnion[];
declare const arrayOmitNumberAndString: ArrayExclude<
	OrdinaryArray,
	number | string
>;
declare const arrayNoOp: ArrayExclude<OrdinaryArray, bigint>;
declare const arrayNoOpOnNever: ArrayExclude<OrdinaryArray, never>;
declare const arrayNever: ArrayExclude<OrdinaryArray, OrdinaryArray[number]>;
declare const unknownArrayNoOp: ArrayExclude<unknown[], string>;
declare const unknownArrayNever: ArrayExclude<unknown[], unknown>;
declare const arrayNested: ArrayExclude<Array<string | string[] | number[]>, string | number[]>;
declare const arrayAny: ArrayExclude<any[], string>;
declare const arrayAnyNever: ArrayExclude<any[], never>;
declare const arrayAnyAny: ArrayExclude<any[], any>;
declare const arrayAnyUnknown: ArrayExclude<any[], unknown>;

expectType<Array<Exclude<OrdinaryArrayUnion, number | string>>>(
	arrayOmitNumberAndString,
);
expectType<string[][]>(arrayNested);
expectType<any[]>(arrayAny);
expectType<any[]>(arrayAnyNever);
expectType<OrdinaryArray>(arrayNoOp);
expectType<OrdinaryArray>(arrayNoOpOnNever);
expectType<unknown[]>(unknownArrayNoOp);
expectType<never[]>(arrayNever);
expectType<never[]>(unknownArrayNever);
expectType<never[]>(arrayAnyAny);
expectType<never[]>(arrayAnyUnknown);

// READONLY ARRAYS AND TUPLES
const readonlyArray = [
	1,
	'literal',
	2,
	false,
	3,
	null,
	1,
	undefined,
	2,
	{prop: 'prop'},
	3,
	Symbol('Symbol description'),
] as const;

type ReadonlyExample = typeof readonlyArray;
type TupleExample = [
	1,
	'literal',
	2,
	false,
	3,
	null,
	1,
	undefined,
	2,
	{prop: 'prop'},
	3,
	symbol,
];
type OmitSeveral = number | boolean | null | Record<string, unknown>;

declare const tupleNoOp: ArrayExclude<TupleExample, bigint>;
declare const tupleNoOpOnNever: ArrayExclude<TupleExample, never>;
declare const readonlyNoOp: ArrayExclude<ReadonlyExample, bigint>;
declare const readonlyNoOpOnNever: ArrayExclude<ReadonlyExample, never>;
declare const tupleOmitNumbers: ArrayExclude<TupleExample, 1 | 3>;
declare const readonlyOmitNumbers: ArrayExclude<ReadonlyExample, 1 | 3>;
declare const readonlyOmitSeveral: ArrayExclude<ReadonlyExample, OmitSeveral>;
declare const tupleOmitSeveral: ArrayExclude<TupleExample, OmitSeveral>;
declare const tupleNever: ArrayExclude<TupleExample, TupleExample[number]>;
declare const readonlyNever: ArrayExclude<ReadonlyExample, ReadonlyExample[number]>;

type ExpectedTupleOmitNumbers = [
	'literal',
	2,
	false,
	null,
	undefined,
	2,
	{prop: 'prop'},
	symbol,
];
type ExpectedReadonlyOmitNumbers = readonly [
	'literal',
	2,
	false,
	null,
	undefined,
	2,
	{readonly prop: 'prop'},
	symbol,
];
type ExpectedTupleOmitSeveral = ['literal', undefined, symbol];
type ExpectedReadonlyOmitSeveral = readonly ['literal', undefined, symbol];

expectType<TupleExample>(tupleNoOp);
expectType<TupleExample>(tupleNoOpOnNever);
expectType<ReadonlyExample>(readonlyNoOp);
expectType<ReadonlyExample>(readonlyNoOpOnNever);
expectType<ExpectedTupleOmitNumbers>(tupleOmitNumbers);
expectType<ExpectedReadonlyOmitNumbers>(readonlyOmitNumbers);
expectType<ExpectedReadonlyOmitSeveral>(readonlyOmitSeveral);
expectType<ExpectedTupleOmitSeveral>(tupleOmitSeveral);
expectType<never[]>(tupleNever);
expectType<readonly never[]>(readonlyNever);

// INVALID TYPES
// @ts-expect-error
declare const invalidPrimitiveSource: ArrayExclude<string, 'something'>;
declare const invalidObjectSource: ArrayExclude<
	// @ts-expect-error
	Record<string, unknown>,
	'something'
>;
expectType<never>(invalidPrimitiveSource);
expectType<never>(invalidObjectSource);

// BOOLEAN EDGE CASE

// If the tuple has a boolean type specification for one of its elements
// this results in discriminative union return
declare const tupleBoolean: ArrayExclude<[number, boolean], number>;
declare const readonlyBoolean: ArrayExclude<readonly [number, boolean], number>;
expectType<[false] | [true]>(tupleBoolean);
expectType<readonly [false] | readonly [true]>(readonlyBoolean);

// DOCUMENTATION EXAMPLES
declare const docsOrdinaryArray: ArrayExclude<Array<string | number | boolean>, string | boolean>;
declare const docsReadonlyArray: ArrayExclude<readonly ['literalValue', 1, 2, 3, {readonly prop: 'prop'}, true], string | 2 | Record<string, unknown>>;
declare const docsTuple: ArrayExclude<['literalValue', 1, 2, 3, {prop: 'prop'}, true], string | 2 | Record<string, unknown>>;

expectType<number[]>(docsOrdinaryArray);
expectType<readonly [1, 3, true]>(docsReadonlyArray);
expectType<[1, 3, true]>(docsTuple);

// Readonly non-tuple arrays
declare const readonlyArrayExclude: ArrayExclude<ReadonlyArray<(string | number | boolean)>, string | boolean>;
declare const readonlyArrayNoOp: ArrayExclude<readonly string[], number>;
declare const readonlyArrayNever: ArrayExclude<readonly string[], string>;
expectType<readonly number[]>(readonlyArrayExclude);
expectType<readonly string[]>(readonlyArrayNoOp);
expectType<readonly never[]>(readonlyArrayNever);

// `never` input type
declare const neverArray: ArrayExclude<never, string>;
expectType<never>(neverArray);
