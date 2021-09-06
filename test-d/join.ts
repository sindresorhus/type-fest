import {expectError, expectType} from 'tsd';
import {Join} from '../index';

// General use.
const generalTest: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz';
const generalTestVariantWithNumbers: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
expectType<'foo.bar.baz'>(generalTest);
expectType<'foo.0.baz'>(generalTestVariantWithNumbers);
expectError<'foo'>(generalTest);
expectError<'foo.bar'>(generalTest);
expectError<'foo.bar.ham'>(generalTest);

// Empty string delimiter.
const emptyDelimiter: Join<['foo', 'bar', 'baz'], ''> = 'foobarbaz';
expectType<'foobarbaz'>(emptyDelimiter);
expectError<'foo.bar.baz'>(emptyDelimiter);

// Empty input.
const emptyInput: Join<[], '.'> = '';
expectType<''>(emptyInput);
expectError<'foo'>(emptyInput);
