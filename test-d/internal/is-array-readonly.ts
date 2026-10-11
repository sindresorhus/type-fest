import {expectTypeOf} from 'nz';
import type {IsArrayReadonly} from '../../source/internal/index.d.ts';

// Non-readonly arrays
expectTypeOf<IsArrayReadonly<[]>>().toBe<false>();
expectTypeOf<IsArrayReadonly<number[]>>().toBe<false>();
expectTypeOf<IsArrayReadonly<[string, number?, ...string[]]>>().toBe<false>();
expectTypeOf<IsArrayReadonly<[x: number, y: number, z?: number]>>().toBe<false>();
expectTypeOf<IsArrayReadonly<[...string[], number, string]>>().toBe<false>();

// Readonly arrays
expectTypeOf<IsArrayReadonly<readonly []>>().toBe<true>();
expectTypeOf<IsArrayReadonly<readonly number[]>>().toBe<true>();
expectTypeOf<IsArrayReadonly<readonly [string, number?, ...string[]]>>().toBe<true>();
expectTypeOf<IsArrayReadonly<readonly [x: number, y: number, z?: number]>>().toBe<true>();
expectTypeOf<IsArrayReadonly<readonly [...string[], number, string]>>().toBe<true>();

// Union
expectTypeOf<boolean>().toBe<IsArrayReadonly<[] | readonly []>>();
expectTypeOf<boolean>().toBe<IsArrayReadonly<[string, number] | readonly [string, number, ...string[]]>>();
expectTypeOf<IsArrayReadonly<[] | [string, number]>>().toBe<false>();
expectTypeOf<IsArrayReadonly<readonly [] | readonly [string, number]>>().toBe<true>();

// Boundary types
expectTypeOf<boolean>().toBe<IsArrayReadonly<any>>();
expectTypeOf<IsArrayReadonly<never>>().toBe<false>();
