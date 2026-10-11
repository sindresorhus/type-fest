import {expectTypeOf} from 'nz';
import type {KeyAsString} from '../source/key-as-string.d.ts';

declare const foo: KeyAsString<{
	1: number;
	stringKey: string;
}>;

expectTypeOf(foo).toBe<'1' | 'stringKey'>();

declare const sym: unique symbol;
expectTypeOf<KeyAsString<{[sym]: unknown; 1: number; foo: string}>>().toBe<'1' | 'foo'>(); // Ignores symbol keys

// Index signatures
expectTypeOf<KeyAsString<{[x: string]: unknown}>>().toBe<string>();
expectTypeOf<KeyAsString<{[x: number]: unknown}>>().toBe<`${number}`>();
expectTypeOf<KeyAsString<{[x: `foo${string}`]: unknown; [y: number]: unknown}>>().toBe<`foo${string}` | `${number}`>();
expectTypeOf<KeyAsString<{[x: string]: unknown; [y: symbol]: unknown}>>().toBe<string>();
expectTypeOf<KeyAsString<{[x: symbol]: unknown}>>().toBe<never>();

// Unions
expectTypeOf<KeyAsString<{1: number; foo: string} | {1: number; bar: string}>>().toBe<'1'>(); // Only grabs the common keys, just like `keyof`.
expectTypeOf<KeyAsString<{foo: string} | {bar: string}>>().toBe<never>();

// Boundary cases
expectTypeOf<KeyAsString<any>>().toBe<string>();
expectTypeOf<KeyAsString<never>>().toBe<string>();
