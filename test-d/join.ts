import {expectNotAssignable, expectType} from 'tsd';
import type {Join} from '../index';

// General use.
const generalTestVariantMixed: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
const generalTestVariantOnlyStrings: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz';
const generalTestVariantOnlyNumbers: Join<[1, 2, 3], '.'> = '1.2.3';
expectType<'foo.0.baz'>(generalTestVariantMixed);
expectType<'1.2.3'>(generalTestVariantOnlyNumbers);
expectType<'foo.bar.baz'>(generalTestVariantOnlyStrings);
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

// Typeof of string[].
const stringArray = ['foo', 'bar', 'baz'];
const joinedStringArray: Join<typeof stringArray, ','> = '';
expectType<string>(joinedStringArray);
expectNotAssignable<'foo,bar,baz'>(joinedStringArray);
