import {expectTypeOf} from 'nz';
import type {IsEqual, PartialDeep, Paths, ReadonlyDate, ReadonlyDeep, Tagged, WritableDeep} from '../index.d.ts';

// A `Date` is accepted where a `ReadonlyDate` is expected
expectTypeOf<Date>().toBeAssignableTo<ReadonlyDate>();

// A `ReadonlyDate` is not accepted where a `Date` is expected
expectTypeOf<ReadonlyDate>().not.toBeAssignableTo<Date>();

declare function format(date: ReadonlyDate): string;

// A function that only reads a date accepts a `Date`
expectTypeOf(format).toBeAssignableTo<(date: Date) => string>();

// Every `set*` method is removed
expectTypeOf<Extract<keyof ReadonlyDate, `set${string}`>>().toBe<never>();
expectTypeOf<IsEqual<keyof ReadonlyDate, Exclude<keyof Date, `set${string}`>>>().toBe<true>();

// The getters, the conversion methods, and the symbol methods stay
expectTypeOf<ReadonlyDate['getTime']>().toBe<Date['getTime']>();
expectTypeOf<ReadonlyDate['getTimezoneOffset']>().toBe<Date['getTimezoneOffset']>();
expectTypeOf<ReadonlyDate['toISOString']>().toBe<Date['toISOString']>();
expectTypeOf<ReadonlyDate['toJSON']>().toBe<Date['toJSON']>();
expectTypeOf<ReadonlyDate['valueOf']>().toBe<Date['valueOf']>();
expectTypeOf<ReadonlyDate[typeof Symbol.toPrimitive]>().toBe<Date[typeof Symbol.toPrimitive]>();

// The methods are readonly
declare const readonlyDate: ReadonlyDate;

// @ts-expect-error Methods are readonly.
readonlyDate.getTime = () => 0;

// `instanceof Date` narrows back to `Date`, which brings the setters back
if (readonlyDate instanceof Date) {
	expectTypeOf<typeof readonlyDate>().toBeAssignableTo<Date>();
}

// `any`, `never`, and `unknown` are not part of the type
expectTypeOf<IsEqual<ReadonlyDate, any>>().toBe<false>();
expectTypeOf<IsEqual<ReadonlyDate, never>>().toBe<false>();
expectTypeOf<IsEqual<ReadonlyDate, unknown>>().toBe<false>();

// A `ReadonlyDate` is not a `Date`
expectTypeOf<IsEqual<ReadonlyDate, Date>>().toBe<false>();

// A `Date` without its setters is not enough, because every member is required
expectTypeOf<Pick<Date, 'getTime'>>().not.toBeAssignableTo<ReadonlyDate>();
expectTypeOf<Partial<Date>>().not.toBeAssignableTo<ReadonlyDate>();

// A `ReadonlyDate` cannot be converted to a `Date` by passing it to a constructor or a parameter
// @ts-expect-error
// eslint-disable-next-line no-new
new Date(readonlyDate);

declare function takeDate(date: Date): void;

// @ts-expect-error
takeDate(readonlyDate);

// The deep types leave it as is
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlyDate>, ReadonlyDate>>().toBe<true>();
expectTypeOf<IsEqual<PartialDeep<ReadonlyDate>, ReadonlyDate>>().toBe<true>();
expectTypeOf<IsEqual<PartialDeep<{date: ReadonlyDate}>, {date?: ReadonlyDate}>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<{date: ReadonlyDate}>, {readonly date: ReadonlyDate}>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<ReadonlyDate[]>, readonly ReadonlyDate[]>>().toBe<true>();

// The deep types do not walk the methods of a `ReadonlyDate`
expectTypeOf<IsEqual<Paths<{date: ReadonlyDate}>, 'date'>>().toBe<true>();
expectTypeOf<IsEqual<Paths<ReadonlyDate>, Paths<Date>>>().toBe<true>();

// `ReadonlyDeep` turns a `Date` into a `ReadonlyDate`
expectTypeOf<IsEqual<ReadonlyDeep<Date>, ReadonlyDate>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<{date: Date}>, {readonly date: ReadonlyDate}>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<{date?: Date | null}>, {readonly date?: ReadonlyDate | null}>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<Date[]>, readonly ReadonlyDate[]>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<[Date, string]>, readonly [ReadonlyDate, string]>>().toBe<true>();

declare const readonlyDeepDate: ReadonlyDeep<{date: Date}>;
// @ts-expect-error
takeDate(readonlyDeepDate.date);

// The `keep` option keeps dates as is
expectTypeOf<IsEqual<ReadonlyDeep<{date: Date}, {keep: Date}>, {readonly date: Date}>>().toBe<true>();

// A subclass of `Date` or a tagged `Date` becomes a plain `ReadonlyDate`
class CustomDate extends Date {
	label = '';
}

expectTypeOf<IsEqual<ReadonlyDeep<CustomDate>, ReadonlyDate>>().toBe<true>();
expectTypeOf<IsEqual<ReadonlyDeep<Tagged<Date, 'CreatedAt'>>, ReadonlyDate>>().toBe<true>();

// `WritableDeep` turns a `ReadonlyDate` back into a `Date`
expectTypeOf<IsEqual<WritableDeep<ReadonlyDate>, Date>>().toBe<true>();
expectTypeOf<IsEqual<WritableDeep<{readonly date: ReadonlyDate}>, {date: Date}>>().toBe<true>();
expectTypeOf<IsEqual<WritableDeep<ReadonlyDeep<{date: Date; dates: Date[]}>>, {date: Date; dates: Date[]}>>().toBe<true>();
expectTypeOf<IsEqual<WritableDeep<{readonly date: ReadonlyDate}, {keep: ReadonlyDate}>, {date: ReadonlyDate}>>().toBe<true>();

// `WritableDeep` keeps a `Date`, its subclasses, and its tags as is
expectTypeOf<IsEqual<WritableDeep<Date>, Date>>().toBe<true>();
expectTypeOf<IsEqual<WritableDeep<CustomDate>, CustomDate>>().toBe<true>();
expectTypeOf<IsEqual<WritableDeep<Tagged<Date, 'CreatedAt'>>, Tagged<Date, 'CreatedAt'>>>().toBe<true>();

// The top types and `never` are not affected
expectTypeOf<ReadonlyDeep<any>>().toBe<any>();
expectTypeOf<ReadonlyDeep<never>>().toBe<never>();
expectTypeOf<WritableDeep<any>>().toBe<any>();
expectTypeOf<WritableDeep<never>>().toBe<never>();
