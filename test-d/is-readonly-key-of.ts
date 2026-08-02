import {expectType} from 'tsd';
import type {IsReadonlyKeyOf} from '../source/is-readonly-key-of.d.ts';

declare const never: never;
declare const boolean: boolean;
declare const symbol: unique symbol;

// Simple object
type A = {
	a: string;
	readonly b: number;
	c?: boolean;
};

expectType<IsReadonlyKeyOf<A, 'a'>>(false);
expectType<IsReadonlyKeyOf<A, 'b'>>(true);
expectType<IsReadonlyKeyOf<A, 'c'>>(false);

// @ts-expect-error `d` is not in `keyof T`
expectType<IsReadonlyKeyOf<A, 'd'>>(false);

// Index signature
type B = {
	[k: string]: number;
};

expectType<IsReadonlyKeyOf<B, 'anything'>>(false);

// Fully readonly index
type C = {
	readonly [k: string]: number;
};

expectType<IsReadonlyKeyOf<C, string>>(true);
expectType<IsReadonlyKeyOf<C, 'anything'>>(false);

// Optional + readonly
type D = {
	readonly a?: string;
	b: number;
};

expectType<IsReadonlyKeyOf<D, 'a'>>(true);
expectType<IsReadonlyKeyOf<D, 'b'>>(false);

// Union
type E1 = {a: number};
type E2 = {readonly a: number};
type E = E1 | E2;

expectType<IsReadonlyKeyOf<E, 'a'>>(boolean);

// Intersection
type F1 = {readonly a: string};
type F2 = {a: string};
type F = F1 & F2;

expectType<IsReadonlyKeyOf<F, 'a'>>(false);

// Class instance
class G {
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	readonly x = 1;
	y = '';
}

expectType<IsReadonlyKeyOf<G, 'x'>>(true);
expectType<IsReadonlyKeyOf<G, 'y'>>(false);

type H = {
	[symbol]: number;
	readonly x: string;
};

expectType<IsReadonlyKeyOf<H, typeof symbol>>(false);
expectType<IsReadonlyKeyOf<H, 'x'>>(true);

// Full readonly object
type I = Readonly<{
	a: number;
	b: string;
}>;

expectType<IsReadonlyKeyOf<I, 'a'>>(true);
expectType<IsReadonlyKeyOf<I, 'b'>>(true);

// Object with method
type J = {
	readonly id: string;
	run(): void;
};

expectType<IsReadonlyKeyOf<J, 'run'>>(false);
expectType<IsReadonlyKeyOf<J, 'id'>>(true);

// Record
type K = Record<'a' | 'b', string>;

expectType<IsReadonlyKeyOf<K, 'a'>>(false);
expectType<IsReadonlyKeyOf<K, 'b'>>(false);

// Union of keys
expectType<IsReadonlyKeyOf<A, 'b' | 'c'>>(boolean);
expectType<IsReadonlyKeyOf<A, 'a' | 'b'>>(boolean);
// @ts-expect-error
expectType<IsReadonlyKeyOf<A, 'a' | 'd'>>(false);
expectType<IsReadonlyKeyOf<A, 'a' | 'c'>>(false);

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectType<IsReadonlyKeyOf<A, FullKeyUnion>>(boolean);
// @ts-expect-error
expectType<IsReadonlyKeyOf<A, 'b' | 'x'>>(boolean); // 'x' is not in A, so filtered as false

// `never` / `any
type L = {readonly a: string};
expectType<IsReadonlyKeyOf<K, any>>(never);
expectType<IsReadonlyKeyOf<any, any>>(never);
expectType<IsReadonlyKeyOf<any, 'a'>>(never);
expectType<IsReadonlyKeyOf<K, never>>(never);
expectType<IsReadonlyKeyOf<any, never>>(never);
expectType<IsReadonlyKeyOf<never, 'a'>>(never);
