import {expectNotAssignable, expectType} from 'tsd';
import type {SetRequired} from '../index';

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
