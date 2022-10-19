import {expectTypeOf} from 'expect-type';
import type {SetReturnType} from '../index';

declare const anything: unknown;

// Without `thisArg` and without parameters.
declare const variation1: SetReturnType<() => void, number>;
expectTypeOf(variation1).toEqualTypeOf<() => number>();
variation1.call(anything);

// Without `thisArg` and with parameters.
declare const variation2: SetReturnType<(foo: string, bar: boolean) => number, void>;
expectTypeOf(variation2).toEqualTypeOf<(foo: string, bar: boolean) => void>();
variation2.call(anything, 'foo', true);

// With `thisArg` and without parameters.
function fn1(this: Date): void {} // eslint-disable-line @typescript-eslint/no-empty-function
declare const variation3: SetReturnType<typeof fn1, string[]>;
expectTypeOf(variation3).toEqualTypeOf<(this: Date) => string[]>();
variation3.call(new Date());
// @ts-expect-error
variation3.call('not-a-date');

// With `thisArg` and with parameters.
declare function fn2(this: Date, foo: any, bar: Array<[number]>): any;
declare const variation4: SetReturnType<typeof fn2, never>;
expectTypeOf(variation4).toEqualTypeOf<(this: Date, foo: any, bar: Array<[number]>) => never>();
variation4.call(new Date(), anything, [[4], [7]]);
// @ts-expect-error
variation4.call('not-a-date', anything, [[4], [7]]);

// Sanity check to the fact that omitting `this: unknown` from the argument list has no effect other than in readability.
declare function withExplicitThis(this: unknown, foo: string): number;
declare function withImplicitThis(foo: string): number;
expectTypeOf(withImplicitThis).toEqualTypeOf<typeof withExplicitThis>();
expectTypeOf(withExplicitThis).toEqualTypeOf<typeof withImplicitThis>();
