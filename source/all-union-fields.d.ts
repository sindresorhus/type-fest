import type {MapsSetsOrArrays, NonRecursiveType, ReadonlyKeysOfUnion, SimplifyObject, ValueOfUnion} from './internal/index.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {SharedUnionFields} from './shared-union-fields.d.ts';
import type {ValueOf} from './value-of.d.ts'; // For `@link`
import type {StringToNumber} from './string-to-number.d.ts';
import type {IsNumericLiteral} from './is-numeric-literal.d.ts';

/**
Create a type with all fields from a union of object types.

Use-cases:
- You want a safe object type where each key exists in the union object.
- You want to merge the values of an object into one object type.

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

	console.log('name:', petInfo.name);
	console.log('type:', petInfo.type);

	// TypeScript complains about `catType` and `dogType` not existing on type `Cat | Dog`.
	// @ts-expect-error
	console.log('animal type:', petInfo.catType ?? petInfo.dogType);
}

function displayPetInfoWithAllUnionFields(petInfo: AllUnionFields<Cat | Dog>) {
	// typeof petInfo =>
	// {
	// 	name: string;
	// 	type: 'cat' | 'dog';
	// 	catType?: string;
	// 	dogType?: string;
	// }

	console.log('name:', petInfo.name);
	console.log('type:', petInfo.type);

	// No TypeScript error.
	console.log('animal type:', petInfo.catType ?? petInfo.dogType);
}
```

Combine it with {@link ValueOf} to merge the values of an object. A key that is in every value is required, and a key that is in only some of the values is optional.

@example
```
import type {AllUnionFields, ValueOf} from 'type-fest';

const steps = {
	install: {title: 'Install the app'},
	login: {title: 'Log in', description: 'Use your GitHub account'},
	finish: {title: 'Done'},
};

type Step = AllUnionFields<ValueOf<typeof steps>>;
//=> {title: string; description?: string}
```

@see {@link SharedUnionFields}

@category Object
@category Union
*/
export type AllUnionFields<Union> =
	Extract<Union, NonRecursiveType | MapsSetsOrArrays> extends infer SkippedMembers
		? NormalizeNumericKeys<Exclude<Union, SkippedMembers>> extends infer RelevantMembers
			? // eslint-disable-line @stylistic/operator-linebreak
			| SkippedMembers
			| SimplifyObject<
				// Include fields that are common in all union members
				SharedUnionFields<RelevantMembers>
				// Include readonly fields present in any union member
				& {
					readonly [P in ReadonlyKeysOfUnion<RelevantMembers>]?: ValueOfUnion<RelevantMembers, P & KeysOfUnion<RelevantMembers>>
				}
				// Include remaining fields that are neither common nor readonly
				& {
					[P in Exclude<KeysOfUnion<RelevantMembers>, ReadonlyKeysOfUnion<RelevantMembers> | keyof RelevantMembers>]?: ValueOfUnion<RelevantMembers, P>
				}
			>
			: never
		: never;

/**
Use an existing numeric key for its exact canonical string spelling, so merging cannot drop duplicate aliases. Leave other unions as is to preserve index signatures.
*/
type NormalizeNumericKeys<Union, AllKeys extends PropertyKey = KeysOfUnion<Union>> =
	IsNumericLiteral<ExistingNumericKey<AllKeys, AllKeys>> extends true
		? Union extends unknown
			? {[Key in keyof Union as
				ExistingNumericKey<Key, AllKeys> extends infer NumericKey extends number
					? NumericKey | Exclude<Key, `${NumericKey}`>
					: never
				]: Union[Key]}
			: never
		: Union;

/**
Get the key in `AllKeys` that the numeric string spelling `Key` names. A `number` index signature covers every numeric key.
*/
type ExistingNumericKey<Key, AllKeys> =
	StringToNumber<Extract<Key, `${number}`>> extends infer NumberKey
		// Compare the string spellings, because `number` is assignable to a numeric enum.
		? `${number}` extends `${AllKeys & number}` ? NumberKey : Extract<AllKeys, NumberKey>
		: never;

export {};
