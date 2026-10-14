import {expectTypeOf} from 'nz';
import type {JoinUnion} from '../index.d.ts';

expectTypeOf<JoinUnion<'a' | 'b'>>().toBeAssignableTo<'a,b' | 'b,a'>();
expectTypeOf<JoinUnion<1 | 2, ' | '>>().toBeAssignableTo<'1 | 2' | '2 | 1'>();
expectTypeOf<JoinUnion<'foo'>>().toBe<'foo'>();
expectTypeOf<JoinUnion<42>>().toBe<'42'>();

expectTypeOf<JoinUnion<null>>().toBe<''>();
expectTypeOf<JoinUnion<undefined>>().toBe<''>();
expectTypeOf<JoinUnion<undefined | null>>().toBe<','>();
expectTypeOf<JoinUnion<undefined | 2>>().toBeAssignableTo<'2,' | ',2'>();

expectTypeOf<JoinUnion<'foo' | `on${string}`>>().toBeAssignableTo<`foo,on${string}` | `on${string},foo`>();
expectTypeOf<JoinUnion<'foo' | (string & {})>>().toBeAssignableTo<`foo,${string}` | `${string},foo`>();

expectTypeOf<JoinUnion<never>>().toBe<''>();
expectTypeOf<JoinUnion<never, ' + '>>().toBe<''>();
expectTypeOf<JoinUnion<any>>().toBe<`${any}`>();
expectTypeOf<JoinUnion<'a' | 'b' | 'c'>>().toBeAssignableTo<'a,b,c' | 'a,c,b' | 'b,a,c' | 'b,c,a' | 'c,a,b' | 'c,b,a'>();
expectTypeOf<JoinUnion<'a' | 'b'>>().not.toBeAssignableTo<'a-b' | 'b-a'>();

// @ts-expect-error
type Invalid = JoinUnion<symbol>;
// @ts-expect-error
type InvalidUnknown = JoinUnion<unknown>;

expectTypeOf<JoinUnion<'a' | 'b', '-'>>().toBeAssignableTo<'a-b' | 'b-a'>();
expectTypeOf<JoinUnion<'x' | 'y', '🔥'>>().toBeAssignableTo<'x🔥y' | 'y🔥x'>();
expectTypeOf<JoinUnion<1 | 2, ''>>().toBeAssignableTo<'12' | '21'>();

expectTypeOf<JoinUnion<boolean, ' or '>>().toBeAssignableTo<'true or false' | 'false or true'>();
