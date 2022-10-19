import {expectTypeOf} from 'expect-type';
import type {UnionToIntersection} from '../index';

declare const intersection1: UnionToIntersection<{a: string} | {b: number}>;
expectTypeOf(intersection1).toMatchTypeOf<{a: string; b: number}>();

// Creates a union of matching properties.
declare const intersection2: UnionToIntersection<{a: string} | {b: number} | {a: () => void}>;
expectTypeOf(intersection2).toMatchTypeOf<{a: string | (() => void); b: number}>();
