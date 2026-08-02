import {expectType} from 'tsd';
import type {SetReturnType} from '../index.d.ts';

declare const anything: unknown;

// Without `thisArg` and without parameters.
declare const variation1: SetReturnType<() => void, number>;
expectType<() => number>(variation1);
variation1.call(anything);

// Without `thisArg` and with parameters.
declare const variation2: SetReturnType<(foo: string, bar: boolean) => number, void>;
expectType<(foo: string, bar: boolean) => void>(variation2);
variation2.call(anything, 'foo', true);

// With `thisArg` and without parameters.
function function1(this: Date): void {} // eslint-disable-line @typescript-eslint/no-empty-function
declare const variation3: SetReturnType<typeof function1, string[]>;
expectType<(this: Date) => string[]>(variation3);
variation3.call(new Date());
// @ts-expect-error
variation3.call('not-a-date');

// With `thisArg` and with parameters.
declare function function2(this: Date, foo: any, bar: Array<[number]>): any;
declare const variation4: SetReturnType<typeof function2, never>;
expectType<(this: Date, foo: any, bar: Array<[number]>) => never>(variation4);
variation4.call(new Date(), anything, [[4], [7]]);
// @ts-expect-error
variation4.call('not-a-date', anything, [[4], [7]]);

// Sanity check to the fact that omitting `this: unknown` from the argument list has no effect other than in readability.
declare function withExplicitThis(this: unknown, foo: string): number;
declare function withImplicitThis(foo: string): number;
expectType<typeof withExplicitThis>(withImplicitThis);
expectType<typeof withImplicitThis>(withExplicitThis);
