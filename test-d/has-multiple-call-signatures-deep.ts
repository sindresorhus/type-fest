import {expectTypeOf} from 'nz';
import type {HasMultipleCallSignatures, NonNullableDeep, PartialDeep, ReadonlyDeep, RequiredDeep, WritableDeep} from '../index.d.ts';

// Duplicate declarations still use the single-signature path, including the receiver and metadata.
type DuplicateCallback = {
	(this: {ready: boolean}, value: string | null): {result: string | null};
	(this: {ready: boolean}, input: string | null): {result: string | null};
	settings: {enabled: boolean; labels: string[]};
	readonly defaults?: {readonly name?: string | null};
};

expectTypeOf<HasMultipleCallSignatures<DuplicateCallback>>().toBe<false>();

declare const readonlyCallback: ReadonlyDeep<DuplicateCallback>;
expectTypeOf(readonlyCallback.settings).toBe<{readonly enabled: boolean; readonly labels: readonly string[]}>();
expectTypeOf(readonlyCallback.defaults).toBe<{readonly name?: string | null} | undefined>();
expectTypeOf<ThisParameterType<typeof readonlyCallback>>().toBe<{ready: boolean}>();
expectTypeOf<Parameters<typeof readonlyCallback>>().toBe<[value: string | null]>();
expectTypeOf<ReturnType<typeof readonlyCallback>>().toBe<{result: string | null}>();
// @ts-expect-error Metadata is made deeply readonly.
readonlyCallback.settings.enabled = false;
// @ts-expect-error Arrays in metadata are made readonly too.
readonlyCallback.settings.labels[0] = 'changed';
// @ts-expect-error An explicit receiver is still required.
readonlyCallback('input');

declare const partialCallback: PartialDeep<DuplicateCallback>;
expectTypeOf(partialCallback.settings).toBe<{enabled?: boolean; labels?: string[]} | undefined>();
expectTypeOf(partialCallback.defaults).toBe<{readonly name?: string | null} | undefined>();
expectTypeOf<ThisParameterType<typeof partialCallback>>().toBe<{ready: boolean}>();
expectTypeOf<Parameters<typeof partialCallback>>().toBe<[value: string | null]>();
expectTypeOf<ReturnType<typeof partialCallback>>().toBe<{result: string | null}>();
partialCallback.settings = {};
// @ts-expect-error Partial properties do not accept explicit undefined by default.
partialCallback.settings = undefined;
// @ts-expect-error The readonly modifier is retained.
partialCallback.defaults = {};
// @ts-expect-error An explicit receiver is still required.
partialCallback('input');

declare const requiredCallback: RequiredDeep<DuplicateCallback>;
expectTypeOf(requiredCallback.defaults).toBe<{readonly name: string | null}>();
expectTypeOf(requiredCallback.settings).toBe<{enabled: boolean; labels: string[]}>();
expectTypeOf<ThisParameterType<typeof requiredCallback>>().toBe<{ready: boolean}>();
expectTypeOf<Parameters<typeof requiredCallback>>().toBe<[value: string | null]>();
expectTypeOf<ReturnType<typeof requiredCallback>>().toBe<{result: string | null}>();
// @ts-expect-error Nested optional metadata becomes required.
const missingName: typeof requiredCallback.defaults = {};
// @ts-expect-error The readonly modifier is retained.
requiredCallback.defaults.name = 'changed';
// @ts-expect-error An explicit receiver is still required.
requiredCallback('input');

declare const writableCallback: WritableDeep<DuplicateCallback>;
expectTypeOf(writableCallback.defaults).toBe<{name?: string | null} | undefined>();
expectTypeOf(writableCallback.settings).toBe<{enabled: boolean; labels: string[]}>();
expectTypeOf<ThisParameterType<typeof writableCallback>>().toBe<{ready: boolean}>();
expectTypeOf<Parameters<typeof writableCallback>>().toBe<[value: string | null]>();
expectTypeOf<ReturnType<typeof writableCallback>>().toBe<{result: string | null}>();
writableCallback.defaults = {};
writableCallback.defaults.name = null;
// @ts-expect-error Optional properties still reject explicit undefined.
writableCallback.defaults.name = undefined;
// @ts-expect-error An explicit receiver is still required.
writableCallback('input');

declare const nonNullableCallback: NonNullableDeep<DuplicateCallback>;
expectTypeOf(nonNullableCallback.defaults).toBe<{readonly name?: string} | undefined>();
expectTypeOf(nonNullableCallback.settings).toBe<{enabled: boolean; labels: string[]}>();
expectTypeOf<ThisParameterType<typeof nonNullableCallback>>().toBe<{ready: boolean}>();
expectTypeOf<Parameters<typeof nonNullableCallback>>().toBe<[value: string]>();
expectTypeOf<ReturnType<typeof nonNullableCallback>>().toBe<{result: string}>();
// @ts-expect-error Nullable metadata is cleaned.
const nullableName: NonNullable<typeof nonNullableCallback.defaults> = {name: null};
// @ts-expect-error The readonly modifier is retained.
nonNullableCallback.defaults = {};
// @ts-expect-error An explicit receiver is still required.
nonNullableCallback('input');

