import {expectAssignable, expectNotAssignable} from 'tsd';
import type {TaggedUnion} from '../index.d.ts';

type Union = TaggedUnion<'tag', {str: {a: string}; num: {b: number}}>;

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

// Three members, each with its own fields, and a tag whose name is also a field's name in one of them, which is the case where a key and a tag could be confused for one another.
type ThreeMembers = TaggedUnion<'kind', {
	Open: {url: string; id: number};
	Close: {visible: boolean};
	Move: {to: {x: number; y: number}; kind?: 'Move'};
}>;

// A member's tag is paired with its own fields, so another member's fields do not satisfy it.
expectAssignable<ThreeMembers>({kind: 'Open', url: 'a', id: 1});
expectAssignable<ThreeMembers>({kind: 'Close', visible: true});
expectNotAssignable<ThreeMembers>({kind: 'Open', visible: true} as const);
expectNotAssignable<ThreeMembers>({kind: 'Move', url: 'a', id: 1} as const);

// The optional field stays optional, and the tag is still required.
expectAssignable<ThreeMembers>({kind: 'Move', to: {x: 1, y: 2}});
expectNotAssignable<ThreeMembers>({to: {x: 1, y: 2}} as const);

// An empty record is one member with no fields, which is a tag and nothing else.
type OnlyATag = TaggedUnion<'tag', {A: {}; B: {value: string}}>;
expectAssignable<OnlyATag>({tag: 'A'});
expectAssignable<OnlyATag>({tag: 'B', value: 'x'});
expectNotAssignable<OnlyATag>({tag: 'A', value: 'x'} as const);
