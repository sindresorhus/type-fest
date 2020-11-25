// Ensure that TypeScript 4.1 methods are available.
import {CamelCase} from '..';
import {expectType} from 'tsd';

const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectType<CamelCase<'FooBar'>>(camelFromPascal);
