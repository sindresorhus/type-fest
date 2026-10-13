import {expectTypeOf} from 'nz';
import type {StringLength} from '../source/string-length.d.ts';
import type {StringRepeat} from '../source/string-repeat.d.ts';
import type {Tagged} from '../source/tagged.d.ts';

// Empty string
expectTypeOf<StringLength<''>>().toBe<0>();

// Literals
expectTypeOf<StringLength<'a'>>().toBe<1>();
expectTypeOf<StringLength<'abcde'>>().toBe<5>();
expectTypeOf<StringLength<'012'>>().toBe<3>();

// Non-literals
expectTypeOf<StringLength<string>>().toBe<number>();
expectTypeOf<StringLength<Uppercase<string>>>().toBe<number>();
expectTypeOf<StringLength<`${string}abc`>>().toBe<number>();
expectTypeOf<StringLength<`abc${string}`>>().toBe<number>();
expectTypeOf<StringLength<`abc${string}def`>>().toBe<number>();
expectTypeOf<StringLength<`abc${string}def${string}ij`>>().toBe<number>();

// Unions
expectTypeOf<StringLength<'abcde' | 'fgh'>>().toBe<3 | 5>();
expectTypeOf<StringLength<'abc' | Uppercase<string>>>().toBe<number>();
expectTypeOf<StringLength<`ab${string}` | `${number}`>>().toBe<number>();

// Long strings
expectTypeOf<StringLength<StringRepeat<'a', 200>>>().toBe<200>();
expectTypeOf<StringLength<StringRepeat<'a', 900>>>().toBe<900>();

// Boundary cases
expectTypeOf<StringLength<never>>().toBe<never>();
expectTypeOf<StringLength<any>>().toBe<number>();

// String brands do not change the number of characters in the input.
expectTypeOf<StringLength<Tagged<'abc', 'Text'>>>().toBe<3>();
expectTypeOf<StringLength<Tagged<'', 'Text'>>>().toBe<0>();
expectTypeOf<StringLength<Tagged<'a' | 'abc', 'Text'>>>().toBe<1 | 3>();
expectTypeOf<StringLength<Tagged<string, 'Text'>>>().toBe<number>();
expectTypeOf<StringLength<Tagged<`abc${string}`, 'Text'>>>().toBe<number>();
