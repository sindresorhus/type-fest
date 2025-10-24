import {expectType} from 'tsd';
import type {ExclusifyUnion} from '../source/exclusify-union.d.ts';
import type {NonRecursiveType} from '../source/internal/type.d.ts';

expectType<{a: string; b?: never} | {a?: never; b: number}>({} as ExclusifyUnion<{a: string} | {b: number}>);
expectType<{a: string; b?: never; c?: never} | {a?: never; b: number; c?: never} | {a?: never; b?: never; c: boolean}>(
	{} as ExclusifyUnion<{a: string} | {b: number} | {c: boolean}>,
);
expectType<{a: string; b: number; c?: never; d?: never} | {a?: never; b?: never; c: string; d: number}>(
	{} as ExclusifyUnion<{a: string; b: number} | {c: string; d: number}>,
);
expectType<
	| {a: string; b?: never; c?: never; d?: never; e?: never; f?: never}
	| {a?: never; b: string; c: number; d?: never; e?: never; f?: never}
	| {a?: never; b?: never; c?: never; d: 1; e: 2; f: 3}
>(
	{} as ExclusifyUnion<{a: string} | {b: string; c: number} | {d: 1; e: 2; f: 3}>,
);

// Single member union
expectType<{a: string}>({} as ExclusifyUnion<{a: string}>);
expectType<{a?: string; readonly b?: number}>({} as ExclusifyUnion<{a?: string; readonly b?: number}>);

// Shared keys
expectType<{a: string; b?: never} | {a: string; b: number}>({} as ExclusifyUnion<{a: string} | {a: string; b: number}>);
expectType<{a: string; b?: never; c?: never} | {a: string; b: number; c?: never} | {a?: never; b: string; c: boolean}>(
	{} as ExclusifyUnion<{a: string} | {a: string; b: number} | {b: string; c: boolean}>,
);

// Already exclusive unions
expectType<{a: string; b?: never} | {a?: never; b: number}>({} as ExclusifyUnion<{a: string; b?: never} | {a?: never; b: number}>);
expectType<{a: string} | {a: number}>({} as ExclusifyUnion<{a: string} | {a: number}>);

// Preserves property modifiers
expectType<{a?: 1; readonly b: 2; readonly c?: 3; d?: never; e?: never} | {a?: never; b?: never; c?: never; d: 4; readonly e?: 5}>(
	{} as ExclusifyUnion<{a?: 1; readonly b: 2; readonly c?: 3} | {d: 4; readonly e?: 5}>,
);
expectType<{a?: string; readonly b: number} | {readonly a: string; b?: number}>(
	{} as ExclusifyUnion<{a?: string; readonly b: number} | {readonly a: string; b?: number}>,
);

// Non-recursive types
expectType<Set<string> | Map<string, string>>({} as ExclusifyUnion<Set<string> | Map<string, string>>);
expectType<string[] | Set<string>>({} as ExclusifyUnion<string[] | Set<string>>);
expectType<NonRecursiveType>({} as ExclusifyUnion<NonRecursiveType>);

// Mix of non-recursive and recursive types
expectType<{a: string; b?: never} | {a: number; b: true} | undefined>({} as ExclusifyUnion<{a: string} | {a: number; b: true} | undefined>);
expectType<Date | {DDMMYYYY: string; MMDDYYYY?: never} | {DDMMYYYY?: never; MMDDYYYY: string}>(
	{} as ExclusifyUnion<Date | {DDMMYYYY: string} | {MMDDYYYY: string}>,
);
expectType<RegExp | null | {foo: string; bar?: never; baz?: never} | {foo?: never; bar: number; baz: {qux: string}}>(
	{} as ExclusifyUnion<RegExp | null | {foo: string} | {bar: number; baz: {qux: string}}>,
);

// Boundary types
expectType<unknown>({} as ExclusifyUnion<unknown>);
expectType<any>({} as ExclusifyUnion<any>);
expectType<never>({} as ExclusifyUnion<never>);
