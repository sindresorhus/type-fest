import {expectTypeOf} from 'nz';
import type {Join, Opaque, StringRepeat, Tagged, TupleOf} from '../index.d.ts';

// General use.
const generalTestVariantMixed: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
const generalTestVariantOnlyStrings: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz';
const generalTestVariantOnlyNumbers: Join<[1, 2, 3], '.'> = '1.2.3';
const generalTestVariantOnlyBigints: Join<[1n, 2n, 3n], '.'> = '1.2.3';
const generalTestVariantOnlyBooleans: Join<[true, false, true], '.'> = 'true.false.true';
const generalTestVariantOnlyNullish: Join<[undefined, null, undefined], '.'> = '..';
const generalTestVariantNullish: Join<['foo', undefined, 'baz', null, 'xyz'], '.'> = 'foo..baz..xyz';
expectTypeOf(generalTestVariantMixed).toBe<'foo.0.baz'>();
expectTypeOf(generalTestVariantOnlyStrings).toBe<'foo.bar.baz'>();
expectTypeOf(generalTestVariantOnlyNumbers).toBe<'1.2.3'>();
expectTypeOf(generalTestVariantOnlyBigints).toBe<'1.2.3'>();
expectTypeOf(generalTestVariantOnlyBooleans).toBe<'true.false.true'>();
expectTypeOf(generalTestVariantOnlyNullish).toBe<'..'>();
expectTypeOf(generalTestVariantNullish).toBe<'foo..baz..xyz'>();

expectTypeOf(generalTestVariantOnlyStrings).not.toBeAssignableTo<'foo'>();
expectTypeOf(generalTestVariantOnlyStrings).not.toBeAssignableTo<'foo.bar'>();
expectTypeOf(generalTestVariantOnlyStrings).not.toBeAssignableTo<'foo.bar.ham'>();

// Empty string delimiter.
const emptyDelimiter: Join<['foo', 'bar', 'baz'], ''> = 'foobarbaz';
expectTypeOf(emptyDelimiter).toBe<'foobarbaz'>();
expectTypeOf(emptyDelimiter).not.toBeAssignableTo<'foo.bar.baz'>();

// Empty input.
const emptyInput: Join<[], '.'> = '';
expectTypeOf(emptyInput).toBe<''>();
expectTypeOf(emptyInput).not.toBeAssignableTo<'foo'>();

// Single input with string[].
const singleStringArray = ['test'];
const singleInput: Join<typeof singleStringArray, '.'> = 'test';
expectTypeOf(singleInput).toBe<string>();
expectTypeOf(singleInput).not.toBeAssignableTo<'test'>();

// Single input with const tuple.
const singleTuple = ['test'] as const;
const singleTupleJoined: Join<typeof singleTuple, '.'> = 'test';
expectTypeOf(singleTupleJoined).toBe<'test'>();
expectTypeOf(singleTupleJoined).not.toBeAssignableTo<'test.'>();

// Typeof of const tuple.
const tuple = ['foo', 'bar', 'baz'] as const;
const joinedTuple: Join<typeof tuple, ','> = 'foo,bar,baz';
expectTypeOf(joinedTuple).toBe<'foo,bar,baz'>();

// Typeof of const empty tuple.
const emptyTuple = [] as const;
const joinedEmptyTuple: Join<typeof emptyTuple, ','> = '';
expectTypeOf(joinedEmptyTuple).toBe<''>();

// Typeof of string[].
const stringArray = ['foo', 'bar', 'baz'];
const joinedStringArray: Join<typeof stringArray, ','> = '';
expectTypeOf(joinedStringArray).toBe<string>();
expectTypeOf(joinedStringArray).not.toBeAssignableTo<'foo,bar,baz'>();

// Partial tuple shapes (rest param last).
const prefixTuple: ['prefix', ...string[]] = ['prefix', 'item1', 'item2'];
const joinedPrefixTuple: Join<typeof prefixTuple, '.'> = 'prefix.item1.item2';
expectTypeOf(joinedPrefixTuple).toBe<`prefix.${string}`>();

