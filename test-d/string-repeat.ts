import {expectTypeOf} from 'nz';
import type {NegativeInfinity, Opaque, PositiveInfinity, StringRepeat, Tagged} from '../index.d.ts';

declare const unknown: unknown;

expectTypeOf<StringRepeat<'', 0>>().toBe<''>();
expectTypeOf(unknown as never).toBe<StringRepeat<'', -1>>();
expectTypeOf<StringRepeat<string, 0>>().toBe<''>();
expectTypeOf(unknown as never).toBe<StringRepeat<string, -1>>();
expectTypeOf<StringRepeat<'', number>>().toBe<''>();
expectTypeOf(unknown as string).toBe<StringRepeat<string, number>>();
expectTypeOf(unknown as string).toBe<StringRepeat<'0', number>>();
expectTypeOf(unknown as never).toBe<StringRepeat<'0', -1>>();
expectTypeOf<StringRepeat<'0', 0>>().toBe<''>();
expectTypeOf<StringRepeat<'0', 1>>().toBe<'0'>();
expectTypeOf<StringRepeat<'0', 5>>().toBe<'00000'>();
expectTypeOf<StringRepeat<'012345-', 0>>().toBe<''>();
expectTypeOf<StringRepeat<'012345-', 1>>().toBe<'012345-'>();
expectTypeOf<StringRepeat<'012345-', 5>>().toBe<'012345-012345-012345-012345-012345-'>();

// Non literal strings
expectTypeOf(unknown as string).toBe<StringRepeat<string, 2>>();
expectTypeOf(unknown as `abc${string}abc${string}`).toBe<StringRepeat<`abc${string}`, 2>>();
expectTypeOf(unknown as `${Uppercase<string>}${Uppercase<string>}`).toBe<StringRepeat<Uppercase<string>, 2>>();

// Fractional counts
expectTypeOf(unknown as '0000000').toBe<StringRepeat<'0', 7.5>>();
expectTypeOf(unknown as 'pipipi').toBe<StringRepeat<'pi', 3.14>>();

// Negative counts truncate toward zero, so only a count that truncates to a negative integer is a `RangeError`. A count between -1 and 0 truncates to `-0`, which gives an empty string.
expectTypeOf(unknown as '').toBe<StringRepeat<'0', -0.5>>();
expectTypeOf(unknown as '').toBe<StringRepeat<'0', -0.9>>();
expectTypeOf(unknown as '').toBe<StringRepeat<'pi', -0.5>>();
expectTypeOf(unknown as '').toBe<StringRepeat<'', -0.5>>();
expectTypeOf(unknown as never).toBe<StringRepeat<'0', -1.5>>();
expectTypeOf(unknown as never).toBe<StringRepeat<'0', -2.9>>();

// Counts in scientific notation
expectTypeOf(unknown as '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000').toBe<StringRepeat<'0', 1e2>>();
expectTypeOf(unknown as '000000000000000000000000000000').toBe<StringRepeat<'0', 3e1>>();
expectTypeOf(unknown as '').toBe<StringRepeat<'0', 1e-5>>();
expectTypeOf(unknown as '').toBe<StringRepeat<'0', 2e-6>>();

// Counts whose string representation is in scientific notation
expectTypeOf(unknown as '').toBe<StringRepeat<'0', 1e-7>>();
expectTypeOf(unknown as string).toBe<StringRepeat<'0', 2e21>>();
expectTypeOf(unknown as string).toBe<StringRepeat<'0', 1e21>>();
expectTypeOf(unknown as string).toBe<StringRepeat<'0', 1_000_000_000_000_000_000_000>>();
expectTypeOf(unknown as '').toBe<StringRepeat<'0', 0.0000001>>();

// Union cases
expectTypeOf(unknown as '00000' | '11111').toBe<StringRepeat<'0' | '1', 5>>();
expectTypeOf(unknown as '0000' | '00000').toBe<StringRepeat<'0', 4 | 5>>();
expectTypeOf(unknown as '0000' | '00000' | '1111' | '11111').toBe<StringRepeat<'0' | '1', 4 | 5>>();
expectTypeOf(unknown as '' | '00').toBe<StringRepeat<'0', 1e-7 | 2>>();
expectTypeOf(unknown as string).toBe<StringRepeat<'0', 1e-7 | 2e21>>();
expectTypeOf(unknown as string).toBe<StringRepeat<'0', 1e21 | 3>>();

// Recursion depth at which a non-tail recursive implementation starts to fail.
const fiftyZeroes = '00000000000000000000000000000000000000000000000000';
expectTypeOf<StringRepeat<'0', 50>>().toBe<typeof fiftyZeroes>();

// Maximum allowed recursion depth for a tail recursive implementation.
// eslint-disable-next-line @stylistic/max-len
const nineHundredNinetyNineZeroes = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
expectTypeOf<StringRepeat<'0', 999>>().toBe<typeof nineHundredNinetyNineZeroes>();

// eslint-disable-next-line @stylistic/max-len
const threeThousandZeroes = '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
expectTypeOf<StringRepeat<'0', 3000>>().toBe<typeof threeThousandZeroes>();

