import {expectAssignable, expectNotAssignable} from 'tsd';
import type {TaggedUnion} from '../index.d.ts';

type Union = TaggedUnion<'tag', {str: {a: string} ; num: {b: number}}>;

const first = {
	tag: 'str' as const,
	a: 'some-string',
};

const second = {
	tag: 'num' as const,
	b: 1,
};

expectAssignable<Union>(first);
expectAssignable<Union>(second);

const fails = {
	tag: 'num' as const,
	b: 'should not be string',
};

const failsToo = {
	tag: 'str' as const,
	b: 2,
};

expectNotAssignable<Union>(fails);
expectNotAssignable<Union>(failsToo);
