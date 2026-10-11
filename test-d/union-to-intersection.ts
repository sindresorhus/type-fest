import {expectTypeOf} from 'nz';
import type {UnionToIntersection} from '../index.d.ts';

declare const intersection1: UnionToIntersection<{a: string} | {b: number}>;
expectTypeOf(intersection1).toBeAssignableTo<{a: string; b: number}>();

// Creates a union of matching properties.
declare const intersection2: UnionToIntersection<{a: string} | {b: number} | {a: () => void}>;
expectTypeOf(intersection2).toBeAssignableTo<{a: string | (() => void); b: number}>();

type Assignability<T, U, _K extends T | U> = never;
type TestAssignability<T, U> = Assignability<T, U, UnionToIntersection<T | U>>;