// A negative count below `1e-6` is one TypeScript prints in scientific notation, so the check for a plain `-0.` prefix does not see it. The runtime truncates it to `-0` all the same, so it is an empty string and not the `RangeError` a count that truncates to a negative integer is.
expectTypeOf(unknown as '').toBe<StringRepeat<'0', -1e-7>>();
expectTypeOf(unknown as '').toBe<StringRepeat<'pi', -1e-21>>();

// Positive counts below one truncate to zero even when TypeScript prints an exponent.
expectTypeOf<StringRepeat<'abc', 1e-7>>().toBe<''>();
expectTypeOf<StringRepeat<string, 5e-324>>().toBe<''>();
expectTypeOf<StringRepeat<'a' | 'b', 2 | 1e-21>>().toBe<'' | 'aa' | 'bb'>();
expectTypeOf<StringRepeat<'abc', 9.99999e-7>>().toBe<''>();
expectTypeOf<StringRepeat<'abc', 1e-6>>().toBe<''>();
expectTypeOf<StringRepeat<'abc', 0.999999>>().toBe<''>();
expectTypeOf<StringRepeat<'abc', 1>>().toBe<'abc'>();
expectTypeOf<StringRepeat<any, 1e-7>>().toBe<''>();
expectTypeOf<StringRepeat<'abc', never>>().toBe<never>();

// An infinite count throws even when the input is empty.
expectTypeOf<StringRepeat<'abc', PositiveInfinity>>().toBe<never>();
expectTypeOf<StringRepeat<'', PositiveInfinity>>().toBe<never>();
expectTypeOf<StringRepeat<string, PositiveInfinity>>().toBe<never>();
expectTypeOf<StringRepeat<'abc', NegativeInfinity>>().toBe<never>();
expectTypeOf<StringRepeat<'', NegativeInfinity>>().toBe<never>();
expectTypeOf<StringRepeat<'abc', 1 | PositiveInfinity | NegativeInfinity>>().toBe<'abc'>();
expectTypeOf<StringRepeat<any, PositiveInfinity>>().toBe<never>();
expectTypeOf<StringRepeat<never, PositiveInfinity>>().toBe<never>();

// Input brands describe the original primitive, not the string produced by repeating it.
expectTypeOf<StringRepeat<Tagged<'x', 'Text'>, 2>>().toBe<'xx'>();
expectTypeOf<StringRepeat<'ab', Tagged<3, 'Count'>>>().toBe<'ababab'>();
expectTypeOf<StringRepeat<'ab', Tagged<-0.9, 'Count'>>>().toBe<''>();
expectTypeOf<StringRepeat<'ab', Tagged<1e-7, 'Count'>>>().toBe<''>();
expectTypeOf<StringRepeat<Opaque<'ab', 'Text'>, Opaque<2, 'Count'>>>().toBe<'abab'>();
expectTypeOf<StringRepeat<Tagged<Tagged<'ab', 'First'>, 'Second'>, Tagged<Tagged<2, 'First'>, 'Second'>>>().toBe<'abab'>();
expectTypeOf<StringRepeat<'ab' & {readonly __brand: unique symbol}, 2 & {readonly __brand: unique symbol}>>().toBe<'abab'>();
expectTypeOf<StringRepeat<Tagged<'x' | 'y', 'Text'>, Tagged<1 | 2, 'Count'>>>().toBe<'x' | 'y' | 'xx' | 'yy'>();

// The original count contract still applies to branded values.
expectTypeOf<StringRepeat<'ab', Tagged<0, 'Count'>>>().toBe<''>();
expectTypeOf<StringRepeat<'ab', Tagged<2.9, 'Count'>>>().toBe<'abab'>();
expectTypeOf<StringRepeat<'ab', Tagged<0.9, 'Count'>>>().toBe<''>();
expectTypeOf<StringRepeat<'ab', Tagged<-2, 'Count'>>>().toBe<never>();
expectTypeOf<StringRepeat<'ab', Tagged<-2.9, 'Count'>>>().toBe<never>();
expectTypeOf<StringRepeat<'ab', Tagged<-1e-7, 'Count'>>>().toBe<''>();
expectTypeOf<StringRepeat<'ab', Tagged<2e21, 'Count'>>>().toBe<string>();
expectTypeOf<StringRepeat<'ab', Tagged<number, 'Count'>>>().toBe<string>();
expectTypeOf<StringRepeat<Tagged<'', 'Text'>, Tagged<2, 'Count'>>>().toBe<''>();
expectTypeOf<StringRepeat<Tagged<string, 'Text'>, 2>>().toBe<string>();
expectTypeOf<StringRepeat<Tagged<'ab', 'Text'>, PositiveInfinity>>().toBe<never>();
expectTypeOf<StringRepeat<'ab', Tagged<PositiveInfinity, 'Count'>>>().toBe<never>();
expectTypeOf<StringRepeat<'ab', Tagged<NegativeInfinity, 'Count'>>>().toBe<never>();
expectTypeOf<StringRepeat<never, Tagged<2, 'Count'>>>().toBe<never>();
expectTypeOf<StringRepeat<Tagged<'x', 'Text'>, never>>().toBe<never>();

expectTypeOf<StringRepeat<any, Tagged<0, 'Count'>>>().toBe<''>();
expectTypeOf<StringRepeat<'x', any>>().toBe<string>();
// @ts-expect-error
expectTypeOf<StringRepeat<unknown, 2>>();
// @ts-expect-error
expectTypeOf<StringRepeat<'x', unknown>>();
