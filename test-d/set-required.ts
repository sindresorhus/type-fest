import {expectNotAssignable, expectType} from 'tsd';
import type {SetRequired} from '../index.d.ts';

// Update one required and one optional to required.
declare const variation1: SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>;
expectType<{a?: number; b: string; c: boolean}>(variation1);

// Update two optional to required.
declare const variation2: SetRequired<{a?: number; b?: string; c?: boolean}, 'a' | 'b'>;
expectType<{a: number; b: string; c?: boolean}>(variation2);

// Three required remain required.
declare const variation3: SetRequired<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>;
expectType<{a: number; b: string; c: boolean}>(variation3);

// Fail if type changes even if optional is right.
declare const variation4: SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>;
expectNotAssignable<{a?: boolean; b: string; c: boolean}>(variation4);

// Update one required and one optional to required in a union.
declare const variation5: SetRequired<{a?: '1'; b: string; c?: boolean} | {a?: '2'; b: string; c?: boolean}, 'a' | 'b'>;
expectType<{a: '1'; b: string; c?: boolean} | {a: '2'; b: string; c?: boolean}>(variation5);

// Preserves readonly modifier.
declare const variation6: SetRequired<{readonly a?: number; readonly b: string; c?: boolean}, 'b' | 'c'>;
expectType<{readonly a?: number; readonly b: string; c: boolean}>(variation6);

// Works with unions.
declare const variation7: SetRequired<{readonly a?: number; b?: number; c?: boolean} | {a?: string; readonly b?: string; d?: boolean}, 'a' | 'b'>;
expectType<{readonly a: number; b: number; c?: boolean} | {a: string; readonly b: string; d?: boolean}>(variation7);

// Marks all keys as required, if `Keys` is `any`.
declare const variation8: SetRequired<{readonly a?: number; b?: string; c?: boolean}, any>;
expectType<{readonly a: number; b: string; c: boolean}>(variation8);

// Does nothing, if `Keys` is `never`.
declare const variation9: SetRequired<{a?: number; readonly b?: string; readonly c: boolean}, never>;
expectType<{a?: number; readonly b?: string; readonly c: boolean}>(variation9);

// Works with index signatures
declare const variation10: SetRequired<{[k: string]: unknown; a?: number; b: string}, 'a' | 'b'>;
expectType<{[k: string]: unknown; a: number; b: string}>(variation10);

// =================
// Works with arrays
// =================

// Empty array
expectType<[]>({} as SetRequired<[], never>);
expectType<readonly []>({} as SetRequired<readonly [], never>);

// All optional elements
expectType<[string, number?]>({} as SetRequired<[string?, number?], '0'>);
expectType<[string, number, boolean]>({} as SetRequired<[string?, number?, boolean?], '0' | '1' | '2'>);
expectType<[(string | number)]>({} as SetRequired<[(string | number)?], '0'>);

// Works with number `Keys`, string `Keys`, and union of them.
expectType<[string, number, boolean?]>({} as SetRequired<[string, number?, boolean?], 1>);
expectType<[string, number, boolean, ...number[]]>({} as SetRequired<[string, number?, boolean?, ...number[]], '1' | '2'>);
expectType<readonly [string, number, boolean]>({} as SetRequired<readonly [string?, number?, boolean?], '0' | 1 | 2>);

// Mix of optional and required elements
expectType<[string, number, boolean?]>({} as SetRequired<[string, number?, boolean?], '1'>);
expectType<readonly [string, number, boolean]>({} as SetRequired<readonly [string, number?, boolean?], '1' | '2'>);

// Mix of optional and rest elements
expectType<[string, number?, boolean?, ...number[]]>({} as SetRequired<[string?, number?, boolean?, ...number[]], '0'>);
expectType<[string, number, boolean, ...number[]]>({} as SetRequired<[string?, number?, boolean?, ...number[]], '0' | '1' | 2>);

// Mix of optional, required, and rest elements
expectType<readonly [string, number, boolean?, ...number[]]>({} as SetRequired<readonly [string, number?, boolean?, ...number[]], '1'>);
expectType<[string, number, boolean, ...string[]]>({} as SetRequired<[string, number?, boolean?, ...string[]], '1' | 2>);

// Works with readonly arrays
expectType<readonly [(string | number)]>({} as SetRequired<readonly [(string | number)?], '0'>);
expectType<readonly [string, number, boolean?]>({} as SetRequired<readonly [string, number?, boolean?], '1'>);
expectType<readonly [string, number, boolean, ...number[]]>({} as SetRequired<readonly [string?, number?, boolean?, ...number[]], '0' | '1' | 2>);
expectType<readonly [string, number, boolean, ...string[]]>({} as SetRequired<readonly [string, number?, boolean?, ...string[]], '1' | 2>);

// Ignores `Keys` that are already required
expectType<[string, number?, boolean?]>({} as SetRequired<[string, number?, boolean?], '0'>);
expectType<readonly [string, number, boolean]>({} as SetRequired<readonly [string, number, boolean], 1 | 2>);
expectType<readonly [string, number, boolean, ...number[]]>({} as SetRequired<readonly [string, number, boolean, ...number[]], 1 | 2>);
expectType<[string, number, boolean, ...number[]]>({} as SetRequired<[string, number?, boolean?, ...number[]], '0' | '1' | '2'>);

