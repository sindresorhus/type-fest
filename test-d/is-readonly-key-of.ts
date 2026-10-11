import {expectTypeOf} from 'nz';
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

expectTypeOf<IsReadonlyKeyOf<A, 'a'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<A, 'b'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<A, 'c'>>().toBe<false>();

// @ts-expect-error `d` is not in `keyof T`
expectTypeOf<IsReadonlyKeyOf<A, 'd'>>().toBe<false>();

// Index signature
type B = {
	[k: string]: number;
};

expectTypeOf<IsReadonlyKeyOf<B, 'anything'>>().toBe<false>();

// Fully readonly index
type C = {
	readonly [k: string]: number;
};

expectTypeOf<IsReadonlyKeyOf<C, string>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<C, 'anything'>>().toBe<false>();

// Optional + readonly
type D = {
	readonly a?: string;
	b: number;
};

expectTypeOf<IsReadonlyKeyOf<D, 'a'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<D, 'b'>>().toBe<false>();

// Union
type E1 = {a: number};
type E2 = {readonly a: number};
type E = E1 | E2;

expectTypeOf(boolean).toBe<IsReadonlyKeyOf<E, 'a'>>();

// Intersection
type F1 = {readonly a: string};
type F2 = {a: string};
type F = F1 & F2;

expectTypeOf<IsReadonlyKeyOf<F, 'a'>>().toBe<false>();

// Class instance
class G {
	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	readonly x = 1;
	y = '';
}

expectTypeOf<IsReadonlyKeyOf<G, 'x'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<G, 'y'>>().toBe<false>();

type H = {
	[symbol]: number;
	readonly x: string;
};

expectTypeOf<IsReadonlyKeyOf<H, typeof symbol>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<H, 'x'>>().toBe<true>();

// Full readonly object
type I = Readonly<{
	a: number;
	b: string;
}>;

expectTypeOf<IsReadonlyKeyOf<I, 'a'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<I, 'b'>>().toBe<true>();

// Object with method
type J = {
	readonly id: string;
	run(): void;
};

expectTypeOf<IsReadonlyKeyOf<J, 'run'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<J, 'id'>>().toBe<true>();

// Record
type K = Record<'a' | 'b', string>;

expectTypeOf<IsReadonlyKeyOf<K, 'a'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<K, 'b'>>().toBe<false>();

// Union of keys
expectTypeOf(boolean).toBe<IsReadonlyKeyOf<A, 'b' | 'c'>>();
expectTypeOf(boolean).toBe<IsReadonlyKeyOf<A, 'a' | 'b'>>();
// @ts-expect-error
expectTypeOf<IsReadonlyKeyOf<A, 'a' | 'd'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<A, 'a' | 'c'>>().toBe<false>();

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectTypeOf(boolean).toBe<IsReadonlyKeyOf<A, FullKeyUnion>>();
// @ts-expect-error
expectTypeOf(boolean).toBe<IsReadonlyKeyOf<A, 'b' | 'x'>>(); // 'x' is not in A, so filtered as false

// `never` / `any
type L = {readonly a: string};
expectTypeOf(never).toBe<IsReadonlyKeyOf<K, any>>();
expectTypeOf(never).toBe<IsReadonlyKeyOf<any, any>>();
expectTypeOf(never).toBe<IsReadonlyKeyOf<any, 'a'>>();
expectTypeOf(never).toBe<IsReadonlyKeyOf<K, never>>();
expectTypeOf(never).toBe<IsReadonlyKeyOf<any, never>>();
expectTypeOf(never).toBe<IsReadonlyKeyOf<never, 'a'>>();
