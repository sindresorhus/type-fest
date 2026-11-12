import type {IsEqual} from './is-equal.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a boolean for whether the given function type has multiple distinct call signatures.

Useful when transforming callbacks without discarding their overloads. Function properties and construct signatures are ignored.

Distributes over unions, returning `boolean` when the results differ. Returns `false` for `any` and `never`; `unknown` and non-callable types are not accepted.

Duplicate signatures, including signatures TypeScript deduplicates in intersections, do not count as distinct.

Compares the inferred receiver, parameter, and return types of the final two signatures, then checks again after TypeScript removes duplicate signatures if needed.

Known limitations:
- Generic type parameters, type predicates, and assertion signatures are lost during inference. If the final signatures differ only in these details, the result can be `false` even when an earlier overload is distinct.
- Implicit `this` and explicit `this: unknown` are indistinguishable.
- Repeated final signatures can hide earlier receiver-only differences when one signature omits `this`, because TypeScript deduplicates them during normalization.

@example
```
import type {HasMultipleCallSignatures} from 'type-fest';

declare function readFile(path: string): string;
declare function readFile(path: string, encoding: 'binary'): Uint8Array;

type HasOverloads = HasMultipleCallSignatures<typeof readFile>;
//=> true

type SingleSignature = HasMultipleCallSignatures<(path: string) => string>;
//=> false
```

@see https://github.com/microsoft/TypeScript/issues/29732

@category Function
@category Type Guard
*/
export type HasMultipleCallSignatures<FunctionType extends (...arguments_: any[]) => unknown> =
	IsNever<FunctionType> extends true
		? false
		: FunctionType extends unknown // Distribute before normalizing each member's overload list.
			? HasDistinctLastTwoCallSignatures<FunctionType> extends true
				? true
				// Check the original first to preserve implicit versus explicit receivers. This intersection deduplicates repeated signatures; `{}` does not.
				: HasDistinctLastTwoCallSignatures<FunctionType & Record<never, never>>
			: never;

/**
Whether the last two inferred call signatures differ in receiver, parameters, or return type.
*/
type HasDistinctLastTwoCallSignatures<FunctionType extends (...arguments_: any[]) => unknown> =
	FunctionType extends {
		(this: infer FirstReceiver, ...arguments_: infer FirstArguments): infer FirstReturn;
		(this: infer SecondReceiver, ...arguments_: infer SecondArguments): infer SecondReturn;
	}
		// Compare types rather than mutual assignability, which treats `any` as equivalent to specific types.
		? IsEqual<[FirstReceiver, FirstArguments, FirstReturn], [SecondReceiver, SecondArguments, SecondReturn]> extends true
			? false
			: true
		: false;

export {};
