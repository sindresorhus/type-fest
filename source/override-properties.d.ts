import type {Merge} from './merge';

/**
Override existing property types in TOriginal with the types in TOverride.
This is useful when you want to override existing properties with a different type and make sure that these properties really exist in TOriginal.

@example
```ts
type Foo = {
	a: string
	b: string
}
type Bar = OverrideProperties<Foo, { b: number }>
//=> type Bar = { a: string, b: number }

type Baz = OverrideProperties<Foo, { c: number }>
// error TS2559: Type '{ c: number; }' has no properties in common with type 'Partial{ a: unknown; b: unknown; }>'.

```
 */
export type OverrideProperties<
	TOriginal,
	TOverride extends Partial<{[k in keyof TOriginal]: unknown}>,
> = Merge<TOriginal, TOverride>;
