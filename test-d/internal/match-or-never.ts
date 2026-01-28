import {expectType} from 'tsd';
import type {MatchOrNever} from '../../source/internal/index.d.ts';

expectType<string | number>({} as MatchOrNever<string | number, string>);
expectType<never>({} as MatchOrNever<string | number, string | number>);
expectType<string | number>({} as MatchOrNever<string | number, unknown>);
expectType<string>({} as MatchOrNever<string, string | number>);

expectType<{readonly a: 0}>({} as MatchOrNever<{readonly a: 0}, {a: 0}>);
expectType<{a: 0}>({} as MatchOrNever<{a: 0}, {readonly a: 0}>);

expectType<unknown>({} as MatchOrNever<unknown, never>);
expectType<never>({} as MatchOrNever<unknown, unknown>);
expectType<never>({} as MatchOrNever<never, never>);
expectType<never>({} as MatchOrNever<never, unknown>);

expectType<never>({} as MatchOrNever<{a: {b: 0}} | {a: {b: 0}}, {a: {b: 0}}>); // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
type A = {a: {b: 0} | {b: 0}}; // eslint-disable-line @typescript-eslint/no-duplicate-type-constituents
expectType<A>({} as MatchOrNever<A, {a: {b: 0}}>);
