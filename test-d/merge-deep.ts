import {expectType} from 'tsd';
import {MergeDeep} from '..';

type Foo = {
	a: number;
	b: string;
	c: {
		d: number;
		e: string;
	};
};

type Bar = {
	b: number;
	c: {
		e: number;
	};
};

const foobar: MergeDeep<Foo, Bar> = {
	a: 1,
	b: 2,
	c: {
		d: 3,
		e: 4
	}
};

expectType<{a: number; b: number; c: {d: number; e: number}}>(foobar);
