import {expectType, expectAssignable, expectNotType, expectNotAssignable} from 'tsd';
import type {LiteralUnion, NegativeInfinity, PositiveInfinity} from '../index.d.ts';

type Pet = LiteralUnion<'dog' | 'cat', string>;
//	  ^?

// Basic literal + string
expectAssignable<Pet>('');
expectAssignable<Pet>('dog');
expectAssignable<Pet>('cat');
expectAssignable<Pet>('parrot');
expectAssignable<Pet>('any string');
expectAssignable<Pet>(String('hello'));

// Should not accept non-string values
expectNotAssignable<Pet>(123);
expectNotAssignable<Pet>(true);
expectNotAssignable<Pet>({});

// Structural behavior
expectNotType<string>({} as Pet); // Should not be `string`
expectNotType<(string & {})>({} as Pet); // Should not be just `(string & {})`
expectType<(string & {}) | 'dog' | 'cat'>({} as Pet);
expectType<(string & Record<never, never>) | 'dog' | 'cat'>({} as Pet);

// Auto-complete (manual check)
// Start typing in editor to verify autocompletion shows `'dog' | 'cat'`
const pet: Pet = '';

// Basic literal + number
type Numeric = LiteralUnion<0 | 1, number>;
//	  ^?

expectAssignable<Numeric>({} as PositiveInfinity);
expectAssignable<Numeric>({} as NegativeInfinity);
expectAssignable<Numeric>(123_456);
expectAssignable<Numeric>(Number(1));
expectAssignable<Numeric>(Number.NaN);
expectAssignable<Numeric>(Number.POSITIVE_INFINITY);

// Should not accept non-number values
expectNotAssignable<Numeric>('string');
expectNotAssignable<Numeric>(true);
expectNotAssignable<Numeric>({});

// Structural behavior
expectNotType<number>({} as Numeric); // Should not be `number`
expectNotType<(number & {})>({} as Numeric); // Should not be just `(number & {})`
expectType<(number & {}) | 0 | 1>({} as Numeric);
expectType<(number & Record<never, never>) | 0 | 1>({} as Numeric);

// Auto-complete (manual check)
// Start typing in editor to verify autocompletion shows `0 | 1`
const numeric: Numeric = 0;
