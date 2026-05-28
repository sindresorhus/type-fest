import {expectAssignable, expectNotAssignable} from 'tsd';
import type {Whitespace} from '../index.d.ts';

// Standard ASCII whitespace characters should be assignable to Whitespace
expectAssignable<Whitespace>('\t');
expectAssignable<Whitespace>('\n');
expectAssignable<Whitespace>('\r');
expectAssignable<Whitespace>(' ');

// Non-whitespace characters should not be assignable
expectNotAssignable<Whitespace>('a');
expectNotAssignable<Whitespace>('.');

// Whitespace can be used to build string manipulation types
type TrimStart<S extends string> = S extends `${Whitespace}${infer Rest}` ? TrimStart<Rest> : S;

expectAssignable<TrimStart<'  hello'>>('hello' as const);
expectAssignable<TrimStart<'\t\n foo'>>('foo' as const);
expectAssignable<TrimStart<'no-trim'>>('no-trim' as const);
