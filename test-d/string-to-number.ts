import {expectTypeOf} from 'nz';
import type {StringToNumber} from '../source/string-to-number.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

// Zero
expectTypeOf<StringToNumber<'0'>>().toBe<0>();

// Positive integers
expectTypeOf<StringToNumber<'1'>>().toBe<1>();
expectTypeOf<StringToNumber<'10'>>().toBe<10>();
expectTypeOf<StringToNumber<'1234'>>().toBe<1234>();
expectTypeOf<StringToNumber<'5000'>>().toBe<5000>();

// Negative integers
expectTypeOf<StringToNumber<'-5'>>().toBe<-5>();
expectTypeOf<StringToNumber<'-20'>>().toBe<-20>();
expectTypeOf<StringToNumber<'-567'>>().toBe<-567>();
expectTypeOf<StringToNumber<'-900'>>().toBe<-900>();

// Positive floats
expectTypeOf<StringToNumber<'0.1'>>().toBe<0.1>();
expectTypeOf<StringToNumber<'10.55'>>().toBe<10.55>();
expectTypeOf<StringToNumber<'1234.56'>>().toBe<1234.56>();

// Negative floats
expectTypeOf<StringToNumber<'-0.9'>>().toBe<-0.9>();
expectTypeOf<StringToNumber<'-3.25'>>().toBe<-3.25>();
expectTypeOf<StringToNumber<'-56.123'>>().toBe<-56.123>();

// Infinity
expectTypeOf<StringToNumber<'Infinity'>>().toBe<PositiveInfinity>();
expectTypeOf<StringToNumber<'-Infinity'>>().toBe<NegativeInfinity>();

// Unions
expectTypeOf<StringToNumber<'1' | '-1' | 'one'>>().toBe<1 | -1>();
expectTypeOf<StringToNumber<'1' | '2' | '-3' | '1.25' | '-0.650' | '10_000_000'>>().toBe<1 | 2 | -3 | 1.25>();

// Non numeric strings
expectTypeOf<StringToNumber<'two'>>().toBe<never>();
expectTypeOf<StringToNumber<'1.2.30'>>().toBe<never>();
expectTypeOf<StringToNumber<'..5'>>().toBe<never>();
expectTypeOf<StringToNumber<Uppercase<string>>>().toBe<never>();
expectTypeOf<StringToNumber<`${number}.${number}`>>().toBe<never>();

expectTypeOf<StringToNumber<'-0'>>().toBe<never>();
expectTypeOf<StringToNumber<'0.0'>>().toBe<never>();
expectTypeOf<StringToNumber<'1.0'>>().toBe<never>();
expectTypeOf<StringToNumber<'-3.50'>>().toBe<never>();
expectTypeOf<StringToNumber<'12_345'>>().toBe<never>();

// Special cases
expectTypeOf<StringToNumber<`${number}`>>().toBe<number>();
expectTypeOf<StringToNumber<string>>().toBe<number>();

// Boundary cases
expectTypeOf<StringToNumber<never>>().toBe<never>();
expectTypeOf<StringToNumber<any>>().toBe<number>();

// Parsing reads the numeric string beneath a brand and produces a plain numeric literal.
expectTypeOf<StringToNumber<Tagged<'123', 'Text'>>>().toBe<123>();
expectTypeOf<StringToNumber<Opaque<'-42', 'Text'>>>().toBe<-42>();
expectTypeOf<StringToNumber<Tagged<'1.25', 'Text'>>>().toBe<1.25>();
expectTypeOf<StringToNumber<Tagged<'0', 'Text'>>>().toBe<0>();
expectTypeOf<StringToNumber<Tagged<'-0', 'Text'>>>().toBe<never>();
expectTypeOf<StringToNumber<Tagged<'1.50', 'Text'>>>().toBe<never>();
expectTypeOf<StringToNumber<Tagged<'007', 'Text'>>>().toBe<never>();
expectTypeOf<StringToNumber<Tagged<'1' | '-2' | 'invalid', 'Text'>>>().toBe<1 | -2>();
expectTypeOf<StringToNumber<Tagged<Tagged<'42', 'Text'>, 'Validated'>>>().toBe<42>();
expectTypeOf<StringToNumber<Tagged<string, 'Text'>>>().toBe<number>();
expectTypeOf<StringToNumber<Tagged<`${number}`, 'Text'>>>().toBe<number>();
expectTypeOf<StringToNumber<Tagged<Uppercase<string>, 'Text'>>>().toBe<never>();
expectTypeOf<StringToNumber<Tagged<'Infinity', 'Text'>>>().toBe<PositiveInfinity>();
expectTypeOf<StringToNumber<Tagged<'-Infinity', 'Text'>>>().toBe<NegativeInfinity>();
expectTypeOf<StringToNumber<'42' & {readonly brand: unique symbol}>>().toBe<42>();
// @ts-expect-error - Only strings can be parsed.
type UnknownString = StringToNumber<unknown>;
