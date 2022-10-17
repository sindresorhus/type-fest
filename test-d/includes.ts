import {expectError, expectType} from 'tsd';
import type {Includes} from '../index';

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

declare const anything: any;

// Verify that incorrect usage of `Includes` produces an error.

// Missing all generic parameters.
expectError<Includes>(anything);

// Missing `Item` generic parameter.
expectError<Includes<['my', 'array', 'has', 'stuff']>>(anything);

// Value generic parameter is a string not an array.
expectError<Includes<'why a string?', 5>>(anything);

// Value generic parameter is an object not an array.
expectError<Includes<{key: 'value'}, 7>>(anything);
