import {expectTypeOf} from 'nz';
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

expectTypeOf<IsWritableKeyOf<A, 'a'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<A, 'b'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<A, 'c'>>().toBe<true>();

// @ts-expect-error `d` is not in `keyof T`
expectTypeOf<IsWritableKeyOf<A, 'd'>>().toBe<false>();

// Index signature
type B = {
	[k: string]: number;
};

expectTypeOf<IsWritableKeyOf<B, 'anything'>>().toBe<true>();

// Fully readonly index
type C = {
	readonly [k: string]: number;
};

expectTypeOf<IsWritableKeyOf<C, string>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<C, 'anything'>>().toBe<true>();

// Optional + readonly
type D = {
	readonly a?: string;
	b: number;
};

expectTypeOf<IsWritableKeyOf<D, 'a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<D, 'b'>>().toBe<true>();

// Union
type E1 = {a: number};
type E2 = {readonly a: number};
type E = E1 | E2;

expectTypeOf(boolean).toBe<IsWritableKeyOf<E, 'a'>>();

// Intersection
type F1 = {readonly a: string};
type F2 = {a: string};
type F = F1 & F2;

expectTypeOf<IsWritableKeyOf<F, 'a'>>().toBe<true>();

// Class instance
class G {
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	readonly x = 1;
	y = '';
}

expectTypeOf<IsWritableKeyOf<G, 'x'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<G, 'y'>>().toBe<true>();

type H = {
	[symbol]: number;
	readonly x: string;
};

expectTypeOf<IsWritableKeyOf<H, typeof symbol>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<H, 'x'>>().toBe<false>();

// Full readonly object
type I = Readonly<{
	a: number;
	b: string;
}>;

expectTypeOf<IsWritableKeyOf<I, 'a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<I, 'b'>>().toBe<false>();

// Object with method
type J = {
	readonly id: string;
	run(): void;
};

expectTypeOf<IsWritableKeyOf<J, 'run'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<J, 'id'>>().toBe<false>();

// Record
type K = Record<'a' | 'b', string>;

expectTypeOf<IsWritableKeyOf<K, 'a'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<K, 'b'>>().toBe<true>();

// Union of keys
expectTypeOf(boolean).toBe<IsWritableKeyOf<A, 'b' | 'c'>>();
expectTypeOf(boolean).toBe<IsWritableKeyOf<A, 'a' | 'b'>>();
// @ts-expect-error
expectTypeOf(boolean).toBe<IsWritableKeyOf<A, 'a' | 'd'>>();
expectTypeOf<IsWritableKeyOf<A, 'a' | 'c'>>().toBe<true>();

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectTypeOf(boolean).toBe<IsWritableKeyOf<A, FullKeyUnion>>();
// @ts-expect-error
expectTypeOf<IsWritableKeyOf<A, 'b' | 'x'>>().toBe<false>(); // 'x' is not in A, so filtered as false

// `never` / `any
type L = {readonly a: string};
expectTypeOf(never).toBe<IsWritableKeyOf<K, any>>();
expectTypeOf(never).toBe<IsWritableKeyOf<any, any>>();
expectTypeOf(never).toBe<IsWritableKeyOf<any, 'a'>>();
expectTypeOf(never).toBe<IsWritableKeyOf<K, never>>();
expectTypeOf(never).toBe<IsWritableKeyOf<any, never>>();
expectTypeOf(never).toBe<IsWritableKeyOf<never, 'a'>>();
