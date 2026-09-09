import {expectNotAssignable, expectType} from 'tsd';
import type {SetOptional, Simplify} from '../index.d.ts';

// Update one required and one optional to optional.
declare const variation1: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectType<{a: number; b?: string; c?: boolean}>(variation1);

// Update two required to optional.
declare const variation2: SetOptional<{a: number; b: string; c: boolean}, 'a' | 'b'>;
expectType<{a?: number; b?: string; c: boolean}>(variation2);

// Three optional remain optional.
declare const variation3: SetOptional<{a?: number; b?: string; c?: boolean}, 'a' | 'b' | 'c'>;
expectType<{a?: number; b?: string; c?: boolean}>(variation3);

// Fail if type changes even if optional is right.
declare const variation4: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectNotAssignable<{a: boolean; b?: string; c?: boolean}>(variation4);

// Preserves readonly modifier.
declare const variation5: SetOptional<{readonly a: number; readonly b?: string; c: boolean}, 'b' | 'c'>;
expectType<{readonly a: number; readonly b?: string; c?: boolean}>(variation5);

// Works with unions.
declare const variation6: SetOptional<{readonly a: number; b: number; c: boolean} | {a: string; readonly b: string; d: boolean}, 'a' | 'b'>;
expectType<{readonly a?: number; b?: number; c: boolean} | {a?: string; readonly b?: string; d: boolean}>(variation6);

// Marks all keys as optional, if `Keys` is `any`.
declare const variation7: SetOptional<{readonly a: number; b: string; c: boolean}, any>;
expectType<{readonly a?: number; b?: string; c?: boolean}>(variation7);

// Does nothing, if `Keys` is `never`.
declare const variation8: SetOptional<{a?: number; readonly b?: string; readonly c: boolean}, never>;
expectType<{a?: number; readonly b?: string; readonly c: boolean}>(variation8);

// Works with index signatures
declare const variation9: SetOptional<{[k: string]: unknown; a: number; b?: string}, 'a' | 'b'>;
expectType<{[k: string]: unknown; a?: number; b?: string}>(variation9);

// Works with functions containing properties
declare const variation10: SetOptional<{(a1: string, a2: number): boolean; p1: string; readonly p2?: number}, 'p1'>;
expectType<boolean>(variation10('foo', 1));
expectType<{p1?: string; readonly p2?: number}>({} as Simplify<typeof variation10>); // `Simplify` removes the call signature from `typeof variation10`

declare const variation11: SetOptional<{(a1: boolean, ...a2: string[]): number; p1: string; readonly p2: number; p3: boolean}, 'p1' | 'p2'>;
expectType<number>(variation11(true, 'foo', 'bar', 'baz'));
expectType<{p1?: string; readonly p2?: number; p3: boolean}>({} as Simplify<typeof variation11>);

// Functions without properties are returned as is
declare const variation12: SetOptional<(a: string) => number, never>;
expectType<number>(variation12('foo'));

// =================
// Works with arrays
// =================

// Empty array
expectType<[]>({} as SetOptional<[], never>);
expectType<readonly []>({} as SetOptional<readonly [], never>);

// All required elements
expectType<[string, number?]>({} as SetOptional<[string, number], '1'>);
expectType<[string?, number?, boolean?]>({} as SetOptional<[string, number, boolean], '0' | '1' | '2'>);
expectType<[(string | number)?]>({} as SetOptional<[(string | number)], '0'>);

// Works with number `Keys`, string `Keys`, and union of them.
expectType<[string, number, boolean?]>({} as SetOptional<[string, number, boolean], 2>);
expectType<[string, number?, boolean?, ...number[]]>({} as SetOptional<[string, number, boolean, ...number[]], '1' | '2'>);
expectType<readonly [string?, number?, boolean?]>({} as SetOptional<readonly [string, number, boolean], '0' | 1 | 2>);

// Mix of optional and required elements
expectType<[string, number?, boolean?]>({} as SetOptional<[string, number, boolean?], '1'>);
expectType<readonly [string?, number?, boolean?]>({} as SetOptional<readonly [string, number, boolean?], '0' | '1'>);

// Mix of required and rest elements
expectType<[string, number, boolean?, ...number[]]>({} as SetOptional<[string, number, boolean, ...number[]], '2'>);
expectType<[string, number?, boolean?, ...number[]]>({} as SetOptional<[string, number, boolean, ...number[]], '1' | 2>);

// Mix of optional, required, and rest elements
expectType<readonly [string, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number, boolean?, ...number[]], '1'>);
expectType<[string?, number?, boolean?, ...string[]]>({} as SetOptional<[string, number, boolean?, ...string[]], '0' | 1>);

// Works with readonly arrays
expectType<readonly [(string | number)?]>({} as SetOptional<readonly [(string | number)], '0'>);
expectType<readonly [string, number?, boolean?]>({} as SetOptional<readonly [string, number, boolean?], '1'>);
expectType<readonly [string, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number, boolean, ...number[]], '1' | '2'>);
expectType<readonly [string?, number?, boolean?, ...string[]]>({} as SetOptional<readonly [string, number, boolean?, ...string[]], 0 | '1'>);

