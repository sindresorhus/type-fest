import {expectType} from 'tsd';
import type {IfArrayReadonly} from '../../source/internal/index.d.ts';

// Non-readonly arrays
expectType<IfArrayReadonly<[]>>(false);
expectType<IfArrayReadonly<number[], string, number>>({} as number);
expectType<IfArrayReadonly<[string?, number?], string>>(false);
expectType<IfArrayReadonly<[string, number, ...string[]], false, true>>(true);

// Readonly arrays
expectType<IfArrayReadonly<readonly []>>(true);
expectType<IfArrayReadonly<readonly number[], string, number>>({} as string);
expectType<IfArrayReadonly<readonly [string?, number?], string>>({} as string);
expectType<IfArrayReadonly<readonly [string, number, ...string[]], false, true>>(false);

// Union
expectType<IfArrayReadonly<[] | [string, number]>>(false);
expectType<IfArrayReadonly<[] | [string, number], string, number>>({} as number);
expectType<IfArrayReadonly<readonly [] | readonly [string, number]>>(true);
expectType<IfArrayReadonly<readonly [] | readonly [string, number], string, number>>({} as string);

// Returns union of `TypeIfArrayReadonly` and `TypeIfNotArrayReadonly` when `T` is a union of readonly and non-readonly arrays.
expectType<IfArrayReadonly<[] | readonly []>>({} as boolean);
expectType<IfArrayReadonly<[string, number] | readonly [string, number, ...string[]], string, number>>({} as string | number);
expectType<IfArrayReadonly<[string, number] | readonly [string, number, ...string[]], string>>({} as string | false);

// Returns union of `TypeIfArrayReadonly` and `TypeIfNotArrayReadonly` when `T` is `any`.
expectType<IfArrayReadonly<any>>({} as boolean);
expectType<IfArrayReadonly<any, string, number>>({} as string | number);
expectType<IfArrayReadonly<any, string>>({} as string | false);

// Returns `TypeIfNotArrayReadonly` when `T` is `never`.
expectType<IfArrayReadonly<never>>(false);
expectType<IfArrayReadonly<never, string, number>>({} as number);
