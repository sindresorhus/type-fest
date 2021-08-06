// Ensure that TypeScript 4.1 types are available.
import {expectType} from 'tsd';
import {CamelCase} from '../index';

const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectType<CamelCase<'FooBar'>>(camelFromPascal);
