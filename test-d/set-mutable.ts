import {expectType, expectError} from 'tsd';
import {SetMutable} from '..';

// Update one mutable and one readonly to mutable, leaving one property unaffected.
declare const variation1: SetMutable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>;
expectType<{readonly a: number; b: string; c: boolean}>(variation1);

// Update two readonly to mutable, leaving one property unaffected.
declare const variation2: SetMutable<{readonly a: number; readonly b: string; readonly c: boolean}, 'a' | 'b'>;
expectType<{a: number; b: string; readonly c: boolean}>(variation2);

// Three mutable remain mutable.
declare const variation3: SetMutable<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>;
expectType<{a: number; b: string; c: boolean}>(variation3);

// Check if type changes raise an error even if readonly and mutable are applied correctly.
declare const variation4: SetMutable<{readonly a: number; b: string; readonly c: boolean}, 'b' | 'c'>;
expectError<{readonly a: boolean; b: string; c: boolean}>(variation4);
