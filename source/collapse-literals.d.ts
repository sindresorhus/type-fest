import type {ExtractLiterals} from './extract-literals.d.ts'; // For `@link`
import type {LiteralToPrimitive} from './literal-to-primitive.d.ts'; // For `@link`
import type {LiteralUnion} from './literal-union.d.ts'; // For `@link`
import type {Primitive} from './primitive.d.ts';

/**
Collapse literal union members into broader types already present in the union.

Use-case: Normalize a {@link LiteralUnion} for type comparisons or conditional types while preserving unrelated union members. Complements {@link ExtractLiterals}, which keeps only the literals.

Unlike {@link LiteralToPrimitive}, this does not widen every literal: a literal changes only when a broader member of the union already covers it. Members that are not primitives are returned unchanged. It only removes the intersection with the empty object type (`& {}`) from primitive members, which lets TypeScript merge the union. This includes the `& Record<never, never>` of {@link LiteralUnion}, because `Record<never, never>` is `{}`. This is not recursive, and it does not merge the members of a branded or tagged type, because each member keeps its own brand or tag.

@example
```
import type {CollapseLiterals, LiteralUnion} from 'type-fest';

type Theme = LiteralUnion<'auto' | 'dark', string>;

type ThemeValue = CollapseLiterals<Theme>;
//=> string

type OptionalTheme = CollapseLiterals<Theme | null | undefined>;
//=> string | null | undefined

type EventName = CollapseLiterals<LiteralUnion<'click' | 'onChange', `on${string}`>>;
//=> 'click' | `on${string}`

type Size = CollapseLiterals<LiteralUnion<1 | 2 | 3, number>>;
//=> number

type KnownTheme = CollapseLiterals<'auto' | 'dark'>;
//=> 'auto' | 'dark'
```

@see {@link LiteralUnion}
@see {@link ExtractLiterals}
@see {@link LiteralToPrimitive}
@category Type
*/
// Distribute first, so an object member in the union cannot stop the other members from collapsing.
// The primitive check also keeps `{}`-like inputs away from the `infer`, which turns them into `unknown`.
export type CollapseLiterals<Union> = Union extends Primitive
	? Union extends infer Collapsed & {}
		? Collapsed
		: Union
	: Union;

export {};
