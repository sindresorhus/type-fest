import {expectTypeOf} from 'expect-type';
import type {ObservableLike} from '../index';

// eslint-disable-next-line no-use-extend-native/no-use-extend-native
expectTypeOf(Symbol.observable).toMatchTypeOf<symbol>();

const observable = (null as any) as ObservableLike;

const subscription = observable.subscribe({
	next() {}, // eslint-disable-line @typescript-eslint/no-empty-function
});
expectTypeOf(subscription).toEqualTypeOf<{unsubscribe(): void}>();

observable.subscribe({
	next(value) {
		expectTypeOf(value).toEqualTypeOf<unknown>();
	},
});

const observable2 = (null as any) as ObservableLike<string>;

observable2.subscribe({
	next() {}, // eslint-disable-line @typescript-eslint/no-empty-function
});
observable2.subscribe({
	next(value) {
		expectTypeOf(value).toEqualTypeOf<string>();
	},
});
