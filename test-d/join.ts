import {expectError, expectType} from 'tsd';
import type {Join} from '../index';

// General use.
const generalTestVariantMixed: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
const generalTestVariantOnlyStrings: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz';
const generalTestVariantOnlyNumbers: Join<[1, 2, 3], '.'> = '1.2.3';
expectType<'foo.0.baz'>(generalTestVariantMixed);
expectType<'1.2.3'>(generalTestVariantOnlyNumbers);
expectType<'foo.bar.baz'>(generalTestVariantOnlyStrings);
expectError<'foo'>(generalTestVariantOnlyStrings);
expectError<'foo.bar'>(generalTestVariantOnlyStrings);
expectError<'foo.bar.ham'>(generalTestVariantOnlyStrings);

// Empty string delimiter.
const emptyDelimiter: Join<['foo', 'bar', 'baz'], ''> = 'foobarbaz';
expectType<'foobarbaz'>(emptyDelimiter);
expectError<'foo.bar.baz'>(emptyDelimiter);

// Empty input.
const emptyInput: Join<[], '.'> = '';
expectType<''>(emptyInput);
expectError<'foo'>(emptyInput);
