import {expectType} from 'tsd';
import type {OrMultiple} from '../source/or-multiple.d.ts';

declare const boolean: boolean;

// Basic boolean combinations
expectType<OrMultiple<[true, false]>>(true);
expectType<OrMultiple<[false, true]>>(true);
expectType<OrMultiple<[false, false]>>(false);

// Multiple parameters in a tuple
expectType<OrMultiple<[false, false, false, true]>>(true);
expectType<OrMultiple<[false, false, false, false]>>(false);

// Generic boolean types (Distributive behavior)
expectType<OrMultiple<[false, boolean]>>(boolean);
expectType<OrMultiple<[true, boolean]>>(true);

// Boundary cases
expectType<OrMultiple<[]>>(false);

expectType<OrMultiple<[false, any]>>(boolean);
expectType<OrMultiple<[false, any]>>(boolean);
expectType<OrMultiple<[any, any]>>(boolean);

expectType<OrMultiple<[false, never]>>(false);
expectType<OrMultiple<[true, never]>>(true);
expectType<OrMultiple<[never, never]>>(false);
