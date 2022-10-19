import {expectTypeOf} from 'expect-type';
import type {Join} from '../index';

// General use.
const generalTestVariantMixed: Join<['foo', 0, 'baz'], '.'> = 'foo.0.baz';
const generalTestVariantOnlyStrings: Join<['foo', 'bar', 'baz'], '.'> = 'foo.bar.baz';
const generalTestVariantOnlyNumbers: Join<[1, 2, 3], '.'> = '1.2.3';
expectTypeOf(generalTestVariantMixed).toEqualTypeOf<'foo.0.baz'>();
expectTypeOf(generalTestVariantOnlyNumbers).toEqualTypeOf<'1.2.3'>();
expectTypeOf(generalTestVariantOnlyStrings).toEqualTypeOf<'foo.bar.baz'>();
expectTypeOf(generalTestVariantOnlyStrings).not.toMatchTypeOf<'foo'>();
expectTypeOf(generalTestVariantOnlyStrings).not.toMatchTypeOf<'foo.bar'>();
expectTypeOf(generalTestVariantOnlyStrings).not.toMatchTypeOf<'foo.bar.ham'>();

// Empty string delimiter.
const emptyDelimiter: Join<['foo', 'bar', 'baz'], ''> = 'foobarbaz';
expectTypeOf(emptyDelimiter).toEqualTypeOf<'foobarbaz'>();
expectTypeOf(emptyDelimiter).not.toMatchTypeOf<'foo.bar.baz'>();

// Empty input.
const emptyInput: Join<[], '.'> = '';
expectTypeOf(emptyInput).toEqualTypeOf<''>();
expectTypeOf(emptyInput).not.toMatchTypeOf<'foo'>();
