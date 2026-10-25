import {expectTypeOf} from 'nz';
import type {IsOptional} from '../source/is-optional.d.ts';

expectTypeOf<IsOptional<any>>().toBe<true>();
expectTypeOf<IsOptional<undefined>>().toBe<true>();
expectTypeOf<IsOptional<null | undefined>>().toBe<true>();
expectTypeOf<IsOptional<string | undefined>>().toBe<true>();
expectTypeOf<IsOptional<string | null | undefined>>().toBe<true>();

expectTypeOf<IsOptional<string>>().toBe<false>();
expectTypeOf<IsOptional<string | null>>().toBe<false>();

expectTypeOf<IsOptional<void>>().toBe<false>();
expectTypeOf<IsOptional<null>>().toBe<false>();
expectTypeOf<IsOptional<never>>().toBe<false>();
expectTypeOf<IsOptional<unknown>>().toBe<false>();
expectTypeOf<IsOptional<() => void>>().toBe<false>();
expectTypeOf<IsOptional<string & undefined>>().toBe<false>();

// Optional properties, tuple elements and parameters contribute an actual undefined member.
expectTypeOf<IsOptional<Partial<{name: string}>['name']>>().toBe<true>();
expectTypeOf<IsOptional<Required<{name?: string}>['name']>>().toBe<false>();
expectTypeOf<IsOptional<[name?: string][0]>>().toBe<true>();
expectTypeOf<IsOptional<Parameters<(name?: string) => void>[0]>>().toBe<true>();
expectTypeOf<IsOptional<Promise<undefined>>>().toBe<false>();

function _readOptionalFlag<Value>(flag: IsOptional<Value>): boolean {
	return flag;
}

function isOptionalFlag<Value>(flag: boolean, allowed: ReadonlyArray<IsOptional<Value>>): flag is IsOptional<Value> {
	return allowed.includes(flag as IsOptional<Value>);
}

function _readCheckedOptionalFlag<Value>(flag: boolean, allowed: ReadonlyArray<IsOptional<Value>>) {
	return isOptionalFlag(flag, allowed) ? flag : undefined;
}

// A schema can expose optional-value flags without widening its inferred fields.
declare function optionalFields<const Model extends object>(model: Model): {readonly [Key in keyof Model]: IsOptional<Model[Key]>};
const optionalFieldFlags = optionalFields({name: 'session', cleared: undefined, active: true});
expectTypeOf(optionalFieldFlags).toBe<{readonly name: false; readonly cleared: true; readonly active: false}>();

// Property presence and an undefined member are separate questions.
expectTypeOf<IsOptional<{name: string | undefined}['name']>>().toBe<true>();
expectTypeOf<IsOptional<Required<{name?: never}>['name']>>().toBe<false>();
expectTypeOf<IsOptional<Required<{name?: undefined}>['name']>>().toBe<true>();

function _makeOptionalFlag<Value>(flag: IsOptional<Value>): {readonly optional: IsOptional<Value>} {
	return {optional: flag};
}
