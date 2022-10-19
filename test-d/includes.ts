import {expectTypeOf} from 'expect-type';
import type {Includes} from '../index';

const includesEmptyArray: Includes<[], 'abc'> = false;
expectTypeOf(includesEmptyArray).toEqualTypeOf<false>();

const includesSingleItemArray: Includes<['colors'], 'colors'> = true;
expectTypeOf(includesSingleItemArray).toEqualTypeOf<true>();

const readonlyArray = ['a', 'b', 'c'] as const;
const includesReadonlyArray: Includes<typeof readonlyArray, 'a'> = true;
expectTypeOf(includesReadonlyArray).toEqualTypeOf<true>();

const includesComplexMultiTypeArray: Includes<[
	{
		prop: 'value';
		num: 5;
		anotherArr: [1, '5', false];
	},
	true,
	null,
	'abcd',
], 'abc'> = false;
expectTypeOf(includesComplexMultiTypeArray).toEqualTypeOf<false>();

const noExtendsProblem: Includes<[boolean], true> = false;
expectTypeOf(noExtendsProblem).toEqualTypeOf<false>();

const objectIncludes: Includes<[{}], {a: 1}> = false;
expectTypeOf(objectIncludes).toEqualTypeOf<false>();

const objectIncludesPass: Includes<[{a: 1}], {a: 1}> = true;
expectTypeOf(objectIncludesPass).toEqualTypeOf<true>();

const nullIncludesUndefined: Includes<[null], undefined> = false;
expectTypeOf(nullIncludesUndefined).toEqualTypeOf<false>();

const nullIncludesNullPass: Includes<[null], null> = true;
expectTypeOf(nullIncludesNullPass).toEqualTypeOf<true>();

// Verify that incorrect usage of `Includes` produces an error.

// @ts-expect-error
declare const missingAllParameters: Includes;

// @ts-expect-error
declare const missingItem: Includes<['my', 'array', 'has', 'stuff']>;

// @ts-expect-error
declare const badValueTypeSring: Includes<'why a string?', 5>;

// @ts-expect-error
declare const badValueTypeObject: Includes<{key: 'value'}, 7>;
