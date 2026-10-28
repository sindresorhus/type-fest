import {expectTypeOf} from 'nz';
import type {SetParameterType} from '../index.d.ts';

function function_(_a: number, _b: string, _c: Object, ..._arguments: boolean[]) {
	return null;
}

function functionWithThis(this: typeof globalThis, _a: number) {
	return null;
}

const arrowFunction = (_a: number) => null;

// Normal case
declare const test1: SetParameterType<typeof function_, {1: boolean}>;
expectTypeOf(test1).toBe<(a: number, b: boolean, c: Object, ...arguments_: boolean[]) => null>();
test1(1, true, {}, true);

// Test multiple parameters
declare const test2: SetParameterType<typeof function_, {0: string; 2: boolean}>;
expectTypeOf(test2).toBe<(a: string, b: string, c: boolean, ...arguments_: boolean[]) => null>();
test2('1', '2', true, true);

// Test another define way
declare const test3: SetParameterType<typeof function_, [a: 'a', b: 'b']>;
expectTypeOf(test3).toBe<(a: 'a', b: 'b', c: Object, ...arguments_: boolean[]) => null>();
test3('a', 'b', {}, true);

// Test `...args` parameter
declare const testargs: SetParameterType<typeof function_, {3: string}>;
expectTypeOf(testargs).toBe<(a: number, b: string, c: Object, ...arguments_: string[]) => null>();
testargs(1, '1', {}, '1');

declare const testargs2: SetParameterType<typeof function_, [string, number, number, ...boolean[]]>;
expectTypeOf(testargs2).toBe<(a: string, b: number, c: number, ...arguments_: boolean[]) => null>();
testargs2('1', 1, 1, true);

// Test `...args` parameter when an optional parameter comes before it
function functionWithOptionalParameter(_a: number, _b?: string, ..._arguments: boolean[]) {
	return null;
}

declare const testargs3: SetParameterType<typeof functionWithOptionalParameter, {2: string}>;
expectTypeOf(testargs3).toBe<(a: number, b?: string, ...arguments_: string[]) => null>();
testargs3(1, '1', '2');

// An unspecified `...args` parameter is kept as-is
declare const testargs4: SetParameterType<typeof functionWithOptionalParameter, {1: number}>;
expectTypeOf(testargs4).toBe<(a: number, b?: number, ...arguments_: boolean[]) => null>();
testargs4(1, 1, true);

// The array form of the replacement sets a `...args` parameter too, just like the object form does.
declare const testargs5: SetParameterType<(a: string, ...rest: boolean[]) => null, [string, number]>;
expectTypeOf(testargs5).toBe<(a: string, ...rest: number[]) => null>();
testargs5('1', 1, 2);

// The rest parameter is kept as-is when the replacement is too short to reach it.
declare const testargs6: SetParameterType<(a: string, ...rest: boolean[]) => null, [Date]>;
expectTypeOf(testargs6).toBe<(a: Date, ...rest: boolean[]) => null>();
testargs6(new Date(), true);

// A parameter list that is only a `...args` parameter is replaced as a whole.
declare const testargs7: SetParameterType<(...arguments_: string[]) => null, [Date]>;
expectTypeOf(testargs7).toBe<(...arguments_: Date[]) => null>();
testargs7(new Date());

// Only index `0` is addressable when the parameter list is only a `...args` parameter, so a longer replacement is truncated.
declare const testargs8: SetParameterType<(...arguments_: string[]) => null, [Date, number]>;
expectTypeOf(testargs8).toBe<(...arguments_: Date[]) => null>();
testargs8(new Date());

// Test arrow function
declare const test5: SetParameterType<typeof arrowFunction, {0: string}>;
expectTypeOf(test5).toBe<(a: string) => null>();

// Test the function that has `this` parameter
declare const testThis: SetParameterType<typeof functionWithThis, {0: string}>;
expectTypeOf(testThis).toBe<(this: typeof globalThis, _a: string) => null>();
testThis.call(globalThis, '1');
// @ts-expect-error
testThis.call(new Date(), '1');

// A type with several call signatures collapses to its last signature. This is a TypeScript limitation, not a choice, so it is pinned here rather than worked around.
declare const overloaded: SetParameterType<{(): void; (x: number): void}, [string]>;
expectTypeOf(overloaded).toBe<(x: string) => void>();

// Replacing a rest parameter must preserve the explicit receiver and every optional position before it.
declare const withReceiverAndOptionalParameters: SetParameterType<(this: Date, first?: string, second?: boolean, ...rest: number[]) => Date, {2: string}>;
expectTypeOf(withReceiverAndOptionalParameters).toBe<(this: Date, first?: string, second?: boolean, ...rest: string[]) => Date>();
withReceiverAndOptionalParameters.call(new Date(), undefined, true, 'value');
// @ts-expect-error -- The receiver is still required to be a Date.
withReceiverAndOptionalParameters.call('invalid', undefined, true, 'value');
// @ts-expect-error -- The old rest parameter type is rejected.
withReceiverAndOptionalParameters.call(new Date(), undefined, true, 1);

