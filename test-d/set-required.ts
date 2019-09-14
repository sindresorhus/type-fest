import {expectType, expectError} from 'tsd';
import {SetRequired} from '..';

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
expectError<{a?: boolean; b: string; c: boolean}>(variation4);
