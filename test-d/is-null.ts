import {expectTypeOf} from 'nz';
import type {If, IsNull} from '../index.d.ts';

// https://www.typescriptlang.org/docs/handbook/type-compatibility.html
expectTypeOf<IsNull<null>>().toBe<true>();
expectTypeOf<IsNull<any>>().toBe<false>();
// `never` is not `null`, and `IsNullable<never>` and `IsNullable<string & null>` are both `false` for the same reason, so the two must agree here too.
expectTypeOf<IsNull<never>>().toBe<false>();
expectTypeOf<IsNull<string & null>>().toBe<false>();
expectTypeOf<IsNull<undefined>>().toBe<false>(); // Depends on `strictNullChecks`
expectTypeOf<IsNull<unknown>>().toBe<false>();
expectTypeOf<IsNull<void>>().toBe<false>();
expectTypeOf<IsNull<{}>>().toBe<false>();

// A union that also contains other types is not `null`.
expectTypeOf<IsNull<string | null>>().toBe<false>();
expectTypeOf<IsNull<null | undefined>>().toBe<false>();

// A union or intersection that normalizes to `any` is not specifically `null`.
expectTypeOf<IsNull<null | any>>().toBe<false>();
expectTypeOf<IsNull<null & any>>().toBe<false>();
expectTypeOf<IsNull<null | never>>().toBe<true>();
expectTypeOf<IsNull<null & unknown>>().toBe<true>();

// Rejecting `any` selects the else branch rather than preserving both branches.
expectTypeOf<If<IsNull<any>, 'null', 'other'>>().toBe<'other'>();

// Only fields whose entire value type is `null` receive a fallback.
type NullFallbacks<Value> = {
	[Key in keyof Value]: If<IsNull<Value[Key]>, 'missing', Value[Key]>;
};

expectTypeOf<NullFallbacks<{
	empty: null;
	untyped: any;
	unknown: unknown;
	missing: never;
	optional?: null;
	nullable: string | null;
}>>().toBe<{
	empty: 'missing';
	untyped: any;
	unknown: unknown;
	missing: never;
	optional?: null;
	nullable: string | null;
}>();