// A function with a readonly rest parameter, such as a parameter list typed with `as const`, keeps its parameter positions.
declare const readonlyParameters: SetParameterType<(...arguments_: readonly [string, number?]) => boolean, {0: boolean}>;
expectTypeOf(readonlyParameters).toBe<(first: boolean, second?: number) => boolean>();

declare const readonlyParametersTuple: SetParameterType<(...arguments_: readonly [string, number?]) => boolean, [boolean]>;
expectTypeOf(readonlyParametersTuple).toBe<(first: boolean, second?: number) => boolean>();

declare const readonlyRestParameter: SetParameterType<(first: string, ...rest: readonly number[]) => boolean, {1: string}>;
expectTypeOf(readonlyRestParameter).toBe<(first: string, ...rest: string[]) => boolean>();

// Numeric parameter keys also accept their canonical string spelling.
expectTypeOf<SetParameterType<(value: string) => boolean, {'0': number}>>().toBe<(value: number) => boolean>();
expectTypeOf<SetParameterType<(value: string, ...rest: boolean[]) => number, {'1': Date}>>().toBe<(value: string, ...rest: Date[]) => number>();

expectTypeOf<SetParameterType<(first: string, second?: number) => boolean, {'0': Date; '1': boolean}>>().toBe<(first: Date, second?: boolean) => boolean>();
expectTypeOf<SetParameterType<(this: Date, first?: string, ...rest: number[]) => Date, {'1': boolean}>>().toBe<(this: Date, first?: string, ...rest: boolean[]) => Date>();
expectTypeOf<SetParameterType<(...rest: number[]) => string, {'0': boolean}>>().toBe<(...rest: boolean[]) => string>();
expectTypeOf<SetParameterType<(first: string, second: number) => boolean, {0: Date; '1': boolean}>>().toBe<(first: Date, second: boolean) => boolean>();
expectTypeOf<SetParameterType<(first: string, ...rest: number[]) => boolean, {'0': Date}>>().toBe<(first: Date, ...rest: number[]) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'1': Date}>>().toBe<(first: string) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'00': Date}>>().toBe<(first: string) => boolean>();
expectTypeOf<SetParameterType<(first: string, ...rest: number[]) => boolean, {'01': Date}>>().toBe<(first: string, ...rest: number[]) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'0': any}>>().toBe<(first: any) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'0': unknown}>>().toBe<(first: unknown) => boolean>();
expectTypeOf<SetParameterType<(first: string) => boolean, {'0': never}>>().toBe<(first: never) => boolean>();
expectTypeOf<SetParameterType<never, {'0': number}>>().toBe<never>();
expectTypeOf<SetParameterType<(() => string) | ((first: string) => number), {'0': Date}>>().toBe<(() => string) | ((first: Date) => number)>();
// @ts-expect-error - The input must be callable.
expectTypeOf<SetParameterType<unknown, {'0': number}>>();

// The transformed signature can be called with the replacement, and rejects the old value.
declare const withStringIndex: SetParameterType<(first: string, ...rest: number[]) => boolean, {'0': Date; '1': string}>;
withStringIndex(new Date(), 'value');
// @ts-expect-error
withStringIndex('old', 'value');
// @ts-expect-error
withStringIndex(new Date(), 1);

