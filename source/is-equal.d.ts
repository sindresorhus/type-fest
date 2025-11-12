import type {IsNever} from './is-never.d.ts';
/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

Use-cases:
- If you want to make a conditional branch based on the result of a comparison of two types.

@example
```
import type {IsEqual} from 'type-fest';

// This type returns a boolean for whether the given array includes the given item.
// `IsEqual` is used to compare the given array at position 0 and the given item and then return true if they are equal.
type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		: false;
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4FECOArgIYA2AvnAGZQQhwDkSqAtFStjAwNwBQvAegFwAKgAtg2BMjRQUMQlAB2U4nABGECKRTEl1aHADuY+aagJTcAObAAbin3EoUYojjAlAY1KEAJhyWaLYO+sAwKCAAdILCAAY4BCSkcR5ShNgofggQcF50YM5oMFYhjnDOru7E8JDY4cAQ+gAMFUrZJcH25eGRbR2m+nIKyghQhGjAVEHVcnAoRGQxzGiY3r4B2AA8AGpkE-MAHhHtUnLEfk2k1UqIANoAugA0cJgRIAB8cAC8vACQe18aBQx0cfjOukuSmucDugImd2azzgUVRnnYFjknAe-z+AH5XnhFqRdvsUIjkW9Il8QSdwWMJrj8QyUEyAFyvdb+DhbLEwF5Uz64jlUMiZbhAA)

@category Type Guard
@category Utilities
*/
export type IsEqual<A, B> =
	[A, B] extends [infer AA, infer BB]
		? [AA] extends [never]
			? [BB] extends [never]
				? true
				: false
			: [BB] extends [never]
				? false
				: _IsEqual<AA, BB>
		: false;

// This version fails the `equalWrappedTupleIntersectionToBeNeverAndNeverExpanded` test in `test-d/is-equal.ts`.
type _IsEqual<A, B> =
	(<G>() => G extends A & G | G ? 1 : 2) extends
	(<G>() => G extends B & G | G ? 1 : 2)
		? true
		: false;

export {};
