import {expectTypeOf} from 'nz';
import type {GreaterThan, GreaterThanOrEqual, Sum, Subtract} from '../index.d.ts';

// A computed enum member has no known value, so its comparisons and arithmetic stay wide.
declare enum DynamicValue {
	Computed,
}

expectTypeOf<GreaterThan<DynamicValue.Computed, 1>>().toBe<boolean>();
expectTypeOf<GreaterThanOrEqual<DynamicValue.Computed, 1>>().toBe<boolean>();
expectTypeOf<Sum<DynamicValue.Computed, 1>>().toBe<number>();
expectTypeOf<Subtract<DynamicValue.Computed, 1>>().toBe<number>();
