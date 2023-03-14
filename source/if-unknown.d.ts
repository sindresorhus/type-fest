import type {IsUnknown} from './is-unknown';

/**
If the given type `T` is `unknown`, the returned type is `TypeIfUnknown`. Otherwise, the return type is `TypeIfNotUnknown`. If only `T` is specified, `TypeIfUnknown` will be `true` and `TypeIfNotUnknown` will be false.

Useful in type utilities, such as when dealing with unknown data from API calls.

@example
```
import type {IfUnknown} from 'type-fest';

// https://github.com/pajecawav/tiny-global-store/blob/master/src/index.ts
type Action<TState, TPayload = void> = IfUnknown<
	TPayload,
	(state: TState) => TState,
	(state: TState, payload: TPayload) => TState
>;

class Store<TState> {
	constructor(private state: TState) {}

	execute<TPayload = void>(action: Action<TState, TPayload>, payload?: TPayload): TState {
		this.state = action(this.state, payload);
		return this.state;
	}

	// ... other methods
}

const store = new Store({value: 1});
declare const someExternalData: unknown;

store.execute(state => ({value: state.value + 1}));
//=> `TPayload` is `void`

store.execute((state, payload) => ({value: state.value + payload}), 5);
//=> `TPayload` is `5`

store.execute((state, payload) => ({value: state.value + payload}), someExternalData);
//=> Errors: `action` is `(state: TState) => TState`
```

@category Type Guard
@category Utilities
*/
export type IfUnknown<T, TypeIfUnknown = true, TypeIfNotUnknown = false> = (
	IsUnknown<T> extends true ? TypeIfUnknown : TypeIfNotUnknown
);
