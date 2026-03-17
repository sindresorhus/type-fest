import {expectType} from 'tsd';
import type {OrMultiple} from '../source/or-multiple.d.ts';

declare const boolean: boolean;

// Basic boolean combinations
expectType<OrMultiple<[true, false]>>(true);
expectType<OrMultiple<[false, true]>>(true);
expectType<OrMultiple<[true, true]>>(true);
expectType<OrMultiple<[false, false]>>(false);

// Multiple elements in a tuple
expectType<OrMultiple<[false, false, false, true]>>(true);
expectType<OrMultiple<[false, false, false, false]>>(false);

// `boolean` element
expectType<OrMultiple<[false, false, boolean]>>(boolean);
expectType<OrMultiple<[false, boolean, true]>>(true);
expectType<OrMultiple<[boolean, boolean, boolean]>>(boolean);

// Boundary cases
expectType<OrMultiple<[]>>(false);

expectType<OrMultiple<[any, any, false]>>(boolean);
expectType<OrMultiple<[any, any, true]>>(true);
expectType<OrMultiple<[any, any, any]>>(boolean);

expectType<OrMultiple<[never, never, false]>>(false);
expectType<OrMultiple<[never, never, true]>>(true);
expectType<OrMultiple<[never, never, never]>>(false);
