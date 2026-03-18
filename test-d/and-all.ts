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

// Boundary cases
expectType<AndAll<[]>>(false);

expectType<AndAll<[any, any, false]>>(false);
expectType<AndAll<[any, any, true]>>(boolean);
expectType<AndAll<[any, any, any]>>(boolean);

expectType<AndAll<[false, never, never]>>(false);
expectType<AndAll<[true, true, never]>>(false);
expectType<AndAll<[never, never, never]>>(false);
