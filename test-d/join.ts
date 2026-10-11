import {expectTypeOf} from 'nz';
import type {Join} from '../index.d.ts';

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
