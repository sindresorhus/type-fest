import {expectType, expectError} from 'tsd';
import {TransformDeep} from '../index';

const data = {
	object: {
		foo: 'bar',
	},
	fn: (_: string) => true,
	string: 'foo',
	number: 1,
	boolean: false,
	symbol: Symbol('test'),
	date: new Date(),
	regExp: new RegExp(/.*/),
	null: null,
	undefined: undefined,
	map: new Map<string, number>(),
	set: new Set<{id: number; label: string}>(),
	array: ['foo'],
	tuple: ['foo'] as ['foo'],
	readonlyMap: new Map<string, {foo: boolean}>() as ReadonlyMap<string, {foo: boolean}>,
	readonlySet: new Set<{foo: boolean}>() as ReadonlySet<{foo: boolean}>,
	readonlyArray: ['foo'] as readonly string[],
	readonlyTuple: ['foo'] as const,
};

const transformedData: TransformDeep<typeof data, string> = {
	object: {
		foo: 'string',
	},
	fn: 'string',
	string: 'string',
	number: 'string',
	boolean: 'string',
	symbol: 'string',
	date: 'string',
	regExp: 'string',
	null: 'string',
	undefined: 'string',
	map: new Map<string, string>(),
	set: new Set<{id: string; label: string}>(),
	array: ['string'],
	tuple: ['string'],
	readonlyMap: new Map<string, {foo: string}>(),
	readonlySet: new Set<{foo: string}>(),
	readonlyArray: ['string'],
	readonlyTuple: ['string'],
};

expectError(transformedData.date = new Date());
expectType<{foo: string}>(transformedData.object);
expectType<string>(transformedData.string);
expectType<string>(transformedData.number);
expectType<string>(transformedData.boolean);
expectType<string>(transformedData.symbol);
expectType<string>(transformedData.null);
expectType<string>(transformedData.undefined);
expectType<string>(transformedData.date);
expectType<string>(transformedData.regExp);
expectType<ReadonlyMap<string, string>>(transformedData.map);
expectType<ReadonlySet<{id: string; label: string}>>(transformedData.set);
expectType<readonly string[]>(transformedData.array);
expectType<readonly [string]>(transformedData.tuple);
expectType<ReadonlyMap<string, {foo: string}>>(transformedData.readonlyMap);
expectType<ReadonlySet<{foo: string}>>(transformedData.readonlySet);
expectType<readonly string[]>(transformedData.readonlyArray);
expectType<readonly [string]>(transformedData.readonlyTuple);
