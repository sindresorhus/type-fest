import {expectNotAssignable, expectType} from 'tsd';
import type {Join} from '../index.d.ts';

// General use.
const generalTestVariantMixed: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
const generalTestVariantOnlyStrings: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz';
const generalTestVariantOnlyNumbers: Join<[1, 2, 3], '.'> = '1.2.3';
const generalTestVariantOnlyBigints: Join<[1n, 2n, 3n], '.'> = '1.2.3';
const generalTestVariantOnlyBooleans: Join<[true, false, true], '.'> = 'true.false.true';
const generalTestVariantOnlyNullish: Join<[undefined, null, undefined], '.'> = '..';
const generalTestVariantNullish: Join<['foo', undefined, 'baz', null, 'xyz'], '.'> = 'foo..baz..xyz';
expectType<'foo.0.baz'>(generalTestVariantMixed);
expectType<'foo.bar.baz'>(generalTestVariantOnlyStrings);
expectType<'1.2.3'>(generalTestVariantOnlyNumbers);
expectType<'1.2.3'>(generalTestVariantOnlyBigints);
expectType<'true.false.true'>(generalTestVariantOnlyBooleans);
expectType<'..'>(generalTestVariantOnlyNullish);
expectType<'foo..baz..xyz'>(generalTestVariantNullish);

expectNotAssignable<'foo'>(generalTestVariantOnlyStrings);
expectNotAssignable<'foo.bar'>(generalTestVariantOnlyStrings);
expectNotAssignable<'foo.bar.ham'>(generalTestVariantOnlyStrings);

// Empty string delimiter.
const emptyDelimiter: Join<['foo', 'bar', 'baz'], ''> = 'foobarbaz';
expectType<'foobarbaz'>(emptyDelimiter);
expectNotAssignable<'foo.bar.baz'>(emptyDelimiter);

// Empty input.
const emptyInput: Join<[], '.'> = '';
expectType<''>(emptyInput);
expectNotAssignable<'foo'>(emptyInput);

// Single input with string[].
const singleStringArray = ['test'];
const singleInput: Join<typeof singleStringArray, '.'> = 'test';
expectType<string>(singleInput);
expectNotAssignable<'test'>(singleInput);

// Single input with const tuple.
const singleTuple = ['test'] as const;
const singleTupleJoined: Join<typeof singleTuple, '.'> = 'test';
expectType<'test'>(singleTupleJoined);
expectNotAssignable<'test.'>(singleTupleJoined);

// Typeof of const tuple.
const tuple = ['foo', 'bar', 'baz'] as const;
const joinedTuple: Join<typeof tuple, ','> = 'foo,bar,baz';
expectType<'foo,bar,baz'>(joinedTuple);

// Typeof of const empty tuple.
const emptyTuple = [] as const;
const joinedEmptyTuple: Join<typeof emptyTuple, ','> = '';
expectType<''>(joinedEmptyTuple);

// Typeof of string[].
const stringArray = ['foo', 'bar', 'baz'];
const joinedStringArray: Join<typeof stringArray, ','> = '';
expectType<string>(joinedStringArray);
expectNotAssignable<'foo,bar,baz'>(joinedStringArray);

// Partial tuple shapes (rest param last).
const prefixTuple: ['prefix', ...string[]] = ['prefix', 'item1', 'item2'];
const joinedPrefixTuple: Join<typeof prefixTuple, '.'> = 'prefix.item1.item2';
expectType<`prefix.${string}`>(joinedPrefixTuple);

// Partial tuple shapes (rest param first).
const suffixTuple: [...string[], 'suffix'] = ['item1', 'item2', 'suffix'];
const joinedSuffixTuple: Join<typeof suffixTuple, '.'> = 'item1.item2.suffix';
expectType<`${string}.suffix`>(joinedSuffixTuple);

// Tuple with optional elements.
const optionalTuple: ['hello' | undefined, 'world' | undefined] = ['hello', undefined];
const joinedOptionalTuple: Join<typeof optionalTuple, '.'> = 'hello.';
expectType<'hello.'>(joinedOptionalTuple);
