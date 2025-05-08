import {expectType} from 'tsd';
import type {Includes} from '../index.d.ts';

const includesEmptyArray: Includes<[], 'abc'> = false;
expectType<false>(includesEmptyArray);

const includesSingleItemArray: Includes<['colors'], 'colors'> = true;
expectType<true>(includesSingleItemArray);

const readonlyArray = ['a', 'b', 'c'] as const;
const includesReadonlyArray: Includes<typeof readonlyArray, 'a'> = true;
expectType<true>(includesReadonlyArray);

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
expectType<false>(includesComplexMultiTypeArray);

const noExtendsProblem: Includes<[boolean], true> = false;
expectType<false>(noExtendsProblem);

const objectIncludes: Includes<[{}], {a: 1}> = false;
expectType<false>(objectIncludes);

const objectIncludesPass: Includes<[{a: 1}], {a: 1}> = true;
expectType<true>(objectIncludesPass);

const nullIncludesUndefined: Includes<[null], undefined> = false;
expectType<false>(nullIncludesUndefined);

const nullIncludesNullPass: Includes<[null], null> = true;
expectType<true>(nullIncludesNullPass);

// Verify that incorrect usage of `Includes` produces an error.

// Missing all generic parameters.
// @ts-expect-error
type A0 = Includes;

// Missing `Item` generic parameter.
// @ts-expect-error
type A1 = Includes<['my', 'array', 'has', 'stuff']>;

// Value generic parameter is a string not an array.
// @ts-expect-error
type A2 = Includes<'why a string?', 5>;

// Value generic parameter is an object not an array.
// @ts-expect-error
type A3 = Includes<{key: 'value'}, 7>;
