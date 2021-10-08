declare global {
	interface SymbolConstructor {
		readonly observable: symbol;
	}
}

/**
@remarks
The TC39 observable proposal defines a `closed` property, but some implementations (such as xstream) do not as of 10/08/2021
As well, some guideance on making an `Observable` do not include `closed` propery.
@see https://github.com/tc39/proposal-observable/blob/master/src/Observable.js#L129-L130
@see https://github.com/staltz/xstream/blob/6c22580c1d84d69773ee4b0905df44ad464955b3/src/index.ts#L79-L85
@see https://github.com/benlesh/symbol-observable#making-an-object-observable
*/
export type Subscription = {
	closed?: boolean;
	unsubscribe(): void;
};

/**
Matches a value that is like an [Observable](https://github.com/tc39/proposal-observable).

@see https://github.com/tc39/proposal-observable
@category Basic
*/
export interface ObservableLike<ValueType = unknown> {
	subscribe(observer: (value: ValueType) => void): Subscription;
	[Symbol.observable](): ObservableLike<ValueType>;
}