// Calling each rebuilt function through its receiver exercises the actual signatures.
declare const service: {
	ready: boolean;
	readonlyRead: typeof readonlyCallback;
	partialRead: typeof partialCallback;
	requiredRead: typeof requiredCallback;
	writableRead: typeof writableCallback;
	nonNullableRead: typeof nonNullableCallback;
};
expectTypeOf(service.readonlyRead(null)).toBe<{result: string | null}>();
expectTypeOf(service.partialRead(null)).toBe<{result: string | null}>();
expectTypeOf(service.requiredRead(null)).toBe<{result: string | null}>();
expectTypeOf(service.writableRead(null)).toBe<{result: string | null}>();
expectTypeOf(service.nonNullableRead('input')).toBe<{result: string}>();
// @ts-expect-error NonNullableDeep cleans the argument as well as the return value.
service.nonNullableRead(null);

// Normalization must distribute before checking each member of a callable union.
type OverloadedCallback = {
	(value: string): string;
	(value: number): number;
	(value: number): number;
	settings: {enabled: boolean};
	readonly defaults?: {readonly name?: string | null};
};
type SingleCallback = ((value: boolean) => boolean) & {
	settings: {enabled: boolean};
	readonly defaults?: {readonly name?: string | null};
};
type CallbackUnion = OverloadedCallback | SingleCallback;

expectTypeOf<ReadonlyDeep<CallbackUnion>>().toBe<OverloadedCallback | ReadonlyDeep<SingleCallback>>();
expectTypeOf<PartialDeep<CallbackUnion>>().toBe<OverloadedCallback | PartialDeep<SingleCallback>>();
expectTypeOf<RequiredDeep<CallbackUnion>>().toBe<OverloadedCallback | RequiredDeep<SingleCallback>>();
expectTypeOf<WritableDeep<CallbackUnion>>().toBe<OverloadedCallback | WritableDeep<SingleCallback>>();
expectTypeOf<NonNullableDeep<CallbackUnion>>().toBe<OverloadedCallback | NonNullableDeep<SingleCallback>>();

// A preserved overloaded callback does not prevent its containing object from being transformed.
type Container = {callback: OverloadedCallback; sibling: {value: string | null}};
expectTypeOf<ReadonlyDeep<Container>>().toBe<{readonly callback: OverloadedCallback; readonly sibling: {readonly value: string | null}}>();
expectTypeOf<PartialDeep<Container>>().toBe<{callback?: OverloadedCallback; sibling?: {value?: string | null}}>();
expectTypeOf<RequiredDeep<{callback?: OverloadedCallback; sibling?: {value?: string | null}}>>().toBe<Container>();
expectTypeOf<WritableDeep<{readonly callback: OverloadedCallback; readonly sibling: {readonly value: string | null}}>>().toBe<Container>();
expectTypeOf<NonNullableDeep<Container>>().toBe<{callback: OverloadedCallback; sibling: {value: string}}>();

declare const readonlyContainer: ReadonlyDeep<Container>;
declare const replacementCallback: OverloadedCallback;
readonlyContainer.callback.settings.enabled = false;
// @ts-expect-error The containing property is still readonly.
readonlyContainer.callback = replacementCallback;
// @ts-expect-error Sibling properties are still made deeply readonly.
readonlyContainer.sibling.value = 'changed';
expectTypeOf(readonlyContainer.callback('input')).toBe<string>();
expectTypeOf(readonlyContainer.callback(1)).toBe<number>();
// @ts-expect-error The original overload set does not accept boolean values.
readonlyContainer.callback(true);

// Overloads remain intact when reached through collections, tuples, and nullable properties.
expectTypeOf<ReadonlyDeep<OverloadedCallback[]>>().toBe<readonly OverloadedCallback[]>();
expectTypeOf<PartialDeep<OverloadedCallback[], {recurseIntoArrays: true}>>().toBe<OverloadedCallback[]>();
expectTypeOf<RequiredDeep<[OverloadedCallback?]>>().toBe<[OverloadedCallback]>();
expectTypeOf<WritableDeep<readonly [OverloadedCallback]>>().toBe<[OverloadedCallback]>();
expectTypeOf<NonNullableDeep<{callback?: OverloadedCallback | null}>>().toBe<{callback?: OverloadedCallback}>();
expectTypeOf<NonNullableDeep<Map<string | null, OverloadedCallback | null>>>().toBe<Map<string, OverloadedCallback>>();

// Readonly rest parameters describe one signature and must not prevent metadata transformations.
type RestCallback = ((...values: readonly number[]) => number) & {values: number[]};
declare const readonlyRest: ReadonlyDeep<RestCallback>;
declare const partialRest: PartialDeep<RestCallback>;
declare const requiredRest: RequiredDeep<RestCallback>;
declare const writableRest: WritableDeep<RestCallback>;
declare const nonNullableRest: NonNullableDeep<RestCallback>;
expectTypeOf(readonlyRest.values).toBe<readonly number[]>();
expectTypeOf(partialRest.values).toBe<number[] | undefined>();
expectTypeOf(requiredRest.values).toBe<number[]>();
expectTypeOf(writableRest.values).toBe<number[]>();
expectTypeOf(nonNullableRest.values).toBe<number[]>();
expectTypeOf(readonlyRest(1, 2)).toBe<number>();
expectTypeOf(partialRest(1, 2)).toBe<number>();
expectTypeOf(requiredRest(1, 2)).toBe<number>();
expectTypeOf(writableRest(1, 2)).toBe<number>();
expectTypeOf(nonNullableRest(1, 2)).toBe<number>();
// @ts-expect-error A readonly rest does not allow arguments of a different type.
readonlyRest('input');
