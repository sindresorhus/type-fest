import {expectTypeOf} from 'nz';
import type {Pipe, TupleOf} from '../index.d.ts';

expectTypeOf<Pipe<[(text: string) => number, (value: number) => boolean]>>().toBe<(text: string) => boolean>();
expectTypeOf<Pipe<readonly [(text: string) => number, (value: number) => boolean]>>().toBe<(text: string) => boolean>();
expectTypeOf<Pipe<[(first: string, second: number) => boolean, (value: boolean) => Date, (value: Date) => string]>>().toBe<(first: string, second: number) => string>();
expectTypeOf<Pipe<[(value?: string) => number]>>().toBe<(value?: string) => number>();
expectTypeOf<Pipe<[(...values: string[]) => number, (value: number) => string]>>().toBe<(...values: string[]) => string>();
expectTypeOf<Pipe<[(...values: readonly string[]) => number, (value: number) => string]>>().toBe<(...values: readonly string[]) => string>();
expectTypeOf<Pipe<[(...values: never[]) => number]>>().toBe<(...values: never[]) => number>();
expectTypeOf<Pipe<[(...values: readonly never[]) => number]>>().toBe<(...values: readonly never[]) => number>();
expectTypeOf<Pipe<[(...values: never[]) => number, (value: number) => boolean]>>().toBe<(...values: never[]) => boolean>();
expectTypeOf<Pipe<[(...values: readonly never[]) => number, (value: number) => boolean]>>().toBe<(...values: readonly never[]) => boolean>();
expectTypeOf<Pipe<[(...values: never[]) => number, (value: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[(...values: readonly never[]) => number, (value: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, (value: number) => string]>>().toBe<() => string>();
expectTypeOf<Pipe<[(value: string) => number]>>().toBe<(value: string) => number>();

// Each overload of the first stage starts a separate pipeline, keeping the valid ones in order.
expectTypeOf<Pipe<[{(value: number): string; (value: string): number}, (value: number) => boolean]>>().toBe<(value: string) => boolean>();
expectTypeOf<Pipe<[{(value: number): string; (value: string): number}, (value: string) => boolean]>>().toBe<(value: number) => boolean>();
expectTypeOf<Pipe<[{(value: number): string; (value: string): string}, (value: string) => boolean]>>().toBe<((value: number) => boolean) & ((value: string) => boolean)>();
expectTypeOf<Pipe<[{(value: number): string; (value: string): number}, (value: Date) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[{(value: number): string; (value: string): number}]>>().toBe<((value: number) => string) & ((value: string) => number)>();

// Calls use the first overload of the first stage, so a later overload it accepts is unreachable.
declare const firstWins: Pipe<[{(value: string | number): 1; (value: number): 2}]>;
expectTypeOf(firstWins(1)).toBe<1>();

// A later stage uses its first overload that accepts the whole preceding return type.
expectTypeOf<Pipe<[() => number, {(value: string): Date; (value: number): boolean}]>>().toBe<() => boolean>();
// The first accepting overload is used without backtracking.
expectTypeOf<Pipe<[() => string, {(value: string): number; (value: string): Date}, (value: Date) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, {(value: number): boolean; (value: string): Date}]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => number, {(value: number): boolean; (value: number | string): Date}]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => string | number, {(value: string): Date; (value: number): boolean}]>>().toBe<never>();
expectTypeOf<Pipe<[() => string | number, {(value: string): Date; (value: string | number): boolean}]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => number, {(value: number, extra: string): Date; (value: number): boolean}]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => number, {(value: number): never; (value: string): Date}]>>().toBe<() => never>();
expectTypeOf<Pipe<[() => number, {(value: number): string; (value: string): Date}, (value: string) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => number, never]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, any]>>().toBe<never>();
// A `never` or `any` stage kills the pipeline, even with stages after it.
expectTypeOf<Pipe<[() => number, never, (value: string) => number]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, any, (value: string) => number]>>().toBe<never>();

