import type { UnknownArray } from './unknown-array.d.ts'
import type { AllIndexOf } from './index-of.d.ts'

export type CountOf<
	Array_ extends UnknownArray, Item, 
	FromIndex extends number = 0
> = AllIndexOf<Array_, Item, FromIndex> extends infer Indexs extends number[]
	? Indexs['length']
	: 0
