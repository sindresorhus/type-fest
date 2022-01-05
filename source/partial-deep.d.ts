import {Primitive} from './primitive';

/**
Create a type from another type with all keys and nested keys set to optional.

Use-cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with its keys would be redundant in terms of the mock or test.

@example
```
import {PartialDeep} from 'type-fest';

const settings: Settings = {
	textEditor: {
		fontSize: 14;
		fontColor: '#000000';
		fontWeight: 400;
	}
	autocomplete: false;
	autosave: true;
};

const applySavedSettings = (savedSettings: PartialDeep<Settings>) => {
	return {...settings, ...savedSettings};
}

settings = applySavedSettings({textEditor: {fontWeight: 500}});
```

@category Object
@category Array
@category Set
@category Map
*/
export type PartialDeep<T, ExceptTypes = never> = T extends Primitive
	? Partial<T>
	: T extends ExceptTypes
	? T
	: T extends Map<infer KeyType, infer ValueType>
	? PartialMapDeep<KeyType, ValueType, ExceptTypes>
	: T extends Set<infer ItemType>
	? PartialSetDeep<ItemType, ExceptTypes>
	: T extends ReadonlyMap<infer KeyType, infer ValueType>
	? PartialReadonlyMapDeep<KeyType, ValueType, ExceptTypes>
	: T extends ReadonlySet<infer ItemType>
	? PartialReadonlySetDeep<ItemType, ExceptTypes>
	: T extends ((...arguments: any[]) => unknown)
	? T | undefined
	: T extends object
	? T extends Array<infer ItemType> // Test for arrays/tuples, per https://github.com/microsoft/TypeScript/issues/35156
		? ItemType[] extends T // Test for arrays (non-tuples) specifically
			? Array<PartialDeep<ItemType | undefined, ExceptTypes>> // Recreate relevant array type to prevent eager evaluation of circular reference
			: PartialObjectDeep<T, ExceptTypes> // Tuples behave properly
		: PartialObjectDeep<T, ExceptTypes>
	: unknown;

/**
Same as `PartialDeep`, but accepts only `Map`s and as inputs. Internal helper for `PartialDeep`.
*/
interface PartialMapDeep<KeyType, ValueType, ExceptTypes> extends Map<PartialDeep<KeyType, ExceptTypes>, PartialDeep<ValueType, ExceptTypes>> {}

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialSetDeep<T, ExceptTypes> extends Set<PartialDeep<T, ExceptTypes>> {}

/**
Same as `PartialDeep`, but accepts only `ReadonlyMap`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialReadonlyMapDeep<KeyType, ValueType, ExceptTypes> extends ReadonlyMap<PartialDeep<KeyType, ExceptTypes>, PartialDeep<ValueType, ExceptTypes>> {}

/**
Same as `PartialDeep`, but accepts only `ReadonlySet`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialReadonlySetDeep<T, ExceptTypes> extends ReadonlySet<PartialDeep<T, ExceptTypes>> {}

/**
Same as `PartialDeep`, but accepts only `object`s as inputs. Internal helper for `PartialDeep`.
*/
type PartialObjectDeep<ObjectType extends object, ExceptTypes> = {
	[KeyType in keyof ObjectType]?: PartialDeep<ObjectType[KeyType], ExceptTypes>
};

type AddSymbolToPrimitive<T> = T extends
  {[Symbol.toPrimitive]: infer V} ?
  {[Symbol.toPrimitive]: V} : {};
