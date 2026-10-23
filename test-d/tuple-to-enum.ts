import {expectTypeOf} from 'nz';
import type {LiteralUnion, Tagged, TupleToEnum, TupleToEnumOptions} from '../index.d.ts';

// Tuple input
expectTypeOf({One: 'One', Two: 'Two'} as const).toBe<TupleToEnum<['One', 'Two']>>();
expectTypeOf({X: 0, Y: 1, Z: 2} as const).toBe<TupleToEnum<['X', 'Y', 'Z'], {numeric: true}>>();
expectTypeOf<TupleToEnum<['A', 'B'] | ['C', 'D']>>().toBe<{readonly A: 'A'; readonly B: 'B'} | {readonly C: 'C'; readonly D: 'D'}>();
expectTypeOf<TupleToEnum<['A', 'B'] | ['C', 'D'], {numeric: true}>>().toBe<{readonly A: 0; readonly B: 1} | {readonly C: 0; readonly D: 1}>();

// Single element tuple
expectTypeOf({Only: 'Only'} as const).toBe<TupleToEnum<['Only']>>();
expectTypeOf({0: 0} as const).toBe<TupleToEnum<[0]>>();
expectTypeOf({0: 5} as const).toBe<TupleToEnum<[0], {numeric: true; startIndex: 5}>>();

// Tuple with numeric keys
expectTypeOf({1: 1, 2: 2, 3: 3} as const).toBe<TupleToEnum<[1, 2, 3]>>();
expectTypeOf({1: 10, 2: 11, 3: 12} as const).toBe<TupleToEnum<[1, 2, 3], {numeric: true; startIndex: 10}>>();

// Mixed keys
expectTypeOf({a: 'a', 1: 1, b: 'b'} as const).toBe<TupleToEnum<['a', 1, 'b']>>();
expectTypeOf({a: 0, 1: 1, b: 2} as const).toBe<TupleToEnum<['a', 1, 'b'], {numeric: true; startIndex: 0}>>();

// Symbol keys
declare const sym1: unique symbol;
declare const sym2: unique symbol;

expectTypeOf({[sym1]: sym1, [sym2]: sym2} as const).toBe<TupleToEnum<[typeof sym1, typeof sym2]>>();

// Large tuple
type BigTuple = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
expectTypeOf({a: 'a', b: 'b', c: 'c', d: 'd', e: 'e', f: 'f', g: 'g'} as const).toBe<TupleToEnum<BigTuple>>();

// Symbols with numeric indices
expectTypeOf({[sym1]: 0, [sym2]: 1} as const).toBe<TupleToEnum<[typeof sym1, typeof sym2], {numeric: true}>>();

// Readonly tuple input
expectTypeOf({a: 'a', b: 'b', c: 'c'} as const).toBe<TupleToEnum<readonly ['a', 'b', 'c']>>();

// Non-literal input fallback
expectTypeOf({}).toBe<TupleToEnum<string[]>>();
expectTypeOf({}).toBe<TupleToEnum<number[]>>();
expectTypeOf({}).toBe<TupleToEnum<symbol[]>>();
expectTypeOf({}).toBe<TupleToEnum<[string]>>();
expectTypeOf({foo: 'foo'} as const).toBe<TupleToEnum<[string, 'foo']>>();

// Empty array cases
expectTypeOf({}).toBe<TupleToEnum<[]>>();
expectTypeOf({}).toBe<TupleToEnum<readonly []>>();

// `never` / `any`
expectTypeOf({}).toBe<TupleToEnum<never>>();
expectTypeOf({}).toBe<TupleToEnum<any>>();

// Literal const arrays
const buttons = ['Play', 'Pause', 'Stop'] as const;

expectTypeOf({Play: 'Play', Pause: 'Pause', Stop: 'Stop'} as const).toBe<TupleToEnum<typeof buttons>>();
expectTypeOf({Play: 0, Pause: 1, Stop: 2} as const).toBe<TupleToEnum<typeof buttons, {numeric: true; startIndex: 0}>>();

const level = ['DEBUG', 'INFO', 'ERROR', 'WARNING'] as const;

expectTypeOf({
	DEBUG: 'DEBUG',
	INFO: 'INFO',
	ERROR: 'ERROR',
	WARNING: 'WARNING',
} as const).toBe<TupleToEnum<typeof level>>();
expectTypeOf({
	DEBUG: 0,
	INFO: 1,
	ERROR: 2,
	WARNING: 3,
} as const).toBe<TupleToEnum<typeof level, {numeric: true}>>();

