import {expectNotAssignable, expectType} from 'tsd';
import type {SetReadonly} from '../index';

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
