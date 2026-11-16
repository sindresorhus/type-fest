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
expectTypeOf<IsWritableKeyOf<C, 'anything'>>().toBe<false>();

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

// `never` / `any`
type L = {readonly a: string};
expectTypeOf<IsWritableKeyOf<K, any>>().toBe<boolean>();
expectTypeOf<IsWritableKeyOf<any, any>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<any, 'a'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<K, never>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<any, never>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<never, 'a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<never, any>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<never, 'a' | 'b'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<never, string>>().toBe<false>();

// An empty key selection is `false` even before its object type is known.
function _readEmptyWritableKeys<Value extends object>(value: IsWritableKeyOf<Value, never>): false {
	return value;
}

// @ts-expect-error An unknown value is not known to be an object.
type UnknownObject = IsWritableKeyOf<unknown, never>;

// @ts-expect-error An unknown key is not known to belong to the object.
type UnknownKey = IsWritableKeyOf<{value: string}, unknown>;

// Generic code that wraps the result and infers it back still resolves after instantiation, for either input.
type WrappedShape = {a: 1; b?: 2; readonly c: 3};
type WrappedIsWritableKeyOfKey<Key extends keyof WrappedShape> = [IsWritableKeyOf<WrappedShape, Key>] extends infer Result extends [boolean] ? ([true] extends Result ? 'yes' : 'no') : never;
type WrappedIsWritableKeyOfType<Type extends {c: 3}> = [IsWritableKeyOf<Type, 'c'>] extends infer Result extends [boolean] ? ([true] extends Result ? 'yes' : 'no') : never;
expectTypeOf<WrappedIsWritableKeyOfKey<'a'>>().toBe<'yes'>();
expectTypeOf<WrappedIsWritableKeyOfKey<'c'>>().toBe<'no'>();
expectTypeOf<WrappedIsWritableKeyOfType<{c: 3}>>().toBe<'yes'>();

// A literal key that an index signature covers has the modifier of the index signature, like a `string` key.
expectTypeOf<IsWritableKeyOf<Readonly<Record<string, number>>, 'a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<{readonly [key: string]: number}, 'a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<{readonly [key: string]: number; b: number}, 'a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<{readonly [key: string]: number; b: number}, 'b'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<{[key: string]: number; readonly b: number}, 'a'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<{[key: string]: number}, 'a'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<{readonly [key: `data-${string}`]: number}, 'data-a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<{readonly [key: number]: number}, 0>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<readonly string[], 0>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<string[], 0>>().toBe<true>();

// Like in TypeScript, a `string` index signature applies only when no other index signature covers the key, and a declared property applies before any index signature.
expectTypeOf<IsWritableKeyOf<{readonly [key: `data-${string}`]: number; [key: string]: number}, 'data-a'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<{readonly [key: `data-${string}`]: number; [key: string]: number}, 'other'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<{'0': number; readonly [key: string]: number}, 0>>().toBe<true>();

// A `number` index signature also covers a numeric string key, and a declared key uses its own modifier.
declare const uniqueSymbol: unique symbol;
expectTypeOf<IsWritableKeyOf<{readonly [key: number]: number; [key: string]: number}, '0'>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<{readonly [key: string]: number; [key: number]: number}, '0'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<{readonly [key: `data-${string}`]: number; 'data-x': number}, 'data-x'>>().toBe<true>();
expectTypeOf<IsWritableKeyOf<{readonly [key: symbol]: number}, typeof uniqueSymbol>>().toBe<false>();
expectTypeOf<IsWritableKeyOf<readonly string[], 'length'>>().toBe<false>();
