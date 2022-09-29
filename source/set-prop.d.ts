import type {MergeDeep} from './merge-deep';
import type {Simplify} from './simplify';
import type {Replace} from './replace';
import type {Split} from './split';

type ReplaceByDot<Path extends string, Search extends string> = Replace<Path, Search, '.', {all: true}>;
type NormalizePath<Path extends string> = ReplaceByDot<ReplaceByDot<Path, '['>, '].'>;
type SplitPath<S extends string> = Split<NormalizePath<S>, '.'>;

type PathFirstKey<List extends string[]> = List extends [infer Head, ...string[] ]
	? Head extends string
		? Head
		: never
	: never;

type PathRestKeys<List extends string[]> = List extends [string, ...infer Tail ]
	? Tail extends string[]
		? Tail
		: never
	: never;

type IsNumberLike<Path extends string> = Path extends `${number}` ? true : false;
type MaybeNullable<Path, Value> = Path extends '0' ? Value : Value | null;

type SetPropFromArrayDeep<Path extends string[], Value> = PathFirstKey<Path> extends never
	? Value
	: IsNumberLike<PathFirstKey<Path>> extends true
		? Array<MaybeNullable<PathFirstKey<Path>, SetPropFromArray<PathRestKeys<Path>, Value>>>
		: PathFirstKey<Path> extends string
			? SetPropFromArray<Path, Value>
			: never;

type SetPropFromArray<Path extends string[], Value> = Simplify<Record<PathFirstKey<Path>, SetPropFromArrayDeep<PathRestKeys<Path>, Value>>>;

/**
Set a deeply-nested property to an object using a key path, like Lodash's `.set()` function.

@example
```
import set from 'lodash/set';

const data = {
	name: 'nyan',
	items: {life: 24},
};

set(data, 'items.life', '42');
// {
// 	name: string;
// 	items: {
// 		life: '42';
// 	};
// }

set(data, 'items.levels', [1, 2, 3]);
// {
// 	name: string;
// 	items: {
// 		life: '42';
// 		levels: number[];
// 	};
// }

type SetLifeString = SetProp<typeof data, 'items.life', '42'>;
// {
// 	name: string;
// 	items: {
// 		life: '42';
// 	};
// }

type CreateLevels = SetProp<SetLifeString, 'items.levels', number[]>;
// {
// 	name: string;
// 	items: {
// 		life: '42';
// 		levels: number[];
// 	};
// }
```

@category Object
*/
export type SetProp<Source, Path extends string, Value> = MergeDeep<Source, SetPropFromArray<SplitPath<Path>, Value>>;
