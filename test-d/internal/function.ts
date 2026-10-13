import {expectTypeOf} from 'nz';
import type {FunctionParameters, HasExplicitThis} from '../../source/internal/index.d.ts';
import type {UnknownArray} from '../../source/unknown-array.d.ts';

// FunctionParameters
// ------------------

expectTypeOf<FunctionParameters<(foo: string, bar: number) => void>>().toBe<[foo: string, bar: number]>();
expectTypeOf<FunctionParameters<() => void>>().toBe<[]>();
expectTypeOf<FunctionParameters<(...args: any[]) => void>>().toBe<any[]>();
expectTypeOf<FunctionParameters<(...args: readonly any[]) => void>>().toBe<readonly any[]>();
expectTypeOf<FunctionParameters<(foo: string, ...bar: number[]) => void>>().toBe<[foo: string, ...bar: number[]]>();
expectTypeOf<FunctionParameters<(foo: string, bar?: number) => void>>().toBe<[foo: string, bar?: number | undefined]>();
expectTypeOf<FunctionParameters<any>>().toBe<UnknownArray>();
expectTypeOf<FunctionParameters<never>>().toBe<never>();

// HasExplicitThis
// ---------------

type ExplicitThisDate = (this: Date, foo: string) => void;
expectTypeOf<HasExplicitThis<ExplicitThisDate, Date, [foo: string], void>>().toBe<true>();

type ExplicitThisUnknown = (this: unknown, foo: string) => void;
expectTypeOf<HasExplicitThis<ExplicitThisUnknown, unknown, [foo: string], void>>().toBe<true>();

type ImplicitThis = (foo: string) => void;
expectTypeOf<HasExplicitThis<ImplicitThis, unknown, [foo: string], void>>().toBe<false>();

type ExplicitThisUrl = (this: URL, foo: number, bar: boolean) => string;
expectTypeOf<HasExplicitThis<ExplicitThisUrl, URL, [foo: number, bar: boolean], string>>().toBe<true>();

type ImplicitThisNoParameters = () => void;
expectTypeOf<HasExplicitThis<ImplicitThisNoParameters, unknown, [], void>>().toBe<false>();

type ExplicitThisUnknownNoParameters = (this: unknown) => void;
expectTypeOf<HasExplicitThis<ExplicitThisUnknownNoParameters, unknown, [], void>>().toBe<true>();

type OverloadedExplicitThis = {
	(this: Date, foo: string): void;
	(foo: number): string;
};
expectTypeOf<HasExplicitThis<OverloadedExplicitThis, Date, [foo: string], void>>().toBe<true>();

type OverloadedImplicitThis = {
	(foo: string): void;
	(foo: number): string;
};
expectTypeOf<HasExplicitThis<OverloadedImplicitThis, unknown, [foo: number], string>>().toBe<false>();

type OverloadedMixedThis = {
	(this: Date, foo: string): void;
	(foo: number): string;
};
expectTypeOf<HasExplicitThis<OverloadedMixedThis, Date, [foo: string], void>>().toBe<true>();

type ImplicitThisRest = (...args: any[]) => void;
expectTypeOf<HasExplicitThis<ImplicitThisRest, unknown, any[], void>>().toBe<false>();

type ExplicitThisRest = (this: string, ...args: any[]) => void;
expectTypeOf<HasExplicitThis<ExplicitThisRest, string, any[], void>>().toBe<true>();

// Generic functions: the sentinel deduplication trick does not work with generic signatures, because TypeScript does not consider a generic instantiation a duplicate of the concrete sentinel.

declare function genericImplicit<Value>(input: Value): Value;
expectTypeOf<HasExplicitThis<typeof genericImplicit, unknown, [input: unknown], unknown>>().toBe<true>();

declare function genericExplicitThis<Value>(this: Date, input: Value): Value;
expectTypeOf<HasExplicitThis<typeof genericExplicitThis, Date, [input: unknown], unknown>>().toBe<true>();

declare function genericExplicitThisUnknown<Value>(this: unknown, input: Value): Value;
expectTypeOf<HasExplicitThis<typeof genericExplicitThisUnknown, unknown, [input: unknown], unknown>>().toBe<true>();

declare function genericThisParameter<This>(this: This, input: string): This;
expectTypeOf<HasExplicitThis<typeof genericThisParameter, unknown, [input: string], unknown>>().toBe<true>();

// Mixed generic + concrete overloads: concrete overload still deduplicates normally.
declare function genericOverloaded<Value>(input: Value): Value;
declare function genericOverloaded(input: string): string;
expectTypeOf<HasExplicitThis<typeof genericOverloaded, unknown, [input: unknown], unknown>>().toBe<true>();
expectTypeOf<HasExplicitThis<typeof genericOverloaded, unknown, [input: string], string>>().toBe<false>();

declare function genericOverloadedWithThis<Value>(this: Value, input: Value): Value;
declare function genericOverloadedWithThis(input: string): string;
expectTypeOf<HasExplicitThis<typeof genericOverloadedWithThis, unknown, [input: unknown], unknown>>().toBe<true>();
expectTypeOf<HasExplicitThis<typeof genericOverloadedWithThis, unknown, [input: string], string>>().toBe<false>();
