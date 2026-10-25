import {expectTypeOf} from 'nz';
import type {IsNullable} from '../source/is-nullable.d.ts';

expectTypeOf<IsNullable<any>>().toBe<true>();
expectTypeOf<IsNullable<null>>().toBe<true>();
expectTypeOf<IsNullable<null | undefined>>().toBe<true>();
expectTypeOf<IsNullable<string | null>>().toBe<true>();
expectTypeOf<IsNullable<string | null | undefined>>().toBe<true>();

expectTypeOf<IsNullable<string>>().toBe<false>();
expectTypeOf<IsNullable<string | undefined>>().toBe<false>();

expectTypeOf<IsNullable<void>>().toBe<false>();
expectTypeOf<IsNullable<undefined>>().toBe<false>();
expectTypeOf<IsNullable<never>>().toBe<false>();
expectTypeOf<IsNullable<unknown>>().toBe<false>();
expectTypeOf<IsNullable<() => void>>().toBe<false>();
expectTypeOf<IsNullable<string & null>>().toBe<false>();

// Null membership is distinct from an unknown or optional value.
expectTypeOf<IsNullable<{value: null}>>().toBe<false>();
expectTypeOf<IsNullable<readonly [null]>>().toBe<false>();
expectTypeOf<IsNullable<Promise<null>>>().toBe<false>();
expectTypeOf<IsNullable<object | null>>().toBe<true>();
expectTypeOf<IsNullable<unknown | null>>().toBe<false>();

function _nonNullableRecord<Value>(flag: IsNullable<{value: Value}>): false {
	return flag;
}

function _nullableTuple<Value>(): IsNullable<readonly [Value] | null> {
	return true;
}

declare function nullFlags<const Model>(model: Model): {readonly [Key in keyof Model]: IsNullable<Model[Key]>};
const nullableFields = nullFlags({name: 'title' as string | null, enabled: true, count: undefined as number | undefined});
expectTypeOf(nullableFields).toBe<{readonly name: true; readonly enabled: false; readonly count: false}>();

// Tuple mapping retains each flag position and the input's readonly modifier.
declare const nullableTupleInput: readonly [string | null, Promise<null>, undefined];
const nullableTupleFlags = nullFlags(nullableTupleInput);
expectTypeOf(nullableTupleFlags).toBe<readonly [true, false, false]>();

function _readNullableFlag<Value>(flag: IsNullable<Value>): boolean {
	return flag;
}
