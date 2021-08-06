import {expectType, expectError} from 'tsd';
import {SetNonNullable} from '..';

// Update nullish fields to be non-null, leave one unchanged.
declare const variation1: SetNonNullable<
	{
		a?: string;
		b: string;
		c?: string;
		d: string | null;
		e: string | undefined;
	},
	'b' | 'c' | 'd' | 'e'
>;
expectType<{a?: string; b: string; c: string; d: string; e: string}>(
	variation1,
);

// Remove optional, undefined and null, leave one unchanged.
declare const variation2: SetNonNullable<
	{a?: number | null | undefined; b?: number | null | undefined},
	'a'
>;
expectType<{a: number; b?: number | null | undefined}>(variation2);

// Fail if type changes even if optional is right.
declare const variation3: SetNonNullable<
	{a?: number; b: string; c?: boolean | null | undefined},
	'b' | 'c'
>;
expectError<{a?: boolean; b: string; c: boolean}>(variation3);
