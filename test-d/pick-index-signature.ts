import {expectTypeOf} from 'nz';
import type {PickIndexSignature, Simplify} from '../index.d.ts';

declare const symbolKey: unique symbol;

type Foo = {
	[x: string]: unknown;
	[x: number]: unknown;
	[x: symbol]: unknown;
	[x: `head-${string}`]: string;
	[x: `${string}-tail`]: string;
	[x: `head-${string}-tail`]: string;
	[x: `${bigint}`]: string;
	[x: `embedded-${number}`]: string;
};

type Bar = {
	['kebab-case-key']: string;
	[symbolKey]: string;
	foo: 'bar';
	qux?: 'baz';
};

type FooBar = Simplify<Foo & Bar>;

declare const indexSignature: PickIndexSignature<FooBar>;

expectTypeOf(indexSignature).toBe<Foo>();

// Object.prototype names are explicit properties, not index signatures.
type PrototypeFields = {
	[key: string]: unknown;
	readonly toString: string;
	valueOf: number;
	hasOwnProperty?: boolean;
};
expectTypeOf<PickIndexSignature<PrototypeFields>>().toBe<Record<string, unknown>>();
expectTypeOf<keyof PickIndexSignature<{toString: string; valueOf: number; hasOwnProperty: boolean}>>().toBe<never>();

// Number, symbol and template domains keep their values while explicit names are removed.
type OtherIndexDomains = {
	readonly [key: number]: string;
	[key: symbol]: boolean;
	[key: `row-${string}`]: number;
	toLocaleString?: string;
	constructor: Date;
};
expectTypeOf<PickIndexSignature<OtherIndexDomains>>().toBe<{readonly [key: number]: string; [key: symbol]: boolean; [key: `row-${string}`]: number}>();
expectTypeOf<PickIndexSignature<{toString: any; valueOf: never; hasOwnProperty: unknown}>>().toBe<{}>();
expectTypeOf<PickIndexSignature<unknown>>().toBe<{}>();
expectTypeOf<PickIndexSignature<never>>().toBe<never>();
expectTypeOf<PickIndexSignature<any>['entry']>().toBe<any>();
expectTypeOf<keyof PickIndexSignature<readonly [string, number?]>>().toBe<number>();

function _constructIndexFields<Value>(value: Value): PickIndexSignature<Value> {
	return value;
}

function _readPatternIndex<Value>(value: PickIndexSignature<{[key: `row-${string}`]: Value; id: number}>): Value | undefined {
	return value['row-first'];
}
