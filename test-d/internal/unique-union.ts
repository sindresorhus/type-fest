import {expectType} from 'tsd';
import type {UniqueUnion} from '../../source/internal/type.d.ts';

expectType<never>({} as UniqueUnion<never>);
expectType<string>({} as UniqueUnion<string>);
expectType<{a: 0}>({} as UniqueUnion<{a: 0}>);
expectType<unknown>({} as UniqueUnion<unknown>);
expectType<any>({} as UniqueUnion<any>);
expectType<[unknown]>({} as UniqueUnion<[unknown]>);
expectType<[any]>({} as UniqueUnion<[any]>);

expectType<{a: 0} | {a: 1}>({} as UniqueUnion<{a: 0} | {a: 0} | {a: 0} | {a: 1}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `{a: t}` isn't excluded by `{a: T}` even if `T` includes `t`.
expectType<{a: 0} | {a: 1} | {a: number}>({} as UniqueUnion<{a: 0} | {a: 0} | {a: 0} | {a: 1} | {a: number}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `readonly`, `optional`, both, and general object key shouldn't be mutually equal.
expectType<{a: number} | {readonly a: number} | {a?: number} | {readonly a?: number}>({} as UniqueUnion<{a: number} | {readonly a: number} | {a?: number} | {readonly a?: number} | {a: number} | {readonly a: number} | {a?: number} | {readonly a?: number}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// Empty tuple isn't removed by `T[]`.
expectType<[0, 1, 2] | [0, 1] | [] | number[]>({} as UniqueUnion<[0, 1, 2] | [0, 1, 2] | [0, 1, 2] | [0, 1] | [] | number[]>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `T[]` doesn't delete tuples of `[t, ...t]` even if `T` includes `t`.
expectType<[0, 1, 2] | ['0', unknown] | [0, unknown]>({} as UniqueUnion<[0, 1, 2] | [0, 1, 2] | [0, 1, 2] | [0, unknown] | ['0', unknown]>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents

// `[u, ...u]` doesn't delete tuples of `[v, ...y]` even if `u` includes `v`.
expectType<[0, 1, 2] | ['0', unknown] | [0, unknown] | number[]>({} as UniqueUnion<[0, 1, 2] | [0, 1, 2] | [0, 1, 2] | [0, unknown] | ['0', unknown] | number[]>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
