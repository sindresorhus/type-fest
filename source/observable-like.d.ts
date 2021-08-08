declare global {
	interface SymbolConstructor {
		readonly observable: symbol;
	}
}

/**
Matches a value that is like an [Observable](https://github.com/tc39/proposal-observable).

@category Basic
*/
export interface ObservableLike<ValueType = unknown> {
	subscribe(observer: (value: ValueType) => void): void;
	[Symbol.observable](): ObservableLike<ValueType>;
}