// Ignores `Keys` that are out of bounds
expectType<[]>({} as SetRequired<[], 1>);
expectType<[string, number?, boolean?]>({} as SetRequired<[string, number?, boolean?], 10>);
expectType<[string, number, boolean]>({} as SetRequired<[string?, number?, boolean?], 0 | 1 | 2 | 3 | 4>);
expectType<readonly [string, number, boolean?, ...number[]]>({} as SetRequired<readonly [string, number?, boolean?, ...number[]], 10 | 1>);

// Marks all keys as required, if `Keys` is `any`.
expectType<[string, number, boolean]>({} as SetRequired<[string?, number?, boolean?], any>);
expectType<[string, number, boolean, ...number[]]>({} as SetRequired<[string, number?, boolean?, ...number[]], any>);
expectType<readonly [string, number, boolean, ...number[]]>({} as SetRequired<readonly [string, number, boolean, ...number[]], any>);
expectType<readonly [string, number, boolean, ...number[]]>({} as SetRequired<readonly [string, number?, boolean?, ...number[]], any>);

// Marks all keys as required, if `Keys` is `number`.
expectType<[string, number, boolean]>({} as SetRequired<[string?, number?, boolean?], number>);
expectType<[string, number, boolean, ...number[]]>({} as SetRequired<[string, number?, boolean?, ...number[]], number>);
expectType<readonly [string, number, boolean, ...number[]]>({} as SetRequired<readonly [string, number, boolean, ...number[]], number>);
expectType<readonly [string, number, boolean, ...number[]]>({} as SetRequired<readonly [string, number?, boolean?, ...number[]], number>);

// Returns the array as-is, if `Keys` is `never`.
expectType<[string?, number?]>({} as SetRequired<[string?, number?], never>);
expectType<readonly [string?, number?, ...number[]]>({} as SetRequired<readonly [string?, number?, ...number[]], never>);

// Arrays where non-rest elements appear after the rest element are left unchanged, because they can never have optional elements.
expectType<[...string[], string | undefined, number]>({} as SetRequired<[...string[], string | undefined, number], any>);
expectType<[boolean, ...string[], string, number]>({} as SetRequired<[boolean, ...string[], string, number], any>);

// Preserves `| undefined`, similar to how built-in `Required` works.
expectType<[string | undefined, number | undefined, boolean]>({} as SetRequired<[string | undefined, (number | undefined)?, boolean?], 0 | 1 | 2>);
expectType<readonly [string | undefined, (number | undefined)?, boolean?]>({} as SetRequired<readonly [(string | undefined)?, (number | undefined)?, boolean?], 0>);

// Optional elements cannot appear after required ones, `Keys` leading to such situations are ignored.
expectType<[string?, number?, boolean?]>({} as SetRequired<[string?, number?, boolean?], 1 | 2>); // `1` and `2` can't be required when `0` is optional
expectType<[string, number, boolean?, string?, string?]>(
	{} as SetRequired<[string?, number?, boolean?, string?, string?], 0 | 1 | 3>, // `3` can't be required when `2` is optional
);
expectType<readonly [string | undefined, number?, boolean?, ...string[]]>(
	{} as SetRequired<readonly [string | undefined, number?, boolean?, ...string[]], 2>, // `2` can't be required when `1` is optional
);

// Works with unions of arrays
expectType<readonly [] | []>({} as SetRequired<readonly [] | [], never>);
expectType<[] | readonly [(string | number)]>({} as SetRequired<[] | readonly [(string | number)?], 0>);
expectType<[string] | [string, number, boolean?, ...number[]] | readonly [string, number, boolean?]>(
	{} as SetRequired<[string?] | [string, number?, boolean?, ...number[]] | readonly [string, number?, boolean?], 0 | 1>,
);
expectType<readonly [number, string] | [string, boolean, ...number[]] | readonly [string, number | undefined, boolean?, string?]>(
	{} as SetRequired<readonly [number, string] | [string, boolean?, ...number[]] | readonly [string, (number | undefined)?, boolean?, string?], 1 | 3>,
);
expectType<readonly [...number[], number] | [string, boolean, ...number[]] | readonly [string, number | undefined, boolean, string]>(
	{} as SetRequired<readonly [...number[], number] | [string, boolean?, ...number[]] | readonly [string, (number | undefined)?, boolean?, string?], any>,
);
expectType<readonly string[] | [x: number, y: number] | [string, number, ...string[]]>(
	{} as SetRequired<readonly string[] | [x: number, y?: number] | [string?, number?, ...string[]], number>,
);

// Works with labelled tuples
expectType<[x: string, y: number]>({} as SetRequired<[x?: string, y?: number], '0' | '1'>);
expectType<readonly [x: number, y: number, z?: number]>({} as SetRequired<readonly [x?: number, y?: number, z?: number], 0 | 1>);
expectType<readonly [x: number, y: number, z?: number, ...rest: number[]]>({} as SetRequired<readonly [x?: number, y?: number, z?: number, ...rest: number[]], 0 | 1>);

// Non tuple arrays are left unchanged
expectType<string[]>({} as SetRequired<string[], number>);
expectType<ReadonlyArray<string | number>>({} as SetRequired<ReadonlyArray<string | number>, number>);
expectType<number[]>({} as SetRequired<[...number[]], never>);
