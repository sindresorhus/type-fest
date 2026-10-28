import {expectTypeOf} from 'nz';
import type {HasMultipleCallSignatures} from '../../source/internal/index.d.ts';
import type {NonNullableDeep, PartialDeep, ReadonlyDeep, RequiredDeep, WritableDeep} from '../../index.d.ts';

type Overloaded = {
	(foo: number): string;
	(foo: string, bar: number): number;
};

type Overloaded2 = {
	(foo: number | undefined): string;
	(foo: number): string;
};

type Namespace = {
	(foo: number): string;
	baz: boolean[];
};

expectTypeOf<HasMultipleCallSignatures<Overloaded>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Overloaded2>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<Namespace>>().toBe<false>();

// Receiver-dependent overloads are distinct even when their ordinary parameters are identical.
type ReceiverMethod = {
	(this: {format: 'text'}, path: string): string;
	(this: {format: 'binary'}, path: string): Uint8Array;
	readonly settings?: {readonly enabled?: boolean};
};
type ReceiverOverloads = {
	(this: Date, value: string): string;
	(this: RegExp, value: string): string;
};
type ReturnOverloads = {
	(value: string): number;
	(value: string): string;
};
expectTypeOf<HasMultipleCallSignatures<ReceiverMethod>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<ReceiverOverloads>>().toBe<true>();
expectTypeOf<HasMultipleCallSignatures<ReturnOverloads>>().toBe<true>();

// Deep transforms leave unsupported overloaded signatures intact instead of dropping an overload.
expectTypeOf<ReadonlyDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<RequiredDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<PartialDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<WritableDeep<ReceiverMethod>>().toBe<ReceiverMethod>();
expectTypeOf<NonNullableDeep<ReceiverMethod>>().toBe<ReceiverMethod>();

declare const textApi: {format: 'text'; read: ReadonlyDeep<ReceiverMethod>};
declare const binaryApi: {format: 'binary'; read: RequiredDeep<ReceiverMethod>};
expectTypeOf(textApi.read('data')).toBe<string>();
expectTypeOf(binaryApi.read('data')).toBe<Uint8Array>();
declare const unsupportedApi: {format: 'json'; read: PartialDeep<ReceiverMethod>};
// @ts-expect-error The original overloads still require one of their declared receivers.
unsupportedApi.read('data');

// Single signatures, including generic and readonly-rest callbacks, still follow the normal property transformations.
expectTypeOf<HasMultipleCallSignatures<(this: Date, ...values: readonly number[]) => never>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<<Value>(value: Value) => Value>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<any>>().toBe<false>();
expectTypeOf<HasMultipleCallSignatures<never>>().toBe<never>();
// @ts-expect-error An unknown type is not known to have a call signature.
type UnknownSignatures = HasMultipleCallSignatures<unknown>;

function _readSignatureFlag<Callback extends (...arguments_: any[]) => unknown>(flag: HasMultipleCallSignatures<Callback>): boolean {
	return flag;
}