// Edge cases for startIndex
expectTypeOf({x: -1} as const).toBe<TupleToEnum<['x'], {numeric: true; startIndex: -1}>>();
expectTypeOf({x: -100, y: -99} as const).toBe<TupleToEnum<['x', 'y'], {numeric: true; startIndex: -100}>>();
expectTypeOf({test: 100} as const).toBe<TupleToEnum<['test'], {numeric: true; startIndex: 100}>>();

// Numeric edge cases
expectTypeOf({0: 0, [-5]: 1, 999: 2} as const).toBe<TupleToEnum<[0, -5, 999], {numeric: true}>>();

// Union and duplicate elements
expectTypeOf<TupleToEnum<['a' | 'b', 'c']>>().toBe<{readonly a: 'a'; readonly b: 'b'; readonly c: 'c'}>();
expectTypeOf<TupleToEnum<['a', 'b', 'a']>>().toBe<{readonly a: 'a'; readonly b: 'b'}>();
expectTypeOf<TupleToEnum<['a', 'b', 'a'], {numeric: true}>>().toBe<{readonly a: 0 | 2; readonly b: 1}>();

// Default `startIndex` is `0`, like TypeScript enums
expectTypeOf<TupleToEnum<['a', 'b'], {numeric: true}>>().toBe<{readonly a: 0; readonly b: 1}>();
expectTypeOf<TupleToEnum<['a', 'b'], {numeric: true; startIndex: 1}>>().toBe<{readonly a: 1; readonly b: 2}>();

// `startIndex` without `numeric` has no effect
expectTypeOf<TupleToEnum<['a', 'b'], {startIndex: 5}>>().toBe<{readonly a: 'a'; readonly b: 'b'}>();

// Invalid input
// @ts-expect-error
type InvalidBoolean = TupleToEnum<[boolean]>;
// @ts-expect-error
type InvalidUnknown = TupleToEnum<unknown>;

// Non-literal elements are ignored, and the other elements keep their indexes
expectTypeOf<TupleToEnum<[`on${string}`, 'x']>>().toBe<{readonly x: 'x'}>();
expectTypeOf<TupleToEnum<[`on${string}`, 'x'], {numeric: true}>>().toBe<{readonly x: 1}>();
expectTypeOf<TupleToEnum<[string, 'foo'], {numeric: true}>>().toBe<{readonly foo: 1}>();

// Rest elements
expectTypeOf<TupleToEnum<['a', ...Array<'b'>]>>().toBe<{readonly a: 'a'; readonly b: 'b'}>();
expectTypeOf<TupleToEnum<['a', ...Array<'b'>], {numeric: true}>>().toBe<{readonly a: 0}>(); // Rest elements have no fixed index
expectTypeOf<TupleToEnum<readonly ['a', 'b'], {numeric: true}>>().toBe<{readonly a: 0; readonly b: 1}>();

// An option chosen at runtime can produce either complete enum representation.
expectTypeOf<TupleToEnum<['play', 'pause'], {numeric: boolean}>>().toBe<{readonly play: 'play'; readonly pause: 'pause'} | {readonly play: 0; readonly pause: 1}>();
const dynamicNumericEnum: TupleToEnum<['play', 'pause'], {numeric: boolean}> = {play: 0, pause: 1};
expectTypeOf(dynamicNumericEnum).toBe<{readonly play: 0; readonly pause: 1}>();

