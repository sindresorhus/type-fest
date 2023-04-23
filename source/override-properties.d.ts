import type {Merge} from './merge';

/**
Override existing properties of the given type. Similar to `Merge`, but enforces that the original type has the properties you want to override.

This is useful when you want to override existing properties with a different type and make sure that these properties really exist in the original.

@example
```
type Foo = {
	a: string
	b: string
}
type Bar = OverrideProperties<Foo, {b: number}>
//=> {a: string, b: number}

type Baz = OverrideProperties<Foo, {c: number}>
// error TS2559: Type '{c: number}' has no properties in common with type 'Partial{a: unknown; b: unknown}>'.
```

@category Object
*/
export type OverrideProperties<
	TOriginal,
	TOverride extends Partial<{[key in keyof TOriginal]: unknown}>,
> = Merge<TOriginal, TOverride>;