// Partial tuple shapes (rest param first).
const suffixTuple: [...string[], 'suffix'] = ['item1', 'item2', 'suffix'];
const joinedSuffixTuple: Join<typeof suffixTuple, '.'> = 'item1.item2.suffix';
expectTypeOf(joinedSuffixTuple).toBe<`${string}.suffix`>();

// Tuple with optional elements.
const optionalTuple: ['hello' | undefined, 'world' | undefined] = ['hello', undefined];
const joinedOptionalTuple: Join<typeof optionalTuple, '.'> = 'hello.';
expectTypeOf(joinedOptionalTuple).toBe<'hello.'>();

// A rest element can be empty, so it does not always introduce a separator.
expectTypeOf<'prefix'>().toBeAssignableTo<Join<['prefix', ...string[]], '.'>>();
expectTypeOf<'suffix'>().toBeAssignableTo<Join<[...string[], 'suffix'], '.'>>();
expectTypeOf<'prefix.suffix'>().toBeAssignableTo<Join<['prefix', ...string[], 'suffix'], '.'>>();

expectTypeOf<Join<readonly ['prefix', ...string[]], '.'>>().toBe<'prefix' | `prefix.${string}`>();
expectTypeOf<Join<readonly [...string[], 'suffix'], '.'>>().toBe<'suffix' | `${string}.suffix`>();
expectTypeOf<Join<['prefix', ...string[], 'suffix'], '.'>>().toBe<'prefix.suffix' | `prefix.${string}.suffix`>();
expectTypeOf<Join<['a', 'b', ...number[]], ':'>>().toBe<'a:b' | `a:b:${string}`>();
expectTypeOf<Join<[...number[], 'a', 'b'], ':'>>().toBe<'a:b' | `${string}:a:b`>();
expectTypeOf<Join<['', ...string[]], '.'>>().toBe<'' | `.${string}`>();
expectTypeOf<Join<[...string[], null], '.'>>().toBe<'' | `${string}.`>();
expectTypeOf<Join<['prefix', ...string[]], ''>>().toBe<`prefix${string}`>();
expectTypeOf<Join<[...string[], 'suffix'], ''>>().toBe<`${string}suffix`>();
expectTypeOf<Join<['prefix', ...string[]], '.'>>().not.toBeAssignableTo<'prefix'>();
expectTypeOf<'prefixtail'>().not.toBeAssignableTo<Join<['prefix', ...string[]], '.'>>();
expectTypeOf<'tailsuffix'>().not.toBeAssignableTo<Join<[...string[], 'suffix'], '.'>>();

// Required elements still introduce a separator even when their string value is empty.
expectTypeOf<Join<['prefix', ...string[], null], '.'>>().toBe<'prefix.' | `prefix.${string}.`>();
expectTypeOf<Join<['a', ...string[], 'b', 'c'], '.'>>().toBe<'a.b.c' | `a.${string}.b.c`>();

// The separator is selected once for the whole join, not independently between each pair.
expectTypeOf<Join<[1, 2, 3], '.' | '-'>>().toBe<'1.2.3' | '1-2-3'>();
expectTypeOf<'1.2-3'>().not.toBeAssignableTo<Join<[1, 2, 3], '.' | '-'>>();
expectTypeOf<'1-2.3'>().not.toBeAssignableTo<Join<[1, 2, 3], '.' | '-'>>();
// @ts-expect-error
const mixedDelimiter: Join<[1, 2, 3], '.' | '-'> = '1.2-3';

expectTypeOf<Join<readonly [1, 2, 3, 4], '.' | '-'>>().toBe<'1.2.3.4' | '1-2-3-4'>();
expectTypeOf<'1.2.3-4'>().not.toBeAssignableTo<Join<[1, 2, 3, 4], '.' | '-'>>();
expectTypeOf<'1-2.3-4'>().not.toBeAssignableTo<Join<[1, 2, 3, 4], '.' | '-'>>();
expectTypeOf<Join<['a', 'b', 'c'], '' | ':' | '--'>>().toBe<'abc' | 'a:b:c' | 'a--b--c'>();
expectTypeOf<Join<[null, undefined, 1], '.' | '-'>>().toBe<'..1' | '--1'>();
expectTypeOf<Join<[true, 2n, 'end'], '.' | '-'>>().toBe<'true.2.end' | 'true-2-end'>();