// A readonly rest array still has a replaceable parameter at index zero.
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: boolean}>>().toBe<(...rest: boolean[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {'0': boolean}>>().toBe<(...rest: boolean[]) => string>();

expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, [Date]>>().toBe<(...rest: Date[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, readonly [Date, boolean]>>().toBe<(...rest: Date[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, readonly Date[]>>().toBe<(...rest: readonly Date[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {}>>().toBe<(...rest: readonly number[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {1: Date}>>().toBe<(...rest: readonly number[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: unknown}>>().toBe<(...rest: readonly unknown[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: any}>>().toBe<(...rest: readonly any[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly number[]) => string, {0: never}>>().toBe<(...rest: readonly never[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly never[]) => string, {0: boolean}>>().toBe<(...rest: readonly boolean[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly unknown[]) => string, {0: boolean}>>().toBe<(...rest: readonly boolean[]) => string>();
expectTypeOf<SetParameterType<(...rest: readonly any[]) => string, {0: boolean}>>().toBe<(...rest: readonly boolean[]) => string>();
expectTypeOf<SetParameterType<(this: Date, ...rest: readonly number[]) => Date, {0: boolean}>>().toBe<(this: Date, ...rest: readonly boolean[]) => Date>();
expectTypeOf<SetParameterType<((...rest: readonly number[]) => string) | ((first: string) => number), {0: boolean}>>().toBe<((...rest: readonly boolean[]) => string) | ((first: boolean) => number)>();

declare const withReadonlyRest: SetParameterType<(this: Date, ...rest: readonly number[]) => Date, {0: boolean}>;
withReadonlyRest.call(new Date(), true, false);
// @ts-expect-error - The previous element type is replaced.
withReadonlyRest.call(new Date(), 1);
// @ts-expect-error - The receiver is preserved.
withReadonlyRest.call('wrong', true);
expectTypeOf<SetParameterType<any, {0: boolean}>>().toBe<any>();

// A long fixed prefix contributes only its positions to the trailing rest index.
type TwentyParameterPrefix = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
type LongRestSource = (...arguments_: [...TwentyParameterPrefix, ...string[]]) => 'complete';
type ChangedLongRest = SetParameterType<LongRestSource, {20: boolean}>;
expectTypeOf<ChangedLongRest>().toBe<(...arguments_: [...TwentyParameterPrefix, ...boolean[]]) => 'complete'>();
expectTypeOf<SetParameterType<LongRestSource, readonly [...TwentyParameterPrefix, boolean]>>().toBe<ChangedLongRest>();
declare const changedLongRest: ChangedLongRest;
expectTypeOf(changedLongRest(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, true)).toBe<'complete'>();
// @ts-expect-error The original rest element type has been replaced.
changedLongRest(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 'old');

// Optional readonly positions count even when omitted, and the receiver and result stay intact.
type OptionalReadonlyRest = (this: Date, ...arguments_: readonly [request: string | undefined, retry?: boolean, audit?: Date, ...rest: number[]]) => Promise<'done'>;
declare const changedOptionalRest: SetParameterType<OptionalReadonlyRest, {3: RegExp}>;
expectTypeOf(changedOptionalRest.call(new Date(), undefined, true, undefined, /entry/)).toBe<Promise<'done'>>();
// @ts-expect-error An omitted optional position does not move the rest index.
void changedOptionalRest.call(new Date(), undefined, true, undefined, 1);

function _callChangedGenericRest<Value>(callback: SetParameterType<(first: Value, flag?: boolean, ...rest: string[]) => Value, {2: number}>, value: Value): Value {
	return callback(value, undefined, 1, 2);
}

declare function inferChangedRest<const Value>(value: Value): SetParameterType<(first: Value, ...rest: string[]) => Value, {1: number}>;
const inferredRestCallback = inferChangedRest({id: 'request'});
expectTypeOf(inferredRestCallback({id: 'request'}, 1)).toBe<{readonly id: 'request'}>();
// @ts-expect-error The inferred callback accepts the replacement rest values.
inferredRestCallback({id: 'request'}, 'old');

// An absent optional slot still occupies an argument position before the rest values.
declare const afterOptionalNever: SetParameterType<(unused?: never, ...rest: string[]) => number, {1: boolean}>;
expectTypeOf(afterOptionalNever(undefined, true)).toBe<number>();
// @ts-expect-error The optional slot does not move the replacement back to the old rest type.
afterOptionalNever(undefined, 'old');

// A short replacement tuple keeps an arbitrary generic rest element type.
function _constructShortReplacementRest<Value>(
	callback: (first: number, ...rest: Value[]) => Value,
): SetParameterType<(first: string, ...rest: Value[]) => Value, [number]> {
	return callback;
}

function _callShortReplacementRest<Value>(
	callback: SetParameterType<(first: string, ...rest: Value[]) => Value, [number]>,
	value: Value,
): Value {
	return callback(1, value);
}

// A numeric replacement index signature reaches fixed, optional, and rest arguments together.
type ReplaceEveryArgument = SetParameterType<(this: Date, first: string, second?: number, ...rest: boolean[]) => 'ready', Record<number, RegExp>>;
expectTypeOf<ReplaceEveryArgument>().toBe<(this: Date, first: RegExp, second?: RegExp, ...rest: RegExp[]) => 'ready'>();
declare const replaceEveryArgument: ReplaceEveryArgument;
expectTypeOf(replaceEveryArgument.call(new Date(), /first/, undefined, /rest/)).toBe<'ready'>();
// @ts-expect-error A replacement index signature also changes the required first argument.
replaceEveryArgument.call(new Date(), 'old');
// @ts-expect-error An optional argument keeps its position and receives the replacement type.
replaceEveryArgument.call(new Date(), /first/, 1);

function _constructEveryReplacementArgument<Value>(
	callback: (this: Date, first: Value, second?: Value, ...rest: Value[]) => 'ready',
): SetParameterType<(this: Date, first: string, second?: number, ...rest: boolean[]) => 'ready', Record<number, Value>> {
	return callback;
}

// Each replacement object keeps its own selected argument positions.
expectTypeOf<Parameters<SetParameterType<(first: string, second: number) => void, {0: boolean} | {1: Date}>>>()
	.toBe<[first: boolean, second: number] | [first: string, second: Date]>();
expectTypeOf<Parameters<SetParameterType<(first: string, second: number) => void, [boolean] | {1: Date}>>>()
	.toBe<[first: boolean, second: number] | [first: string, second: Date]>();

declare const unionRestReplacement: SetParameterType<(this: Date, first: string, ...rest: boolean[]) => 'ready', {0: RegExp} | {'1': Date}>;
expectTypeOf(unionRestReplacement.call(new Date(), /first/, true)).toBe<'ready'>();
expectTypeOf(unionRestReplacement.call(new Date(), 'first', new Date())).toBe<'ready'>();
// @ts-expect-error Replacement alternatives do not mix their changed prefix and rest arguments.
unionRestReplacement.call(new Date(), /first/, new Date());
// @ts-expect-error Replacement alternatives retain their receiver.
unionRestReplacement.call('wrong', /first/, true);

function _constructUnionReplacement<Value>(
	callback: (...arguments_: [first: Value, second: number] | [first: string, second: Date]) => 'ready',
): SetParameterType<(first: string, second: number) => 'ready', {0: Value} | {1: Date}> {
	return callback;
}

// A rest index belongs to its parameter-list alternative, not to the union of all lists.
type PacketArguments = [kind: 'first', ...values: number[]] | [kind: 'second', enabled: boolean, ...labels: string[]];
type PacketCallback = (this: Date, ...arguments_: PacketArguments) => 'ready';
type ChangedPacketCallback = SetParameterType<PacketCallback, {1: Date}>;
expectTypeOf<Parameters<ChangedPacketCallback>>()
	.toBe<[kind: 'first', ...values: Date[]] | [kind: 'second', enabled: Date, ...labels: string[]]>();
expectTypeOf<Parameters<SetParameterType<PacketCallback, ['changed', Date]>>>()
	.toBe<[kind: 'changed', ...values: Date[]] | [kind: 'changed', enabled: Date, ...labels: string[]]>();
expectTypeOf<ThisParameterType<ChangedPacketCallback>>().toBe<Date>();
declare const changedPackets: ChangedPacketCallback;
expectTypeOf(changedPackets.call(new Date(), 'first', new Date(), new Date())).toBe<'ready'>();
expectTypeOf(changedPackets.call(new Date(), 'second', new Date(), 'label')).toBe<'ready'>();
// @ts-expect-error The first alternative's old rest element type is replaced.
changedPackets.call(new Date(), 'first', 1);
// @ts-expect-error A string label belongs only to the second alternative.
changedPackets.call(new Date(), 'first', new Date(), 'label');
// @ts-expect-error Replacing parameter alternatives retains the receiver.
changedPackets.call('wrong', 'second', new Date());

type ReadonlyPacketCallback<Value> = (this: Date, ...arguments_: readonly [kind: 'first', ...values: number[]] | readonly [kind: 'second', enabled: boolean, ...labels: string[]]) => Promise<Value>;
function _constructReadonlyPacketCallback<Value>(
	callback: (this: Date, ...arguments_: readonly [kind: 'first', ...values: Value[]] | readonly [kind: 'second', enabled: Value, ...labels: string[]]) => Promise<Value>,
): SetParameterType<ReadonlyPacketCallback<Value>, {1: Value}> {
	return callback;
}

// Replacing a fixed prefix keeps an unresolved generic rest parameter list intact.
function constructGenericParameterList<Receiver, Arguments extends readonly unknown[], Result>(
	callback: (this: Receiver, first: number, ...arguments_: Arguments) => Result,
): SetParameterType<(this: Receiver, first: string, ...arguments_: Arguments) => Result, {0: number}> {
	return callback;
}

declare const genericParameterListCallback: (this: Date, first: number, label: 'ready', ...flags: boolean[]) => Promise<{readonly label: 'ready'}>;
const constructedGenericParameterList = constructGenericParameterList(genericParameterListCallback);
expectTypeOf(constructedGenericParameterList.call(new Date(), 1, 'ready', true, false)).toBe<Promise<{readonly label: 'ready'}>>();
expectTypeOf<ThisParameterType<typeof constructedGenericParameterList>>().toBe<Date>();
// @ts-expect-error The changed fixed prefix rejects the original type.
void constructedGenericParameterList.call(new Date(), 'old', 'ready');
// @ts-expect-error The generic rest list retains its required literal argument.
void constructedGenericParameterList.call(new Date(), 1, 'wrong');
// @ts-expect-error The remaining variadic values retain their original type.
void constructedGenericParameterList.call(new Date(), 1, 'ready', 1);
// @ts-expect-error Constructing the generic wrapper retains its receiver.
void constructedGenericParameterList.call('wrong', 1, 'ready');
