import {expectType} from 'tsd';
import type {IsWritableKeyOf} from '../source/is-writable-key-of.d.ts';

declare const never: never;
declare const boolean: boolean;
declare const symbol: unique symbol;

// Simple object
type A = {
	a: string;
	readonly b: number;
	c?: boolean;
};

expectType<IsWritableKeyOf<A, 'a'>>(true);
expectType<IsWritableKeyOf<A, 'b'>>(false);
expectType<IsWritableKeyOf<A, 'c'>>(true);

// @ts-expect-error `d` is not in `keyof T`
expectType<IsWritableKeyOf<A, 'd'>>(false);

// Index signature
type B = {
	[k: string]: number;
};

expectType<IsWritableKeyOf<B, 'anything'>>(true);

// Fully readonly index
type C = {
	readonly [k: string]: number;
};

expectType<IsWritableKeyOf<C, string>>(false);
expectType<IsWritableKeyOf<C, 'anything'>>(true);

// Optional + readonly
type D = {
	readonly a?: string;
	b: number;
};

expectType<IsWritableKeyOf<D, 'a'>>(false);
expectType<IsWritableKeyOf<D, 'b'>>(true);

// Union
type E1 = {a: number};
type E2 = {readonly a: number};
type E = E1 | E2;

expectType<IsWritableKeyOf<E, 'a'>>(boolean);

// Intersection
type F1 = {readonly a: string};
type F2 = {a: string};
type F = F1 & F2;

expectType<IsWritableKeyOf<F, 'a'>>(true);

// Class instance
class G {
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	readonly x = 1;
	y = '';
}

expectType<IsWritableKeyOf<G, 'x'>>(false);
expectType<IsWritableKeyOf<G, 'y'>>(true);

type H = {
	[symbol]: number;
	readonly x: string;
};

expectType<IsWritableKeyOf<H, typeof symbol>>(true);
expectType<IsWritableKeyOf<H, 'x'>>(false);

// Full readonly object
type I = Readonly<{
	a: number;
	b: string;
}>;

expectType<IsWritableKeyOf<I, 'a'>>(false);
expectType<IsWritableKeyOf<I, 'b'>>(false);

// Object with method
type J = {
	readonly id: string;
	run(): void;
};

expectType<IsWritableKeyOf<J, 'run'>>(true);
expectType<IsWritableKeyOf<J, 'id'>>(false);

// Record
type K = Record<'a' | 'b', string>;

expectType<IsWritableKeyOf<K, 'a'>>(true);
expectType<IsWritableKeyOf<K, 'b'>>(true);

// Union of keys
expectType<IsWritableKeyOf<A, 'b' | 'c'>>(boolean);
expectType<IsWritableKeyOf<A, 'a' | 'b'>>(boolean);
// @ts-expect-error
expectType<IsWritableKeyOf<A, 'a' | 'd'>>(boolean);
expectType<IsWritableKeyOf<A, 'a' | 'c'>>(true);

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectType<IsWritableKeyOf<A, FullKeyUnion>>(boolean);
// @ts-expect-error
expectType<IsWritableKeyOf<A, 'b' | 'x'>>(false); // 'x' is not in A, so filtered as false

// `never` / `any
type L = {readonly a: string};
expectType<IsWritableKeyOf<K, any>>(never);
expectType<IsWritableKeyOf<any, any>>(never);
expectType<IsWritableKeyOf<any, 'a'>>(never);
expectType<IsWritableKeyOf<K, never>>(never);
expectType<IsWritableKeyOf<any, never>>(never);
expectType<IsWritableKeyOf<never, 'a'>>(never);