// Element and input unions remain independent of the delimiter selection.
expectTypeOf<Join<[1 | 2, 3, 4], '.' | '-'>>().toBe<'1.3.4' | '2.3.4' | '1-3-4' | '2-3-4'>();
expectTypeOf<Join<[1, 2, 3] | ['a', 'b', 'c'], '.' | '-'>>().toBe<'1.2.3' | '1-2-3' | 'a.b.c' | 'a-b-c'>();
expectTypeOf<Join<[] | ['a'] | [1, 2, 3], '.' | '-'>>().toBe<'' | 'a' | '1.2.3' | '1-2-3'>();
expectTypeOf<Join<[], '.' | '-'>>().toBe<''>();
expectTypeOf<Join<readonly ['a'], '.' | '-'>>().toBe<'a'>();
expectTypeOf<Join<readonly [null?], '.' | '-'>>().toBe<''>();

// A rest element may be empty; fixed separators on either side still use one delimiter.
expectTypeOf<Join<['a', 'b', ...string[]], '.' | '-'>>().toBe<'a.b' | 'a-b' | `a.b.${string}` | `a-b-${string}`>();
expectTypeOf<Join<[...string[], 'a', 'b'], '.' | '-'>>().toBe<'a.b' | 'a-b' | `${string}.a.b` | `${string}-a-b`>();
expectTypeOf<Join<['a', ...string[], 'b', 'c'], '.' | '-'>>().toBe<'a.b.c' | 'a-b-c' | `a.${string}.b.c` | `a-${string}-b-c`>();
expectTypeOf<'a.b-c'>().not.toBeAssignableTo<Join<['a', ...string[], 'b', 'c'], '.' | '-'>>();

// Broad delimiters and array inputs retain their existing approximation.
expectTypeOf<Join<[1, 2, 3], string>>().toBe<`1${string}2${string}3`>();
expectTypeOf<Join<string[], '.' | '-'>>().toBe<string>();
expectTypeOf<Join<['prefix', ...string[]], string>>().toBeAssignableTo<`prefix${string}`>();
expectTypeOf<'prefix'>().toBeAssignableTo<Join<['prefix', ...string[]], string>>();
expectTypeOf<Join<never, '.' | '-'>>().toBe<never>();
expectTypeOf<Join<[1, 2, 3], never>>().toBe<never>();
expectTypeOf<Join<[], never>>().toBe<never>();
expectTypeOf<Join<['a'], never>>().toBe<never>();

// A long tuple does not hit the recursion limit.
expectTypeOf<Join<TupleOf<200, 'a'>, '.'>>().toBe<`${StringRepeat<'a.', 199>}a`>();
expectTypeOf<Join<[...TupleOf<200, 'a'>, ...string[]], '.'>>().toBe<`${StringRepeat<'a.', 199>}a` | `${StringRepeat<'a.', 200>}${string}`>();

// A long required suffix is handled as efficiently as a long prefix.
type LongJoinedPrefix = `${StringRepeat<'a.', 199>}a`;
type LongJoinedSuffix = `${StringRepeat<'b.', 199>}b`;
expectTypeOf<Join<[...string[], ...TupleOf<200, 'a'>], '.'>>().toBe<LongJoinedPrefix | `${string}.${LongJoinedPrefix}`>();
expectTypeOf<Join<[...TupleOf<200, 'a'>, ...string[], ...TupleOf<200, 'b'>], '.'>>().toBe<`${LongJoinedPrefix}.${LongJoinedSuffix}` | `${LongJoinedPrefix}.${string}.${LongJoinedSuffix}`>();
expectTypeOf<Join<readonly [...string[], ...TupleOf<200, 'a'>], '.'>>().toBe<LongJoinedPrefix | `${string}.${LongJoinedPrefix}`>();
expectTypeOf<Join<[...number[], 'a', 'b', 'c'], '.' | '-'>>().toBe<'a.b.c' | 'a-b-c' | `${string}.a.b.c` | `${string}-a-b-c`>();
expectTypeOf<Join<['prefix', ...string[], null, undefined], '.'>>().toBe<'prefix..' | `prefix.${string}..`>();
expectTypeOf<Join<['prefix', ...string[], 'a', 'b', 'c'], ''>>().toBe<`prefix${string}abc`>();
expectTypeOf<Join<[...string[], 'a', 'b', 'c'], ''>>().toBe<`${string}abc`>();
expectTypeOf<Join<[...string[], 1 | 2, true, null], ':'>>().toBe<'1:true:' | '2:true:' | `${string}:1:true:` | `${string}:2:true:`>();
expectTypeOf<'prefix.a-b-c'>().not.toBeAssignableTo<Join<['prefix', ...string[], 'a', 'b', 'c'], '.' | '-'>>();
expectTypeOf<Join<[...string[], 'a', 'b', 'c'] | ['single'], '.'>>().toBe<'a.b.c' | `${string}.a.b.c` | 'single'>();
// @ts-expect-error - Only values supported by Array#join can be joined.
type UnknownSuffix = Join<[...string[], unknown], '.'>;

