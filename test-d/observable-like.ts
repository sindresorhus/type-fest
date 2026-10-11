import {expectTypeOf} from 'nz';
import type {ObservableLike} from '../source/globals/index.d.ts';

expectTypeOf(Symbol.observable).toBeAssignableTo<symbol>();

const observable = (null as any) as ObservableLike;

const subscription = observable.subscribe({
	next() {}, // eslint-disable-line @typescript-eslint/no-empty-function
});
expectTypeOf(subscription).toBe<{unsubscribe(): void}>();

observable.subscribe({
	next(value) {
		expectTypeOf(value).toBe<unknown>();
	},
});

const observable2 = (null as any) as ObservableLike<string>;

observable2.subscribe({
	next() {}, // eslint-disable-line @typescript-eslint/no-empty-function
});
observable2.subscribe({
	next(value) {
		expectTypeOf(value).toBe<string>();
	},
});