// Ignores `Keys` that are already optional
expectType<[string, number, boolean?]>({} as SetOptional<[string, number, boolean?], '2'>);
expectType<readonly [string, number?, boolean?]>({} as SetOptional<readonly [string, number?, boolean?], 1 | 2>);
expectType<readonly [string, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number?, boolean?, ...number[]], 1 | 2>);
expectType<[string, number?, boolean?, ...number[]]>({} as SetOptional<[string, number, boolean?, ...number[]], '1' | '2'>);

// Ignores `Keys` that are out of bounds
expectType<[]>({} as SetOptional<[], 1>);
expectType<[string, number, boolean]>({} as SetOptional<[string, number, boolean], 10>);
expectType<[string?, number?, boolean?]>({} as SetOptional<[string, number, boolean], 0 | 1 | 2 | 3 | 4>);
expectType<readonly [string, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number, boolean?, ...number[]], 10 | 1>);

// Marks all keys as optional, if `Keys` is `any`.
expectType<[string?, number?, boolean?]>({} as SetOptional<[string, number, boolean], any>);
expectType<[string?, number?, boolean?, ...number[]]>({} as SetOptional<[string, number, boolean, ...number[]], any>);
expectType<readonly [string?, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number, boolean, ...number[]], any>);
expectType<readonly [string?, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number, boolean?, ...number[]], any>);

// Marks all keys as optional, if `Keys` is `number`.
expectType<[string?, number?, boolean?]>({} as SetOptional<[string, number, boolean], number>);
expectType<[string?, number?, boolean?, ...number[]]>({} as SetOptional<[string, number, boolean, ...number[]], number>);
expectType<readonly [string?, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number, boolean, ...number[]], number>);
expectType<readonly [string?, number?, boolean?, ...number[]]>({} as SetOptional<readonly [string, number, boolean?, ...number[]], number>);

// Returns the array as-is, if `Keys` is `never`.
expectType<[string, number?]>({} as SetOptional<[string, number?], never>);
expectType<readonly [string, number?, ...number[]]>({} as SetOptional<readonly [string, number?, ...number[]], never>);

// Arrays where non-rest elements appear after the rest element are left unchanged, because they can never have optional elements.
expectType<[...string[], string | undefined, number]>({} as SetOptional<[...string[], string | undefined, number], any>);
expectType<[boolean, ...string[], string, number]>({} as SetOptional<[boolean, ...string[], string, number], any>);

// Preserves `| undefined`, similar to how built-in `Partial` works.
expectType<[string | undefined, (number | undefined)?, boolean?]>({} as SetOptional<[string | undefined, number | undefined, boolean], 1 | 2>);
expectType<readonly [(string | undefined)?, (number | undefined)?, boolean?]>({} as SetOptional<readonly [string | undefined, number | undefined, boolean], 0 | 1 | 2>);

// Optional elements cannot appear before required ones, `Keys` leading to such situations are ignored.
expectType<[string, number, boolean]>({} as SetOptional<[string, number, boolean], 0 | 1>); // `0` and `1` can't be optional when `2` is required
expectType<[string, number, boolean, string, string?]>(
	{} as SetOptional<[string, number, boolean, string, string], 0 | 2 | 4>, // `0` and `2` can't be optional when `3` is required
);
expectType<readonly [string, number, boolean?, ...string[]]>(
	{} as SetOptional<readonly [string, number, boolean, ...string[]], 0 | 2>, // `0` can't be optional when `1` is required
);

// Works with unions of arrays
expectType<readonly [] | []>({} as SetOptional<readonly [] | [], never>);
expectType<[] | readonly [(string | number)?]>({} as SetOptional<[] | readonly [(string | number)], 0>);
expectType<[string?] | [string, number, boolean?, ...number[]] | readonly [string, number]>(
	{} as SetOptional<[string] | [string, number, boolean, ...number[]] | readonly [string, number], 0 | 2>,
);
expectType<readonly [number, string?] | [string, boolean?, ...number[]] | readonly [string, number, boolean, (string | undefined)?]>(
	{} as SetOptional<readonly [number, string] | [string, boolean, ...number[]] | readonly [string, number, boolean, (string | undefined)], 1 | 3>,
);
expectType<readonly [...number[], number] | [string?, boolean?, ...number[]] | readonly [string?, (number | undefined)?, boolean?, string?]>(
	{} as SetOptional<readonly [...number[], number] | [string, boolean, ...number[]] | readonly [string, number | undefined, boolean?, string?], any>,
);
expectType<readonly string[] | [x?: number, y?: number] | [string?, number?, ...string[]]>(
	{} as SetOptional<readonly string[] | [x: number, y: number] | [string, number, ...string[]], number>,
);

// Works with labelled tuples
expectType<[x: string, y?: number]>({} as SetOptional<[x: string, y: number], '1'>);
expectType<readonly [x: number, y?: number, z?: number]>({} as SetOptional<readonly [x: number, y: number, z: number], 1 | 2>);
expectType<readonly [x: number, y?: number, z?: number, ...rest: number[]]>({} as SetOptional<readonly [x: number, y: number, z: number, ...rest: number[]], 1 | 2>);

// Non tuple arrays are left unchanged
expectType<string[]>({} as SetOptional<string[], number>);
expectType<ReadonlyArray<string | number>>({} as SetOptional<ReadonlyArray<string | number>, number>);
expectType<number[]>({} as SetOptional<[...number[]], never>);
