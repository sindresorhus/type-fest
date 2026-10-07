import {expectNotAssignable, expectType} from 'tsd';
import type {SetRequired, Simplify} from '../index.d.ts';

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

// Works with functions containing properties
declare const variation11: SetRequired<{(a1: string, a2: number): boolean; p1?: string; readonly p2: number}, 'p1'>;
expectType<boolean>(variation11('foo', 1));
expectType<{p1: string; readonly p2: number}>({} as Simplify<typeof variation11>);

declare const variation12: SetRequired<{(a1: boolean, ...a2: string[]): number; p1?: string; readonly p2?: number; p3?: boolean}, 'p1' | 'p2'>;
expectType<number>(variation12(true, 'foo', 'bar', 'baz'));
expectType<{p1: string; readonly p2: number; p3?: boolean}>({} as Simplify<typeof variation12>);

// Functions without properties are returned as is
declare const variation13: SetRequired<(a: string) => number, never>;
expectType<number>(variation13('foo'));

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

// Required elements cannot appear after optional ones, so `Keys` leading to such situations are ignored.
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

// A key that lands in a rest element is ignored, unlike `SetNonNullable`, which makes the rest element non-nullable. Making a rest element required is not expressible either, because a rest element has no optionality to remove: its elements are always present, and the `undefined` in `number | undefined` is a value the element may hold rather than the element being absent. `SetRequired<[string, number?], 1>` is `[string, number]` because there the `?` is real optionality. See the note in the docs.
expectType<[string, ...Array<number | undefined>]>({} as SetRequired<[string, ...Array<number | undefined>], 1>);

// A key that only one member of a union has is accepted, and a member without it is left as it is.
expectType<{a: 1} | {b?: 2}>({} as SetRequired<{a?: 1} | {b?: 2}, 'a'>);
expectType<{a?: 1} | {b: 2}>({} as SetRequired<{a?: 1} | {b?: 2}, 'b'>);

// TypeScript rejects a required element that follows an optional one, so `[number?, number]` is not a tuple type and the walk stops at the first optional element. Naming both keys gives `[number, number]`, which is the answer when the earlier key is named too.
declare const afterAnOptionalElement: SetRequired<[number?, number?], 1>;
expectType<[number?, number?]>(afterAnOptionalElement);

declare const afterAnOptionalElementWithBothKeys: SetRequired<[number?, number?], '0' | '1'>;
expectType<[number, number]>(afterAnOptionalElementWithBothKeys);

declare const afterAnOptionalElementWithBothKeysAsNumbers: SetRequired<[number?, number?], 0 | 1>;
expectType<[number, number]>(afterAnOptionalElementWithBothKeysAsNumbers);

// The rebuilt call signature keeps the `this` parameter, which `Parameters` leaves out, so a wrong receiver stays a type error after the transform.
declare const thisParameter: ThisParameterType<SetRequired<{(this: Date, a: string): void; p: string}, 'p'>>;
expectType<Date>(thisParameter);

// The call signature is kept per member, so a union of callables does not mix their signatures, and a callable member keeps its signature beside a member that is not callable.
type StringCallable = ((a: string) => 1) & {x?: 1};
type NumberCallable = ((a: number) => 2) & {y?: 2};
expectNotAssignable<SetRequired<StringCallable | NumberCallable, 'x'>>({} as ((a: string) => 1) & {y?: 2});
expectType<1>(({} as Extract<SetRequired<StringCallable | {z?: 1}, 'x'>, Function>)('a'));

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetRequired<any, 'a'>;
expectType<{[x: string]: any}>(anyBase);
