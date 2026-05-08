import {expectType} from 'tsd';
import type {Unbind} from '../index.d.ts';

type Success = {
	kind: 'success';
	data: string;
};

type Failure = {
	kind: 'error';
	error: Error;
};

declare const result: Unbind<Success | Failure>;
expectType<{
	kind: 'success' | 'error';
	data?: string;
	error?: Error;
}>(result);

type A = {a: string};
type B = {b: number};

declare const ab: Unbind<A | B>;
expectType<{
	a?: string;
	b?: number;
}>(ab);

type Common = {a: string} | {a: number; b: boolean};

declare const common: Unbind<Common>;
expectType<{
	a: string | number;
	b?: boolean;
}>(common);

// Edge cases
expectType<Unbind<any>>({} as Record<PropertyKey, any>);
expectType<Unbind<never>>({} as Record<PropertyKey, never>);
expectType<Unbind<unknown>>({});