type TupleUnionStage = (...values: [string] | [number, number]) => number;
type ReadonlyTupleUnionStage = (...values: readonly [string] | readonly [number, number]) => number;
type UnaryTupleUnionStage = (...values: [string] | [number]) => boolean;
expectTypeOf<Pipe<[TupleUnionStage]>>().toBe<TupleUnionStage>();
expectTypeOf<Pipe<[ReadonlyTupleUnionStage]>>().toBe<ReadonlyTupleUnionStage>();
expectTypeOf<Pipe<[TupleUnionStage, (value: number) => boolean]>>().toBe<(...values: [string] | [number, number]) => boolean>();
expectTypeOf<Pipe<[TupleUnionStage, (value: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[ReadonlyTupleUnionStage, (value: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, UnaryTupleUnionStage]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => number, UnaryTupleUnionStage, (value: Date) => string]>>().toBe<never>();

// A union of functions as a stage is handled through its members' overloads.
expectTypeOf<Pipe<[() => number, ((value: number) => boolean) | ((value: string) => Date)]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => 'x', ((value: 'x') => 1) | ((value: 'x') => 2)]>>().toBe<(() => 1) | (() => 2)>();
expectTypeOf<Pipe<[() => number, ((value: number) => 'a') | {(value: string): 'b'; (value: number): 'c'}]>>().toBe<(() => 'a') | (() => 'c')>();
expectTypeOf<Pipe<[() => string | number, ((value: string) => 'a') | ((value: number) => 'b')]>>().toBe<never>();
expectTypeOf<Pipe<[((value: number) => string) | ((value: string) => number), (value: string) => boolean]>>().toBe<(value: number) => boolean>();
expectTypeOf<Pipe<[() => number, ((value: number) => 'x') | ((value: string) => boolean), (value: 'x') => string]>>().toBe<() => string>();

expectTypeOf<Pipe<[]>>().toBe<never>();
expectTypeOf<Pipe<Array<(value: string) => string>>>().toBe<never>();
expectTypeOf<Pipe<[(value: string) => number, ...Array<(value: number) => number>]>>().toBe<never>();

// The entire preceding return type must be accepted, not just one union member.
expectTypeOf<Pipe<[() => string | number, (value: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => string, (value: string | number) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => unknown, (value: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => string, (value: never) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, (...arguments_: never) => boolean]>>().toBe<never>();
// A stage with a `never` parameter list is skipped, even for a `never` value.
expectTypeOf<Pipe<[() => never, (...arguments_: never) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => string, (value: string) => number, (...arguments_: never) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => never, (value: string) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => never, (value: never) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => any, (value: string) => unknown]>>().toBe<() => unknown>();
expectTypeOf<Pipe<[() => number, (value: number) => never]>>().toBe<() => never>();
expectTypeOf<Pipe<[() => number, () => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, (value?: number) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, (value: number, extra?: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => number, (value: number, extra: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => Promise<number>, (value: number) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => Promise<number>, (value: Promise<number>) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => string] | [() => number]>>().toBe<(() => string) | (() => number)>();
expectTypeOf<Pipe<any>>().toBe<any>();
expectTypeOf<Pipe<never>>().toBe<never>();

declare const zeroArgument: Pipe<[(...values: never[]) => number]>;
expectTypeOf(zeroArgument()).toBe<number>();

declare const tupleUnion: Pipe<[TupleUnionStage]>;
expectTypeOf(tupleUnion('value')).toBe<number>();
expectTypeOf(tupleUnion(1, 2)).toBe<number>();
// @ts-expect-error The first stage does not accept a single number.
tupleUnion(1);

declare const parse: Pipe<[(text: string) => number, (value: number) => boolean]>;
expectTypeOf(parse('1')).toBe<boolean>();
// @ts-expect-error The first stage requires a string.
parse(1);
// @ts-expect-error An array of functions is required.
type UnknownFunctions = Pipe<unknown>;
// @ts-expect-error Each stage must be callable.
type InvalidStage = Pipe<[() => string, number]>;

// Longer pipelines.
expectTypeOf<Pipe<[
	(text: string) => string[],
	(parts: string[]) => number[],
	(numbers: number[]) => number,
	(total: number) => string,
	(text: string) => boolean,
]>>().toBe<(text: string) => boolean>();
expectTypeOf<Pipe<[() => number, ...TupleOf<100, (value: number) => number>]>>().toBe<() => number>();
expectTypeOf<Pipe<[() => number, ...TupleOf<50, (value: number) => number>, (value: string) => number]>>().toBe<never>();

// Each stage only needs to accept the preceding return type.
expectTypeOf<Pipe<[() => 'a', (value: string) => number]>>().toBe<() => number>();
expectTypeOf<Pipe<[() => 'a' | 'b', (value: 'a') => number]>>().toBe<never>();
expectTypeOf<Pipe<[() => {a: 1; b: 2}, (value: {a: number}) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => {a: number}, (value: {a: number; b: number}) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => string[], (value: readonly string[]) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => readonly string[], (value: string[]) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => string, (value: unknown) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => string, (value: any) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => undefined, (value: string | undefined) => boolean]>>().toBe<() => boolean>();
expectTypeOf<Pipe<[() => string | undefined, (value: string) => boolean]>>().toBe<never>();
expectTypeOf<Pipe<[() => boolean, (value: true) => string]>>().toBe<never>();

// A `void` parameter counts as optional.
expectTypeOf<Pipe<[() => void, (value: void) => string]>>().toBe<never>();
expectTypeOf<Pipe<[() => void, (value: undefined) => string]>>().toBe<never>();

// Receiver types, type predicates, and generic relationships are not preserved.
expectTypeOf<Pipe<[(this: Date, value: string) => number]>>().toBe<(value: string) => number>();
expectTypeOf<Pipe<[(value: unknown) => value is string, (value: boolean) => number]>>().toBe<(value: unknown) => number>();
expectTypeOf<Pipe<[() => string, <T>(value: T) => T]>>().toBe<() => unknown>();
expectTypeOf<Pipe<[<T>(value: T) => T, (value: string) => number]>>().toBe<never>();

// Unions of pipelines, where invalid members are dropped.
expectTypeOf<Pipe<[() => string, (value: string) => number] | [() => string, (value: number) => number]>>().toBe<() => number>();
expectTypeOf<Pipe<[(value: string) => number] | []>>().toBe<(value: string) => number>();

declare const pipeline: Pipe<[(first: string, second: number) => boolean, (value: boolean) => Date]>;
expectTypeOf(pipeline('a', 1)).toBe<Date>();
// @ts-expect-error The second argument is required.
pipeline('a');
// @ts-expect-error Constructors are not functions.
type ConstructorStage = Pipe<[new () => string]>;
