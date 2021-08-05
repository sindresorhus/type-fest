import {expectAssignable} from 'tsd';
import {Merge} from '../index';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
expectAssignable<{a: number; b: number}>(ab);
