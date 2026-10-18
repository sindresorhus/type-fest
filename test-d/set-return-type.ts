import {expectTypeOf} from 'nz';
import type {SetReturnType} from '../index.d.ts';

declare const anything: unknown;

// Without `thisArg` and without parameters.
declare const variation1: SetReturnType<() => void, number>;
expectTypeOf(variation1).toBe<() => number>();
variation1.call(anything);

// Without `thisArg` and with parameters.
declare const variation2: SetReturnType<(foo: string, bar: boolean) => number, void>;
expectTypeOf(variation2).toBe<(foo: string, bar: boolean) => void>();
variation2.call(anything, 'foo', true);

// With `thisArg` and without parameters.
function function1(this: Date): void {} // eslint-disable-line @typescript-eslint/no-empty-function
declare const variation3: SetReturnType<typeof function1, string[]>;
expectTypeOf(variation3).toBe<(this: Date) => string[]>();
variation3.call(new Date());
// @ts-expect-error
variation3.call('not-a-date');

// With `thisArg` and with parameters.
declare function function2(this: Date, foo: any, bar: Array<[number]>): any;
declare const variation4: SetReturnType<typeof function2, never>;
expectTypeOf(variation4).toBe<(this: Date, foo: any, bar: Array<[number]>) => never>();
variation4.call(new Date(), anything, [[4], [7]]);
// @ts-expect-error
variation4.call('not-a-date', anything, [[4], [7]]);

// Sanity check to the fact that omitting `this: unknown` from the argument list has no effect other than in readability.
declare function withExplicitThis(this: unknown, foo: string): number;
declare function withImplicitThis(foo: string): number;
expectTypeOf(withImplicitThis).toBe<typeof withExplicitThis>();
expectTypeOf(withExplicitThis).toBe<typeof withImplicitThis>();

// A type with several call signatures collapses to its last signature. This is a TypeScript limitation, not a choice, so it is pinned here rather than worked around.
declare const overloaded: SetReturnType<{(): void; (x: number): void}, string>;
expectTypeOf(overloaded).toBe<(x: number) => string>();

// A readonly rest parameter, such as a parameter list typed with `as const`, keeps its parameter positions.
declare const readonlyParameters: SetReturnType<(...arguments_: readonly [string, number?]) => boolean, string>;
expectTypeOf(readonlyParameters).toBe<(first: string, second?: number) => string>();

declare const readonlyRestParameter: SetReturnType<(first: string, ...rest: readonly number[]) => boolean, string>;
expectTypeOf(readonlyRestParameter).toBe<(first: string, ...rest: number[]) => string>();
