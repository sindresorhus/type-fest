import {expectType} from 'tsd';
import type {IsArrayReadonly} from '../../source/internal/index.d.ts';

// Non-readonly arrays
expectType<IsArrayReadonly<[]>>(false);
expectType<IsArrayReadonly<number[]>>(false);
expectType<IsArrayReadonly<[string, number?, ...string[]]>>(false);
expectType<IsArrayReadonly<[x: number, y: number, z?: number]>>(false);
expectType<IsArrayReadonly<[...string[], number, string]>>(false);

// Readonly arrays
expectType<IsArrayReadonly<readonly []>>(true);
expectType<IsArrayReadonly<readonly number[]>>(true);
expectType<IsArrayReadonly<readonly [string, number?, ...string[]]>>(true);
expectType<IsArrayReadonly<readonly [x: number, y: number, z?: number]>>(true);
expectType<IsArrayReadonly<readonly [...string[], number, string]>>(true);

// Union
expectType<IsArrayReadonly<[] | readonly []>>({} as boolean);
expectType<IsArrayReadonly<[string, number] | readonly [string, number, ...string[]]>>({} as boolean);
expectType<IsArrayReadonly<[] | [string, number]>>(false);
expectType<IsArrayReadonly<readonly [] | readonly [string, number]>>(true);

// Boundary types
expectType<IsArrayReadonly<any>>({} as boolean);
expectType<IsArrayReadonly<never>>(false);
