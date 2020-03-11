import {expectAssignable} from 'tsd';
import {UnionToIntersection} from '..';

declare const intersection1: UnionToIntersection<{a: string} | {b: number}>;
expectAssignable<{a: string; b: number}>(intersection1);

// Creates a union of matching properties.
declare const intersection2: UnionToIntersection<{a: string} | {b: number} | {a: () => void}>;
expectAssignable<{a: string | (() => void); b: number}>(intersection2);
