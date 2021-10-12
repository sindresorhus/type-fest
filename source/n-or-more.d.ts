/**
Create a type of one or more items.

@category Utilities
*/
export type OneOrMore<T> = [T, ...T[]]; // NOrMore<T, 1>

/**
Create a type of N or more items, where N is an integer between 0 and 9 inclusive.

@remarks:

NOrMore<T, N> constrains N because recursive definitions such as the following yield the error 'Type instantiation is excessively deep and possibly infinite.'.

```typescript
import {Subtract} from './internal';
export type NOrMore<T, N extends number> =
	N extends 0 ?
		T[] : // Zero or more
		[T, ...NOrMore<T, Subtract<N, 1>>];
```
@category Utilities
*/
export type NOrMore<T, N extends 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9> =
	N extends 0 ?
		T[] : // Zero or more
		N extends 1 ?
			[T, ...T[]] : // One or more
			N extends 2 ?
				[T, T, ...T[]] : // Two or more
				N extends 3 ?
					[T, T, T, ...T[]] : // Three or more
					N extends 4 ?
						[T, T, T, T, ...T[]] : // Four or more
						N extends 5 ?
							[T, T, T, T, T, ...T[]] : // Five or more
							N extends 6 ?
								[T, T, T, T, T, T, ...T[]] : // Six or more
								N extends 7 ?
									[T, T, T, T, T, T, T, ...T[]] : // Seven or more
									N extends 8 ?
										[T, T, T, T, T, T, T, T, ...T[]] : // Eight or more
										N extends 9 ?
											[T, T, T, T, T, T, T, T, T, ...T[]] : // Nine or more
											never; // N > 9 is not supported at this time
