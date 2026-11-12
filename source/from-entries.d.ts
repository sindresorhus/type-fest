import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {IsUnion} from './is-union.d.ts';

/**
Create an object type from an array of key-value pairs.

Use-cases:
- Type configuration objects constructed with `Object.fromEntries()`.
- Recover the relationship between each entry's key and value.

Fixed tuples with one literal key per entry produce required properties. For dynamic arrays, rest tuples, and tuples with any entry that has a union or non-literal key, every property is optional (or an index signature for non-literal keys), because not every key is necessarily present. If any key is non-literal, every property has the union of all entry values, since their key domains can overlap.

Duplicate keys produce a union of their values rather than simulating the last write. Numeric and string spellings of the same key follow TypeScript's property-key rules. Branded keys are unsupported. Only arrays of required pairs are accepted, not arbitrary iterables or tuples with optional entries.

Tuple intersections with brands or extra properties are unsupported.

Distributes over unions of entry arrays. Returns `any` for `any` and `never` for `never`.

@example
```
import type {FromEntries} from 'type-fest';

const settings = [['theme', 'dark'], ['retries', 3]] as const;

type Settings = FromEntries<typeof settings>;
//=> {theme: 'dark'; retries: 3}

type DynamicSettings = FromEntries<Array<['theme', string] | ['retries', number]>>;
//=> {theme?: string; retries?: number}
```

The entry union is mapped by its first element, keeping each corresponding second element as the value. Presence is checked separately from the value mapping.

@category Object
@category Array
*/
export type FromEntries<Entries extends ReadonlyArray<readonly [PropertyKey, unknown]>> = IfNotAnyOrNever<Entries, {
	ifNot: Entries extends unknown
		? EntryRecord<Entries[number]> extends infer Result
			? number extends Entries['length']
				? Partial<Result>
				: HasSingleLiteralKeys<Entries> extends true ? Result : Partial<Result>
			: never
		: never;
}>;

/**
Maps literal keys to their corresponding values, or widens values when key domains can overlap.
*/
type EntryRecord<Entry extends readonly [PropertyKey, unknown]> = IsLiteral<Entry[0]> extends true
	? {[Pair in Entry as Pair[0]]: Pair[1]}
	: Record<Entry[0], Entry[1]>;

/**
Checks each tuple position independently, keeping a union-valued entry intact when reading its key.
*/
type HasSingleLiteralKeys<Entries extends ReadonlyArray<readonly [PropertyKey, unknown]>> = IsLiteral<Entries[number][0]> extends true
	? true extends {[Index in keyof Entries]: IsUnion<Entries[Index][0]>}[number] ? false : true
	: false;

export {};
