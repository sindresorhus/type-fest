// Ensure that TypeScript 4.1 types are available.
import {expectTypeOf} from 'expect-type';
import type {CamelCase} from '../index';

const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectTypeOf(camelFromPascal).toEqualTypeOf<CamelCase<'FooBar'>>();
