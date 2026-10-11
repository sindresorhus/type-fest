import {expectTypeOf} from 'nz';
import type {IsOptionalKeyOf} from '../source/is-optional-key-of.d.ts';

declare const never: never;
declare const boolean: boolean;
declare const symbol: unique symbol;

// Base object
type A = {
	a: string;
	b?: number;
	c: boolean;
};

expectTypeOf<IsOptionalKeyOf<A, 'a'>>().toBe<false>();
expectTypeOf<IsOptionalKeyOf<A, 'b'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<A, 'c'>>().toBe<false>();

// @ts-expect-error `d` is not in `keyof T`
expectTypeOf<IsOptionalKeyOf<A, 'd'>>().toBe<false>();

// Index signature with optional keys
type B = {
	[k: string]: string;
};

expectTypeOf<IsOptionalKeyOf<B, string>>().toBe<false>();
expectTypeOf<IsOptionalKeyOf<B, 'anything'>>().toBe<true>();

// Optional + readonly
type C = {
	readonly a?: number;
	b: string;
};

expectTypeOf<IsOptionalKeyOf<C, 'a'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<C, 'b'>>().toBe<false>();

// Required + readonly
type D = {
	readonly x: boolean;
	y?: string;
};

expectTypeOf<IsOptionalKeyOf<D, 'x'>>().toBe<false>();
expectTypeOf<IsOptionalKeyOf<D, 'y'>>().toBe<true>();

// Union
type E1 = {a?: number};
type E2 = {a: number};
type E = E1 | E2;

expectTypeOf(boolean).toBe<IsOptionalKeyOf<E, 'a'>>();

// Intersection
type F1 = {a?: number};
type F2 = {a: number};
type F = F1 & F2;

expectTypeOf<IsOptionalKeyOf<F, 'a'>>().toBe<false>();

// Class
class G {
	x?: string;
	y = 5;
}

expectTypeOf<IsOptionalKeyOf<G, 'x'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<G, 'y'>>().toBe<false>();

type H = {
	[symbol]?: number;
	a: string;
};

expectTypeOf<IsOptionalKeyOf<H, typeof symbol>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<H, 'a'>>().toBe<false>();

// Method and optional prop
type I = {
	name: string;
	run?(): void;
};

expectTypeOf<IsOptionalKeyOf<I, 'run'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<I, 'name'>>().toBe<false>();

// Fully optional object
type J = Partial<{
	a: number;
	b: string;
}>;

expectTypeOf<IsOptionalKeyOf<J, 'a'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<J, 'b'>>().toBe<true>();

// Non-optional but union with undefined
type L = {
	a: string | undefined;
	b?: number;
};

expectTypeOf<IsOptionalKeyOf<L, 'a'>>().toBe<false>();
expectTypeOf<IsOptionalKeyOf<L, 'b'>>().toBe<true>();

// Union of keys
expectTypeOf(boolean).toBe<IsOptionalKeyOf<A, 'b' | 'c'>>();
expectTypeOf(boolean).toBe<IsOptionalKeyOf<A, 'a' | 'b'>>();
// @ts-expect-error
expectTypeOf<IsOptionalKeyOf<A, 'a' | 'd'>>().toBe<false>();
expectTypeOf<IsOptionalKeyOf<A, 'a' | 'c'>>().toBe<false>();

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectTypeOf(boolean).toBe<IsOptionalKeyOf<A, FullKeyUnion>>();
// @ts-expect-error
expectTypeOf(boolean).toBe<IsOptionalKeyOf<A, 'b' | 'x'>>(); // 'x' is not in A, so filtered as false

// `never` / `any
type K = {a?: string};
expectTypeOf(never).toBe<IsOptionalKeyOf<K, any>>();
expectTypeOf(never).toBe<IsOptionalKeyOf<any, any>>();
expectTypeOf(never).toBe<IsOptionalKeyOf<any, 'a'>>();
expectTypeOf(never).toBe<IsOptionalKeyOf<K, never>>();
expectTypeOf(never).toBe<IsOptionalKeyOf<any, never>>();
expectTypeOf(never).toBe<IsOptionalKeyOf<never, 'a'>>();

// Only the built-in `Record` type disagrees, because TypeScript compares it with the `Record` in the check by its type arguments instead of by its properties. It is not caused by `keyof`, which is the same for `Record<string, T>` and `{[Key in string]: T}`. See the note in the docs.
type CustomRecord<Key extends PropertyKey, Value> = {[RecordKey in Key]: Value};
expectTypeOf<IsOptionalKeyOf<{[key: string]: number}, 'a'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<{[Key in string]: number}, 'a'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<CustomRecord<string, number>, 'a'>>().toBe<true>();
expectTypeOf<IsOptionalKeyOf<Record<string, number>, 'a'>>().toBe<false>();
expectTypeOf<IsOptionalKeyOf<{[key: string]: number}, string>>().toBe<false>();
expectTypeOf<IsOptionalKeyOf<Record<string, number>, string>>().toBe<false>();

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it. The answer is `boolean`, because the member that has the key decides it and the one that does not contributes `false`.
declare const keyOfOneMember: IsOptionalKeyOf<{a?: 1} | {b: 2}, 'a'>;
expectTypeOf(keyOfOneMember).toBe<boolean>();
