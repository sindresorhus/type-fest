import {expectTypeOf} from 'nz';
import type {IsRequiredKeyOf} from '../source/is-required-key-of.d.ts';

declare const never: never;
declare const boolean: boolean;
declare const symbol: unique symbol;

// Base object
type A = {
	a: string;
	b?: number;
	c: boolean;
};

expectTypeOf<IsRequiredKeyOf<A, 'a'>>().toBe<true>();
expectTypeOf<IsRequiredKeyOf<A, 'b'>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<A, 'c'>>().toBe<true>();

// @ts-expect-error `d` is not in `keyof T`
expectTypeOf<IsRequiredKeyOf<A, 'd'>>().toBe<false>();

// Index signature with required keys
type B = {
	[k: string]: string;
};

expectTypeOf<IsRequiredKeyOf<B, string>>().toBe<true>();
expectTypeOf<IsRequiredKeyOf<B, 'anything'>>().toBe<false>();

// Required and readonly combo
type C = {
	readonly a?: number;
	b: string;
};

expectTypeOf<IsRequiredKeyOf<C, 'a'>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<C, 'b'>>().toBe<true>();

// Required + readonly
type D = {
	readonly x: boolean;
	y?: string;
};

expectTypeOf<IsRequiredKeyOf<D, 'x'>>().toBe<true>();
expectTypeOf<IsRequiredKeyOf<D, 'y'>>().toBe<false>();

// Union
type E1 = {a?: number};
type E2 = {a: number};
type E = E1 | E2;

expectTypeOf(boolean).toBe<IsRequiredKeyOf<E, 'a'>>();

// Intersection
type F1 = {a?: number};
type F2 = {a: number};
type F = F1 & F2;

expectTypeOf<IsRequiredKeyOf<F, 'a'>>().toBe<true>();

// Class
class G {
	x?: string;
	y = 5;
}

expectTypeOf<IsRequiredKeyOf<G, 'x'>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<G, 'y'>>().toBe<true>();

type H = {
	[symbol]?: number;
	a: string;
};

expectTypeOf<IsRequiredKeyOf<H, typeof symbol>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<H, 'a'>>().toBe<true>();

// Method and required prop
type I = {
	name: string;
	run?(): void;
};

expectTypeOf<IsRequiredKeyOf<I, 'run'>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<I, 'name'>>().toBe<true>();

// Fully required object
type J = Partial<{
	a: number;
	b: string;
}>;

expectTypeOf<IsRequiredKeyOf<J, 'a'>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<J, 'b'>>().toBe<false>();

// Non-required but union with undefined
type L = {
	a: string | undefined;
	b?: number;
};

expectTypeOf<IsRequiredKeyOf<L, 'a'>>().toBe<true>();
expectTypeOf<IsRequiredKeyOf<L, 'b'>>().toBe<false>();

// Union of keys
expectTypeOf(boolean).toBe<IsRequiredKeyOf<A, 'b' | 'c'>>();
expectTypeOf<IsRequiredKeyOf<A, 'a' | 'c'>>().toBe<true>();
// @ts-expect-error
expectTypeOf(boolean).toBe<IsRequiredKeyOf<A, 'a' | 'd'>>();
expectTypeOf<IsRequiredKeyOf<A, 'a' | 'c'>>().toBe<true>();

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectTypeOf(boolean).toBe<IsRequiredKeyOf<A, FullKeyUnion>>();
// @ts-expect-error
expectTypeOf(boolean).toBe<IsRequiredKeyOf<A, 'a' | 'x'>>(); // 'x' is not in A, so filtered as false

// `never` / `any
type K = {a: string};
expectTypeOf(never).toBe<IsRequiredKeyOf<K, any>>();
expectTypeOf(never).toBe<IsRequiredKeyOf<any, any>>();
expectTypeOf(never).toBe<IsRequiredKeyOf<any, 'a'>>();
expectTypeOf(never).toBe<IsRequiredKeyOf<K, never>>();
expectTypeOf(never).toBe<IsRequiredKeyOf<any, never>>();
expectTypeOf(never).toBe<IsRequiredKeyOf<never, 'a'>>();

// The mirror of the `IsOptionalKeyOf` index-signature discrepancy: only the built-in `Record` type reports a literal key as required. See the note in that type's docs.
expectTypeOf<IsRequiredKeyOf<{[key: string]: number}, 'a'>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<{[Key in string]: number}, 'a'>>().toBe<false>();
expectTypeOf<IsRequiredKeyOf<Record<string, number>, 'a'>>().toBe<true>();

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it. The answer is `boolean`, because the member that has the key decides it and the one that does not contributes `false`.
declare const keyOfOneMember: IsRequiredKeyOf<{a: 1} | {b: 2}, 'a'>;
expectTypeOf(keyOfOneMember).toBe<boolean>();
