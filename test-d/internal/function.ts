import {expectType} from 'tsd';
import type {FunctionParameters, HasExplicitThis} from '../../source/internal/index.d.ts';
import type {UnknownArray} from '../../source/unknown-array.d.ts';

// FunctionParameters
// ------------------

expectType<[foo: string, bar: number]>({} as FunctionParameters<(foo: string, bar: number) => void>);
expectType<[]>({} as FunctionParameters<() => void>);
expectType<any[]>({} as FunctionParameters<(...args: any[]) => void>);
expectType<readonly any[]>({} as FunctionParameters<(...args: readonly any[]) => void>);
expectType<[foo: string, ...bar: number[]]>({} as FunctionParameters<(foo: string, ...bar: number[]) => void>);
expectType<[foo: string, bar?: number | undefined]>({} as FunctionParameters<(foo: string, bar?: number) => void>);
expectType<UnknownArray>({} as FunctionParameters<any>);
expectType<never>({} as FunctionParameters<never>);

// HasExplicitThis
// ---------------

type ExplicitThisDate = (this: Date, foo: string) => void;
expectType<true>({} as HasExplicitThis<ExplicitThisDate, Date, [foo: string], void>);

type ExplicitThisUnknown = (this: unknown, foo: string) => void;
expectType<true>({} as HasExplicitThis<ExplicitThisUnknown, unknown, [foo: string], void>);

type ImplicitThis = (foo: string) => void;
expectType<false>({} as HasExplicitThis<ImplicitThis, unknown, [foo: string], void>);

type ExplicitThisUrl = (this: URL, foo: number, bar: boolean) => string;
expectType<true>({} as HasExplicitThis<ExplicitThisUrl, URL, [foo: number, bar: boolean], string>);

type ImplicitThisNoParameters = () => void;
expectType<false>({} as HasExplicitThis<ImplicitThisNoParameters, unknown, [], void>);

type ExplicitThisUnknownNoParameters = (this: unknown) => void;
expectType<true>({} as HasExplicitThis<ExplicitThisUnknownNoParameters, unknown, [], void>);

type OverloadedExplicitThis = {
	(this: Date, foo: string): void;
	(foo: number): string;
};
expectType<true>({} as HasExplicitThis<OverloadedExplicitThis, Date, [foo: string], void>);

type OverloadedImplicitThis = {
	(foo: string): void;
	(foo: number): string;
};
expectType<false>({} as HasExplicitThis<OverloadedImplicitThis, unknown, [foo: number], string>);

type OverloadedMixedThis = {
	(this: Date, foo: string): void;
	(foo: number): string;
};
expectType<true>({} as HasExplicitThis<OverloadedMixedThis, Date, [foo: string], void>);

type ImplicitThisRest = (...args: any[]) => void;
expectType<false>({} as HasExplicitThis<ImplicitThisRest, unknown, any[], void>);

type ExplicitThisRest = (this: string, ...args: any[]) => void;
expectType<true>({} as HasExplicitThis<ExplicitThisRest, string, any[], void>);

// Generic functions — the sentinel deduplication trick does not work with generic signatures
// because TS doesn't consider a generic instantiation a duplicate of the concrete sentinel.

declare function genericImplicit<Value>(input: Value): Value;
expectType<true>({} as HasExplicitThis<typeof genericImplicit, unknown, [input: unknown], unknown>);

declare function genericExplicitThis<Value>(this: Date, input: Value): Value;
expectType<true>({} as HasExplicitThis<typeof genericExplicitThis, Date, [input: unknown], unknown>);

declare function genericExplicitThisUnknown<Value>(this: unknown, input: Value): Value;
expectType<true>({} as HasExplicitThis<typeof genericExplicitThisUnknown, unknown, [input: unknown], unknown>);

declare function genericThisParameter<This>(this: This, input: string): This;
expectType<true>({} as HasExplicitThis<typeof genericThisParameter, unknown, [input: string], unknown>);

// Mixed generic + concrete overloads: concrete overload still deduplicates normally.
declare function genericOverloaded<Value>(input: Value): Value;
declare function genericOverloaded(input: string): string;
expectType<true>({} as HasExplicitThis<typeof genericOverloaded, unknown, [input: unknown], unknown>);
expectType<false>({} as HasExplicitThis<typeof genericOverloaded, unknown, [input: string], string>);

declare function genericOverloadedWithThis<Value>(this: Value, input: Value): Value;
declare function genericOverloadedWithThis(input: string): string;
expectType<true>({} as HasExplicitThis<typeof genericOverloadedWithThis, unknown, [input: unknown], unknown>);
expectType<false>({} as HasExplicitThis<typeof genericOverloadedWithThis, unknown, [input: string], string>);
