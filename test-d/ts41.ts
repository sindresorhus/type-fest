// Ensure that TypeScript 4.1 types are available.
import {expectTypeOf} from 'nz';
import type {CamelCase} from '../index.d.ts';

const camelFromPascal: CamelCase<'FooBar'> = 'fooBar';
expectTypeOf(camelFromPascal).toBe<CamelCase<'FooBar'>>();
