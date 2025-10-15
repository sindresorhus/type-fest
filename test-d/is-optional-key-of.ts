import {expectType} from 'tsd';
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

expectType<IsOptionalKeyOf<A, 'a'>>(false);
expectType<IsOptionalKeyOf<A, 'b'>>(true);
expectType<IsOptionalKeyOf<A, 'c'>>(false);

// @ts-expect-error `d` is not in `keyof T`
expectType<IsOptionalKeyOf<A, 'd'>>(false);

// Index signature with optional keys
type B = {
	[k: string]: string;
};

expectType<IsOptionalKeyOf<B, string>>(false);
expectType<IsOptionalKeyOf<B, 'anything'>>(true);

// Optional + readonly
type C = {
	readonly a?: number;
	b: string;
};

expectType<IsOptionalKeyOf<C, 'a'>>(true);
expectType<IsOptionalKeyOf<C, 'b'>>(false);

// Required + readonly
type D = {
	readonly x: boolean;
	y?: string;
};

expectType<IsOptionalKeyOf<D, 'x'>>(false);
expectType<IsOptionalKeyOf<D, 'y'>>(true);

// Union
type E1 = {a?: number};
type E2 = {a: number};
type E = E1 | E2;

expectType<IsOptionalKeyOf<E, 'a'>>(boolean);

// Intersection
type F1 = {a?: number};
type F2 = {a: number};
type F = F1 & F2;

expectType<IsOptionalKeyOf<F, 'a'>>(false);

// Class
class G {
	x?: string;
	y = 5;
}

expectType<IsOptionalKeyOf<G, 'x'>>(true);
expectType<IsOptionalKeyOf<G, 'y'>>(false);

type H = {
	[symbol]?: number;
	a: string;
};

expectType<IsOptionalKeyOf<H, typeof symbol>>(true);
expectType<IsOptionalKeyOf<H, 'a'>>(false);

// Method and optional prop
type I = {
	name: string;
	run?(): void;
};

expectType<IsOptionalKeyOf<I, 'run'>>(true);
expectType<IsOptionalKeyOf<I, 'name'>>(false);

// Fully optional object
type J = Partial<{
	a: number;
	b: string;
}>;

expectType<IsOptionalKeyOf<J, 'a'>>(true);
expectType<IsOptionalKeyOf<J, 'b'>>(true);

// Non-optional but union with undefined
type L = {
	a: string | undefined;
	b?: number;
};

expectType<IsOptionalKeyOf<L, 'a'>>(false);
expectType<IsOptionalKeyOf<L, 'b'>>(true);

// Union of keys
expectType<IsOptionalKeyOf<A, 'b' | 'c'>>(boolean);
expectType<IsOptionalKeyOf<A, 'a' | 'b'>>(boolean);
// @ts-expect-error
expectType<IsOptionalKeyOf<A, 'a' | 'd'>>(false);
expectType<IsOptionalKeyOf<A, 'a' | 'c'>>(false);

type FullKeyUnion = keyof A; // 'a' | 'b' | 'c'
expectType<IsOptionalKeyOf<A, FullKeyUnion>>(boolean);
// @ts-expect-error
expectType<IsOptionalKeyOf<A, 'b' | 'x'>>(boolean); // 'x' is not in A, so filtered as false

// `never` / `any
type K = {a?: string};
expectType<IsOptionalKeyOf<K, any>>(never);
expectType<IsOptionalKeyOf<any, any>>(never);
expectType<IsOptionalKeyOf<any, 'a'>>(never);
expectType<IsOptionalKeyOf<K, never>>(never);
expectType<IsOptionalKeyOf<any, never>>(never);
expectType<IsOptionalKeyOf<never, 'a'>>(never);
