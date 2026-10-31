import type {If} from './if.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsLiteral} from './is-literal.d.ts';
import type {ExactKey} from './internal/keys.d.ts';
import type {UnwrapBrand} from './internal/object.d.ts';
import type {Tagged} from './tagged.d.ts'; // For `@link`
import type {TupleToObject} from './tuple-to-object.d.ts'; // For `@link`

/**
Transforms an array of objects into a record keyed by one of their properties.

When all key values are literals, each key maps to the element it comes from, so a property that only one element has stays available under that element's key. Elements that share a key value are merged into a union under that key. `Object.fromEntries` keeps only the last of them at runtime, so the union is wider than the value you get back. If any key value is not a literal, every key maps to the union of all elements, since their key domains may overlap.

Use-cases:
- Type a lookup table built from a static list, such as routes by path or commands by name.
- Type the result of `Object.fromEntries(items.map(item => [item[key], item]))` without turning every element into the same type.

@example
```
import type {ArrayToRecord} from 'type-fest';

const animals = [
	{name: 'Shadow', species: 'dog'},
	{name: 'Sassy', species: 'cat'},
	{name: 'Jake the Dog', species: 'dog', isMagical: true},
] as const;

type Animals = ArrayToRecord<typeof animals, 'name'>;
//=> {
// 	Shadow: {
// 		readonly name: 'Shadow';
// 		readonly species: 'dog';
// 	};
// 	Sassy: {
// 		readonly name: 'Sassy';
// 		readonly species: 'cat';
// 	};
// 	'Jake the Dog': {
// 		readonly name: 'Jake the Dog';
// 		readonly species: 'dog';
// 		readonly isMagical: true;
// 	};
// }

const animalsByName = Object.fromEntries(animals.map(animal => [animal.name, animal])) as Animals;

type IsMagical = Animals['Jake the Dog']['isMagical'];
//=> true

// A key property that holds a wide `string` gives an index signature
type AnyAnimalByName = ArrayToRecord<Array<{name: string; species: string}>, 'name'>;
//=> {[x: string]: {name: string; species: string}}
```

Note: Every element must have the key property, and it must hold a `string` or a `number`; any other value type gives `never`. An `any` key value is valid and gives a string index signature, unless another element's key value is invalid, which makes the whole record `never`. A `never` key value gives no key. The key values must be literal to get a key per element, so use `as const` or a `const` type parameter; a wide `string` gives a string index signature, a wide `number` gives a numeric one, and mixing the two gives both. A number and its string spelling, like `1` and `'1'`, are the same key. A branded key value is unwrapped first, so a {@link Tagged} `'a'` gives the key `a`.

@see {@link TupleToObject}
@category Array
*/
// The element's key value names its property. `UnwrapBrand` stops a branded value from erasing the key, and `& (string | number)` keeps the mapped key a valid property key for the compiler. Validate each element before combining its key values, so `any` cannot hide another element's invalid key type.
export type ArrayToRecord<
	ArrayType extends readonly object[],
	KeyProperty extends keyof ArrayType[number] | keyof WithKeyAliases<ArrayType[number]>,
> = If<IsAny<ArrayType>, any,
	false extends HasValidKey<ArrayType[number], KeyProperty>
		? never
		: UnwrapBrand<KeyValues<ArrayType[number], KeyProperty>> & (string | number) extends infer Keys extends string | number
			? IsLiteral<Keys> extends true
				? {[Item in ArrayType[number] as UnwrapBrand<Item[ExactKey<Item, KeyProperty>]> & (string | number)]: Item}
				: Record<Keys, ArrayType[number]>
			: never>;

/**
Checks each element separately so an `any` key value cannot erase invalid key values on other elements.
*/
type HasValidKey<Item extends object, KeyProperty extends PropertyKey> = Item extends unknown
	? [Item[ExactKey<Item, KeyProperty>]] extends [string | number] ? true : false
	: never;

/**
Adds numeric key aliases to each element before finding the common keys of their union.
*/
type WithKeyAliases<Item extends object> = Item extends unknown
	? {[Key in keyof Item | `${keyof Item & number}` | ExactKey<Record<number, unknown>, keyof Item & string>]: unknown}
	: never;

/**
Reads the selected property on each element before combining its values.
*/
type KeyValues<Item extends object, KeyProperty extends PropertyKey> = Item extends unknown
	? Item[ExactKey<Item, KeyProperty>]
	: never;

export {};
