import {expectNotAssignable, expectType} from 'tsd';
import type {SetOptional} from '../index.d.ts';

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
expectType<((a1: string, a2: number) => boolean) & {p1?: string; readonly p2?: number}>(variation10);

declare const variation11: SetOptional<{(a1: boolean, ...a2: string[]): number; p1: string; readonly p2: number; p3: boolean}, 'p1' | 'p2'>;
expectType<number>(variation11(true, 'foo', 'bar', 'baz'));
expectType<((a1: boolean, ...a2: string[]) => number) & {p1?: string; readonly p2?: number; p3: boolean}>(variation11);

// Functions without properties are returned as is
declare const variation12: SetOptional<(a: string) => number, never>;
expectType<number>(variation12('foo'));
