import type {IsNever} from './is-never';

/**
If the given type `T` is `never`, the returned type is `TypeIfNever`. Otherwise, the return type is `TypeIfNotNever`. If only `T` is specified, `TypeIfNever` will be `true` and `TypeIfNotNever` will be false.

@link https://github.com/microsoft/TypeScript/issues/31751#issuecomment-498526919
@link https://stackoverflow.com/a/53984913/10292952
@link https://www.zhenghao.io/posts/ts-never

Useful in type utilities, such as checking if something does not occur.

@example
```
import type {IfNever} from 'type-fest';

type And<A, B> =
	A extends true
		? B extends true
			? true
			: false
		: false;

// https://github.com/andnp/SimplyTyped/blob/master/src/types/strings.ts
type AreStringsEqual<A extends string, B extends string> =
	And<
		IfNever<Exclude<A, B>>,
		IfNever<Exclude<B, A>>
	>;

type EndIfEqual<I extends string, O extends string> =
	AreStringsEqual<I, O> extends true
		? never
		: void;

function endIfEqual<I extends string, O extends string>(input: I, output: O): EndIfEqual<I, O> {
	if (input === output) {
		process.exit(0);
	}
}

endIfEqual('abc', 'abc');
//=> never

endIfEqual('abc', '123');
//=> void
```

@category Utilities
*/
export type IfNever<T, TypeIfNever = true, TypeIfNotNever = false> = (
	IsNever<T> extends true ? TypeIfNever : TypeIfNotNever
);