expectTypeOf<TupleToEnum<readonly ['play', 'pause'], {numeric: boolean; startIndex: 3}>>().toBe<{readonly play: 'play'; readonly pause: 'pause'} | {readonly play: 3; readonly pause: 4}>();
expectTypeOf<TupleToEnum<['a', 'b'], {numeric: true} | {numeric: false}>>().toBe<{readonly a: 'a'; readonly b: 'b'} | {readonly a: 0; readonly b: 1}>();
expectTypeOf<TupleToEnum<['a', 'b'], {numeric: true; startIndex: 5} | {numeric: false; startIndex: 20}>>().toBe<{readonly a: 'a'; readonly b: 'b'} | {readonly a: 5; readonly b: 6}>();
expectTypeOf<TupleToEnum<['a', 'b'] | ['c'], {numeric: boolean}>>().toBe<{readonly a: 'a'; readonly b: 'b'} | {readonly a: 0; readonly b: 1} | {readonly c: 'c'} | {readonly c: 0}>();
expectTypeOf<TupleToEnum<['a', 'b', 'a'], {numeric: boolean}>>().toBe<{readonly a: 'a'; readonly b: 'b'} | {readonly a: 0 | 2; readonly b: 1}>();
expectTypeOf<TupleToEnum<[typeof sym1, -1], {numeric: boolean; startIndex: -2}>>().toBe<{readonly [sym1]: typeof sym1; readonly [-1]: -1} | {readonly [sym1]: -2; readonly [-1]: -1}>();
expectTypeOf<TupleToEnum<[string, 'x'], {numeric: boolean}>>().toBe<{readonly x: 'x'} | {readonly x: 1}>();
expectTypeOf<TupleToEnum<['a', ...Array<'b'>], {numeric: boolean}>>().toBe<{readonly a: 'a'; readonly b: 'b'} | {readonly a: 0}>();
expectTypeOf<keyof TupleToEnum<[], {numeric: boolean}>>().toBe<never>();
expectTypeOf<TupleToEnum<any, {numeric: boolean}>>().toBe<{}>();
expectTypeOf<TupleToEnum<never, {numeric: boolean}>>().toBe<{}>();
// Optional or `any` options use the existing default-option behavior.
expectTypeOf<TupleToEnum<['a'], {numeric?: boolean}>>().toBe<{readonly a: 'a'}>();
expectTypeOf<TupleToEnum<['a'], {numeric: any}>>().toBe<{readonly a: 'a'}>();
expectTypeOf<TupleToEnum<['a'], {numeric: never}>>().toBe<{readonly a: 'a'}>();
expectTypeOf<{a: 'a'; b: 1}>().not.toBeAssignableTo<TupleToEnum<['a', 'b'], {numeric: boolean}>>();
// @ts-expect-error
expectTypeOf<TupleToEnum<['a'], {numeric: unknown}>>();

// Classify each position before broad keys can absorb the known literal positions.
expectTypeOf<TupleToEnum<[string, number, symbol, 'ready', 7, typeof sym1]>>().toBe<{readonly ready: 'ready'; readonly 7: 7; readonly [sym1]: typeof sym1}>();
expectTypeOf<TupleToEnum<[Uppercase<string>, 'fixed', ...Array<'rest'>]>>().toBe<{readonly fixed: 'fixed'; readonly rest: 'rest'}>();
expectTypeOf<TupleToEnum<readonly [...Array<'queued'>, 'done']>>().toBe<{readonly queued: 'queued'; readonly done: 'done'}>();
expectTypeOf<TupleToEnum<Array<'read' | 'write'>>>().toBe<{readonly read: 'read'; readonly write: 'write'}>();
expectTypeOf<TupleToEnum<[any, 'known', never]>>().toBe<{readonly known: 'known'}>();
expectTypeOf<TupleToEnum<[LiteralUnion<'hint', string>, 'fixed']>>().toBe<{readonly fixed: 'fixed'}>();

// Literal property identity is retained for enums, symbols, and branded keys.
enum CommandKey {
	Ready = 'ready',
	Done = 'done',
}
expectTypeOf<TupleToEnum<[CommandKey.Ready, CommandKey.Done]>>().toBe<{readonly [CommandKey.Ready]: CommandKey.Ready; readonly [CommandKey.Done]: CommandKey.Done}>();
expectTypeOf<keyof TupleToEnum<[Tagged<'known', 'Command'>]>>().toBe<Tagged<'known', 'Command'>>();
expectTypeOf<TupleToEnum<readonly ['a', 'b'] & {readonly metadata: 'commands'}>>().toBe<{readonly a: 'a'; readonly b: 'b'}>();

// Generic consumers can return the result as an object and read known entries.
function _genericEnum<Values extends readonly PropertyKey[]>(value: TupleToEnum<Values>): object {
	return value;
}

function _genericEnumOptions<Values extends readonly PropertyKey[], Options extends TupleToEnumOptions>(value: TupleToEnum<Values, Options>): object {
	return value;
}

function _knownEnumEntry<Value extends string>(value: TupleToEnum<['fixed', Value]>): 'fixed' {
	return value.fixed;
}

declare function enumOf<const Values extends readonly PropertyKey[]>(values: Values): TupleToEnum<Values>;
const inferredEnum = enumOf(['ready', 7, sym1]);
expectTypeOf(inferredEnum).toBe<{readonly ready: 'ready'; readonly 7: 7; readonly [sym1]: typeof sym1}>();
// @ts-expect-error Enum properties remain readonly.
inferredEnum.ready = 'ready';
declare function acceptCommand(key: keyof typeof inferredEnum): void;
// @ts-expect-error Unlisted properties are rejected.
acceptCommand('missing');
// @ts-expect-error Unknown tuple elements are not property keys.
type UnknownElementEnum = TupleToEnum<[unknown, 'known']>;

