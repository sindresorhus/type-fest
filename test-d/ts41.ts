// Ensure that TypeScript 4.1 types are available.
import {CamelCase} from '..';
import {expectType} from 'tsd';

const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectType<CamelCase<'FooBar'>>(camelFromPascal);
