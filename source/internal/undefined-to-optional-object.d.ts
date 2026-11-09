import type {SimplifyObject} from './object.d.ts';

// Returns the key if its property is a union with `undefined`, otherwise `never`. `any` and `unknown` do not describe an explicit union with `undefined`.
type OptionalFilter<Type, Key extends keyof Type> = unknown extends Type[Key]
	? never
	: undefined extends Type[Key]
		? Type[Key] extends undefined
			? never
			: Key
		: never;

/**
Object-only implementation of `UndefinedToOptional`, for callers that already know the input is an object.

`UndefinedToOptional` first checks for containers and non-object inputs. For generic `MergeDeep` options, those conditional checks remain unresolved, so TypeScript cannot prove the result satisfies `MergeDeepInternalOptions`. Mapping the object directly preserves that assignability.
*/
export type UndefinedToOptionalObject<ObjectType> = SimplifyObject<{
	// Keep keys not selected for conversion, preserving their existing modifiers.
	[Key in keyof ObjectType as Key extends OptionalFilter<ObjectType, Key> ? never : Key]: ObjectType[Key]
} & {
	[Key in keyof ObjectType as OptionalFilter<ObjectType, Key>]?: Exclude<ObjectType[Key], undefined>
}>;

export {};
