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
expectTypeOf<IsReadonlyKeyOf<C, 'anything'>>().toBe<true>();

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

// `never` / `any`
type L = {readonly a: string};
expectTypeOf<IsReadonlyKeyOf<K, any>>().toBe<boolean>();
expectTypeOf<IsReadonlyKeyOf<any, any>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<any, 'a'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<K, never>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<any, never>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<never, 'a'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<never, any>>().toBe<false>();

// @ts-expect-error An unknown value is not known to be an object.
type UnknownObject = IsReadonlyKeyOf<unknown, never>;

// @ts-expect-error An unknown key is not known to belong to the object.
type UnknownKey = IsReadonlyKeyOf<{value: string}, unknown>;

// Generic code that wraps the result and infers it back still resolves after instantiation, for either input.
type WrappedShape = {a: 1; b?: 2; readonly c: 3};
type WrappedIsReadonlyKeyOfKey<Key extends keyof WrappedShape> = [IsReadonlyKeyOf<WrappedShape, Key>] extends infer Result extends [boolean] ? ([true] extends Result ? 'yes' : 'no') : never;
type WrappedIsReadonlyKeyOfType<Type extends {c: 3}> = [IsReadonlyKeyOf<Type, 'c'>] extends infer Result extends [boolean] ? ([true] extends Result ? 'yes' : 'no') : never;
expectTypeOf<WrappedIsReadonlyKeyOfKey<'c'>>().toBe<'yes'>();
expectTypeOf<WrappedIsReadonlyKeyOfKey<'a'>>().toBe<'no'>();
expectTypeOf<WrappedIsReadonlyKeyOfType<{readonly c: 3}>>().toBe<'yes'>();

// A literal key that an index signature covers has the modifier of the index signature, like a `string` key.
expectTypeOf<IsReadonlyKeyOf<Readonly<Record<string, number>>, 'a'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: string]: number}, 'a'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: string]: number; b: number}, 'a'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: string]: number; b: number}, 'b'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<{[key: string]: number; readonly b: number}, 'a'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<{[key: string]: number}, 'a'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: `data-${string}`]: number}, 'data-a'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: number]: number}, 0>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<readonly string[], 0>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<string[], 0>>().toBe<false>();

// Like in TypeScript, a `string` index signature applies only when no other index signature covers the key, and a declared property applies before any index signature.
expectTypeOf<IsReadonlyKeyOf<{readonly [key: `data-${string}`]: number; [key: string]: number}, 'data-a'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: `data-${string}`]: number; [key: string]: number}, 'other'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<{'0': number; readonly [key: string]: number}, 0>>().toBe<false>();

// A `number` index signature also covers a numeric string key, and a declared key uses its own modifier.
declare const uniqueSymbol: unique symbol;
expectTypeOf<IsReadonlyKeyOf<{readonly [key: number]: number; [key: string]: number}, '0'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: string]: number; [key: number]: number}, '0'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: `data-${string}`]: number; 'data-x': number}, 'data-x'>>().toBe<false>();
expectTypeOf<IsReadonlyKeyOf<{readonly [key: symbol]: number}, typeof uniqueSymbol>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<readonly string[], 'length'>>().toBe<true>();

// Like in TypeScript, a `${number}` index signature covers the string key `'0'`, but not the number key `0`, which takes the `string` index signature.
type NumericTemplateSignature = {readonly [key: `${number}`]: number; [key: string]: number};
expectTypeOf<IsReadonlyKeyOf<NumericTemplateSignature, '0'>>().toBe<true>();
expectTypeOf<IsReadonlyKeyOf<NumericTemplateSignature, 0>>().toBe<false>();
