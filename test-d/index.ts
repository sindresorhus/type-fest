import {expectType, expectAssignable} from 'tsd';
import {ObservableLike} from '../index';

// eslint-disable-next-line no-use-extend-native/no-use-extend-native
expectAssignable<symbol>(Symbol.observable);

const observable = (null as any) as ObservableLike;

observable.subscribe(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
observable.subscribe(value => {
 expectType<unknown>(value);
});

const observable2 = (null as any) as ObservableLike<string>;

observable2.subscribe(() => {}); // eslint-disable-line @typescript-eslint/no-empty-function
observable2.subscribe(value => {
	expectType<string>(value);
});
