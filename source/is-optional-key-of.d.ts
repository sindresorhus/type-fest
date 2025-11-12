import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether the given key is an optional key of type.

This is useful when writing utility types or schema validators that need to differentiate `optional` keys.

@example
```
import type {IsOptionalKeyOf} from 'type-fest';

interface User {
	name: string;
	surname: string;

	luckyNumber?: number;
}

interface Admin {
	name: string;
	surname?: string;
}

type T1 = IsOptionalKeyOf<User, 'luckyNumber'>;
//=> true

type T2 = IsOptionalKeyOf<User, 'name'>;
//=> false

type T3 = IsOptionalKeyOf<User, 'name' | 'luckyNumber'>;
//=> boolean

type T4 = IsOptionalKeyOf<User | Admin, 'name'>;
//=> false

type T5 = IsOptionalKeyOf<User | Admin, 'surname'>;
//=> boolean
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gSQM4HkwzAQB2AhgDYDSKiuAZgL5x1QQhwDkSqAtHSthgcA3AChRwYjBRQ6pAMZoAqthkZRASDIgUALjiCokgOZiN2AK5RtegzCPFT4jeQvyA1ogByFkACMZAH59Yl8AqDEGcUlpWQU0AEEAExBJdS1SHX1DEzNLa0yUYLsHJyjRbjQAFQBGOABeOBx8QhIKalo6AB4VGQAaTlcPbzCZDgA+MQB6KfrxhCgLFHFKuCqAJgamvAIiMioaeh7VKAGOGwnp2fm5clUV5GqAZi3m3baDzuP+zgu4AB9Bm5PD5-GNJqIZnM4H4IBByChSMQHqg1gAWV47Vr7DpHXpQAFwZKpYhnC4QqE3Cj3CqPNYAVkxLT27UO3XxhOJkjO+XJV2hsPhiOIQA)

@category Type Guard
@category Utilities
*/
export type IsOptionalKeyOf<Type extends object, Key extends keyof Type> =
	IsAny<Type | Key> extends true ? never
		: Key extends keyof Type
			? Type extends Record<Key, Type[Key]>
				? false
				: true
			: false;

export {};
