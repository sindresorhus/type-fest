export type UnwrapPartial<PartialObjectType> =
	PartialObjectType extends Partial<infer ObjectType>
		? (
			Partial<ObjectType> extends PartialObjectType
				? ObjectType
				: PartialObjectType
		)
		: PartialObjectType;

export {};