// Inferred entries remain usable through numeric and unique-symbol indexed reads.
expectTypeOf(inferredEnum[7]).toBe<7>();
expectTypeOf(inferredEnum[sym1]).toBe<typeof sym1>();
expectTypeOf<keyof typeof inferredEnum>().toBe<'ready' | 7 | typeof sym1>();

// A chosen starting index shifts the whole numeric enum together.
type ShiftedCommands = TupleToEnum<['start', 'stop'], {numeric: true; startIndex: 1 | 10}>;
type ExpectedShiftedCommands = {readonly start: 1; readonly stop: 2} | {readonly start: 10; readonly stop: 11};
expectTypeOf<ShiftedCommands>().toBe<ExpectedShiftedCommands>();
expectTypeOf<{start: 1; stop: 11}>().not.toBeAssignableTo<ShiftedCommands>();

function _readShiftedCommand(value: ShiftedCommands): void {
	if (value.start === 1) {
		expectTypeOf(value.stop).toBe<2>();
	}
}

// Each negative or positive shift is selected once, including duplicate keys and representation choices.
type SignedShiftedCommands = TupleToEnum<readonly ['start', 'stop'], {numeric: true; startIndex: -2 | 4}>;
expectTypeOf<SignedShiftedCommands>().toBe<{readonly start: -2; readonly stop: -1} | {readonly start: 4; readonly stop: 5}>();
expectTypeOf<{start: -2; stop: 5}>().not.toBeAssignableTo<SignedShiftedCommands>();
type DuplicateShiftedCommands = TupleToEnum<['start', 'stop', 'start'], {numeric: true; startIndex: 1 | 10}>;
expectTypeOf<DuplicateShiftedCommands>().toBe<{readonly start: 1 | 3; readonly stop: 2} | {readonly start: 10 | 12; readonly stop: 11}>();
expectTypeOf<{start: 1; stop: 11}>().not.toBeAssignableTo<DuplicateShiftedCommands>();
expectTypeOf<TupleToEnum<['start', 'stop'], {numeric: boolean; startIndex: 1 | 10}>>()
	.toBe<ExpectedShiftedCommands | {readonly start: 'start'; readonly stop: 'stop'}>();
expectTypeOf<TupleToEnum<['start', 'stop'] | ['pause'], {numeric: true; startIndex: 1 | 10}>>()
	.toBe<ExpectedShiftedCommands | {readonly pause: 1} | {readonly pause: 10}>();

// An enum-valued offset retains its own identity, while the later values still use the chosen offset.
enum CommandOffset {
	First = 1,
	Later = 10,
}
type OffsetEnumOptions<Start extends number> = {numeric: true; startIndex: Start};
expectTypeOf<TupleToEnum<['start', 'stop'], OffsetEnumOptions<CommandOffset>>>()
	.toBe<TupleToEnum<['start', 'stop'], OffsetEnumOptions<CommandOffset.First>> | TupleToEnum<['start', 'stop'], OffsetEnumOptions<CommandOffset.Later>>>();

// Optional and sentinel options retain their default behavior; a wide offset remains a number.
expectTypeOf<TupleToEnum<['start', 'stop'], {numeric: true; startIndex?: 1 | 10}>>().toBe<{readonly start: 0; readonly stop: 1}>();
expectTypeOf<TupleToEnum<['start', 'stop'], {numeric: true; startIndex: number}>>().toBe<{readonly start: number; readonly stop: number}>();
expectTypeOf<TupleToEnum<['start', 'stop'], any>>().toBe<{readonly start: 'start'; readonly stop: 'stop'}>();
expectTypeOf<TupleToEnum<['start', 'stop'], never>>().toBe<{readonly start: 'start'; readonly stop: 'stop'}>();
// @ts-expect-error A starting index must be numeric.
type UnknownStartingIndex = TupleToEnum<['start'], {numeric: true; startIndex: unknown}>;

declare function shiftedEnum<const Values extends readonly PropertyKey[], const Start extends number>(values: Values, start: Start): TupleToEnum<Values, OffsetEnumOptions<Start>>;
declare const chosenCommandOffset: 1 | 10;
const inferredShiftedCommands = shiftedEnum(['start', 'stop'], chosenCommandOffset);
expectTypeOf(inferredShiftedCommands).toBe<ExpectedShiftedCommands>();
// @ts-expect-error Correlation does not change readonly modifiers.
inferredShiftedCommands.start = 1;
expectTypeOf<{start: 10; stop: 2}>().not.toBeAssignableTo<typeof inferredShiftedCommands>();
