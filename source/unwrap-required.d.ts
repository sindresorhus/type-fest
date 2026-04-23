/**
Revert the `Required` modifier on an object type.

@category Object
*/
export type UnwrapRequired<RequiredObjectType> =
	RequiredObjectType extends Required<infer ObjectType>
		? (
			Required<ObjectType> extends RequiredObjectType
				? ObjectType
				: RequiredObjectType
		)
		: RequiredObjectType;

export {};
