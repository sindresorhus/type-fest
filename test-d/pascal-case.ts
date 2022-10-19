import {expectTypeOf} from 'expect-type';
import type {PascalCase} from '../index';

const pascalFromCamel: PascalCase<'fooBar'> = 'FooBar';
expectTypeOf(pascalFromCamel).toEqualTypeOf<'FooBar'>();

const pascalFromKebab: PascalCase<'foo-bar'> = 'FooBar';
expectTypeOf(pascalFromKebab).toEqualTypeOf<'FooBar'>();

const pascalFromComplexKebab: PascalCase<'foo-bar-abc-123'> = 'FooBarAbc123';
expectTypeOf(pascalFromComplexKebab).toEqualTypeOf<'FooBarAbc123'>();
