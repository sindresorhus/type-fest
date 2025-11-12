import type {BuiltIns, HasMultipleCallSignatures} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Create a type from another type with all keys and nested keys set to required.

Use-cases:
- Creating optional configuration interfaces where the underlying implementation still requires all options to be fully specified.
- Modeling the resulting type after a deep merge with a set of defaults.

@example
```
import type {RequiredDeep} from 'type-fest';

type Settings = {
	textEditor?: {
		fontSize?: number;
		fontColor?: string;
		fontWeight?: number | undefined;
	};
	autocomplete?: boolean;
	autosave?: boolean | undefined;
};

type RequiredSettings = RequiredDeep<Settings>;
//=> {
// 	textEditor: {
// 		fontSize: number;
// 		fontColor: string;
// 		fontWeight: number | undefined;
// 	};
// 	autocomplete: boolean;
// 	autosave: boolean | undefined;
// }
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gJRQRwK7BQoAmAIiimAL5wBmUEIcA5EqgLS0oDOMzA3AChBbNAGUUMGMAB2Ac25wAvBkEBIGCgAeMAKLFgMaAH4AXKrVraEGTDHAAXijNwZeEACMUUIZeu2AYQgAGxNzXihZOV8rGxgAdRRgOQALGBc3T284AB84PBliFFpZEl8qXwBDPCMAY0YwYMlncw8IEJRKmSqaiG5KgDcWuDaOrtz8wuLS4iEK4VE4bHxCEgkpKMUVZYIiMgowAB516XluAD4hAHorpXPVG7gNbT0DIyhzdEFHvzj7J3MmS8Pm+VyesUCIWg4RgkXk1zBv1siWSaUB7mBEwKRRKMjKoKe8x+1TqDSamla7SaXQRTxJfUGKEpYxkWKmuPxjyoQA)

Note that types containing overloaded functions are not made deeply required due to a [TypeScript limitation](https://github.com/microsoft/TypeScript/issues/29732).

@category Utilities
@category Object
@category Array
@category Set
@category Map
*/
export type RequiredDeep<T> = T extends BuiltIns
	? T
	: T extends Map<infer KeyType, infer ValueType>
		? Map<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
		: T extends Set<infer ItemType>
			? Set<RequiredDeep<ItemType>>
			: T extends ReadonlyMap<infer KeyType, infer ValueType>
				? ReadonlyMap<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
				: T extends ReadonlySet<infer ItemType>
					? ReadonlySet<RequiredDeep<ItemType>>
					: T extends WeakMap<infer KeyType, infer ValueType>
						? WeakMap<RequiredDeep<KeyType>, RequiredDeep<ValueType>>
						: T extends WeakSet<infer ItemType>
							? WeakSet<RequiredDeep<ItemType>>
							: T extends Promise<infer ValueType>
								? Promise<RequiredDeep<ValueType>>
								: T extends (...arguments_: any[]) => unknown
									? IsNever<keyof T> extends true
										? T
										: HasMultipleCallSignatures<T> extends true
											? T
											: ((...arguments_: Parameters<T>) => ReturnType<T>) & RequiredObjectDeep<T>
									: T extends object
										? RequiredObjectDeep<T>
										: unknown;

type RequiredObjectDeep<ObjectType extends object> = {
	[KeyType in keyof ObjectType]-?: RequiredDeep<ObjectType[KeyType]>
};

export {};
