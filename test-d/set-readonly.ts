import {expectNotAssignable, expectType} from 'tsd';
import type {SetReadonly} from '../index.d.ts';

// Update one readonly and one non readonly to readonly.
declare const variation1: SetReadonly<{a: number; readonly b: string; c: boolean}, 'b' | 'c'>;
expectType<{a: number; readonly b: string; readonly c: boolean}>(variation1);

// Update two non readonly to readonly.
declare const variation2: SetReadonly<{readonly a: number; readonly b: string; c: boolean}, 'a' | 'b'>;
expectType<{readonly a: number; readonly b: string; c: boolean}>(variation2);

// Three readonly remain readonly.
declare const variation3: SetReadonly<{readonly a: number; readonly b?: string; readonly c: boolean}, 'a' | 'b' | 'c'>;
expectType<{readonly a: number; readonly b?: string; readonly c: boolean}>(variation3);

// Fail if type changes even if readonly is right.
declare const variation4: SetReadonly<{a: number; readonly b: string; c: boolean}, 'b' | 'c'>;
expectNotAssignable<{a: boolean; readonly b: string; readonly c: boolean}>(variation4);

// Preserves optional modifier.
declare const variation5: SetReadonly<{a?: number; readonly b?: string; c?: boolean}, 'b' | 'c'>;
expectType<{a?: number; readonly b?: string; readonly c?: boolean}>(variation5);

// Works with unions.
declare const variation6: SetReadonly<{a?: number; b: number; c: boolean} | {a: string; b?: string; d: boolean}, 'a' | 'b'>;
expectType<{readonly a?: number; readonly b: number; c: boolean} | {readonly a: string; readonly b?: string; d: boolean}>(variation6);

// Marks all keys as readonly, if `Keys` is `any`.
declare const variation7: SetReadonly<{a?: number; b: string; c: boolean}, any>;
expectType<{readonly a?: number; readonly b: string; readonly c: boolean}>(variation7);

// Does nothing, if `Keys` is `never`.
declare const variation8: SetReadonly<{a: number; readonly b: string; readonly c: boolean}, never>;
expectType<{a: number; readonly b: string; readonly c: boolean}>(variation8);

// Works with index signatures
declare const variation9: SetReadonly<{[k: string]: unknown; a: number; readonly b: string}, 'a' | 'b'>;
expectType<{[k: string]: unknown; readonly a: number; readonly b: string}>(variation9);
