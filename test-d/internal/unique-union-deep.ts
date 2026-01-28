import {expectType} from 'tsd';
import type {UniqueUnionDeep} from '../../source/internal/type.d.ts';

// The returns of `UniqueUnionDeep` are expected to be equal to `UniqueUnion`, if there's no recursive object type in the passed union type.
// That's why those tests are pasted from 'test-d/internal/union-unique.ts'.

expectType<never>({} as UniqueUnionDeep<never>);
expectType<string>({} as UniqueUnionDeep<string>);
expectType<{a: 0}>({} as UniqueUnionDeep<{a: 0}>);
expectType<unknown>({} as UniqueUnionDeep<unknown>);
expectType<any>({} as UniqueUnionDeep<any>);
expectType<[unknown]>({} as UniqueUnionDeep<[unknown]>);
expectType<[any]>({} as UniqueUnionDeep<[any]>);

expectType<{a: 0} | {a: 1}>({} as UniqueUnionDeep<{a: 0} | {a: 0} | {a: 0} | {a: 1}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `{a: t}` isn't excluded by `{a: T}` even if `T` includes `t`.
expectType<{a: 0} | {a: 1} | {a: number}>({} as UniqueUnionDeep<{a: 0} | {a: 0} | {a: 0} | {a: 1} | {a: number}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `readonly`, `optional`, both, and general object key shouldn't be mutually equal.
expectType<{a: number} | {readonly a: number} | {a?: number} | {readonly a?: number}>({} as UniqueUnionDeep<{a: number} | {readonly a: number} | {a?: number} | {readonly a?: number} | {a: number} | {readonly a: number} | {a?: number} | {readonly a?: number}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// Empty tuple isn't removed by `T[]`.
expectType<[0, 1, 2] | [0, 1] | [] | number[]>({} as UniqueUnionDeep<[0, 1, 2] | [0, 1, 2] | [0, 1, 2] | [0, 1] | [] | number[]>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `T[]` doesn't delete tuples of `[t, ...t]` even if `T` includes `t`.
expectType<[0, 1, 2] | ['0', unknown] | [0, unknown]>({} as UniqueUnionDeep<[0, 1, 2] | [0, 1, 2] | [0, 1, 2] | [0, unknown] | ['0', unknown]>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `[u, ...u]` doesn't delete tuple of `[v, ...y]` even if `u` includes `v`.
expectType<[0, 1, 2] | ['0', unknown] | [0, unknown] | number[]>({} as UniqueUnionDeep<[0, 1, 2] | [0, 1, 2] | [0, 1, 2] | [0, unknown] | ['0', unknown] | number[]>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

expectType<{z: {a: {aa: 0}} | {b: 0}; x: '1'}>({} as UniqueUnionDeep<{z: {a: {aa: 0} | {aa: 0}} | {a: {aa: 0} | {aa: 0}} | {b: 0}; x: '1'}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<{z: {a: 0}; x: '1'} | {z: {a: 0}; x: '2'}>({} as UniqueUnionDeep<{z: {a: 0} | {a: 0}; x: '1'} | {z: {a: 0} | {a: 0}; x: '2'}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
