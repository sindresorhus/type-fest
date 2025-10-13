import {expectType} from 'tsd';
import type {SimplifyUnion} from '../source/simplify-union.d.ts';

type U1 = 'a' | 0 | null | ['b', 1n];
type U2 = (() => void) | {[x: string]: number; b: number};

type UnSimplifiedUnion = U1 | U2;
//=> U1 | U2 <- obfuscated, hovering over the type doesn't show the underlying types in the union.

type SimplifiedUnion = SimplifyUnion<UnSimplifiedUnion>;
//=> 0 | "a" | null | ['b', 1n] | (() => void) | {[x: string]: number; b: number}

expectType<SimplifiedUnion>({} as UnSimplifiedUnion);
// Checking all types are preserved.
