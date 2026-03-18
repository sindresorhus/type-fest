import {expectType} from 'tsd';
import type {OrAll} from '../source/or-all.d.ts';

declare const boolean: boolean;

// Basic boolean combinations
expectType<OrAll<[true, false]>>(true);
expectType<OrAll<[false, true]>>(true);
expectType<OrAll<[true, true]>>(true);
expectType<OrAll<[false, false]>>(false);

// Multiple elements in a tuple
expectType<OrAll<[false, false, false, true]>>(true);
expectType<OrAll<[false, false, false, false]>>(false);

// `boolean` element
expectType<OrAll<[false, false, boolean]>>(boolean);
expectType<OrAll<[false, boolean, true]>>(true);
expectType<OrAll<[boolean, boolean, boolean]>>(boolean);

// Unions
expectType<OrAll<[false, false, true] | [false, false, false]>>(boolean); // `true` | `false`
expectType<OrAll<[false, true, false] | [true]>>(true); // `true` | `true`
expectType<OrAll<[false] | [false, false, false]>>(false); // `false` | `false`
expectType<OrAll<[true, false] | [false, boolean]>>(boolean); // `true` | `boolean`
expectType<OrAll<[false, false] | [false, false, boolean]>>(boolean); // `false` | `boolean`
expectType<OrAll<[boolean, false, false] | [boolean]>>(boolean); // `boolean` | `boolean`

// Tuples with rest element
expectType<OrAll<[false, ...Array<false>]>>(false);
expectType<OrAll<[...Array<false>, true]>>(true);
expectType<OrAll<[false, ...Array<false>, boolean]>>(boolean);

// Non-tuple arrays
expectType<OrAll<Array<true>>>(true);
expectType<OrAll<Array<false>>>(false);
expectType<OrAll<boolean[]>>(boolean);

// Readonly arrays
expectType<OrAll<readonly [true, false, true]>>(true);
expectType<OrAll<readonly [false, false, false]>>(false);
expectType<OrAll<readonly [false, false, boolean]>>(boolean);
expectType<OrAll<ReadonlyArray<true>>>(true);
expectType<OrAll<ReadonlyArray<false>>>(false);
expectType<OrAll<readonly boolean[]>>(boolean);

// Boundary cases
expectType<OrAll<[]>>(false);

expectType<OrAll<[any, any, false]>>(boolean);
expectType<OrAll<[any, any, true]>>(true);
expectType<OrAll<[any, any, any]>>(boolean);

expectType<OrAll<[never, never, false]>>(false);
expectType<OrAll<[never, never, true]>>(true);
expectType<OrAll<[never, never, never]>>(false);

// Errors with non-boolean or optional elements
// @ts-expect-error
type Error1 = OrAll<[1, 0]>;
// @ts-expect-error
type Error2 = OrAll<[true, false?]>;
