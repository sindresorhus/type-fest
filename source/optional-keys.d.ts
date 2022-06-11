export type OptionalKeysOf<BaseType extends object> = Exclude<{
	[Key in keyof BaseType]: BaseType extends Record<Key, BaseType[Key]>
		? never
		: Key
}[keyof BaseType], undefined>;

export type HasOptionalKeys<BaseType extends object> = OptionalKeysOf<BaseType> extends never ? false : true;
