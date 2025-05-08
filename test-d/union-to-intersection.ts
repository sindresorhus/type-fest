import {expectAssignable, expectType} from 'tsd';
import type {UnionToIntersection} from '../index.d.ts';

declare const intersection1: UnionToIntersection<{a: string} | {b: number}>;
expectAssignable<{a: string; b: number}>(intersection1);

// Creates a union of matching properties.
declare const intersection2: UnionToIntersection<{a: string} | {b: number} | {a: () => void}>;
expectAssignable<{a: string | (() => void); b: number}>(intersection2);

// It's possible to index by the resulting type.
type ObjectsUnion = {a: string; z: string} | {b: string; z: string} | {c: string; z: string};
declare const value: ObjectsUnion[UnionToIntersection<keyof ObjectsUnion>];
expectType<string>(value);
