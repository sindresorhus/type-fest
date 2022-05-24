import {expectType} from 'tsd';
import type {PascalCase} from '../index';

const pascalFromCamel: PascalCase<'fooBar'> = 'FooBar';
expectType<'FooBar'>(pascalFromCamel);

const pascalFromKebab: PascalCase<'foo-bar'> = 'FooBar';
expectType<'FooBar'>(pascalFromKebab);

const pascalFromComplexKebab: PascalCase<'foo-bar-abc-123'> = 'FooBarAbc123';
expectType<'FooBarAbc123'>(pascalFromComplexKebab);
