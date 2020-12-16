import {Primitive} from './basic';

/**
A type that will cause the right-hand side of the merge operation to always win with no further recursion.
*/
type Unmergeable =
	| Primitive
	| ((...arguments: any[]) => unknown)
	| ReadonlyMap<any, any>
	| ReadonlySet<any>
	| Map<any, any>
	| Set<any>;

/**
Merge two types deeply into a new type. Keys of the second type overrides keys of the first type.
Recursively merges own and inherited enumerable string keyed properties of source types into the destination type.

Use-cases:
- Where intersection types would result in a property having `never`. If two different types for the same property are used, intersection types assume its type is `never`. `MergeDeep` allows for safe intersection of two types and having the second passed in type take precedence, resulting in no unwanted `never` property types.
- Merging complex, multi-level interfaces that share common properties across different levels.

@example
```
import {MergeDeep} from 'type-fest';

const defaultKeywords = {
	if: function() { … },
	each: function() { … },
	partial: function() { … }
};
type DefaultKeywords = typeof defaultKeywords;

const customKeywords = {
	partial: {
		setupState: function() { … },
		render: true
	},
	debugger: function() { … }
};
type CustomKeywords = typeof customKeywords;

const config: MergeDeep<DefaultKeywords, CustomKeywords> = {
	if: function() { … },
	each: function() { … },
	partial: {
		setupState: function() { … },
		render: false
	}
  },
  debugger: function() { … }
};

const intersectedKeywords: DefaultKeywords & CustomKeywords = {partial: {render: true}};
//=> Type 'boolean' is not assignable to type 'never'.
```
*/
export type MergeDeep<First, Second> = Second extends Unmergeable
	? Second
	: {
		[KeyType in keyof Second]:
			KeyType extends keyof First
				? Second[KeyType] extends Unmergeable
					? Second[KeyType]
					: Second[KeyType] extends object
					? MergeDeep<First[KeyType], Second[KeyType]>
					: Second[KeyType]
				: Second[KeyType]
	} & {
		[KeyType in keyof First]:
			KeyType extends keyof Second
				? Second[KeyType] extends Unmergeable
					? Second[KeyType]
					: Second[KeyType] extends object
					? MergeDeep<First[KeyType], Second[KeyType]>
					: Second[KeyType]
				: First[KeyType];
	};
