import {expectType} from 'tsd';
import type {AndAll} from '../source/and-all.d.ts';

declare const boolean: boolean;

// Basic boolean combinations
expectType<AndAll<[true, true]>>(true);
expectType<AndAll<[true, false]>>(false);
expectType<AndAll<[false, true]>>(false);
expectType<AndAll<[false, false]>>(false);

// Multiple elements in a tuple
expectType<AndAll<[true, true, true, true]>>(true);
expectType<AndAll<[true, true, true, false]>>(false);
expectType<AndAll<[true, true, false, true]>>(false);

// `boolean` element
expectType<AndAll<[true, true, boolean]>>(boolean);
expectType<AndAll<[true, boolean, false]>>(false);
expectType<AndAll<[boolean, boolean, boolean]>>(boolean);

// Unions
expectType<AndAll<[true, true, true] | [true, true, false]>>(boolean); // `true` | `false`
expectType<AndAll<[true, true] | [true]>>(true); // `true` | `true`
expectType<AndAll<[false] | [true, false, true]>>(false); // `false` | `false`
expectType<AndAll<[true, true] | [true, boolean]>>(boolean); // `true` | `boolean`
expectType<AndAll<[false, true] | [true, true, boolean]>>(boolean); // `false` | `boolean`
expectType<AndAll<[boolean, true, true] | [boolean]>>(boolean); // `boolean` | `boolean`

// Tuples with rest element
expectType<AndAll<[true, ...Array<true>]>>(true);
expectType<AndAll<[...Array<true>, false]>>(false);
expectType<AndAll<[true, ...Array<true>, boolean]>>(boolean);

// Non-tuple arrays
expectType<AndAll<Array<true>>>(true);
expectType<AndAll<Array<false>>>(false);
expectType<AndAll<boolean[]>>(boolean);

// Readonly arrays
expectType<AndAll<readonly [true, true, true]>>(true);
expectType<AndAll<readonly [true, true, false]>>(false);
expectType<AndAll<readonly [true, true, boolean]>>(boolean);
expectType<AndAll<ReadonlyArray<true>>>(true);
expectType<AndAll<ReadonlyArray<false>>>(false);
expectType<AndAll<readonly boolean[]>>(boolean);

// Boundary cases
expectType<AndAll<[]>>(true);

expectType<AndAll<[any, any, false]>>(false);
expectType<AndAll<[any, any, true]>>(boolean);
expectType<AndAll<[any, any, any]>>(boolean);

expectType<AndAll<[false, never, never]>>(false);
expectType<AndAll<[true, true, never]>>(false);
expectType<AndAll<[never, never, never]>>(false);

// Errors with non-boolean or optional elements
// @ts-expect-error
type Error1 = AndAll<[1, 0]>;
// @ts-expect-error
type Error2 = AndAll<[true, false?]>;
