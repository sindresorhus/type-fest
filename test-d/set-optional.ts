import {expectType} from 'tsd';
import {SetOptional} from '..';

// Update one required and one optional to optional
declare const variation1: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectType<{a: number; b?: string; c?: boolean}>(variation1);

// Update two required to optional
declare const variation2: SetOptional<{a: number; b: string; c: boolean}, 'a' | 'b'>;
expectType<{a?: number; b?: string; c: boolean}>(variation2);

// Three optional remain optional
declare const variation3: SetOptional<{a?: number; b?: string; c?: boolean}, 'a' | 'b' | 'c'>;
expectType<{a?: number; b?: string; c?: boolean}>(variation3);
