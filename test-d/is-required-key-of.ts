import {expectType} from 'tsd';
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

expectType<IsRequiredKeyOf<A, 'a'>>(true);
expectType<IsRequiredKeyOf<A, 'b'>>(false);
expectType<IsRequiredKeyOf<A, 'c'>>(true);

// @ts-expect-error `d` is not in `keyof T`
expectType<IsRequiredKeyOf<A, 'd'>>(false);

// Index signature with required keys
type B = {
	[k: string]: string;
};

expectType<IsRequiredKeyOf<B, string>>(true);
expectType<IsRequiredKeyOf<B, 'anything'>>(false);

// Required and readonly combo
type C = {
	readonly a?: number;
	b: string;
};

expectType<IsRequiredKeyOf<C, 'a'>>(false);
expectType<IsRequiredKeyOf<C, 'b'>>(true);

// Required + readonly
type D = {
	readonly x: boolean;
	y?: string;
};

expectType<IsRequiredKeyOf<D, 'x'>>(true);
expectType<IsRequiredKeyOf<D, 'y'>>(false);

// Union
type E1 = {a?: number};
type E2 = {a: number};
type E = E1 | E2;

expectType<IsRequiredKeyOf<E, 'a'>>(boolean);

// Intersection
type F1 = {a?: number};
type F2 = {a: number};
type F = F1 & F2;

expectType<IsRequiredKeyOf<F, 'a'>>(true);

// Class
class G {
	x?: string;
	y = 5;
}

expectType<IsRequiredKeyOf<G, 'x'>>(false);
expectType<IsRequiredKeyOf<G, 'y'>>(true);

type H = {
	[symbol]?: number;
	a: string;
};

expectType<IsRequiredKeyOf<H, typeof symbol>>(false);
expectType<IsRequiredKeyOf<H, 'a'>>(true);

// Method and required prop
type I = {
	name: string;
	run?(): void;
};

expectType<IsRequiredKeyOf<I, 'run'>>(false);
expectType<IsRequiredKeyOf<I, 'name'>>(true);

// Fully required object
type J = Partial<{
	a: number;
	b: string;
}>;

expectType<IsRequiredKeyOf<J, 'a'>>(false);
expectType<IsRequiredKeyOf<J, 'b'>>(false);

// Non-required but union with undefined
type L = {
	a: string | undefined;
	b?: number;
};

expectType<IsRequiredKeyOf<L, 'a'>>(true);
expectType<IsRequiredKeyOf<L, 'b'>>(false);

// Union of keys
expectType<IsRequiredKeyOf<A, 'b' | 'c'>>(boolean);
expectType<IsRequiredKeyOf<A, 'a' | 'c'>>(true);
// @ts-expect-error
expectType<IsRequiredKeyOf<A, 'a' | 'd'>>(boolean);
expectType<IsRequiredKeyOf<A, 'a' | 'c'>>(true);

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectType<IsRequiredKeyOf<A, FullKeyUnion>>(boolean);
// @ts-expect-error
expectType<IsRequiredKeyOf<A, 'a' | 'x'>>(boolean); // 'x' is not in A, so filtered as false

// `never` / `any
type K = {a: string};
expectType<IsRequiredKeyOf<K, any>>(never);
expectType<IsRequiredKeyOf<any, any>>(never);
expectType<IsRequiredKeyOf<any, 'a'>>(never);
expectType<IsRequiredKeyOf<K, never>>(never);
expectType<IsRequiredKeyOf<any, never>>(never);
expectType<IsRequiredKeyOf<never, 'a'>>(never);

// The mirror of the `IsOptionalKeyOf` index-signature discrepancy: only the built-in `Record` type reports a literal key as required. See the note in that type's docs.
expectType<false>({} as IsRequiredKeyOf<{[key: string]: number}, 'a'>);
expectType<false>({} as IsRequiredKeyOf<{[Key in string]: number}, 'a'>);
expectType<true>({} as IsRequiredKeyOf<Record<string, number>, 'a'>);

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it. The answer is `boolean`, because the member that has the key decides it and the one that does not contributes `false`.
declare const keyOfOneMember: IsRequiredKeyOf<{a: 1} | {b: 2}, 'a'>;
expectType<boolean>(keyOfOneMember);
