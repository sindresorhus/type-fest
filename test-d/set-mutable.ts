import {expectType, expectError} from 'tsd';
import {SetMutable} from '..';

// Update one required and one optional to required.
declare const variation1: SetMutable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>;
expectType<{readonly a: number; b: string; c: boolean}>(variation1);

// Update two optional to required.
declare const variation2: SetMutable<{readonly a: number; readonly b: string; readonly c: boolean}, 'a' | 'b'>;
expectType<{a: number; b: string; readonly c: boolean}>(variation2);

// Three required remain required.
declare const variation3: SetMutable<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>;
expectType<{a: number; b: string; c: boolean}>(variation3);

// Fail if type changes even if optional is right.
declare const variation4: SetMutable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>;
expectError<{readonly a: boolean; b: string; c: boolean}>(variation4);