// Joining stringifies branded primitive values and delimiters by their underlying values.
expectTypeOf<Join<[Tagged<'users', 'Collection'>, Tagged<42, 'Id'>], '.'>>().toBe<'users.42'>();
expectTypeOf<Join<['foo', 'bar'], Tagged<'-', 'Delimiter'>>>().toBe<'foo-bar'>();
expectTypeOf<Join<[Tagged<true, 'Flag'>, Tagged<2n, 'Id'>], ':'>>().toBe<'true:2'>();

expectTypeOf<Join<readonly [Opaque<'foo', 'Text'>, Opaque<2, 'Id'>], Opaque<':', 'Delimiter'>>>().toBe<'foo:2'>();
expectTypeOf<Join<[Tagged<Tagged<'foo', 'First'>, 'Second'>, Tagged<Tagged<2, 'First'>, 'Second'>], '.'>>().toBe<'foo.2'>();
expectTypeOf<Join<['foo' & {readonly __brand: unique symbol}, 2 & {readonly __brand: unique symbol}], '.'>>().toBe<'foo.2'>();
expectTypeOf<Join<[Tagged<'foo' | 'bar', 'Text'>, Tagged<1 | 2, 'Id'>], ':'>>().toBe<'foo:1' | 'foo:2' | 'bar:1' | 'bar:2'>();
expectTypeOf<Join<[Tagged<'foo', 'Text'>, null, undefined], Tagged<'-', 'Delimiter'>>>().toBe<'foo--'>();
expectTypeOf<Join<[Tagged<'foo', 'Text'>, Tagged<'bar', 'Text'>?], Tagged<'-', 'Delimiter'>>>().toBe<'foo' | 'foo-' | 'foo-bar'>();
expectTypeOf<Join<[Tagged<'foo', 'Text'>, ...string[]], Tagged<'.', 'Delimiter'>>>().toBe<'foo' | `foo.${string}`>();
expectTypeOf<Join<[...string[], Tagged<'bar', 'Text'>], Tagged<'.', 'Delimiter'>>>().toBe<'bar' | `${string}.bar`>();
expectTypeOf<Join<[Tagged<'foo', 'Text'>, ...string[], Tagged<'bar', 'Text'>], Tagged<'.', 'Delimiter'>>>().toBe<'foo.bar' | `foo.${string}.bar`>();
expectTypeOf<Join<['a', 'b', 'c'], Tagged<'.' | '-', 'Delimiter'>>>().toBe<'a.b.c' | 'a-b-c'>();
expectTypeOf<Join<[Tagged<'', 'Text'>, Tagged<false, 'Flag'>], Tagged<'', 'Delimiter'>>>().toBe<'false'>();
expectTypeOf<Join<[], Tagged<'-', 'Delimiter'>>>().toBe<''>();
expectTypeOf<Join<[Tagged<string, 'Text'>], '.'>>().toBe<string>();
expectTypeOf<Join<[Tagged<number, 'Id'>], '.'>>().toBe<`${number}`>();
expectTypeOf<Join<[Tagged<bigint, 'Id'>], '.'>>().toBe<`${bigint}`>();
expectTypeOf<Join<[Tagged<boolean, 'Flag'>], '.'>>().toBe<'true' | 'false'>();
expectTypeOf<Join<[any], Tagged<'.', 'Delimiter'>>>().toBe<`${any}`>();
expectTypeOf<Join<[never], Tagged<'.', 'Delimiter'>>>().toBe<never>();
expectTypeOf<Join<never, Tagged<'.', 'Delimiter'>>>().toBe<never>();
// @ts-expect-error
expectTypeOf<Join<[unknown], '.'>>();

