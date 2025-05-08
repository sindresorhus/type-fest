import {expectType} from 'tsd';
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

expectType<Foo>(indexSignature);
