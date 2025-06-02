import type {UnionToTuple} from './union-to-tuple.d.ts';
import type {Join, JoinableItem} from './join.d.ts';

type JoinUnion<U, S extends string = ','> =
	UnionToTuple<U> extends infer Tuple extends JoinableItem[]
		? Join<Tuple, S>
		: '';