// Optional fixed slots produce a finite set of joins, including holes before later elements.
expectTypeOf<Join<[1?, 2?], '-'>>().toBe<'' | '1' | '-' | '-2' | '1-' | '1-2'>();
type OptionalPathResult = 'start' | 'start.' | 'start.middle' | 'start..' | 'start..end' | 'start.middle.' | 'start.middle.end';
expectTypeOf<Join<readonly ['start', 'middle'?, 'end'?], '.'>>().toBe<OptionalPathResult>();
expectTypeOf<'start.invalid'>().not.toBeAssignableTo<Join<readonly ['start', 'middle'?, 'end'?], '.'>>();

declare function joinOptionalPath<const Items extends ReadonlyArray<string | number | undefined>>(items: Items): Join<Items, '.'>;
declare const optionalPathSegments: readonly ['start', 'middle'?, 'end'?];
const joinedOptionalPath = joinOptionalPath(optionalPathSegments);
expectTypeOf(joinedOptionalPath).toBe<OptionalPathResult>();

// Optional slots can be holes before a later value, rather than only a shorter suffix.
const sparseOptionalNumbers: [1?, 2?] = [];
sparseOptionalNumbers.length = 2;
sparseOptionalNumbers[1] = 2;
const sparseOptionalSegments: ['start', 'middle'?, 'end'?] = ['start'];
sparseOptionalSegments.length = 3;
sparseOptionalSegments[2] = 'end';
expectTypeOf<'-2'>().toBeAssignableTo<Join<typeof sparseOptionalNumbers, '-'>>();
expectTypeOf<'start..end'>().toBeAssignableTo<Join<typeof sparseOptionalSegments, '.'>>();
expectTypeOf<'2'>().not.toBeAssignableTo<Join<typeof sparseOptionalNumbers, '-'>>();
expectTypeOf<Join<[never?, 2?], '-'>>().toBe<'' | '-' | '-2'>();
expectTypeOf<Join<[null?, undefined?, true?], ':'>>().toBe<'' | ':' | '::' | '::true'>();
expectTypeOf<Join<['start', undefined?, 'end'?], '.'>>().toBe<'start' | 'start.' | 'start..' | 'start..end'>();

// One delimiter and one input member apply to the whole optional tuple.
expectTypeOf<'-2-3'>().toBeAssignableTo<Join<[1?, 2?, 3?], '.' | '-'>>();
expectTypeOf<'1.2-3'>().not.toBeAssignableTo<Join<[1?, 2?, 3?], '.' | '-'>>();
expectTypeOf<'1-b'>().not.toBeAssignableTo<Join<[1?, 2?] | ['a'?, 'b'?], '-'>>();
expectTypeOf<Join<[1?, ...Array<2>], '-'>>().toBe<'' | '1' | `-${string}` | `1-${string}`>();
expectTypeOf<Join<readonly [Tagged<'a', 'Part'>?, Tagged<2, 'Part'>?], Tagged<':', 'Delimiter'>>>()
	.toBe<'' | 'a' | ':' | ':2' | 'a:' | 'a:2'>();

function _readJoinedString<Items extends ReadonlyArray<string | number | bigint | boolean | null | undefined>, Delimiter extends string>(value: Join<Items, Delimiter>): string {
	return value;
}

function optionalPathWithMetadata<Metadata>(metadata: Metadata): {path: Join<['start', 'middle'?, 'end'?], '.'>; metadata: Metadata} {
	return {path: 'start', metadata};
}

expectTypeOf(optionalPathWithMetadata({id: 1} as const).metadata).toBe<{readonly id: 1}>();
expectTypeOf(optionalPathWithMetadata('draft').path).toBe<OptionalPathResult>();
