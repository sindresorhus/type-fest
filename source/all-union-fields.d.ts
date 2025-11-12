import type {NonRecursiveType, ReadonlyKeysOfUnion, ValueOfUnion} from './internal/index.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {SharedUnionFields} from './shared-union-fields.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a type with all fields from a union of object types.

Use-cases:
- You want a safe object type where each key exists in the union object.

@example
```
import type {AllUnionFields} from 'type-fest';

type Cat = {
	name: string;
	type: 'cat';
	catType: string;
};

type Dog = {
	name: string;
	type: 'dog';
	dogType: string;
};

function displayPetInfo(petInfo: Cat | Dog) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat';
	// 	catType: string;
	// } | {
	// 	name: string;
	// 	type: 'dog';
	// 	dogType: string;
	// }

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);

	// TypeScript complains about `catType` and `dogType` not existing on type `Cat | Dog`.
	// @ts-expect-error
	console.log('animal type: ', petInfo.catType ?? petInfo.dogType);
}

function displayPetInfoWithAllUnionFields(petInfo: AllUnionFields<Cat | Dog>) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat' | 'dog';
	// 	catType?: string;
	// 	dogType?: string;
	// }

	console.log('name: ', petInfo.name);
	console.log('type: ', petInfo.type);

	// No TypeScript error.
	console.log('animal type: ', petInfo.catType ?? petInfo.dogType);
}
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gQQDbYKoB2wEBAYsCtgCYDOAvnAGZQQhwDkSqAtIyjTHYBuAFAiuaAMIBDeAF4MIgJAFpIFAC44AqMAIBzUUolb2AY1nDlFmABVkm7TF0HRdUeIdwAIhH1wFdGVVdS0dPUNlEw4qPyslWP17VDDnCLcPRgBXAjMYYgI4KmAaMGxpRAAFFBgASQJGCAAKVDqGiC0ZeAAfHz8ASkUlAHphhAcIRjhW+saAgD5lUaHllTVHcNclseMHUxt41ZtkjbStkbGGXqCLuDXQpxdI292UmLijVcST1KfPy7ESjMJBoEGwKAAdNg-E12CFHOwADTTGqzCAQ+H9IzAgig8FQmGcPYcZEzdoQiRYwHLE4AZTMujA8GB4HKehocGkACMIFl4AADY4OfmcghUOD877CuAECDwFAADxK+QMcBI41QEq6cF6vn0-Ih2zgAAEYDRuIrUHkLVAWFBrCCwZDofpYdIiCBpNgNQjSajyULNQB+IMotqNCFS1BUuhibK5fLq4qlcpVf2NADqwBgAAscPgiCRyJRaC10x04PnCAVi9QaAAebW6vzzQY3ZYSSZhtELI3tnbw37pI2vBEHHXvfSHHaBlBBofnL5+E7zx7D26xh24p0E11w9amP3h9GY7GO-Eu2HRJHd8mUjy3AByEDgdIZwCZcBQtughqB5+dQl3VAL0fUPW8I1nOAQwg9EoxQGMgA)

@see {@link SharedUnionFields}

@category Object
@category Union
*/
export type AllUnionFields<Union> =
Extract<Union, NonRecursiveType | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown> | UnknownArray> extends infer SkippedMembers
	? Exclude<Union, SkippedMembers> extends infer RelevantMembers
		?
		| SkippedMembers
		| Simplify<
		// Include fields that are common in all union members
			SharedUnionFields<RelevantMembers> &
		// Include readonly fields present in any union member
			{
				readonly [P in ReadonlyKeysOfUnion<RelevantMembers>]?: ValueOfUnion<RelevantMembers, P & KeysOfUnion<RelevantMembers>>
			} &
		// Include remaining fields that are neither common nor readonly
			{
				[P in Exclude<KeysOfUnion<RelevantMembers>, ReadonlyKeysOfUnion<RelevantMembers> | keyof RelevantMembers>]?: ValueOfUnion<RelevantMembers, P>
			}
		>
		: never
	: never;

export {};
