import {expectTypeOf} from 'nz';
import type {ConditionalKeys} from '../index.d.ts';

type Example = {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
	e: never;
};

declare const exampleConditionalKeys: ConditionalKeys<Example, string>;
expectTypeOf(exampleConditionalKeys).toBe<'a'>();

declare const exampleConditionalKeysWithUndefined: ConditionalKeys<Example, string | undefined>;
expectTypeOf(exampleConditionalKeysWithUndefined).toBe<'a' | 'c'>();

declare const exampleConditionalKeysTargetingNever: ConditionalKeys<Example, never>;
expectTypeOf(exampleConditionalKeysTargetingNever).toBe<'e'>();

// Readonly modifiers
expectTypeOf<ConditionalKeys<{readonly a: string; readonly b: number; c: Uppercase<string>}, string>>().toBe<'a' | 'c'>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b: number}, string>>().toBe<never>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b?: number}, string | undefined>>().toBe<'a'>();

// Optional modifiers
expectTypeOf<ConditionalKeys<{a?: string; b: string}, string>>().toBe<'b'>();
expectTypeOf<ConditionalKeys<{a?: string; b?: string}, string>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a?: string; b: string}, undefined>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a?: string; b: string}, string | undefined>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b: string}, string | undefined>>().toBe<'a' | 'b'>();

// Union in property values
expectTypeOf<ConditionalKeys<{a: boolean | number}, boolean>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: boolean | number; b: boolean; c: number}, boolean | number>>().toBe<'a' | 'b' | 'c'>();
expectTypeOf<ConditionalKeys<{a?: boolean | number; readonly b: boolean | number}, boolean | number>>().toBe<'b'>();
expectTypeOf<ConditionalKeys<{a?: boolean | number; readonly b?: boolean; c: bigint | number}, boolean | number | undefined>>().toBe<'a' | 'b'>();

// `never` as condition
expectTypeOf<ConditionalKeys<{a: string; b: number}, never>>().toBe<never>();
expectTypeOf<ConditionalKeys<{readonly a?: string; readonly b?: number}, never>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: never; b: never}, never>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{a: never; b: never}, any>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{a?: never; b?: never}, never>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a?: never; b?: never}, undefined>>().toBe<'a' | 'b'>();

// Unions
expectTypeOf<ConditionalKeys<{a: string} | {b: number}, string | number>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {b: number}, string>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {b: number}, number>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {a: number}, number>>().toBe<never>();
expectTypeOf<ConditionalKeys<{a: string} | {a: number}, string | number>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{a: string; b: bigint} | {a: number; b: string; c: boolean}, string | number | bigint>>().toBe<'a' | 'b'>();
expectTypeOf<ConditionalKeys<{a: string} | {a: Lowercase<string>; b: Uppercase<string>}, string>>().toBe<'a'>();
expectTypeOf<ConditionalKeys<{length: number} | [number], number>>().toBe<never>();

// `any`/`unknown` as condition
expectTypeOf<ConditionalKeys<{a?: string; b: string | number; readonly c: boolean; readonly d?: bigint; e: never}, any>>().toBe<'a' | 'b' | 'c' | 'd' | 'e'>();
expectTypeOf<ConditionalKeys<{a?: string; b: string | number; readonly c: boolean; readonly d?: bigint; e: never}, unknown>>().toBe<'a' | 'b' | 'c' | 'd' | 'e'>();

// Index signatures
expectTypeOf<ConditionalKeys<{[x: string]: boolean}, boolean>>().toBe<string | number>();
expectTypeOf<ConditionalKeys<{[x: string]: string; a: string}, string>>().toBe<string | number>();
expectTypeOf<ConditionalKeys<{[x: Uppercase<string>]: string; a: string}, string>>().toBe<Uppercase<string> | 'a'>();
expectTypeOf<ConditionalKeys<{[x: Uppercase<string>]: string; [x: number]: number; a: number}, number>>().toBe<number | 'a'>();

// Arrays and tuples
expectTypeOf<ConditionalKeys<[string, number, string], string>>().toBe<'0' | '2'>();
expectTypeOf<ConditionalKeys<[string, string, string | number], string>>().toBe<'0' | '1'>();
expectTypeOf<ConditionalKeys<[string, number, string], any>>().toBe<'0' | '1' | '2'>();
expectTypeOf<ConditionalKeys<[string, string?, string?], string>>().toBe<'0'>();
expectTypeOf<ConditionalKeys<[string, string?, string?], string | undefined>>().toBe<'0' | '1' | '2'>();
expectTypeOf<ConditionalKeys<[string, number, ...boolean[]], boolean>>().toBe<never>();
expectTypeOf<ConditionalKeys<[string, number?, ...boolean[]], string | number | boolean>>().toBe<'0'>();
expectTypeOf<ConditionalKeys<[string?, number?, ...boolean[]], number | undefined>>().toBe<'1'>();
expectTypeOf<ConditionalKeys<[string, number, ...boolean[]], string | number | boolean>>().toBe<'0' | '1' | number>();
expectTypeOf<ConditionalKeys<[bigint, ...number[], bigint], bigint>>().toBe<'0'>();
expectTypeOf<ConditionalKeys<[...boolean[], string, string], string>>().toBe<never>();
expectTypeOf<ConditionalKeys<[...string[], string, string], string>>().toBe<number>();
expectTypeOf<ConditionalKeys<string[], string>>().toBe<number>();
expectTypeOf<ConditionalKeys<string[], number>>().toBe<never>();

// Primitives
expectTypeOf<ConditionalKeys<string, number>>().toBe<'length'>();
expectTypeOf<ConditionalKeys<number, () => number>>().toBe<'valueOf'>();

// Boundary cases
expectTypeOf<ConditionalKeys<{}, boolean>>().toBe<never>();
expectTypeOf<ConditionalKeys<any, boolean>>().toBe<PropertyKey>();
expectTypeOf<ConditionalKeys<never, boolean>>().toBe<never>();
