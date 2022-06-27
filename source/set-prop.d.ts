import {MergeDeep, Unwrap} from './merge-deep';
import {Replace} from './replace';
import {Split} from './split';

type ReplaceByDot<Path extends string, Search extends string> = Replace<Path, Search, '.', {all: true}>;
type NormalizePath<Path extends string> = ReplaceByDot<ReplaceByDot<Path, '['>, '].'>;
type SplitPath<S extends string> = Split<NormalizePath<S>, '.'>;

type PathHead<List extends string[]> = List extends [infer Head, ...string[] ]
  ? Head extends string ? Head : never : never;

type PathTail<List extends string[]> = List extends [string, ...infer Tail ]
  ? Tail extends string[] ? Tail : never : never;

type IsNumberLike<Path extends string> = Path extends `${number}` ? true : false;

type MaybeNullable<Path, Value> = Path extends '0' ? Value : Value | null;

type SetPropDeep<Path extends string[], Value> = PathHead<Path> extends never
  ? Value
  : IsNumberLike<PathHead<Path>> extends true
  ? Array<MaybeNullable<PathHead<Path>, SetPropArray<PathTail<Path>, Value>>>
  : PathHead<Path> extends string
  ? SetPropArray<Path, Value>
  : never;

type SetPropArray<Path extends string[], Value> = Unwrap<Record<PathHead<Path>, SetPropDeep<PathTail<Path>, Value>>>;

/**
Set a deeply-nested property to an object using a key path, like Lodash's `.set()` function.

@example
```
import set from "lodash/set";

const data = {name: 'nyan', items: {life: 24}};

set(data, 'items.life', '42');
set(data, 'items.levels', [1, '2', true]);

export const newData = data as unknown as CreateLevels;
```

@category Object
*/

export type SetProp<Source, Path extends string, Value> = MergeDeep<Source, SetPropArray<SplitPath<Path>, Value>>;
