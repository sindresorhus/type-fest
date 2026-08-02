// Ensure that TypeScript 4.1 types are available.
import {expectType} from 'tsd';
import type {CamelCase} from '../index.d.ts';

const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectType<CamelCase<'FooBar'>>(camelFromPascal);
