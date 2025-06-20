import {expectType} from 'tsd';
import type {KeyAsString} from '../source/key-as-string.d.ts';

declare const foo: KeyAsString<{
	1: number;
	stringKey: string;
}>;

expectType<'1' | 'stringKey'>(foo);

declare const sym: unique symbol;
expectType<'1' | 'foo'>({} as KeyAsString<{[sym]: unknown; 1: number; foo: string}>); // Ignores symbol keys

// Index signatures
expectType<string>({} as KeyAsString<{[x: string]: unknown}>);
expectType<`${number}`>({} as KeyAsString<{[x: number]: unknown}>);
expectType<`foo${string}` | `${number}`>({} as KeyAsString<{[x: `foo${string}`]: unknown; [y: number]: unknown}>);
expectType<string>({} as KeyAsString<{[x: string]: unknown; [y: symbol]: unknown}>);
expectType<never>({} as KeyAsString<{[x: symbol]: unknown}>);

// Unions
expectType<'1'>({} as KeyAsString<{1: number; foo: string} | {1: number; bar: string}>); // Only grabs the common keys, just like `keyof`.
expectType<never>({} as KeyAsString<{foo: string} | {bar: string}>);

// Boundary cases
expectType<string>({} as KeyAsString<any>);
expectType<string>({} as KeyAsString<never>);
