import type {Flavor} from './flavor.d.ts'; // For `@link`
import type {CollapseLiterals} from './collapse-literals.d.ts';
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {KeysOfUnion} from './keys-of-union.d.ts';
import type {Primitive} from './primitive.d.ts';
import type {LiteralToPrimitive} from './literal-to-primitive.d.ts'; // For `@link`
import type {Opaque, TagContainer, Tagged, UnwrapTagged} from './tagged.d.ts'; // `Opaque` and `Tagged` are for `@link`.

/**
Remove brand properties from primitive types while preserving literal types.

Useful for recovering literal keys from branded types. Unlike {@link LiteralToPrimitive}, this does not widen literals. This distributes over unions. Non-primitive members are returned unchanged, including their brands and nested properties. `any`, `never`, and `unknown` are also returned unchanged.

@example
```
import type {Tagged, UnwrapBrandedPrimitive} from 'type-fest';

type Status = ('draft' | 'published') & {readonly __brand: 'Status'};

type StatusName = UnwrapBrandedPrimitive<Status>;
//=> 'draft' | 'published'

type StatusCounts = Record<UnwrapBrandedPrimitive<Status>, number>;
//=> {draft: number; published: number}

type UserId = UnwrapBrandedPrimitive<Tagged<string, 'UserId'>>;
//=> string
```

@example
```
import type {UnwrapBrandedPrimitive} from 'type-fest';

type Brand = {readonly __brand: unique symbol};

type A = UnwrapBrandedPrimitive<string & Brand>;
//=> string

type B = UnwrapBrandedPrimitive<number & Brand>;
//=> number

type C = UnwrapBrandedPrimitive<PropertyKey & Brand>;
//=> number | string | symbol

type D = UnwrapBrandedPrimitive<(1 | 200n | 'foo' | 'bar') & Brand>;
//=> 1 | 200n | 'foo' | 'bar'
```

Custom brands must use a single object with explicit marker properties, such as `string & {brand: 'Id'}`. Optional markers, including a single {@link Flavor}, are supported. Separate custom intersections, such as `string & BrandA & BrandB`, and marker keys shared with any built-in primitive properties are not supported. Index signatures and call or construct signatures are not supported as custom brands. All extra properties are treated as brands, including methods.

Nested {@link Tagged} types follow the limits described in {@link UnwrapTagged}. A single legacy {@link Opaque} layer is supported, except with a `never` token. Use {@link UnwrapTagged} to unwrap tagged objects too.

@see {@link UnwrapTagged}
@see {@link LiteralToPrimitive}

@category Type
*/
export type UnwrapBrandedPrimitive<Value> = IfNotAnyOrNever<Value, {ifNot: UnwrapBrandedPrimitiveImplementation<Value, Primitive>}>;

type UnwrapBrandedPrimitiveImplementation<Value, Base> = Value extends Primitive
	// Separate tag layers do not match a single object containing all brand properties.
	// `CollapseLiterals` removes `& {}` first, because TypeScript defers `keyof` on types like `` `on${string}` & {} ``.
	? UnwrapPrimitiveProperties<CollapseLiterals<Value extends TagContainer<unknown> ? UnwrapTagged<Value> : Value>, Base>
	: Value;

type UnwrapPrimitiveProperties<Value, Base> = Value extends infer Unbranded & Pick<Value, Exclude<keyof Value, KeysOfUnion<Base>>>
	? Unbranded
	: Value;

export {};
