import {expectTypeOf} from 'nz';
import type {Includes} from '../index.d.ts';

declare const includesEmptyArray: Includes<[], 'abc'>;
expectTypeOf(includesEmptyArray).toBe<false>();

declare const includesSingleItemArray: Includes<['colors'], 'colors'>;
expectTypeOf(includesSingleItemArray).toBe<true>();

const readonlyArray = ['a', 'b', 'c'] as const;
declare const includesReadonlyArray: Includes<typeof readonlyArray, 'a'>;
expectTypeOf(includesReadonlyArray).toBe<true>();

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
expectTypeOf(includesComplexMultiTypeArray).toBe<false>();

declare const noExtendsProblem: Includes<[boolean], true>;
expectTypeOf(noExtendsProblem).toBe<false>();

declare const objectIncludes: Includes<[{}], {a: 1}>;
expectTypeOf(objectIncludes).toBe<false>();

declare const objectIncludesPass: Includes<[{a: 1}], {a: 1}>;
expectTypeOf(objectIncludesPass).toBe<true>();

declare const nullIncludesUndefined: Includes<[null], undefined>;
expectTypeOf(nullIncludesUndefined).toBe<false>();

declare const nullIncludesNullPass: Includes<[null], null>;
expectTypeOf(nullIncludesNullPass).toBe<true>();

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
expectTypeOf(includesLeadingRest).toBe<true>();

declare const includesLeadingRestMultiple: Includes<[...string[], 1, 2, 3], 1>;
expectTypeOf(includesLeadingRestMultiple).toBe<true>();

declare const excludesLeadingRest: Includes<[...string[], 1], 2>;
expectTypeOf(excludesLeadingRest).toBe<false>();

declare const includesLeadingRestReadonly: Includes<readonly [...string[], 'a'], 'a'>;
expectTypeOf(includesLeadingRestReadonly).toBe<true>();

// `[...string[]]` is just `string[]`, which has no fixed elements, so `'a'` is compared against the element type `string` and may or may not be present.
declare const leadingRestOnly: Includes<[...string[]], 'a'>;
expectTypeOf(leadingRestOnly).toBe<boolean>();

// An array of unknown length has no elements to walk, so the item is compared against the element type.
declare const includesVariableLength: Includes<string[], string>;
expectTypeOf(includesVariableLength).toBe<true>();

declare const excludesVariableLength: Includes<string[], number>;
expectTypeOf(excludesVariableLength).toBe<false>();

declare const partiallyMatchesVariableLength: Includes<Array<string | number>, string>;
expectTypeOf(partiallyMatchesVariableLength).toBe<boolean>();

declare const includesVariableLengthNumber: Includes<readonly number[], 1>;
expectTypeOf(includesVariableLengthNumber).toBe<boolean>();

// A tuple whose first element is optional still has that element, so the search must reach it instead of stopping at the end.
declare const includesOptionalTail: Includes<[1, 2?], 2>;
expectTypeOf(includesOptionalTail).toBe<true>();

// Every element of the tuple is known, so a missing item is definitively absent.
declare const excludesMissingOptional: Includes<[1, 2?], 3>;
expectTypeOf(excludesMissingOptional).toBe<false>();

declare const includesOptionalTailOnly: Includes<[1, 2?], 1>;
expectTypeOf(includesOptionalTailOnly).toBe<true>();

declare const includesOptionalTailReadonly: Includes<readonly [1, 2?], 2>;
expectTypeOf(includesOptionalTailReadonly).toBe<true>();

declare const includesAllOptional: Includes<[1?, 2?, 3?], 3>;
expectTypeOf(includesAllOptional).toBe<true>();

declare const excludesFromAllOptional: Includes<[1?, 2?, 3?], 4>;
expectTypeOf(excludesFromAllOptional).toBe<false>();

// A leading rest element after optional elements has no required elements of its own.
declare const includesOptionalThenRest: Includes<[1?, 2?, ...Array<3>], 1>;
expectTypeOf(includesOptionalThenRest).toBe<boolean>();

declare const includesRestElement: Includes<[1?, 2?, ...Array<3>], 3>;
expectTypeOf(includesRestElement).toBe<boolean>();

// A fixed-length tuple can only ever hold the items it lists, so any other item is definitively absent.
declare const excludesFromFixedTuple: Includes<[1, 2, 3], 4>;
expectTypeOf(excludesFromFixedTuple).toBe<false>();

declare const excludesFromReadonlyTuple: Includes<readonly [1, 2, 3], 4>;
expectTypeOf(excludesFromReadonlyTuple).toBe<false>();

declare const excludesFromStringTuple: Includes<['a', 'b'], 'c'>;
expectTypeOf(excludesFromStringTuple).toBe<false>();

declare const excludesFromEmptyTuple: Includes<[], 'a'>;
expectTypeOf(excludesFromEmptyTuple).toBe<false>();

declare const excludesFromSingleOptional: Includes<[1?], 2>;
expectTypeOf(excludesFromSingleOptional).toBe<false>();

// A tuple with a rest element of unknown length is searched across both the rest element and the fixed part, so an item that may be in the rest element is `boolean`.
declare const includesRestAndFixed: Includes<[...string[], 1], 'a'>;
expectTypeOf(includesRestAndFixed).toBe<boolean>();

declare const excludesFromRestAndFixed: Includes<[...Array<1>, 2], 3>;
expectTypeOf(excludesFromRestAndFixed).toBe<false>();

// Every element of the tuple matches, so any other item is definitively absent.
declare const excludesFromHomogeneousTuple: Includes<[string, string], number>;
expectTypeOf(excludesFromHomogeneousTuple).toBe<false>();

// The item must match an element exactly, so a union that is not itself an element is absent.
declare const excludesUnionItem: Includes<[1, 2], 1 | 3>;
expectTypeOf(excludesUnionItem).toBe<false>();

declare const includesExactUnionItem: Includes<[1 | 3, 2], 1 | 3>;
expectTypeOf(includesExactUnionItem).toBe<true>();
