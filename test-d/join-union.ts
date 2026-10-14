import {expectTypeOf} from 'nz';
import type {JoinUnion} from '../source/join-union.d.ts';

expectTypeOf<JoinUnion<'a' | 'b'>>().toBeAssignableTo<'a,b' | 'b,a'>();
expectTypeOf<JoinUnion<1 | 2, ' | '>>().toBeAssignableTo<'1 | 2' | '2 | 1'>();
expectTypeOf<JoinUnion<'foo'>>().toBeAssignableTo<'foo'>();
expectTypeOf<JoinUnion<42>>().toBeAssignableTo<'42'>();

expectTypeOf<JoinUnion<null>>().toBeAssignableTo<''>();
expectTypeOf<JoinUnion<undefined>>().toBeAssignableTo<''>();
expectTypeOf<JoinUnion<undefined | null>>().toBeAssignableTo<','>();
expectTypeOf<JoinUnion<undefined | 2>>().toBeAssignableTo<'2,' | ',2'>();

expectTypeOf<JoinUnion<'foo' | `on${string}`>>().toBeAssignableTo<`foo,on${string}` | `on${string},foo`>();
expectTypeOf<JoinUnion<'foo' | (string & {})>>().toBeAssignableTo<`${string & {}}`>(); // Intended `foo,${string}`
// TODO: For now `UnionToTuple` does not handle 'LiteralUnions'. Will be fixed after `ExtractLiterals` type get approved.

expectTypeOf<JoinUnion<never>>().toBe<''>();
expectTypeOf<JoinUnion<never, ' + '>>().toBe<''>();

expectTypeOf<JoinUnion<'a' | 'b', '-'>>().toBeAssignableTo<'a-b' | 'b-a'>();
expectTypeOf<JoinUnion<'x' | 'y', '🔥'>>().toBeAssignableTo<'x🔥y' | 'y🔥x'>();
expectTypeOf<JoinUnion<1 | 2, ''>>().toBeAssignableTo<'12' | '21'>();

expectTypeOf<JoinUnion<boolean, ' or '>>().toBeAssignableTo<'true or false' | 'false or true'>();
