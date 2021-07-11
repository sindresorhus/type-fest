import {Includes} from '..';
import {expectType} from 'tsd';

const includesEmptyArray: Includes<[], 'abc'> = false;
expectType<false>(includesEmptyArray);

const includesSingleItemArray: Includes<['colors'], 'colors'> = true;
expectType<true>(includesSingleItemArray);

const includesComplexMultiTypeArray: Includes<[
	{
		prop: 'value';
		num: 5;
		anotherArr: [1, '5', false];
	},
	true,
	null,
	'abcd'
], 'abc'> = false;
expectType<false>(includesComplexMultiTypeArray);

const noExtendsProblem: Includes<[boolean], true> = false;
expectType<false>(noExtendsProblem);

// @ts-expect-error
const noArgsIncludes: Includes<> = false;

// @ts-expect-error
const oneArgIncludes: Includes<['my', 'array', 'has', 'stuff']> = false;

// @ts-expect-error
const nonArrayPassed: Includes<'why a string?', 5> = false;

// @ts-expect-error
const objectPassed: Includes<{ key: 'value' }, 7> = false;
