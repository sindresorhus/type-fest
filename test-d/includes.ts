import {expectType} from 'tsd';
import type {Includes} from '../index.d.ts';

declare const includesEmptyArray: Includes<[], 'abc'>;
expectType<false>(includesEmptyArray);

declare const includesSingleItemArray: Includes<['colors'], 'colors'>;
expectType<true>(includesSingleItemArray);

const readonlyArray = ['a', 'b', 'c'] as const;
declare const includesReadonlyArray: Includes<typeof readonlyArray, 'a'>;
expectType<true>(includesReadonlyArray);

declare const includesComplexMultiTypeArray: Includes<[
	{
		prop: 'value';
		num: 5;
		anotherArr: [1, '5', false];
	},
	true,
	null,
	'abcd',
], 'abc'>;
expectType<false>(includesComplexMultiTypeArray);

declare const noExtendsProblem: Includes<[boolean], true>;
expectType<false>(noExtendsProblem);

declare const objectIncludes: Includes<[{}], {a: 1}>;
expectType<false>(objectIncludes);

declare const objectIncludesPass: Includes<[{a: 1}], {a: 1}>;
expectType<true>(objectIncludesPass);

declare const nullIncludesUndefined: Includes<[null], undefined>;
expectType<false>(nullIncludesUndefined);

declare const nullIncludesNullPass: Includes<[null], null>;
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

// A tuple with a leading rest element, such as `[...string[], 1]`, has no required first element, so the required elements must be searched from the other end.
declare const includesLeadingRest: Includes<[...string[], 1], 1>;
expectType<true>(includesLeadingRest);

declare const includesLeadingRestMultiple: Includes<[...string[], 1, 2, 3], 1>;
expectType<true>(includesLeadingRestMultiple);

declare const excludesLeadingRest: Includes<[...string[], 1], 2>;
expectType<false>(excludesLeadingRest);

declare const includesLeadingRestReadonly: Includes<readonly [...string[], 'a'], 'a'>;
expectType<true>(includesLeadingRestReadonly);

// `[...string[]]` is just `string[]`, which has no fixed elements, so `'a'` is compared against the element type `string` and may or may not be present.
declare const leadingRestOnly: Includes<[...string[]], 'a'>;
expectType<boolean>(leadingRestOnly);

// An array of unknown length has no elements to walk, so the item is compared against the element type.
declare const includesVariableLength: Includes<string[], string>;
expectType<true>(includesVariableLength);

declare const excludesVariableLength: Includes<string[], number>;
expectType<false>(excludesVariableLength);

declare const partiallyMatchesVariableLength: Includes<Array<string | number>, string>;
expectType<boolean>(partiallyMatchesVariableLength);

declare const includesVariableLengthNumber: Includes<readonly number[], 1>;
expectType<boolean>(includesVariableLengthNumber);

// A tuple whose first element is optional still has that element, so the search must reach it instead of stopping at the end.
declare const includesOptionalTail: Includes<[1, 2?], 2>;
expectType<true>(includesOptionalTail);

// Every element of the tuple is known, so a missing item is definitively absent.
declare const excludesMissingOptional: Includes<[1, 2?], 3>;
expectType<false>(excludesMissingOptional);

declare const includesOptionalTailOnly: Includes<[1, 2?], 1>;
expectType<true>(includesOptionalTailOnly);

declare const includesOptionalTailReadonly: Includes<readonly [1, 2?], 2>;
expectType<true>(includesOptionalTailReadonly);

declare const includesAllOptional: Includes<[1?, 2?, 3?], 3>;
expectType<true>(includesAllOptional);

declare const excludesFromAllOptional: Includes<[1?, 2?, 3?], 4>;
expectType<false>(excludesFromAllOptional);

// A leading rest element after optional elements has no required elements of its own.
declare const includesOptionalThenRest: Includes<[1?, 2?, ...Array<3>], 1>;
expectType<boolean>(includesOptionalThenRest);

declare const includesRestElement: Includes<[1?, 2?, ...Array<3>], 3>;
expectType<boolean>(includesRestElement);

// A fixed-length tuple can only ever hold the items it lists, so any other item is definitively absent.
declare const excludesFromFixedTuple: Includes<[1, 2, 3], 4>;
expectType<false>(excludesFromFixedTuple);

declare const excludesFromReadonlyTuple: Includes<readonly [1, 2, 3], 4>;
expectType<false>(excludesFromReadonlyTuple);

declare const excludesFromStringTuple: Includes<['a', 'b'], 'c'>;
expectType<false>(excludesFromStringTuple);

declare const excludesFromEmptyTuple: Includes<[], 'a'>;
expectType<false>(excludesFromEmptyTuple);

declare const excludesFromSingleOptional: Includes<[1?], 2>;
expectType<false>(excludesFromSingleOptional);

// A tuple with a rest element of unknown length is searched across both the rest element and the fixed part, so an item that may be in the rest element is `boolean`.
declare const includesRestAndFixed: Includes<[...string[], 1], 'a'>;
expectType<boolean>(includesRestAndFixed);

declare const excludesFromRestAndFixed: Includes<[...Array<1>, 2], 3>;
expectType<false>(excludesFromRestAndFixed);

// Every element of the tuple matches, so any other item is definitively absent.
declare const excludesFromHomogeneousTuple: Includes<[string, string], number>;
expectType<false>(excludesFromHomogeneousTuple);

// The item must match an element exactly, so a union that is not itself an element is absent.
declare const excludesUnionItem: Includes<[1, 2], 1 | 3>;
expectType<false>(excludesUnionItem);

declare const includesExactUnionItem: Includes<[1 | 3, 2], 1 | 3>;
expectType<true>(includesExactUnionItem);
