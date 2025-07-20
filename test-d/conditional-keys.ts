import {expectType} from 'tsd';
import type {ConditionalKeys} from '../index.d.ts';

type Example = {
	a: string;
	b?: string | number;
	c?: string;
	d: Record<string, unknown>;
	e: never;
};

declare const exampleConditionalKeys: ConditionalKeys<Example, string>;
expectType<'a'>(exampleConditionalKeys);

declare const exampleConditionalKeysWithUndefined: ConditionalKeys<Example, string | undefined>;
expectType<'a' | 'c'>(exampleConditionalKeysWithUndefined);

declare const exampleConditionalKeysTargetingNever: ConditionalKeys<Example, never>;
expectType<'e'>(exampleConditionalKeysTargetingNever);

// Readonly modifiers
expectType<'a' | 'c'>({} as ConditionalKeys<{readonly a: string; readonly b: number; c: Uppercase<string>}, string>);
expectType<never>({} as ConditionalKeys<{readonly a?: string; readonly b: number}, string>);
expectType<'a'>({} as ConditionalKeys<{readonly a?: string; readonly b?: number}, string | undefined>);

// Optional modifiers
expectType<'b'>({} as ConditionalKeys<{a?: string; b: string}, string>);
expectType<never>({} as ConditionalKeys<{a?: string; b?: string}, string>);
expectType<never>({} as ConditionalKeys<{a?: string; b: string}, undefined>);
expectType<'a' | 'b'>({} as ConditionalKeys<{a?: string; b: string}, string | undefined>);
expectType<'a' | 'b'>({} as ConditionalKeys<{readonly a?: string; readonly b: string}, string | undefined>);

// Union in property values
expectType<never>({} as ConditionalKeys<{a: boolean | number}, boolean>);
expectType<'a' | 'b' | 'c'>({} as ConditionalKeys<{a: boolean | number; b: boolean; c: number}, boolean | number>);
expectType<'b'>({} as ConditionalKeys<{a?: boolean | number; readonly b: boolean | number}, boolean | number>);
expectType<'a' | 'b'>(
	{} as ConditionalKeys<{a?: boolean | number; readonly b?: boolean; c: bigint | number}, boolean | number | undefined>,
);

// `never` as condition
expectType<never>({} as ConditionalKeys<{a: string; b: number}, never>);
expectType<never>({} as ConditionalKeys<{readonly a?: string; readonly b?: number}, never>);
expectType<'a' | 'b'>({} as ConditionalKeys<{a: never; b: never}, never>);
expectType<'a' | 'b'>({} as ConditionalKeys<{a: never; b: never}, any>);
expectType<never>({} as ConditionalKeys<{a?: never; b?: never}, never>);
expectType<'a' | 'b'>({} as ConditionalKeys<{a?: never; b?: never}, undefined>);

// Unions
expectType<never>({} as ConditionalKeys<{a: string} | {b: number}, string | number>);
expectType<never>({} as ConditionalKeys<{a: string} | {b: number}, string>);
expectType<never>({} as ConditionalKeys<{a: string} | {b: number}, number>);
expectType<never>({} as ConditionalKeys<{a: string} | {a: number}, number>);
expectType<'a'>({} as ConditionalKeys<{a: string} | {a: number}, string | number>);
expectType<'a' | 'b'>(
	{} as ConditionalKeys<{a: string; b: bigint} | {a: number; b: string; c: boolean}, string | number | bigint>,
);
expectType<'a'>({} as ConditionalKeys<{a: string} | {a: Lowercase<string>; b: Uppercase<string>}, string>);
expectType<never>({} as ConditionalKeys<{length: number} | [number], number>);

// `any`/`unknown` as condition
expectType<'a' | 'b' | 'c' | 'd' | 'e'>(
	{} as ConditionalKeys<{a?: string; b: string | number; readonly c: boolean; readonly d?: bigint; e: never}, any>,
);
expectType<'a' | 'b' | 'c' | 'd'>(
	{} as ConditionalKeys<{a?: string; b: string | number; readonly c: boolean; readonly d?: bigint; e: never}, unknown>,
);

// Index signatures
expectType<string | number>({} as ConditionalKeys<{[x: string]: boolean}, boolean>);
expectType<string | number>({} as ConditionalKeys<{[x: string]: string; a: string}, string>);
expectType<Uppercase<string> | 'a'>({} as ConditionalKeys<{[x: Uppercase<string>]: string; a: string}, string>);
expectType<number | 'a'>({} as ConditionalKeys<{[x: Uppercase<string>]: string; [x: number]: number; a: number}, number>);

// Arrays and tuples
expectType<'0' | '2'>({} as ConditionalKeys<[string, number, string], string>);
expectType<'0' | '1'>({} as ConditionalKeys<[string, string, string | number], string>);
expectType<'0' | '1' | '2'>({} as ConditionalKeys<[string, number, string], any>);
expectType<'0'>({} as ConditionalKeys<[string, string?, string?], string>);
expectType<'0' | '1' | '2'>({} as ConditionalKeys<[string, string?, string?], string | undefined>);
expectType<never>({} as ConditionalKeys<[string, number, ...boolean[]], boolean>);
expectType<'0'>({} as ConditionalKeys<[string, number?, ...boolean[]], string | number | boolean>);
expectType<'1'>({} as ConditionalKeys<[string?, number?, ...boolean[]], number | undefined>);
expectType<'0' | '1' | number>({} as ConditionalKeys<[string, number, ...boolean[]], string | number | boolean>);
expectType<'0'>({} as ConditionalKeys<[bigint, ...number[], bigint], bigint>);
expectType<never>({} as ConditionalKeys<[...boolean[], string, string], string>);
expectType<number>({} as ConditionalKeys<[...string[], string, string], string>);
expectType<number>({} as ConditionalKeys<string[], string>);
expectType<never>({} as ConditionalKeys<string[], number>);

// Primitives
expectType<'length'>({} as ConditionalKeys<string, number>);
expectType<'valueOf'>({} as ConditionalKeys<number, () => number>);

// Boundary cases
expectType<never>({} as ConditionalKeys<{}, boolean>);
expectType<PropertyKey>({} as ConditionalKeys<any, boolean>);
expectType<never>({} as ConditionalKeys<never, boolean>);
