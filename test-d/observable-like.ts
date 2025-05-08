import {expectType, expectAssignable} from 'tsd';
import type {ObservableLike} from '../source/globals/index.d.ts';

// eslint-disable-next-line no-use-extend-native/no-use-extend-native
expectAssignable<symbol>(Symbol.observable);

const observable = (null as any) as ObservableLike;

const subscription = observable.subscribe({
	next() {}, // eslint-disable-line @typescript-eslint/no-empty-function
});
expectType<{unsubscribe(): void}>(subscription);

observable.subscribe({
	next(value) {
		expectType<unknown>(value);
	},
});

const observable2 = (null as any) as ObservableLike<string>;

observable2.subscribe({
	next() {}, // eslint-disable-line @typescript-eslint/no-empty-function
});
observable2.subscribe({
	next(value) {
		expectType<string>(value);
	},
});
