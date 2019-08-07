/**
Create a type from another type with all properties and nested properties set to optional.

Use cases:
- Merging a default settings/config object with another object, the second object would be a deep partial of the default object.
- Mocking and testing complex entities, where populating an entire object with it's properties would be redundant in terms of the mock or test.

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
*/
export type PartialDeep<T> = {
	[KeyType in keyof T]?:
		T[KeyType] extends Map<infer MapKeyType, infer MapValueType>
		? PartialMap<MapKeyType, MapValueType>
		: T[KeyType] extends Set<infer SetType>
		? PartialSet<SetType>
		: T[KeyType] extends Array<infer ArrayType>
		? Array<PartialDeep<ArrayType>>
		: T[KeyType] extends ReadonlyArray<infer ReadonlyArrayType>
		? ReadonlyArray<PartialDeep<ReadonlyArrayType>>
		: PartialDeep<T[KeyType]>;
};

/**
Same as `PartialDeep`, but accepts only `Map`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialMap<KeyType, ValueType> extends Map<PartialDeep<KeyType>, PartialDeep<ValueType>> {}

/**
Same as `PartialDeep`, but accepts only `Set`s as inputs. Internal helper for `PartialDeep`.
*/
interface PartialSet<T> extends Set<PartialDeep<T>> {}
